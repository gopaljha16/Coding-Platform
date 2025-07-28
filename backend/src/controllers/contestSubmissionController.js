const Problem = require("../models/problem");
const Contest = require("../models/contest");
const ContestSubmission = require("../models/contestSubmission");
const { getLanguageById, submitToken, SubmitBatch } = require("../utils/problemUtility");
const { getIO } = require("../config/socket");

// Submit code for a contest problem
// Submit code for a contest problem
exports.submitContestCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { contestId, problemId } = req.params;
        const { code, language } = req.body;

        // Validate required fields
        if (!userId || !contestId || !problemId || !code || !language) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Check if contest exists and is active
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ 
                success: false, 
                message: "Contest not found" 
            });
        }

        const now = new Date();
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);

        // Check if contest has started
        if (now < startTime) {
            return res.status(400).json({ 
                success: false, 
                message: "Contest has not started yet" 
            });
        }

        // Check if contest has ended
        if (now > endTime) {
            return res.status(400).json({ 
                success: false, 
                message: "Contest has ended" 
            });
        }

        // Log request headers for debugging
        console.log("submitContestCode: Request headers:", req.headers);
        // Check if user is registered for the contest
        console.log("submitContestCode: userId:", userId.toString());
        console.log("submitContestCode: contest.participants:", contest.participants.map(p => p.toString()));
        
        // Auto-register user if not already registered (workaround for system date issue)
        if (!contest.participants.map(p => p.toString()).includes(userId.toString())) {
            console.log("submitContestCode: User not registered for contest - auto-registering");
            try {
                // Add user to participants
                contest.participants = contest.participants || [];
                contest.participants.push(userId);
                await contest.save();
                console.log(`User ${userId.toString()} auto-registered for contest ${contest._id.toString()}`);
            } catch (saveError) {
                console.error("Error auto-registering user:", saveError);
                // Continue anyway - don't block submission
            }
        }

        // Check if problem belongs to this contest
        if (!contest.problems.includes(problemId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Problem is not part of this contest" 
            });
        }

        // Fetch the problem
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ 
                success: false, 
                message: "Problem not found" 
            });
        }

        // Normalize language
        let normalizedLanguage = language;
        if (language === 'cpp') {
            normalizedLanguage = 'c++';
        }

        // Create submission record with pending status
        const submission = await ContestSubmission.create({
            userId,
            contestId,
            problemId,
            code,
            language: normalizedLanguage,
            status: "Pending",
            totalTestCases: problem.hiddenTestCases.length,
            submissionTime: now
        });

        // Get language ID for Judge0
        const languageId = getLanguageById(normalizedLanguage);
        if (!languageId) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid language" 
            });
        }

        // Prepare test cases for Judge0
        const testCases = problem.hiddenTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));

        // Submit to Judge0
        const submitResult = await SubmitBatch(testCases);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).json({ 
                success: false, 
                message: "Code evaluation failed" 
            });
        }

        // Get tokens and fetch results
        const resultTokens = submitResult.map(value => value.token);
        const testResults = await submitToken(resultTokens);

        // Process test results
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let errorMessage = null;
        let status = "Accepted";

        for (const test of testResults) {
            if (test.status_id == 3) { // Accepted
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) { // Wrong Answer
                    status = "Wrong Answer";
                    errorMessage = test.stderr || "Wrong Answer";
                } else { // Other errors
                    status = "Compiler Error";
                    errorMessage = test.stderr || test.compile_output || "Execution Error";
                }
            }
        }

        // Calculate score based on test cases passed and runtime
        const passRatio = testCasesPassed / problem.hiddenTestCases.length;
        let score = 0;
        
        if (status === "Accepted") {
            // Base score for difficulty
            const difficultyScore = {
                "easy": 100,
                "medium": 200,
                "hard": 300
            }[problem.difficulty] || 100;
            
            // Time bonus (faster solutions get more points)
            // Calculate time elapsed since contest start (in minutes)
            const contestDuration = (endTime - startTime) / (1000 * 60); // in minutes
            const timeElapsed = (now - startTime) / (1000 * 60); // in minutes
            const timeRatio = 1 - (timeElapsed / contestDuration); // 1 at start, 0 at end
            
            // Time bonus decreases as contest progresses
            const timeBonus = Math.round(difficultyScore * 0.5 * timeRatio);
            
            score = difficultyScore + timeBonus;
        } else if (passRatio > 0) {
            // Partial credit for some test cases passed
            const difficultyScore = {
                "easy": 50,
                "medium": 100,
                "hard": 150
            }[problem.difficulty] || 50;
            
            score = Math.round(difficultyScore * passRatio);
        }

        // Update submission with results
        submission.status = status;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.testCasesPassed = testCasesPassed;
        submission.errorMessage = errorMessage;
        submission.score = score;
        
        await submission.save();

        // Add user to contest participants if not already added
        if (!contest.participants.includes(userId)) {
            contest.participants.push(userId);
            await contest.save();
        }

        // Add problem to user's problemSolved list if accepted and not already present
        if (status === "Accepted") {
            const User = require("../models/user");
            const user = await User.findById(userId);
            if (user) {
                const problemIdStr = problemId.toString();
                const solvedIds = user.problemSolved.map(id => id.toString());
                if (!solvedIds.includes(problemIdStr)) {
                    user.problemSolved.push(problemId);
                    await user.save();

                    // Emit user profile update event
                    const io = getIO();
                    io.to(userId.toString()).emit('userProfileUpdate', {
                        userId: user._id,
                        problemSolved: user.problemSolved
                    });
                }

                // Check if user has solved all problems in the contest
                const contest = await Contest.findById(contestId);
                if (contest) {
                    const contestProblemIds = contest.problems.map(id => id.toString());
                    const userSolvedIds = user.problemSolved.map(id => id.toString());

                    const allSolved = contestProblemIds.every(pid => userSolvedIds.includes(pid));

                    if (allSolved) {
                        const completedContestIds = user.contestsCompleted.map(id => id.toString());
                        if (!completedContestIds.includes(contestId.toString())) {
                            user.contestsCompleted.push(contestId);
                            await user.save();

                            // Emit user contest completion event
                            io.to(userId.toString()).emit('contestCompleted', {
                                contestId: contest._id,
                                message: 'Contest completed!'
                            });
                        }
                    }
                }
            }
        }

        // Emit leaderboard update via Socket.IO
        try {
            const io = getIO();
            
            // Create a simplified leaderboard update object
            const leaderboardUpdate = {
                contestId,
                leaderboard: {
                    contestId,
                    rankings: [], // Will be populated by frontend on next fetch
                    isFinalized: false,
                    lastUpdated: new Date()
                }
            };
            
            // Emit the update to all connected clients
            io.emit('leaderboardUpdate', leaderboardUpdate);
            console.log(`Emitted leaderboardUpdate for contest ${contestId}`);
        } catch (socketError) {
            console.error("Socket.IO emission error:", socketError);
            // Continue with response even if socket emission fails
        }

        // Return results to user
        res.status(200).json({
            success: true,
            submission: {
                id: submission._id,
                status,
                score,
                testCasesPassed,
                totalTestCases: problem.hiddenTestCases.length,
                runtime,
                memory,
                submissionTime: submission.submissionTime
            }
        });

} catch (error) {
        console.error("❌ Error submitting contest code:", error);
        try {
            res.status(500).json({ success: false, message: error.message || error });
        } catch (sendErr) {
            console.error("Error sending error response:", sendErr);
        }
    }
};

// Run code for a contest problem (for testing, doesn't affect score)
exports.runContestCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { contestId, problemId } = req.params;
        const { code, language } = req.body;

        // Validate required fields
        if (!userId || !contestId || !problemId || !code || !language) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Check if contest exists and is active
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ 
                success: false, 
                message: "Contest not found" 
            });
        }

        const now = new Date();
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);

        // Check if contest has started
        if (now < startTime) {
            return res.status(400).json({ 
                success: false, 
                message: "Contest has not started yet" 
            });
        }

        // Check if contest has ended
        if (now > endTime) {
            return res.status(400).json({ 
                success: false, 
                message: "Contest has ended" 
            });
        }

        // Check if problem belongs to this contest
        if (!contest.problems.includes(problemId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Problem is not part of this contest" 
            });
        }

        // Fetch the problem
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ 
                success: false, 
                message: "Problem not found" 
            });
        }

        // Normalize language
        let normalizedLanguage = language;
        if (language === 'cpp') {
            normalizedLanguage = 'c++';
        }

        // Get language ID for Judge0
        const languageId = getLanguageById(normalizedLanguage);
        if (!languageId) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid language" 
            });
        }

        // Prepare visible test cases for Judge0 (not hidden ones)
        const testCases = problem.visibleTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));

        // Submit to Judge0
        const submitResult = await SubmitBatch(testCases);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).json({ 
                success: false, 
                message: "Code evaluation failed" 
            });
        }

        // Get tokens and fetch results
        const resultTokens = submitResult.map(value => value.token);
        const testResults = await submitToken(resultTokens);

        // Process test results and transform to frontend expected format
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        // Map testResults to include passed, input, expectedOutput, actualOutput, error, runtime
        const transformedTestCases = testResults.map((test, index) => {
            const passed = test.status_id === 3;
            if (passed) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                status = false;
                errorMessage = test.stderr || test.compile_output || "Execution Error";
            }

            return {
                passed,
                input: problem.visibleTestCases[index].input,
                expectedOutput: problem.visibleTestCases[index].output,
                actualOutput: test.stdout || test.output || '',
                error: test.stderr || test.compile_output || null,
                runtime: test.time ? parseFloat(test.time) * 1000 : null // convert to ms
            };
        });

        // Return results to user
        res.status(200).json({
            success: status,
            testCases: transformedTestCases,
            testCasesPassed,
            totalTestCases: problem.visibleTestCases.length,
            runtime,
            memory,
            errorMessage
        });

    } catch (error) {
        console.error("❌ Error running contest code:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's submissions for a specific contest problem
exports.getUserContestSubmissions = async (req, res) => {
    try {
        const userId = req.result._id;
        const { contestId, problemId } = req.params;

        // Validate required fields
        if (!userId || !contestId || !problemId) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Get all submissions for this user, contest, and problem
        const submissions = await ContestSubmission.find({
            userId,
            contestId,
            problemId
        }).sort({ createdAt: -1 }); // Most recent first

        // Format submissions for response
        const formattedSubmissions = submissions.map(sub => ({
            id: sub._id,
            status: sub.status,
            language: sub.language,
            score: sub.score,
            runtime: sub.runtime,
            memory: sub.memory,
            testCasesPassed: sub.testCasesPassed,
            totalTestCases: sub.totalTestCases,
            submissionTime: sub.submissionTime || sub.createdAt,
            code: sub.code
        }));

        res.status(200).json({
            success: true,
            submissions: formattedSubmissions
        });

    } catch (error) {
        console.error("❌ Error getting user contest submissions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
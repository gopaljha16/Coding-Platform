const Problem = require("../models/problem");
const Contest = require("../models/contest");
const ContestSubmission = require("../models/contestSubmission");
const { getLanguageById, submitToken, SubmitBatch } = require("../utils/problemUtility");
const { getIO } = require("../config/socket");

// Submit code for a contest problem
exports.submitContestCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { contestId, problemId } = req.params;
        const { code, language } = req.body;

        // Validate input
        if (!code?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Code is required"
            });
        }

        // Normalize language before processing
        let normalizedLanguage = language?.toLowerCase();
        if (normalizedLanguage === 'cpp') {
            normalizedLanguage = 'c++';
        }

        if (!normalizedLanguage) {
            return res.status(400).json({
                success: false,
                message: "Language is required"
            });
        }

        // Check if contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        // Check if problem exists and belongs to contest
        const problem = await Problem.findById(problemId);
        if (!problem || !contest.problems.includes(problemId)) {
            return res.status(404).json({
                success: false,
                message: "Problem not found in this contest"
            });
        }

        // Create submission record first
        const submission = await ContestSubmission.create({
            userId,
            contestId,
            problemId,
            code,
            language: normalizedLanguage,
            status: "Processing",
            totalTestCases: problem.hiddenTestCases?.length || 0,
            submissionTime: new Date()
        });

        // Get language ID for Judge0
        const languageId = getLanguageById(normalizedLanguage);
        if (!languageId) {
            submission.status = "Error";
            submission.errorMessage = "Unsupported language";
            await submission.save();
            return res.status(400).json({
                success: false,
                message: "Unsupported programming language"
            });
        }

        // Prepare test cases
        const testCases = problem.hiddenTestCases.map(testcase => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));

        // Submit to Judge0
        const submitResult = await SubmitBatch(testCases);
        if (!submitResult?.length) {
            throw new Error("Failed to submit to judge");
        }

        // Get tokens and fetch results
        const resultTokens = submitResult.map(value => value.token);
        const testResults = await submitToken(resultTokens);

        // Process results
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "Accepted";
        let errorMessage = null;

        for (const result of testResults) {
            if (result.status.id === 3) { // Accepted
                testCasesPassed++;
                runtime += parseFloat(result.time || 0);
                memory = Math.max(memory, parseInt(result.memory || 0));
            } else {
                status = "Wrong Answer";
                errorMessage = result.compile_output || result.stderr || "Test case failed";
                break;
            }
        }

        // Update submission
        submission.status = status;
        submission.testCasesPassed = testCasesPassed;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.errorMessage = errorMessage;
        await submission.save();

        // Return response
        return res.status(200).json({
            success: true,
            submission: {
                id: submission._id,
                status,
                testCasesPassed,
                totalTestCases: problem.hiddenTestCases.length,
                runtime,
                memory,
                errorMessage
            }
        });

    } catch (error) {
        console.error("Submission error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error while processing submission"
        });
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
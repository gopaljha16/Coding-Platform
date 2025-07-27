const Contest = require("../models/contest");
const ContestSubmission = require("../models/contestSubmission");
const Leaderboard = require("../models/leaderboard");
const { getIO } = require("../config/socket");
const User = require("../models/user");

// Helper function to generate rankings from submissions
const generateRankings = (submissions) => {
    // Group submissions by user
    const userSubmissions = {};
    submissions.forEach(submission => {
        const userId = submission.userId._id.toString();
        if (!userSubmissions[userId]) {
            userSubmissions[userId] = {
                user: submission.userId,
                problems: {},
                totalScore: 0,
                problemsSolved: 0,
                totalRuntime: 0
            };
        }

        const problemId = submission.problemId._id.toString();
        if (!userSubmissions[userId].problems[problemId] || 
            (submission.status === 'Accepted' && 
             (userSubmissions[userId].problems[problemId].status !== 'Accepted' || 
              submission.runtime < userSubmissions[userId].problems[problemId].runtime))) {
            
            // Update problem data with this submission
            userSubmissions[userId].problems[problemId] = {
                problem: submission.problemId,
                status: submission.status,
                score: submission.score,
                runtime: submission.runtime,
                submissionTime: submission.submissionTime || submission.createdAt
            };

            // Update user totals
            if (submission.status === 'Accepted') {
                // If this is a new accepted solution or better runtime
                if (!userSubmissions[userId].problems[problemId].counted) {
                    userSubmissions[userId].problemsSolved++;
                    userSubmissions[userId].problems[problemId].counted = true;
                }
            }

            userSubmissions[userId].totalScore = Object.values(userSubmissions[userId].problems)
                .reduce((sum, p) => sum + (p.score || 0), 0);
            
            userSubmissions[userId].totalRuntime = Object.values(userSubmissions[userId].problems)
                .filter(p => p.status === 'Accepted')
                .reduce((sum, p) => sum + (p.runtime || 0), 0);
        }
    });

    // Convert to array and sort
    return Object.values(userSubmissions)
        .map(data => ({
            userId: data.user,
            score: data.totalScore,
            problemsSolved: data.problemsSolved,
            totalRuntime: data.totalRuntime,
            submissions: Object.values(data.problems).map(p => ({
                problemId: p.problem._id,
                status: p.status,
                score: p.score,
                bestRuntime: p.runtime,
                submissionTime: p.submissionTime
            }))
        }))
        .sort((a, b) => {
            // Sort by score (descending)
            if (b.score !== a.score) return b.score - a.score;
            // Then by problems solved (descending)
            if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
            // Then by runtime (ascending)
            return a.totalRuntime - b.totalRuntime;
        })
        .map((user, index) => ({
            ...user,
            rank: index + 1
        }));
};

// Finalize contest rankings automatically after contest ends
exports.autoFinalizeContestRankings = async () => {
    try {
        const now = new Date();

        // Find contests that have ended but not finalized
        const contestsToFinalize = await Contest.find({
            endTime: { $lte: now }
        });

        for (const contest of contestsToFinalize) {
            const existingLeaderboard = await Leaderboard.findOne({ contestId: contest._id, isFinalized: true });
            if (existingLeaderboard) {
                continue; // Already finalized
            }

            // Get all submissions for this contest
            const submissions = await ContestSubmission.find({ contestId: contest._id })
                .populate('userId', 'name email profileImage')
                .populate('problemId', 'title difficulty');

            // Generate rankings
            const rankings = generateRankings(submissions);

            // Create and save finalized leaderboard
            const leaderboard = new Leaderboard({
                contestId: contest._id,
                rankings,
                isFinalized: true,
                lastUpdated: new Date()
            });

            await leaderboard.save();
                console.log(`Auto-finalized leaderboard for contest ${contest._id}`);
                
                // Emit leaderboard update via Socket.IO
                try {
                    const io = getIO();
                    
                    // Create a leaderboard update object with the finalized data
                    const leaderboardUpdate = {
                        contestId: contest._id,
                        leaderboard: leaderboard
                    };
                    
                    // Emit the update to all connected clients
                    io.emit('leaderboardUpdate', leaderboardUpdate);
                    console.log(`Emitted auto-finalized leaderboardUpdate for contest ${contest._id}`);
                } catch (socketError) {
                    console.error("Socket.IO emission error:", socketError);
                    // Continue even if socket emission fails
                }
        }
    } catch (error) {
        console.error("❌ Error auto-finalizing contest rankings:", error);
    }
};

// Get contest leaderboard
exports.getContestLeaderboard = async (req, res) => {
    try {
        const { contestId } = req.params;

        // Check if contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ success: false, message: "Contest not found" });
        }

        // Check if finalized leaderboard exists
        const existingLeaderboard = await Leaderboard.findOne({ contestId, isFinalized: true })
            .populate({
                path: 'rankings.userId',
                select: 'name email profileImage'
            });

        if (existingLeaderboard) {
            return res.status(200).json({
                success: true,
                leaderboard: existingLeaderboard,
                contest: {
                    name: contest.name,
                    startTime: contest.startTime,
                    endTime: contest.endTime,
                    isActive: new Date() >= new Date(contest.startTime) && new Date() <= new Date(contest.endTime)
                }
            });
        }

        // If no finalized leaderboard, generate a real-time one
        const submissions = await ContestSubmission.find({ contestId })
            .populate('userId', 'name email profileImage')
            .populate('problemId', 'title difficulty');

        // Group submissions by user
        const userSubmissions = {};
        submissions.forEach(submission => {
            const userId = submission.userId._id.toString();
            if (!userSubmissions[userId]) {
                userSubmissions[userId] = {
                    user: submission.userId,
                    problems: {},
                    totalScore: 0,
                    problemsSolved: 0,
                    totalRuntime: 0
                };
            }

            const problemId = submission.problemId._id.toString();
            if (!userSubmissions[userId].problems[problemId] || 
                (submission.status === 'Accepted' && 
                 (userSubmissions[userId].problems[problemId].status !== 'Accepted' || 
                  submission.runtime < userSubmissions[userId].problems[problemId].runtime))) {
                
                // Update problem data with this submission
                userSubmissions[userId].problems[problemId] = {
                    problem: submission.problemId,
                    status: submission.status,
                    score: submission.score,
                    runtime: submission.runtime,
                    submissionTime: submission.submissionTime || submission.createdAt
                };

                // Update user totals
                if (submission.status === 'Accepted') {
                    // If this is a new accepted solution or better runtime
                    if (!userSubmissions[userId].problems[problemId].counted) {
                        userSubmissions[userId].problemsSolved++;
                        userSubmissions[userId].problems[problemId].counted = true;
                    }
                }

                userSubmissions[userId].totalScore = Object.values(userSubmissions[userId].problems)
                    .reduce((sum, p) => sum + (p.score || 0), 0);
                
                userSubmissions[userId].totalRuntime = Object.values(userSubmissions[userId].problems)
                    .filter(p => p.status === 'Accepted')
                    .reduce((sum, p) => sum + (p.runtime || 0), 0);
            }
        });

        // Convert to array and sort
        const rankings = Object.values(userSubmissions)
            .map(data => ({
                userId: data.user,
                score: data.totalScore,
                problemsSolved: data.problemsSolved,
                totalRuntime: data.totalRuntime,
                submissions: Object.values(data.problems).map(p => ({
                    problemId: p.problem._id,
                    status: p.status,
                    score: p.score,
                    bestRuntime: p.runtime,
                    submissionTime: p.submissionTime
                }))
            }))
            .sort((a, b) => {
                // Sort by score (descending)
                if (b.score !== a.score) return b.score - a.score;
                // Then by problems solved (descending)
                if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
                // Then by runtime (ascending)
                return a.totalRuntime - b.totalRuntime;
            })
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));

        // Create temporary leaderboard response
        const leaderboard = {
            contestId,
            rankings,
            isFinalized: false,
            lastUpdated: new Date()
        };

        // Emit leaderboard update via Socket.IO if contest is active
        const isActive = new Date() >= new Date(contest.startTime) && new Date() <= new Date(contest.endTime);
        if (isActive) {
            try {
                const io = getIO();
                
                // Create a leaderboard update object
                const leaderboardUpdate = {
                    contestId,
                    leaderboard
                };
                
                // Emit the update to all connected clients
                io.emit('leaderboardUpdate', leaderboardUpdate);
                console.log(`Emitted leaderboardUpdate for contest ${contestId} from getContestLeaderboard`);
            } catch (socketError) {
                console.error("Socket.IO emission error:", socketError);
                // Continue with response even if socket emission fails
            }
        }

        return res.status(200).json({
            success: true,
            leaderboard,
            contest: {
                name: contest.name,
                startTime: contest.startTime,
                endTime: contest.endTime,
                isActive
            }
        });

    } catch (error) {
        console.error("❌ Error getting contest leaderboard:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Finalize contest rankings (admin only)
exports.finalizeContestRankings = async (req, res) => {
    try {
        const { contestId } = req.params;

        // Check if contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ success: false, message: "Contest not found" });
        }

        // Check if contest has ended
        if (new Date() < new Date(contest.endTime)) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot finalize leaderboard before contest ends" 
            });
        }

        // Check if leaderboard is already finalized
        const existingLeaderboard = await Leaderboard.findOne({ contestId, isFinalized: true });
        if (existingLeaderboard) {
            return res.status(400).json({ 
                success: false, 
                message: "Leaderboard is already finalized" 
            });
        }

        // Get all submissions for this contest
        const submissions = await ContestSubmission.find({ contestId })
            .populate('userId', 'name email profileImage')
            .populate('problemId', 'title difficulty');

        // Group submissions by user
        const userSubmissions = {};
        submissions.forEach(submission => {
            const userId = submission.userId._id.toString();
            if (!userSubmissions[userId]) {
                userSubmissions[userId] = {
                    user: submission.userId,
                    problems: {},
                    totalScore: 0,
                    problemsSolved: 0,
                    totalRuntime: 0
                };
            }

            const problemId = submission.problemId._id.toString();
            if (!userSubmissions[userId].problems[problemId] || 
                (submission.status === 'Accepted' && 
                 (userSubmissions[userId].problems[problemId].status !== 'Accepted' || 
                  submission.runtime < userSubmissions[userId].problems[problemId].runtime))) {
                
                // Update problem data with this submission
                userSubmissions[userId].problems[problemId] = {
                    problem: submission.problemId,
                    status: submission.status,
                    score: submission.score,
                    runtime: submission.runtime,
                    attempts: (userSubmissions[userId].problems[problemId]?.attempts || 0) + 1,
                    submissionTime: submission.submissionTime || submission.createdAt
                };

                // Update user totals
                if (submission.status === 'Accepted') {
                    // If this is a new accepted solution or better runtime
                    if (!userSubmissions[userId].problems[problemId].counted) {
                        userSubmissions[userId].problemsSolved++;
                        userSubmissions[userId].problems[problemId].counted = true;
                    }
                }

                userSubmissions[userId].totalScore = Object.values(userSubmissions[userId].problems)
                    .reduce((sum, p) => sum + (p.score || 0), 0);
                
                userSubmissions[userId].totalRuntime = Object.values(userSubmissions[userId].problems)
                    .filter(p => p.status === 'Accepted')
                    .reduce((sum, p) => sum + (p.runtime || 0), 0);
            } else {
                // Increment attempts counter even if not the best submission
                userSubmissions[userId].problems[problemId].attempts = 
                    (userSubmissions[userId].problems[problemId].attempts || 0) + 1;
            }
        });

        // Convert to array and sort
        const rankings = Object.values(userSubmissions)
            .map(data => ({
                userId: data.user._id,
                score: data.totalScore,
                problemsSolved: data.problemsSolved,
                totalRuntime: data.totalRuntime,
                submissions: Object.values(data.problems).map(p => ({
                    problemId: p.problem._id,
                    status: p.status,
                    score: p.score,
                    attempts: p.attempts || 1,
                    bestRuntime: p.runtime,
                    submissionTime: p.submissionTime
                }))
            }))
            .sort((a, b) => {
                // Sort by score (descending)
                if (b.score !== a.score) return b.score - a.score;
                // Then by problems solved (descending)
                if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
                // Then by runtime (ascending)
                return a.totalRuntime - b.totalRuntime;
            })
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));

        // Create and save finalized leaderboard
        const leaderboard = new Leaderboard({
            contestId,
            rankings,
            isFinalized: true,
            lastUpdated: new Date()
        });

        await leaderboard.save();

        // Emit leaderboard update via Socket.IO
        try {
            const io = getIO();
            
            // Create a leaderboard update object with the finalized data
            const leaderboardUpdate = {
                contestId,
                leaderboard: leaderboard
            };
            
            // Emit the update to all connected clients
            io.emit('leaderboardUpdate', leaderboardUpdate);
            console.log(`Emitted finalized leaderboardUpdate for contest ${contestId}`);
        } catch (socketError) {
            console.error("Socket.IO emission error:", socketError);
            // Continue with response even if socket emission fails
        }

        return res.status(200).json({
            success: true,
            message: "Contest leaderboard finalized successfully",
            leaderboard
        });

    } catch (error) {
        console.error("❌ Error finalizing contest rankings:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's contest history and performance
exports.getUserContestHistory = async (req, res) => {
    try {
        const userId = req.result._id; // From auth middleware

        // Find all contests the user has participated in
        const submissions = await ContestSubmission.find({ userId })
            .distinct('contestId');

        // Get contest details and user's rank in each
        const contestHistory = await Promise.all(submissions.map(async (contestId) => {
            const contest = await Contest.findById(contestId);
            const leaderboard = await Leaderboard.findOne({ contestId, isFinalized: true });
            
            let rank = null;
            let score = 0;
            let problemsSolved = 0;
            
            if (leaderboard) {
                const userRanking = leaderboard.rankings.find(
                    r => r.userId.toString() === userId.toString()
                );
                
                if (userRanking) {
                    rank = userRanking.rank;
                    score = userRanking.score;
                    problemsSolved = userRanking.problemsSolved;
                }
            }
            
            return {
                contestId,
                name: contest.name,
                date: contest.startTime,
                rank,
                score,
                problemsSolved,
                totalParticipants: leaderboard ? leaderboard.rankings.length : null,
                isFinalized: leaderboard ? leaderboard.isFinalized : false
            };
        }));
        
        // Sort by date (most recent first)
        contestHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.status(200).json({
            success: true,
            contestHistory
        });
        
    } catch (error) {
        console.error("❌ Error getting user contest history:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
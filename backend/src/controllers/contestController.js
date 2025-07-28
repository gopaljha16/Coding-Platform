const mongoose = require('mongoose');
const Contest = require("../models/contest");
const Problem = require("../models/problem");

exports.createContest = async (req, res) => {
  try {
    // Ensure problems is an array of ObjectIds, not a stringified array
    let problems = req.body.problems;
    if (typeof problems === 'string') {
      try {
        problems = JSON.parse(problems);
      } catch (e) {
        // If parsing fails, keep as is
      }
    }
    if (!Array.isArray(problems)) {
      return res.status(400).json({ success: false, message: "Problems must be an array" });
    }

    // Convert each problem ID to mongoose ObjectId using 'new' keyword
    problems = problems.map(id => new mongoose.Types.ObjectId(id));

    const contest = new Contest({
      name: req.body.name,
      description: req.body.description || "", // optional
      problems: problems,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      createdBy: req.result._id, 
      isPublic: req.body.isPublic,
      date: new Date(req.body.startTime).toISOString().split("T")[0] 
    });

    await contest.save();
    res.status(201).json({ success: true, contest });
  } catch (error) {
    console.error("❌ Error creating contest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register for a contest
exports.registerForContest = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.result._id;

    console.log(`Registration attempt for contest ${contestId} by user ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID" });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    // Check if contest is active - TEMPORARILY DISABLED DUE TO SYSTEM DATE ISSUE
    // const now = new Date();
    // if (now < contest.startTime) {
    //   return res.status(400).json({ success: false, message: "Contest has not started yet" });
    // }
    // 
    // if (now > contest.endTime) {
    //   return res.status(400).json({ success: false, message: "Contest has already ended" });
    // }

    // Check if user already registered
    if (contest.participants && contest.participants.map(p => p.toString()).includes(userId.toString())) {
      console.log(`User ${userId} already registered for contest ${contestId}`);
      return res.status(200).json({ success: true, message: "Already registered" });
    }

    // Add user to participants
    contest.participants = contest.participants || [];
    contest.participants.push(userId);
    try {
      await contest.save();
      console.log(`User ${userId.toString()} successfully registered for contest ${contest._id.toString()}`);
    } catch (saveError) {
      console.error("Error saving contest participants:", saveError);
      return res.status(500).json({ success: false, message: "Failed to register for contest" });
    }

    res.status(200).json({ success: true, message: "Registered for contest successfully" });
  } catch (error) {
    console.error("Error in registerForContest:", error);
    // Try to register anyway as a fallback
    try {
      const contestId = req.params.contestId;
      const userId = req.result._id;
      
      const contest = await Contest.findById(contestId);
      if (contest && !contest.participants.includes(userId)) {
        contest.participants = contest.participants || [];
        contest.participants.push(userId);
        await contest.save();
        console.log(`Fallback: User ${userId} registered for contest ${contestId}`);
        return res.status(200).json({
          success: true,
          message: "Registered for contest successfully (fallback)"
        });
      }
    } catch (fallbackError) {
      console.error("Fallback registration also failed:", fallbackError);
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("problems");
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate("problems");
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Get user contest registration and completion status if user is authenticated
    let userStatus = null;
    if (req.result && req.result._id) {
      const User = require("../models/user");
      const user = await User.findById(req.result._id);
      if (user) {
        const isRegistered = contest.participants.includes(user._id);
        const isCompleted = user.contestsCompleted.some(cId => cId.toString() === contest._id.toString());
        userStatus = {
          isRegistered,
          isCompleted
        };
      }
    }

    res.json({ contest, userStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const updated = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Contest not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    const deleted = await Contest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Contest not found" });
    res.json({ message: "Contest deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all problems to show in UI
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, "_id title difficulty");
    res.json({ success: true, problems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Pick a random problem for "problem of the day"
exports.getProblemOfTheDay = async (req, res) => {
  try {
    const problems = await Problem.find();
    const randomIndex = Math.floor(Math.random() * problems.length);
    res.json(problems[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodayContest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const contest = await Contest.findOne({ date: today });

    if (!contest) {
      return res.status(404).json({ error: "No contest found for today" });
    }

    res.json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get problems for a specific contest
exports.getContestProblems = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const contest = await Contest.findById(contestId).populate('problems', '_id title difficulty description startCode visibleTestCases constraints');
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }
    res.status(200).json({ success: true, problems: contest.problems });
  } catch (error) {
    console.error("❌ Error fetching contest problems:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a single problem by contestId and problemId
exports.getContestProblem = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;

    // Verify contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Verify problem belongs to contest
    if (!contest.problems.includes(problemId)) {
      return res.status(404).json({ message: "Problem not found in this contest" });
    }

    // Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ problem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

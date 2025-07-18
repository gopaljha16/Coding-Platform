const Contest = require("../models/contest");
const Submission = require("../models/submission");


exports.createContest = async (req, res) => {
  try {
    const { name, description, problems, startTime, endTime, createdBy, isPublic } = req.body;

    const newContest = await Contest.create({
      name,
      description,
      problems,
      startTime,
      endTime,
      createdBy,
      isPublic
    });

    res.status(201).json(newContest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate("problems");
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerForContest = async (req, res) => {
  try {
    const { userId } = req.body;

    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    if (!contest.participants.includes(userId)) {
      contest.participants.push(userId);
      await contest.save();
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getContestsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const now = new Date();
    let query = {};

    if (status === 'live') query = { startTime: { $lte: now }, endTime: { $gte: now } };
    else if (status === 'upcoming') query = { startTime: { $gt: now } };
    else if (status === 'past') query = { endTime: { $lt: now } };

    const contests = await Contest.find(query);
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContestLeaderboard = async (req, res) => {
  try {
    const contestId = req.params.id;
    const contest = await Contest.findById(contestId).populate("problems");
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const problemIds = contest.problems.map(p => p._id);

    const leaderboard = await Submission.aggregate([
      { $match: { problemId: { $in: problemIds }, status: "Accepted" } },
      { $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        totalProblemsSolved: { $sum: 1 },
      }},
      { $sort: { totalScore: -1, totalProblemsSolved: -1 } }
    ]);

    res.json(leaderboard);
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

const Contest = require("../models/contest");
const Problem = require("../models/problem");



exports.createContest = async (req, res) => {
  try {
    const contest = new Contest({
      name: req.body.name,
      description: req.body.description || "", // optional
      problems: req.body.problems,
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
    res.json(contest);
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
    console.log("Fetched problems:", problems);
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
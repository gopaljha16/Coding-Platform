const express = require("express");
const {
  createContest,
  registerForContest,
  getContestById,
  getAllContests,
  getContestsByStatus,
  getContestLeaderboard,
  updateContest,
  deleteContest,
} = require("../controllers/contestController");

const Contest = require("../models/contest");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const contestRouter = express.Router();

// Middleware: To ensure contest is live
exports.ensureContestAccess = async (req, res, next) => {
  try {
    const contest = await Contest.findById(req.params.id);
    const now = new Date();

    if (now < contest.startTime)
      return res.status(403).json({ message: "Contest hasn't started." });
    if (now > contest.endTime)
      return res.status(403).json({ message: "Contest ended." });

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create contest
contestRouter.post("/create", adminMiddleware, createContest);

// Admin: Update & Delete contest
contestRouter.put("/update/:id", adminMiddleware, updateContest);
contestRouter.delete("/delete/:id", adminMiddleware, deleteContest);

// Public: Get all contests
contestRouter.get("/", getAllContests);

// Public: Get contest by ID
contestRouter.get("/:id", getContestById);

// User: Register for contest
contestRouter.post("/register/:id", userMiddleware, registerForContest);

// Public (or user): Filter contests and view leaderboard
contestRouter.get("/filter", getContestsByStatus);
contestRouter.get("/:id/leaderboard", getContestLeaderboard);

module.exports = contestRouter;

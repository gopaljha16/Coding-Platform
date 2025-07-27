const express = require("express");
const {
  createContest,
  getAllContests,
  getContestById,
  updateContest,
  deleteContest,
  getAllProblems,
  getTodayContest
} = require("../controllers/contestController");
const {
  getContestLeaderboard,
  finalizeContestRankings,
  getUserContestHistory
} = require("../controllers/leaderboardController");
const {
  submitContestCode,
  runContestCode,
  getUserContestSubmissions
} = require("../controllers/contestSubmissionController");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const contestRouter = express.Router();

// Today's contest
contestRouter.get("/today", getTodayContest);

// CRUD operations
contestRouter.post("/create", adminMiddleware, createContest);
contestRouter.get("/", getAllContests);
contestRouter.get("/:id", getContestById);
contestRouter.put("/update/:id", adminMiddleware, updateContest);
contestRouter.delete("/delete/:id", adminMiddleware, deleteContest);

// Problem selection
contestRouter.get("/problems", adminMiddleware, getAllProblems);

// Leaderboard routes
contestRouter.get("/:contestId/leaderboard", getContestLeaderboard);
contestRouter.post("/:contestId/finalize", adminMiddleware, finalizeContestRankings);
contestRouter.get("/user/history", userMiddleware, getUserContestHistory);

// Contest submission routes
contestRouter.post("/:contestId/problem/:problemId/submit", userMiddleware, submitContestCode);
contestRouter.post("/:contestId/problem/:problemId/run", userMiddleware, runContestCode);
contestRouter.get("/:contestId/problem/:problemId/submissions", userMiddleware, getUserContestSubmissions);

module.exports = contestRouter;
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
  finalizeContestRankings
} = require("../controllers/leaderboardController");
const adminMiddleware = require("../middleware/adminMiddleware");
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

module.exports = contestRouter;
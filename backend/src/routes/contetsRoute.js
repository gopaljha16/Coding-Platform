const express = require("express");
const {
  createContest,
  getAllContests,
  getContestById,
  updateContest,
  deleteContest,
  getAllProblems,
  getProblemOfTheDay,
} = require("../controllers/contestController");
const adminMiddleware = require("../middleware/adminMiddleware");
const contestRouter = express.Router();

contestRouter.post("/create", adminMiddleware, createContest);
contestRouter.get("/", getAllContests);
contestRouter.get("/:id", getContestById);
contestRouter.put("/update/:id", adminMiddleware, updateContest);
contestRouter.delete("/delete/:id", adminMiddleware, deleteContest);

// New routes for problem selection
contestRouter.get("/problems", adminMiddleware, getAllProblems);
contestRouter.get("/problem-of-the-day", getProblemOfTheDay);

module.exports = contestRouter;

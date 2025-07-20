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
const adminMiddleware = require("../middleware/adminMiddleware");
const contestRouter = express.Router();

contestRouter.get("/today", getTodayContest);
contestRouter.post("/create", adminMiddleware, createContest);
contestRouter.get("/", getAllContests);
contestRouter.get("/:id", getContestById);
contestRouter.put("/update/:id", adminMiddleware, updateContest);
contestRouter.delete("/delete/:id", adminMiddleware, deleteContest);

// New routes for problem selection
contestRouter.get("/problems", adminMiddleware, getAllProblems);


module.exports = contestRouter;

const express = require("express");
const Problem = require("../models/problem");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProblem } = require("../controllers/userProblem");

const problemRouter = express.Router();

// create , fetch , update , delete
problemRouter.post("/create" , adminMiddleware , createProblem);
// problemRouter.patch("/:id" , adminMiddleware, updateProblem);
// problemRouter.delete("/:id" , adminMiddleware . deleteProblem);

module.exports = problemRouter;
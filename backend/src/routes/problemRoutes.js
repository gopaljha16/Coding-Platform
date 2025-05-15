const express = require("express");
const Problem = require("../models/problem");
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware")
const { createProblem , updateProblem , deleteProblem , getAllProblems , getProblemById , getAllSubmission, submittedProblem } = require("../controllers/userProblem");

const problemRouter = express.Router();

// create , fetch , update , delete
problemRouter.post("/create" , adminMiddleware , createProblem);
problemRouter.put("/update/:id" , adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id" , adminMiddleware , deleteProblem);


//user giving functionalities
problemRouter.get("/getProblemById/:id", userMiddleware , getProblemById)
problemRouter.get("/getAllProblems" , userMiddleware , getAllProblems);
problemRouter.get("/getAllSubmissions" , userMiddleware , getAllSubmission);
problemRouter.get("/submittedProblem/:pid" , userMiddleware  , submittedProblem )

module.exports = problemRouter;
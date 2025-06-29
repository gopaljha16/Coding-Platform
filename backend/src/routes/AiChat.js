const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const aiRouter = express.Router();
const DoubtAi = require("../controllers/doubtAi")


aiRouter.post("/chat" , userMiddleware , DoubtAi);

module.exports = aiRouter;
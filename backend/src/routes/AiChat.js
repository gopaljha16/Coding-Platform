const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const DoubtAi = require("../controllers/doubtAi");
const adminMiddleware = require("../middleware/adminMiddleware");
const aiRouter = express.Router();



aiRouter.post("/chat" , DoubtAi);

module.exports = aiRouter;
const express = require("express");
const {
    userMiddleware,
    checkPremiumAndTokens
} = require("../middleware/userMiddleware");
const DoubtAi = require("../controllers/doubtAi");
const adminMiddleware = require("../middleware/adminMiddleware");
const aiRouter = express.Router();



aiRouter.post("/chat", userMiddleware, checkPremiumAndTokens, DoubtAi);

module.exports = aiRouter;

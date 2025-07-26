const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/user");

const userMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication token missing" 
            });
        }

        // 2. Verify JWT token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = payload;

        if (!_id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        // 3. Find user in database
        const result = await User.findById(_id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 4. Check if token is blocked in Redis
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({
                success: false,
                message: "Session expired"
            });
        }

        // 5. Attach user to request and continue
        req.result = result;
        next();

    } catch (err) {
        console.error("Authentication error:", err);
        
        // Handle specific JWT errors
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                error: err.message
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: err.message
        });
    }
};

module.exports = userMiddleware;
const express = require("express");
const { getProfile, login, logout, deleteProfile, activeUsers, updateProfile, googleLogin } = require("../controllers/userAuthenticate"); // Removed 'register'
const { requestEmailVerificationOTP, verifyEmailOTP, requestPasswordResetOTP, resetPassword, changePassword } = require("../controllers/userVerification");
const { signupWithVerification, verifySignupOTP } = require("../controllers/userSignupVerification");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminRegister = require("../controllers/adminAuthenticate");
const dashboardController = require("../controllers/dashboardController");
const authRouter = express.Router();

// Removed authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.get("/getProfile", userMiddleware, getProfile);
authRouter.put("/updateProfile", userMiddleware, updateProfile);
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);
authRouter.get("/activeuser", adminMiddleware, activeUsers);

// New route for Google login
authRouter.post("/googleLogin", googleLogin);

// New routes for email verification and password reset
authRouter.post("/requestEmailVerificationOTP", requestEmailVerificationOTP);
authRouter.post("/verifyEmailOTP", verifyEmailOTP);

// New signup with email verification routes
authRouter.post("/signupWithVerification", signupWithVerification);
authRouter.post("/verifySignupOTP", verifySignupOTP);
authRouter.post("/requestPasswordResetOTP", requestPasswordResetOTP);
authRouter.post("/resetPassword", resetPassword);
authRouter.post("/changePassword", userMiddleware, changePassword);

// Dashboard endpoints
authRouter.get("/streaks", userMiddleware, dashboardController.getUserStreaks);
authRouter.get("/badges", userMiddleware, dashboardController.getUserBadges);
authRouter.get("/rank", userMiddleware, dashboardController.getUserRank);
authRouter.get("/submissions", userMiddleware, dashboardController.getAllUserSubmissions);

// check auth for user enters the website for checking the user is registered or if register then redirect to home page not then login/signup page
//so here token checking
authRouter.get("/check", userMiddleware, (req, res) => {
    try {
        const reply = {
            firstName: req.result.firstName,
            emailId: req.result.emailId,
            _id: req.result._id,
            role: req.result.role,
            profileImage: req.result.profileImage || null
        };

        res.status(200).json({
            user: reply,
            message: "Valid User"
        });
    } catch (err) {
        res.status(500).send(" Error Occured " + err);
    }
});

module.exports = authRouter;

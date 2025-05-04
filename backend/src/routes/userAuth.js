const express = require("express");
const { register , getProfile , login ,logout } = require("../controllers/userAuthenticate");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminRegister = require("../controllers/adminAuthenticate");
const authRouter = express.Router();


authRouter.post("/register" , register);
authRouter.post("/login" ,  login);
authRouter.post("/logout"  , userMiddleware ,  logout);
authRouter.post("/admin/register" , adminMiddleware , adminRegister)
authRouter.get("/getProfile" , getProfile );

module.exports  = authRouter;
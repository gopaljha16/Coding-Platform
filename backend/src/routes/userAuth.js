const express = require("express");
const { register , getProfile , login ,logout } = require("../controllers/userAuthenticate");
const authRouter = express.Router();


authRouter.post("/regiser" , register);
authRouter.post("/login" ,  login);
authRouter.post("/logout" , logout);
authRouter.get("/getProfile" , getProfile );
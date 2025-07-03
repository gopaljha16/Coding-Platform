const express = require("express");
const { register , getProfile , login ,logout , deleteProfile , activeUsers} = require("../controllers/userAuthenticate");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminRegister = require("../controllers/adminAuthenticate");
const authRouter = express.Router();


authRouter.post("/register" , register);
authRouter.post("/login" ,  login);
authRouter.post("/logout"  , userMiddleware ,  logout);
authRouter.post("/admin/register" , adminMiddleware , adminRegister)
authRouter.get("/getProfile" , getProfile );
authRouter.delete("/deleteProfile" , userMiddleware , deleteProfile)
authRouter.get("/activeuser" , adminMiddleware , activeUsers)
// uthRouter.post("/googleAuth" , userMiddleware , googleAuth);

// check auth for user enters the website for checking the user is registered or if register then redirect to home page not then login/signup page
//so here token checking
authRouter.get("/check" , userMiddleware , (req , res) =>{
    try{
        const reply = {
            firstName:req.result.firstName,
            emailId:req.result.emailId,
            _id:req.result._id,
            role:req.result.role
        }

       

        res.status(200).json({
            user:reply,
            message:"Valid User"
        })
    }catch(err){
        res.status(500).send(" Error Occured " + err);
    }
})

module.exports  = authRouter;
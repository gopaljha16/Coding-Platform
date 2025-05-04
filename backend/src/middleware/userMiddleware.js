const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/user");


const userMiddleware = async (req , res , next) =>{
    try{

        const {token} = req.cookies;

        if(!token)
            throw new Error("Invalid Token");

        //validate the token
         const payload = jwt.verify(token , process.env.JWT_SECRET);

         const {_id} = payload;

         if(!_id)
            throw new Error(" Id is Missing");

         const result = await User.findById(_id);

         if(!result)
            throw new Error(" User Doesn't Exists");

        //  redis blocking 
        const isBlocked = await redisClient.exists(`token:${token}`);

        if(isBlocked)
            throw new Error(" Invalid Token");

        req.result = result;

        next();


    }catch(err){
        res.send("Error Occured " + err );
    }
}

module.exports = userMiddleware
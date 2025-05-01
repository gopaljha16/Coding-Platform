import redisClient from "../config/redis";
import validate from "../utils/validator";
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");


export const register = async (req, res) => {
    try {

        validate(req.body);
        const { firstName, email, password } = req.body;

        if(!firstName || !email)
            throw new Error("Credential Missing");

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);

        // created account login directy by using that token 
        const token = jwt.sign({ _id: user._id, emailId: user.emailId }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("User Registered Successfully");


    } catch (err) {
        res.status(401).send("Error :- " + err);
    }
}

export const login = async(req , res) =>{
    try{
        const {emailId , password} = req.body;

        if(!emailId || !password)
            throw new Error("Credentials Missing");

        const user =  await User.findOne({emailId});

        const match =  await bcrypt.compare(password , user.password);

        if(!match)
            throw new Error(" Invalid Credentials");

        // token create 
        const token = jwt.verify({_id:user_id, emailid:user.emailId} ,process.env.JWT_SECRET , {expiresIn:60*60} );

        res.cookie("token" , token, {maxAge:60*60*1000});

        res.status(201).send("Logged In Successfully");

    }catch(err){
        res.status(403).send("Error " + err );
    }
}

export const logout = async (req , res) =>{
    try{

         const {token } = req.cookies;

         await redisClient.set(`token:${token}` , "Blocked");

         //extracting expiry time
         const payload = jwt.decode(token) //contains jwt expiry
         await redisClient.expireAt(`token:${token}`, payload.exp);

         res.cookie("token" , null , {expires: new Date(Date.now())});

         res.status(200).send("User Logged Out Successfully");

    }catch(err){
        res.status(401).send("Error : " + err);
    }
}

export const getProfile = async (req , res) =>{
    try{

        
    }catch(err){
        res.status(401).send("Error :- " +err);
    }
}
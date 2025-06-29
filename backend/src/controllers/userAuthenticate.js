const redisClient = require("../config/redis");
const validate = require("../utils/validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const Submission = require("../models/submission");



const register = async (req, res) => {
    try {

        validate(req.body);
        const { firstName, emailId, password , confirmPassword  } = req.body;

        if (!firstName || !emailId)
            throw new Error("Credential Missing");


      if (password !== confirmPassword)
            throw new Error("Password Doesn't Match");

        req.body.password = await bcrypt.hash(password, 10);
    

        const user = await User.create(req.body);
        req.body.role = "user";
        // created account login directy by using that token 
        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: "user" }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
           
        }

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        res.status(201).json({
            user: reply,
            message: "User Registered Successfully"
        });


    } catch (err) {
        res.status(401).send("Error :- " + err);
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;


        if (!emailId || !password)
            throw new Error("Credentials Missing");

        const user = await User.findOne({ emailId });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error(" Invalid Credentials");

        // token create 
        const token = jwt.sign({ _id: user._id, emailid: user.emailId, role: user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            // role:req.result.role
        }


        res.status(201).json({
            user: reply,
            message: "Logged In Successfully"
        });

    } catch (err) {
        res.status(403).send("Error " + err);
    }
}

const logout = async (req, res) => {
    try {

        const { token } = req.cookies;

        await redisClient.set(`token:${token}`, "Blocked");

        //extracting expiry time
        const payload = jwt.decode(token) //contains jwt expiry
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()) });

        res.status(200).send("User Logged Out Successfully");

    } catch (err) {
        res.status(401).send("Error : " + err);
    }
}

const getProfile = async (req, res) => {
    try {


    } catch (err) {
        res.status(401).send("Error :- " + err);
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;

        await User.findByIdAndDelete(userId);

        //    await Submission.deleteMany({userId});

        res.status(200).send("User Deleted Successfully");


    } catch (err) {
        res.status(403).send("Error Occured " + err);
    }
}




module.exports = { register, login, logout, getProfile, deleteProfile }
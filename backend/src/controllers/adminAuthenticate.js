const User = require("../models/user");
const validate = require("../utils/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const adminRegister = async (req , res) =>{
    try {

        validate(req.body);
        const { firstName, emailId, password } = req.body;

        if(!firstName || !emailId)
            throw new Error("Credentials Missing");

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "admin";
        const user = await User.create(req.body);
        
        console.log("Registered user role:", user.role);
        // created account login directy by using that token 
        const token = jwt.sign({ _id: user._id, emailId: user.emailId , role:user.role}, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("User Registered Successfully");


    } catch (err) {
        res.status(401).send("Error :- " + err);
    }
}


module.exports = adminRegister;
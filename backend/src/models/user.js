const mongoose  = require("mongoose");
const {Schema} = mongoose;

const userScehma = Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        immutable:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:["user" , "admin"], //user admin/user.
        default: "user",
    },
    problemSolved:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:"problem",
                unique:true
            },
        ]
    }
})

const User = mongoose.model("user" , userScehma);
module.exports = User;
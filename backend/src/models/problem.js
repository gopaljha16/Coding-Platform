const mongoose = require("mongoose");
const {Schema} =mongoose;

const ProblemSchema = Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:["easy" , "medium" , "hard"],
        required:true,
    },
    tags:{
        type:String,
        enum:["Array" , "LinkedList" , 'Graph' , "Dynamic Programming"],
        required:true,
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true,
            },
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true,
            },
        }
    ],

    referenceSolution:[  // actual solution.
        {
            language:{
            type:String,
            required:true,
           },
           completeCode:{
            type:String,
            required:true,
           },
            default: []
         }
         
    ],

    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
})

const Problem = mongoose.model("problem" , ProblemSchema);
module.exports = Problem;
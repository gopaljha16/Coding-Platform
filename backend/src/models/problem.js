const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProblemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    tags: {
        type: [String],
        enum: ["array", "linkedList", "graph", "dp", "function", "stack"],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true,
            },
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            },
        }
    ],

    referenceSolution: [  // actual solution.
        {
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true,
            },
            default: []
        }

    ],

    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {Timestamp:true})

const Problem = mongoose.model("problem", ProblemSchema);
module.exports = Problem;
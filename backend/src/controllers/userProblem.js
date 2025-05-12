const { getLanguageById, SubmitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem")


const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;
    try {
        //array iteration every elemeny
        for (const { language, completeCode } of referenceSolution) {

            if (!language || !completeCode) {
                return res.status(400).send("Missing language or completeCode in referenceSolution.");
            }

            // langauge id
            const languageId = getLanguageById(language);
            console.log(languageId)

            // submission array creating
            const submission = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output,
            }));


            const submitResult = await SubmitBatch(submission);

            if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).send("Judge0 submission failed or no result returned.");
            }

            const resultToken = submitResult.map((value) => value.token); // creates the array and returns the token
            // console.log(resultToken)
            const testResult = await submitToken(resultToken)
            console.log(testResult)

            // check the test cases
            for (const test of testResult) {
                if (test.status_id != 3)
                    return res.status(400).send("Error Occured Status_code is not equal to 3 ");
            }
        }

        //  storing the problem into database
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id,
        })


        res.status(201).send("Problem Created Successfully");


    } catch (err) {
        res.status(401).send("Error Occured " + err)
    }
}


const updateProblem = async (req, res) => {
    const { id } = req.params
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;

    try {

        if (!id)
            return res.status(404).send("Id is Missing");

        const getProblem = Problem.findById(id);

        if (!getProblem) {
            return res.status(403).send("Problem is Missing");
        }

        for (const { language, completeCode } of referenceSolution) {

            if (!language || !completeCode) {
                return res.status(400).send("Missing language or completeCode in referenceSolution.");
            }

            // langauge id
            const languageId = getLanguageById(language);
            console.log(languageId)

            // submission array creating
            const submission = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output,
            }));


            const submitResult = await SubmitBatch(submission);

            if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).send("Judge0 submission failed or no result returned.");
            }

            const resultToken = submitResult.map((value) => value.token); // creates the array and returns the token
            // console.log(resultToken)
            const testResult = await submitToken(resultToken)
            console.log(testResult)

            // check the test cases
            for (const test of testResult) {
                if (test.status_id != 3)
                    return res.status(400).send("Error Occured Status_code is not equal to 3 ");
            }

            // update the problem 
            const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

            res.status(200).send(newProblem)

        }
    } catch (err) {
        res.statu(403).send("Error Occured " + err);
    }
}

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id)
            return res.status(404).send("Id is Missing");

        const getProblem = Problem.findById(id);

        if (!getProblem) {
            return res.status(403).send("Problem is Missing");
        }

        const deleteProblem = await Problem.findByIdAndDelete(id);

        if (!deleteProblem)
            return res.status(500).send("Problem is Missing Cannot be deleted");

        res.status(200).send("Problem Deleted Successfully");

    } catch (err) {
        res.status(404).send("Error Occured " + err);
    }
}


const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        
         if(!id)
            return res.status(403).send("Id is Missing");

         const getProblem  = await Problem.findById(id);

         if(!getProblem)
            return res.status(403).send("Problem is Missing");


         res.status(200).send(getProblem);
        
    } catch (err) { }
    res.status(500).send("Error Occured " + err);
}

const getAllProblems = async (req ,res) =>{
    try{
        
        const getProblems  = await Problem.find({});

        if(!getProblems)
            return res.status(403).send("Problems are Missing");

        res.status(200).send(getProblems)

    }catch(err){
        res.status(500).send("Error Occured " + err);
    }
}

const getAllSubmission = async (req , res) =>{
    try{

    }catch(err){
        res.status(403).send("Error Occured " +err);
    }
}


module.exports = { createProblem, updateProblem, deleteProblem, getAllProblems , getProblemById , getAllSubmission }
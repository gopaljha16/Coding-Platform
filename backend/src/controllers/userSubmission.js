const Problem = require("../models/problem")
const Submission = require("../models/submission")
const { getLanguageById, submitToken, SubmitBatch } = require("../utils/problemUtility")



const submitCode = async (req, res) => {
    try {

        const userId = req.result._id;
        console.log(userId)

        const problemId = req.params.id;
     

        const { code, language } = req.body;


        if (!userId || !problemId || !code || !language)
            return res.status(401).send("Fields Are Missing");

        if (language === 'cpp')
            language = 'c++'

        //fetch the problem from database
        const problem = await Problem.findById(problemId);


        // first saving into the database if there is an issue in the judge0 first it should be saved as an pending
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "Pending",
            totalTestCases: problem.hiddenTestCases.length,
        })

        //now judge0 code submit 
        const languageId = await getLanguageById(language);

        if (!languageId)
            return res.status(404).send(" Invalid Language Id");

        const submission = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }))

        const submitResult = await SubmitBatch(submission);

        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).send("Judge0 submission failed or no result returned.");
        }


        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);


        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let errorMessage = null;
        let status = "Accepted";


        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = "Wrong Answer";
                    errorMessage = test.stderr
                } else {
                    status = "Error";
                    errorMessage = test.stderr
                }
            }
        }

        // update to the database submission store into the database which previous stored as pending if it's wrong answer that will also be stored 
        submittedResult.status = status;
        submittedResult.runtime = runtime;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;

        await submittedResult.save();

        // after submission saving it to the problem Id
        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

    

        const accepted = (status == 'Accepted')
        res.status(201).json({
            accepted,
            totalTestCases: submittedResult.totalTestCases,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });
        
       

    } catch (err) {
        res.status(500).send("Internal Server Error " + err);
    }
}


const runCode = async (req, res) => {
    try {

        const userId = req.result._id;
        console.log(userId)

        const { id } = req.params;
        const problemId = id;

        const { code, language } = req.body;
        if (language === 'cpp')
            language = 'c++'

        if (!userId || !problemId || !code || !language)
            return res.status(401).send("Fields Are Missing");

        //fetch the problem from database
        const problem = await Problem.findById(problemId);

        //now judge0 code submit 
        const languageId = await getLanguageById(language);

        if (!languageId)
            return res.status(404).send(" Invalid Language Id");

        const submission = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }))

        const submitResult = await SubmitBatch(submission);

        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).send("Judge0 submission failed or no result returned.");
        }


        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = false
                    errorMessage = test.stderr
                }
                else {
                    status = false
                    errorMessage = test.stderr
                }
            }
        }

        res.status(201).json({
            success: status,
            testCases: testResult,
            runtime,
            memory
        });
    } catch (err) {
        res.status(403).send("Error Occured " + err);
    }
}




module.exports = { submitCode, runCode }
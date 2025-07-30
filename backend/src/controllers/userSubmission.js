const Problem = require("../models/problem")
const Submission = require("../models/submission")
const User = require("../models/user")
const { getLanguageById, submitToken, SubmitBatch } = require("../utils/problemUtility")



const submitCode = async (req, res) => {
    try {

        const userId = req.result._id;
        console.log("submitCode: userId:", userId);

        const problemId = req.params.id;
        console.log("submitCode: problemId:", problemId);

        let { code, language } = req.body;
        console.log("submitCode: received code and language");

        if (!userId || !problemId || !code || !language) {
            console.log("submitCode: Missing fields");
            return res.status(401).send("Fields Are Missing");
        }

        if (language === 'cpp')
            language = 'c++';

        //fetch the problem from database
        const problem = await Problem.findById(problemId);
        if (!problem) {
            console.log("submitCode: Problem not found");
            return res.status(404).send("Problem not found");
        }
        console.log("submitCode: Problem found");

        // first saving into the database if there is an issue in the judge0 first it should be saved as an pending
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "Pending",
            totalTestCases: problem.hiddenTestCases.length,
        });
        console.log("submitCode: Submission created with pending status");

        //now judge0 code submit 
        const languageId = await getLanguageById(language);
        if (!languageId) {
            console.log("submitCode: Invalid language id");
            return res.status(404).send(" Invalid Language Id");
        }
        console.log("submitCode: Language ID found:", languageId);

        const submission = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
        }));
        console.log("submitCode: Prepared submission batch");

        const submitResult = await SubmitBatch(submission);
        if (!submitResult || !Array.isArray(submitResult)) {
            console.log("submitCode: Judge0 submission failed or no result returned");
            return res.status(500).send("Judge0 submission failed or no result returned.");
        }
        console.log("submitCode: Judge0 submission successful");

        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
        console.log("submitCode: Received test results");

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
                    errorMessage = test.stderr;
                } else {
                    status = "Error";
                    errorMessage = test.stderr;
                }
            }
        }
        console.log("submitCode: Test results processed");

        // update to the database submission store into the database which previous stored as pending if it's wrong answer that will also be stored 
        submittedResult.status = status;
        submittedResult.runtime = runtime;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;

        await submittedResult.save();
        console.log("submitCode: Submission updated with results");

        // after submission saving it to the problem Id - only if status is Accepted
        console.log("submitCode: Checking if problem is already solved. Status:", status);
        console.log("submitCode: User's problemSolved array:", req.result.problemSolved);
        console.log("submitCode: Problem ID to check:", problemId);

        // Check if problemId is already in the problemSolved array
        const isAlreadySolved = req.result.problemSolved.some(id =>
            id.toString() === problemId.toString()
        );
        console.log("submitCode: Is problem already solved?", isAlreadySolved);

        if (status === 'Accepted' && !isAlreadySolved) {
            console.log("submitCode: Adding problem to solved list");
            req.result.problemSolved.push(problemId);
            try {
                await req.result.save();
                console.log("submitCode: User problemSolved updated");
            } catch (userSaveErr) {
                console.error("submitCode: Error saving user document:", userSaveErr);
                // Log detailed error for debugging
                console.error("Error details:", JSON.stringify(userSaveErr));

                // Try to update using findByIdAndUpdate as a fallback
                try {
                    await User.findByIdAndUpdate(
                        req.result._id,
                        { $addToSet: { problemSolved: problemId } }
                    );
                    console.log("submitCode: User problemSolved updated using findByIdAndUpdate");
                } catch (fallbackErr) {
                    console.error("Fallback update also failed:", fallbackErr);
                    // Still don't fail the submission, but log the error
                }
            }
        }

        const accepted = (status == 'Accepted');
        res.status(201).json({
            success: true,
            message: accepted ? "Submission accepted" : "Submission processed",
            accepted,
            totalTestCases: submittedResult.totalTestCases,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });
        console.log("submitCode: Response sent");

    } catch (err) {
        console.error("Error in submitCode:", err);
        try {
            res.status(500).send("Internal Server Error " + err.message || err);
        } catch (sendErr) {
            console.error("Error sending error response:", sendErr);
        }
    }
}


const runCode = async (req, res) => {

    const userId = req.result._id;
    console.log(userId)

    const { id } = req.params;
    const problemId = id;

    let { code, language } = req.body;
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
}




module.exports = { submitCode, runCode }

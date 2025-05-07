const { getLanguageById , SubmitBatch  , submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem")


const createProblem = async (req , res) =>{
    const {title ,description, difficulty, tags , visibleTestCases , hiddenTestCases , startCode , referenceSolution } = req.body;
    try{
         //array iteration every elemeny
         for(const {language , completeCode } of referenceSolution){
            
  if (!language || !completeCode) {
        return res.status(400).send("Missing language or completeCode in referenceSolution.");
    }

            // langauge id
            const languageId = getLanguageById(language);
            console.log(languageId)
            
            // submission array creating
            const submission = visibleTestCases.map((testcase) =>({
                source_code:completeCode,
                language_id: languageId,
                stdin:testcase.input,
                expected_output:testcase.output,
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
            for(const test of testResult){
                if(test.status_id!=3)
                    return res.status(400).send("Error Occured Status_code is not equal to 3 ");
            }
         }

        //  storing the problem into database
        const userProblem = await Problem.create({
            ...req.body ,
            problemCreator: req.result._id,
        })


         res.status(201).send("Problem Created Successfully");


    }catch(err){
        res.status(401).send("Error Occured " + err)
    }
}

module.exports = {createProblem}
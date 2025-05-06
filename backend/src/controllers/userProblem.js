const { getLanguageById, SubmitBatch } = require("../utils/problemUtility");
S


const createProblem = async (req , res) =>{
    const {title ,description, difficulty, tags , visibleTestCases , hiddenTestCases , startCode , refernceSolution, problemCreator } = req.body;
    try{
         //array iteration every elemeny
         for(const {langauge , completeCode} of refernceSolution){
            
            // langauge id
            const langaugeId = getLanguageById(langauge);
            
            // submission array creating
            const submission = visibleTestCases.map((input , output) =>{
                source_code:completeCode;
                langauge_id:langaugeId;
                stdin:input;
                expected_output:output;
            })

            const submitResult = await SubmitBatch(submission);
         }



    }catch(err){
        res.status(401).send("Error Occured " + err)
    }
}
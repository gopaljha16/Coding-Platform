const axios = require('axios');


const getLanguageById = (lang)=>{

  const language = {
      "c++":54,
      "java":62,
      "javascript":63
  }


  return language[lang.toLowerCase()];
}


const SubmitBatch = async(submissions) =>{
    // axios using
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
          base64_encoded: 'false'
        },
        headers: {
          'x-rapidapi-key': '688fc6595emsh1f123e8f5a3be18p1e127ejsn819f20ee62cb',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
         submissions
        }
      };
      
      async function fetchData() {
          try {
              const response = await axios.request(options);
               return response.data;
          } catch (error) {
              console.log(error)
          }
      }
      
    return await fetchData();
}

const waiting = (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
}

const submitToken = async (resultToken) =>{


const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '688fc6595emsh1f123e8f5a3be18p1e127ejsn819f20ee62cb',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}


while(true){
    
  const result = await fetchData();


  // here the result status id should be greater than 2 or else call again 
  const isResultObtained = await result.submissions.every((r) => r.status.id > 2);

  if(isResultObtained){
    return result.submissions;
  }

  // here calling the function again after 1second  

 await waiting(1000);
}
}

module.exports = {getLanguageById , SubmitBatch , submitToken}
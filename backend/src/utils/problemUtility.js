
const getLanguageById = async (lang) =>{
    const langauge = {
        "C++":54,
        "java":62,
        "javascript":63,
    }
    return langauge[lang.toLowerCase()];
}

const SubmitBatch = async(submissions) =>{
    // axios using

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
          base64_encoded: 'true'
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

module.exports = {getLanguageById , SubmitBatch}
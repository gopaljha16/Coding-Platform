require('dotenv').config();
const axios = require('axios');

console.log('Testing Judge0 API configuration');
console.log('JUDGE_0_API_KEY:', process.env.JUDGE_0_API_KEY ? 'Exists (hidden)' : 'Missing');
console.log('JUDGE_0_HOST_API:', process.env.JUDGE_0_HOST_API ? 'Exists (hidden)' : 'Missing');

async function testJudge0Connection() {
  try {
    const options = {
      method: 'GET',
      url: 'https://judge0-ce.p.rapidapi.com/about',
      headers: {
        'x-rapidapi-key': process.env.JUDGE_0_API_KEY,
        'x-rapidapi-host': process.env.JUDGE_0_HOST_API
      }
    };
    
    console.log('Attempting to connect to Judge0 API...');
    const response = await axios.request(options);
    console.log('Connection successful!');
    console.log('Judge0 API response:', response.data);
    return true;
  } catch (error) {
    console.error('Error connecting to Judge0 API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error message:', error.message);
    }
    return false;
  }
}

testJudge0Connection();
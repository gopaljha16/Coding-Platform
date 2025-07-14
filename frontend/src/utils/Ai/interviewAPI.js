// api/interviewAPI.js
import axios from 'axios';

// Create API client instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const createInterviewSession = async (file, candidateInfo) => {
  try {
    let resumeText = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      resumeText = await parsePDF(file);
    } else if (file.type === 'text/plain') {
      resumeText = await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload PDF or TXT files.');
    }

    // Validate resume text length
    if (resumeText.trim().length < 50) {
      throw new Error('Resume content is too short. Please provide a more detailed resume.');
    }

    // Prepare the request payload
    const requestData = {
      resumeText: resumeText.trim(),
      fileName: file.name,
      fileSize: file.size,
      candidate: {
        name: candidateInfo?.name || 'Anonymous',
        email: candidateInfo?.email || ''
      }
    };

    console.log('Creating session with data:', {
      resumeLength: resumeText.length,
      fileName: file.name,
      candidateName: candidateInfo?.name
    });

    // Make API call
    const response = await fetch('http://localhost:3000/api/ai/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to create session');
    }

    console.log('✅ Session created successfully:', result.data);
    return result.data;

  } catch (error) {
    console.error('❌ Create session error:', error);
    throw error;
  }
};


// Interview API methods
export const interviewAPI = {
  // Create new interview session
  createSession: async (resumeData) => {
     try {
      const response = await fetch('http://localhost:3000/api/ai/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeData.text,
          fileName: resumeData.fileName,
          fileSize: resumeData.fileSize,
          candidate: {
            name: resumeData.candidateName,
            email: resumeData.candidateEmail,
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', result);
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create session'
      };
    }
  },

  // Continue interview with user answer
  continueInterview: async (sessionId, userAnswer) => {
   try {
      const response = await fetch('http://localhost:3000/api/ai/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userAnswer: userAnswer.trim(),
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: result.data || result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to continue interview'
      };
    }
  },

  // End interview session
  endInterview: async (sessionId) => {
    try {
      const response = await apiClient.post('http://localhost:3000/api/ai/end', {
        sessionId,
        endTime: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to end interview'
      };
    }
  },

  // Get session status/details
  getSessionStatus: async (sessionId) => {
    try {
      const response = await apiClient.get(`/ai/session/${sessionId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get session status'
      };
    }
  },

  // Upload resume file
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await apiClient.post('/ai/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted + '%');
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload resume'
      };
    }
  },

  // Get interview feedback
  getFeedback: async (sessionId) => {
    try {
      const response = await apiClient.get(`/ai/feedback/${sessionId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get feedback'
      };
    }
  },

  // Save interview recording (if applicable)
  saveRecording: async (sessionId, audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('recording', audioBlob, 'interview-recording.wav');
      formData.append('sessionId', sessionId);
      
      const response = await apiClient.post('/interview/save-recording', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save recording'
      };
    }
  }
};

// Helper function to extract text from PDF
export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        // This is a simplified version - you'd need a PDF parsing library like pdf-parse
        const text = event.target.result;
        resolve({
          text: text,
          fileName: file.name,
          fileSize: file.size
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Example usage functions for your React component
export const useInterviewAPI = () => {
  const createSession = async (resumeFile) => {
    try {
      // First upload the resume
      const uploadResult = await interviewAPI.uploadResume(resumeFile);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      // Then create session with the uploaded resume data
      const sessionResult = await interviewAPI.createSession(uploadResult.data);
      
      if (!sessionResult.success) {
        throw new Error(sessionResult.error);
      }
      
      return sessionResult.data;
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  };

  const continueInterview = async (sessionId, userAnswer, responseTime) => {
    try {
      const result = await interviewAPI.continueInterview(sessionId, {
        ...userAnswer,
        responseTime
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (error) {
      console.error('Continue interview error:', error);
      throw error;
    }
  };

  const endInterview = async (sessionId) => {
    try {
      const result = await interviewAPI.endInterview(sessionId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (error) {
      console.error('End interview error:', error);
      throw error;
    }
  };

  return {
    createSession,
    continueInterview,
    endInterview,
    getSessionStatus: interviewAPI.getSessionStatus,
    getFeedback: interviewAPI.getFeedback,
    saveRecording: interviewAPI.saveRecording
  };
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      details: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      details: 'No response from server'
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      details: error
    };
  }
};

// Configuration for different environments
export const apiConfig = {
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 30000
  },
  production: {
    baseURL: 'https://your-api-domain.com/api',
    timeout: 30000
  },
  staging: {
    baseURL: 'https://staging-api-domain.com/api',
    timeout: 30000
  }
};

export default interviewAPI;
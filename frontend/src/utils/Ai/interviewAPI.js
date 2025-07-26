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

// Update createInterviewSession function
export const createInterviewSession = async (file, candidateInfo) => {
  try {
    // First upload the resume
    const uploadResult = await interviewAPI.uploadResume(file);
    
    // Backend returns {success: true, data: {...}} directly now
    if (!uploadResult || !uploadResult.success) {
      throw new Error(uploadResult?.error || 'Resume upload failed');
    }
    
    // Get the extracted text from the upload response
    // Check if text property exists in the response
    // The backend returns a nested structure: {success: true, data: {text: "...", ...}}
    if (!uploadResult.data) {
      console.error('Invalid upload response:', uploadResult);
      throw new Error('Resume text extraction failed. Please try a different file.');
    }
    
    // Handle nested data structure
    const resumeData = uploadResult.data;
    if (!resumeData.text) {
      console.error('No text found in upload response:', resumeData);
      throw new Error('Resume text extraction failed. Please try a different file.');
    }
    
    const resumeText = resumeData.text;
    
    // DEBUG: Log extracted text
    console.log('Extracted Resume Text:', resumeText.substring(0, 100) + '...');
    console.log('Text Length:', resumeText.length);
    
    // Then create session with the uploaded resume data
    const sessionResult = await interviewAPI.createSession({
      resumeText, // This is the key expected by createSession
      fileName: file.name,
      fileSize: file.size,
      candidate: {
        name: candidateInfo?.name || 'Anonymous',
        email: candidateInfo?.email || ''
      }
    });
    
    if (!sessionResult.success) {
      throw new Error(sessionResult.error);
    }
    
    return sessionResult.data;
  } catch (error) {
    console.error('❌ Create session error:', error);
    throw error;
  }
};

// Update createSession API call
createSession: async (sessionData) => {
  try {
    const response = await fetch('http://localhost:3000/api/ai/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData) // Send the entire session data object
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
};

// Interview API methods
export const interviewAPI = {
  // Create new interview session
  createSession: async (resumeData) => {
    try {
      // Validate resumeData
      if (!resumeData.resumeText || resumeData.resumeText.length < 10) {
        console.error('Invalid resume data:', resumeData);
        return {
          success: false,
          error: 'Resume text is required and must be at least 10 characters'
        };
      }

      const response = await fetch('http://localhost:3000/api/ai/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeData.resumeText, // Using the property name from createInterviewSession
          fileName: resumeData.fileName,
          fileSize: resumeData.fileSize,
          candidate: resumeData.candidate || {
            name: 'Anonymous',
            email: ''
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
  continueInterview: async (sessionId, answerData) => {
    try {
      // Validate answerData
      if (!answerData) {
        return {
          success: false,
          error: 'Answer data is required'
        };
      }

      // Extract the answer text, ensuring it's a string
      const userAnswerText = typeof answerData.text === 'string' 
        ? answerData.text.trim() 
        : (typeof answerData === 'string' ? answerData.trim() : '');
      
      if (!userAnswerText) {
        return {
          success: false,
          error: 'Answer text is required'
        };
      }

      const response = await fetch('http://localhost:3000/api/ai/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userAnswer: userAnswerText,
          responseTime: answerData.responseTime,
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

      // The backend returns {success: true, data: {text: "...", ...}}
      // We want to preserve this structure for proper handling in createInterviewSession
      return response.data;
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

      // Check if the response contains the expected data structure
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data // Extract the nested data object
        };
      } else {
        // Handle case where response is successful but doesn't have expected structure
        console.warn('Feedback response missing expected data structure:', response.data);
        return {
          success: true,
          data: response.data // Return whatever data is available
        };
      }
    } catch (error) {
      console.error('Error fetching feedback:', error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get feedback',
        status: error.response?.status
      };
    }
  },
  
  // Generate feedback for a session (useful if feedback wasn't generated automatically)
  generateFeedback: async (sessionId) => {
    try {
      const response = await apiClient.post(`/ai/generate-feedback/${sessionId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        console.warn('Feedback generation response missing expected data structure:', response.data);
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('Error generating feedback:', error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate feedback',
        status: error.response?.status
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

      // Backend returns {success: true, data: {...}} directly now
      if (!uploadResult || !uploadResult.success) {
        throw new Error(uploadResult?.error || 'Resume upload failed');
      }

      // Then create session with the uploaded resume data
      // Convert the data structure to match what createSession expects
      const sessionResult = await interviewAPI.createSession({
        resumeText: uploadResult.data.text,
        fileName: uploadResult.data.fileName,
        fileSize: uploadResult.data.fileSize,
        candidate: {
          name: uploadResult.data.candidateName,
          email: uploadResult.data.candidateEmail
        }
      });

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
      // Check if userAnswer is a string or an object
      const answerData = typeof userAnswer === 'string' 
        ? { text: userAnswer, responseTime } 
        : { ...userAnswer, responseTime };
      
      const result = await interviewAPI.continueInterview(sessionId, answerData);

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

  // Generate feedback manually (useful for debugging or if automatic generation fails)
  const generateFeedback = async (sessionId) => {
    try {
      const result = await interviewAPI.generateFeedback(sessionId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Generate feedback error:', error);
      throw error;
    }
  };

  return {
    createSession,
    continueInterview,
    endInterview,
    getSessionStatus: interviewAPI.getSessionStatus,
    getFeedback: interviewAPI.getFeedback,
    generateFeedback,
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
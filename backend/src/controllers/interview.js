const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for interview sessions
// In production, you should use a database like Redis
const interviewSessions = new Map();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  cleanupExpiredSessions();
}, 5 * 60 * 1000);

const extractKeySkills = (resume) => {
  const skillKeywords = [
    'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'mongodb',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest',
    'graphql', 'typescript', 'express', 'angular', 'vue', 'spring', 'django',
    'html', 'css', 'bootstrap', 'tailwind', 'redux', 'next.js', 'nest.js',
    'mysql', 'postgresql', 'redis', 'elasticsearch', 'firebase', 'azure',
    'gcp', 'jenkins', 'github', 'gitlab', 'jira', 'confluence'
  ];

  const foundSkills = skillKeywords.filter(skill =>
    resume.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills.slice(0, 5); // Return top 5 skills
};

// Helper function to generate context-aware questions
const generateQuestionPrompt = (session, questionNumber) => {
  const { conversation, keySkills } = session;

  // Get last 2 exchanges to maintain context while saving tokens
  const recentContext = conversation.slice(-4);
  const contextText = recentContext.map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const difficulty = questionNumber <= 2 ? 'basic' : questionNumber <= 4 ? 'intermediate' : 'advanced';
  const focusSkill = keySkills[Math.min(questionNumber - 1, keySkills.length - 1)] || 'problem-solving';

  const basePrompt = `You are a technical interviewer. Based on the candidate's skills: ${keySkills.join(', ')}.

${contextText ? `Previous conversation:\n${contextText}\n` : ''}

Question ${questionNumber}/5 - Ask a ${difficulty} question about ${focusSkill}.

Rules:
- ONE question only
- 15 words maximum
- Be specific and technical
- No greetings or explanations
- Focus on practical application`;

  return basePrompt;
};

// Helper function to generate feedback prompt
const generateFeedbackPrompt = (session) => {
  const { keySkills, conversation } = session;

  // Extract only user responses for evaluation
  const userResponses = conversation
    .filter(msg => msg.role === 'user')
    .map((msg, index) => `Q${index + 1}: ${msg.content}`)
    .join('\n');

  return `Evaluate this technical interview for skills: ${keySkills.join(', ')}.

Candidate Responses:
${userResponses}

Provide detailed feedback in JSON format only:
{
  "overallScore": 0-100,
  "technicalScore": 0-100,
  "communicationScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["area1", "area2"],
  "improvements": ["tip1", "tip2", "tip3"],
  "detailedAnalysis": "Brief analysis in 50-100 words"
}`;
};

// Update uploadResume function
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    // File validation
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed'
      });
    }

    // File size validation
    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 10MB allowed'
      });
    }

    let extractedText = '';
    const filePath = req.file.path;

    try {
      if (fileExtension === '.txt') {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } else if (fileExtension === '.pdf') {
        try {
          // Use pdf-parse to extract text
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdf(dataBuffer);
          extractedText = data.text;

          // If parsing fails, try fallback text extraction
          if (!extractedText || extractedText.trim().length < 10) {
            console.warn('PDF parsing returned insufficient text, using fallback');
            // Simple text extraction as fallback
            const fallbackText = extractTextFromPDFBuffer(dataBuffer);
            if (fallbackText && fallbackText.length > extractedText.length) {
              extractedText = fallbackText;
            }
          }
        } catch (parseError) {
          console.error('PDF parsing error:', parseError);
          // Simple fallback extraction
          extractedText = extractTextFromPDFBuffer(fs.readFileSync(filePath));
        }
      }
      else {
        // For DOC/DOCX, we'll still use placeholder
        extractedText = "DOC/DOCX text extraction not implemented yet. Please use a text file or implement mammoth library.";
      }
    } catch (parseError) {
      console.error('Text extraction error:', parseError);
      extractedText = "Failed to extract text from file";
    }

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Validate extracted text
    if (extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Resume content too short. Please provide a more detailed resume.'
      });
    }

    // Return extracted data
    const resumeData = {
      text: extractedText,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      candidateName: req.body.candidateName || 'Anonymous',
      candidateEmail: req.body.candidateEmail || ''
    };

    res.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error.message);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process resume file'
    });
  }
};

// Add this helper function
function extractTextFromPDFBuffer(buffer) {
  // Simple text extraction from PDF buffer
  try {
    const text = buffer.toString('utf8', 0, 10000);
    return text.replace(/[^a-zA-Z0-9\s]/g, ' '); // Basic cleanup
  } catch (e) {
    console.error('Fallback text extraction failed:', e);
    return "PDF content extraction failed. Please try a different file.";
  }
}

// Get detailed feedback for a session
const getFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Check if session exists in memory (for recent sessions)
    const session = interviewSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or feedback already retrieved'
      });
    }

    // If session exists but interview not completed, return current status
    if (session.questionCount < 5) {
      return res.json({
        success: true,
        data: {
          sessionId,
          status: 'in_progress',
          questionsAnswered: session.conversation.filter(msg => msg.role === 'user').length,
          totalQuestions: 5,
          keySkills: session.keySkills,
          message: 'Interview still in progress'
        }
      });
    }

    // Generate feedback for completed interview
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generateFeedbackPrompt(session);

    const result = await model.generateContent(prompt);
    let feedback;

    try {
      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error("Feedback parsing error:", parseError);
      feedback = {
        overallScore: 65,
        technicalScore: 60,
        communicationScore: 70,
        strengths: ["Completed the interview", "Showed engagement"],
        weaknesses: ["Could provide more detailed responses", "Technical depth needs improvement"],
        improvements: [
          "Practice explaining technical concepts with examples",
          "Prepare STAR method responses",
          "Study fundamental concepts more deeply"
        ],
        detailedAnalysis: "Good participation in the interview. Focus on providing more specific examples and deeper technical explanations."
      };
    }

    // Calculate additional metrics
    const userResponseCount = session.conversation.filter(msg => msg.role === 'user').length;
    const interviewDuration = Math.floor((Date.now() - session.startTime) / 1000);

    const detailedFeedback = {
      ...feedback,
      sessionStats: {
        duration: interviewDuration,
        questionsAnswered: userResponseCount,
        averageResponseTime: Math.round(interviewDuration / userResponseCount) || 0,
        completionRate: Math.round((userResponseCount / 5) * 100),
        keySkillsEvaluated: session.keySkills
      },
      interviewHistory: session.conversation.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    };

    res.json({
      success: true,
      data: detailedFeedback
    });

  } catch (error) {
    console.error('❌ Feedback retrieval error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback'
    });
  }
};

// Save interview recording
const saveRecording = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No recording file uploaded'
      });
    }

    if (!sessionId) {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Validate file type (should be audio)
    const allowedAudioTypes = ['.wav', '.mp3', '.m4a', '.ogg', '.webm'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedAudioTypes.includes(fileExtension)) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid audio file type'
      });
    }

    // File size validation (50MB limit for audio)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (req.file.size > maxSize) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Audio file too large. Maximum 50MB allowed'
      });
    }

    // Create recordings directory if it doesn't exist
    const recordingsDir = path.join(__dirname, '../recordings');
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }

    // Generate new filename with session ID
    const timestamp = Date.now();
    const newFileName = `${sessionId}_${timestamp}${fileExtension}`;
    const newFilePath = path.join(recordingsDir, newFileName);

    // Move file to recordings directory
    fs.renameSync(req.file.path, newFilePath);

    // In a real application, you would save this info to a database
    // For now, we'll just return the file information
    const recordingData = {
      sessionId,
      fileName: newFileName,
      originalName: req.file.originalname,
      filePath: newFilePath,
      fileSize: req.file.size,
      uploadTime: timestamp,
      status: 'saved'
    };

    res.json({
      success: true,
      data: recordingData
    });

  } catch (error) {
    console.error('❌ Recording save error:', error.message);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save recording'
    });
  }
};

// Updated createSession function to handle both old and new data structures
const createSession = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Add logging for debugging

    // Handle both camelCase and snake_case properties
    const resumeText = req.body.resumeText || req.body.resume_text;
    const fileName = req.body.fileName || req.body.file_name;
    const fileSize = req.body.fileSize || req.body.file_size;
    const candidate = req.body.candidate || {};

    if (!resumeText || resumeText.trim().length < 10) {
      console.error('Invalid resume text:', {
        length: resumeText?.length,
        sample: resumeText?.substring(0, 50)
      });

      return res.status(400).json({
        success: false,
        message: `Resume text is required and must be at least 10 characters (received ${resumeText?.length || 0})`
      });
    }

    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini API key not configured');
      return res.status(500).json({
        success: false,
        message: "AI service not configured. Please check server configuration."
      });
    }

    try {


      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Extract key skills to focus the interview
      const keySkills = extractKeySkills(resumeText);

      // If no skills found, use generic ones
      if (keySkills.length === 0) {
        keySkills.push('problem-solving', 'communication', 'teamwork');
      }

      const prompt = `You are a technical interviewer. The candidate has skills in: ${keySkills.join(', ')}.

Resume snippet: ${resumeText.substring(0, 300)}...

Ask the first technical question about their strongest skill: ${keySkills[0]}. 
Keep it simple, practical, and under 15 words.
Don't include any greetings or explanations.`;

      const result = await model.generateContent(prompt);
      const question = result.response.text().trim();

      // Store optimized session data
      interviewSessions.set(sessionId, {
        keySkills,
        conversation: [{ role: "ai", content: question, timestamp: Date.now() }],
        startTime: Date.now(),
        questionCount: 1,
        resumeSnippet: resumeText.substring(0, 300),
        candidateInfo: {
          name: candidate?.name || 'Anonymous',
          email: candidate?.email || '',
          fileName: fileName || 'resume.txt',
          fileSize: fileSize || 0
        }
      });

      console.log('✅ Session created successfully:', sessionId);

      res.json({
        success: true,
        data: {
          sessionId,
          question,
          keySkills,
          timeLimit: 120,
          candidateName: candidate?.name || 'Anonymous'
        }
      });

    } catch (aiError) {
      console.error('❌ AI service error:', aiError.message);
      res.status(500).json({
        success: false,
        message: "AI service temporarily unavailable. Please try again later."
      });
    }

  } catch (error) {
    console.error("❌ Session creation error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to create interview session. Please try again."
    });
  }
};

const continueInterview = async (req, res) => {
  try {
    const { sessionId, userAnswer } = req.body;

    // Validate input
    if (!sessionId || !userAnswer || userAnswer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Session ID and valid answer (min 5 chars) required"
      });
    }

    const session = interviewSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or expired"
      });
    }

    // Check if session has expired (2 minutes)
    const sessionDuration = (Date.now() - session.startTime) / 1000;
    if (sessionDuration > 120) {
      interviewSessions.delete(sessionId);
      return res.status(408).json({
        success: false,
        message: "Session expired"
      });
    }

    // Check if max questions reached
    if (session.questionCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum questions reached"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Add user answer to conversation
    session.conversation.push({
      role: "user",
      content: userAnswer.trim(),
      timestamp: Date.now()
    });

    // Generate next question with optimized prompt
    const nextQuestionNumber = session.questionCount + 1;
    const prompt = generateQuestionPrompt(session, nextQuestionNumber);

    const result = await model.generateContent(prompt);
    const nextQuestion = result.response.text().trim();

    // Update session
    session.conversation.push({
      role: "ai",
      content: nextQuestion,
      timestamp: Date.now()
    });
    session.questionCount++;

    const timeRemaining = Math.max(0, 120 - Math.floor(sessionDuration));

    res.json({
      success: true,
      data: {
        question: nextQuestion,
        questionCount: session.questionCount,
        timeRemaining,
        isLastQuestion: session.questionCount === 5
      }
    });

  } catch (error) {
    console.error("❌ Interview continuation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to continue interview"
    });
  }
};

// End interview and generate feedback
const endInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    const session = interviewSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const interviewDuration = Math.floor((Date.now() - session.startTime) / 1000);

    // Generate optimized feedback prompt
    const prompt = generateFeedbackPrompt(session);

    const result = await model.generateContent(prompt);
    let feedback;

    try {
      const responseText = result.response.text().trim();
      // Extract JSON from response if it contains other text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error("Feedback parsing error:", parseError);
      // Fallback feedback structure
      feedback = {
        overallScore: 65,
        technicalScore: 60,
        communicationScore: 70,
        strengths: ["Attempted all questions", "Showed willingness to learn"],
        weaknesses: ["Need more specific examples", "Could improve technical depth"],
        improvements: [
          "Practice explaining technical concepts clearly",
          "Prepare specific project examples",
          "Study core fundamentals deeper"
        ],
        detailedAnalysis: "Good effort overall. Focus on providing more detailed technical explanations and specific examples from your experience."
      };
    }

    // Calculate performance metrics
    const userResponseCount = session.conversation.filter(msg => msg.role === 'user').length;
    const avgResponseTime = userResponseCount > 0 ? interviewDuration / userResponseCount : 0;

    // Clean up session
    interviewSessions.delete(sessionId);

    res.json({
      success: true,
      data: {
        feedback,
        sessionStats: {
          duration: interviewDuration,
          questionsAnswered: userResponseCount,
          averageResponseTime: Math.round(avgResponseTime),
          completionRate: Math.round((userResponseCount / 5) * 100),
          keySkillsEvaluated: session.keySkills
        }
      }
    });

  } catch (error) {
    console.error("❌ Interview analysis error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to analyze interview"
    });
  }
};

// Get session status
const getSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    const session = interviewSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const sessionDuration = Math.floor((Date.now() - session.startTime) / 1000);
    const timeRemaining = Math.max(0, 120 - sessionDuration);
    const isExpired = sessionDuration > 120;

    if (isExpired) {
      interviewSessions.delete(sessionId);
      return res.status(408).json({
        success: false,
        message: "Session expired"
      });
    }

    res.json({
      success: true,
      data: {
        questionCount: session.questionCount,
        duration: sessionDuration,
        timeRemaining,
        isActive: true,
        keySkills: session.keySkills,
        maxQuestions: 5
      }
    });

  } catch (error) {
    console.error("❌ Session status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get session status"
    });
  }
};

// Cleanup expired sessions (call this periodically)
const cleanupExpiredSessions = () => {
  const now = Date.now();
  let deletedCount = 0;

  for (const [sessionId, session] of interviewSessions.entries()) {
    if (now - session.startTime > 180000) { // 3 minutes buffer
      interviewSessions.delete(sessionId);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`🧹 Cleaned up ${deletedCount} expired sessions`);
  }
};

// Export all functions
module.exports = {
  createSession,
  continueInterview,
  endInterview,
  getSessionStatus,
  uploadResume,
  getFeedback,
  saveRecording,
  cleanupExpiredSessions
};
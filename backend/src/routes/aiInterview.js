const express = require("express");
const multer = require("multer");
const { 
  createSession, 
  continueInterview, 
  endInterview, 
  getSessionStatus,
  uploadResume,
  getFeedback,
  saveRecording
} = require("../controllers/interview");

const interviewRouter = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, DOC, and DOCX files are allowed.'));
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with error handling
interviewRouter.post("/ai/create-session", asyncHandler(createSession));
interviewRouter.post("/ai/continue", asyncHandler(continueInterview));
interviewRouter.post("/ai/end", asyncHandler(endInterview));
interviewRouter.get("/ai/session/:sessionId", asyncHandler(getSessionStatus));

// File upload routes with error handling
interviewRouter.post("/ai/upload-resume", upload.single('resume'), handleMulterError, asyncHandler(uploadResume));
interviewRouter.get("/ai/feedback/:sessionId", asyncHandler(getFeedback));
interviewRouter.post("/interview/save-recording", upload.single('recording'), handleMulterError, asyncHandler(saveRecording));

// Global error handler for this router
interviewRouter.use((err, req, res, next) => {
  console.error('Interview router error:', err);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
});

module.exports = interviewRouter;
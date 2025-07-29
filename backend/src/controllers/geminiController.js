const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateCodeStream = async (req, res) => {
  try {
    const { dsaType, prompt } = req.body;
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = `
      Generate a JavaScript function that demonstrates ${dsaType} operations.
      ${prompt ? `Additional requirements: ${prompt}` : ''}
      
      Requirements:
      1. Use ES6 syntax
      2. Include detailed comments
      3. Focus on visualization-friendly operations
      4. Return only the code without explanations
    `;

    // Send stream in chunks
    const result = await model.generateContentStream(fullPrompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // Send each chunk as an event
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Error generating code:', error.stack || error);
    // Send error event with actual error message
    const errorMessage = error.message || 'Failed to generate code';
    res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
};


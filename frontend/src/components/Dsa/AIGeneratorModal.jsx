import React, { useState, useEffect } from "react";
import { Sparkles, Zap, Copy, Check } from "lucide-react";

const AIGeneratorModal = ({ isOpen, onClose, onCodeGenerated, dsaType }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    setGeneratedText("");

    try {
      // Your existing API call logic here
      const backendUrl = "http://localhost:3000/dsa/generate-code";
      
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dsaType, prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        while (buffer.includes("\n\n")) {
          const eventEndIndex = buffer.indexOf("\n\n");
          const eventData = buffer.substring(0, eventEndIndex);
          buffer = buffer.substring(eventEndIndex + 2);
          
          if (eventData.startsWith("data: ")) {
            const data = eventData.substring(6).trim();
            try {
              const parsedData = JSON.parse(data);
              setGeneratedText(prev => prev + parsedData.text);
            } catch (error) {
              console.error("Error parsing data:", error);
            }
          }
        }
      }
    } catch (err) {
      setError("Failed to generate code. Please try again.");
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseCode = () => {
    onCodeGenerated(generatedText);
    onClose();
  };

  const handleClose = () => {
    setIsGenerating(false);
    setError("");
    setGeneratedText("");
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-yellow-400/40 bg-gradient-to-br from-gray-900/90 to-gray-800/90 shadow-2xl p-0 glassmorphism relative animate-fadein">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center drop-shadow-lg flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Generate Code with AI
          </h2>
          
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-300 mb-2 font-medium">
                  DSA Type
                </label>
                <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                  {dsaType}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-gray-300 mb-2 font-medium">
                  Describe what you want to visualize
                </label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
                  rows="3"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`e.g., 'Create a ${dsaType.toLowerCase()} with 5 elements and demonstrate sorting'`}
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-700/80 text-red-200 rounded-lg px-4 py-2 text-center font-semibold shadow shadow-red-900 animate-pulse">
                {error}
              </div>
            )}

            {/* Generated Code Preview */}
            {(isGenerating || generatedText) && (
              <div className="relative mt-2 bg-gray-900/90 rounded-xl border border-yellow-500/30 p-4 max-h-72 overflow-auto shadow-inner">
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                  {generatedText || "// Generating code..."}
                </pre>
                {generatedText && (
                  <button
                    className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-1 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                    }`}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-600 transition shadow"
                onClick={handleClose}
                disabled={isGenerating}
              >
                {isGenerating ? "Cancel Generation" : "Cancel"}
              </button>
              {!isGenerating ? (
                <button
                  className="px-4 py-2 bg-yellow-500 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_15px_rgba(255,208,0,0.7)] transition shadow flex items-center gap-2"
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                >
                  <Zap className="w-4 h-4" />
                  Generate Code
                </button>
              ) : (
                generatedText && (
                  <button
                    className="px-4 py-2 bg-green-500 rounded-lg text-white font-bold hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition shadow"
                    onClick={handleUseCode}
                  >
                    Use Generated Code
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;
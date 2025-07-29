import React, { useState, useEffect } from 'react';

const AIGeneratorModal = ({ isOpen, onClose, onCodeGenerated }) => {
  const [dsaType, setDsaType] = useState('Array');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedText('');
    
    // Create new SSE connection
    const backendUrl = 'http://localhost:3000/dsa/generate-code';
    const es = new EventSourcePolyfill(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dsaType, prompt }),
      onmessage: (e) => {
        try {
          const data = JSON.parse(e.data);
          setGeneratedText(prev => prev + data.text);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      },
      onerror: (e) => {
        console.error('SSE error:', e);
        setIsGenerating(false);
        if (eventSource) eventSource.close();
      }
    });
    
    setEventSource(es);
  };

  const handleUseCode = () => {
    onCodeGenerated(generatedText);
    if (eventSource) eventSource.close();
    onClose();
  };

  const handleClose = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-1/2 rounded-xl border border-yellow-500 p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Generate Code with AI</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">DSA Type</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              value={dsaType}
              onChange={(e) => setDsaType(e.target.value)}
              disabled={isGenerating}
            >
              <option value="Array">Array</option>
              <option value="Linked List">Linked List</option>
              <option value="Stack">Stack</option>
              <option value="Queue">Queue</option>
              <option value="Binary Tree">Binary Tree</option>
              <option value="Graph">Graph</option>
              <option value="Sorting">Sorting</option>
              <option value="Searching">Searching</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Describe what you want to visualize</label>
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Create a linked list with 5 nodes and reverse it'"
              disabled={isGenerating}
            />
          </div>
          
          {/* Generated Code Preview */}
          {isGenerating && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-h-60 overflow-auto">
              <pre className="text-yellow-200 animate-pulse">
                {generatedText || 'Generating code...'}
              </pre>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-600 transition"
              onClick={handleClose}
              disabled={isGenerating}
            >
              {isGenerating ? 'Cancel Generation' : 'Cancel'}
            </button>
            
            {!isGenerating ? (
              <button
                className="px-4 py-2 bg-yellow-500 rounded-lg text-gray-900 font-medium hover:shadow-[0_0_15px_rgba(255,208,0,0.5)] transition"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                Generate Code
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-green-500 rounded-lg text-white font-medium hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition"
                onClick={handleUseCode}
                disabled={!generatedText}
              >
                Use Generated Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// EventSource polyfill for browsers that don't support POST in EventSource
class EventSourcePolyfill {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.listeners = {};
    this.controller = new AbortController();
    
    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.options.headers,
        body: this.options.body,
        signal: this.controller.signal
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        while (buffer.includes('\n\n')) {
          const eventEndIndex = buffer.indexOf('\n\n');
          const eventData = buffer.substring(0, eventEndIndex);
          buffer = buffer.substring(eventEndIndex + 2);
          
          if (eventData.startsWith('data: ')) {
            const data = eventData.substring(6).trim();
            if (this.options.onmessage) {
              this.options.onmessage({ data });
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.options.onerror?.(error);
      }
    }
  }

  close() {
    this.controller.abort();
    if (this.options.onclose) {
      this.options.onclose();
    }
  }
}

export default AIGeneratorModal;
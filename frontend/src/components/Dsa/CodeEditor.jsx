import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import AIGeneratorModal from './AIGeneratorModal';

const CodeEditor = ({ code, setCode, onRun }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-gray-800">
        <h2 className="text-xl font-bold text-yellow-400">Code Editor</h2>
        <div className="flex space-x-3">
          <button 
            className="px-4 py-2 bg-orange-500 rounded-lg text-white font-medium hover:shadow-[0_0_15px_rgba(255,122,0,0.7)] transition"
            onClick={onRun}
          >
            Run & Visualize
          </button>
          <button 
            className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-600 transition"
            onClick={() => setCode('// Start coding here...')}
          >
            Reset
          </button>
          <button 
            className="px-4 py-2 bg-yellow-500 rounded-lg text-gray-900 font-medium hover:shadow-[0_0_15px_rgba(255,208,0,0.7)] transition"
            onClick={() => setIsAIModalOpen(true)}
          >
            Generate with AI
          </button>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <AIGeneratorModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onCodeGenerated={setCode}
      />
    </div>
  );
};

export default CodeEditor;
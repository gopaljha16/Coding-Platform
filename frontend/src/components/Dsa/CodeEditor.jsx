import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import AIGeneratorModal from './AIGeneratorModal';
import { Code2, Play, RotateCcw, Sparkles } from 'lucide-react';

const CodeEditor = ({ code, setCode, onRun, onCodeGenerated, dsaType }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleReset = () => {
    const exampleCode = {
      'Array': `// Array Operations Example
let arr = [5, 2, 8, 1, 9];
insertAt(0, 3);
swap(1, 3);
bubbleSort();`,
      'Linked List': `// Linked List Example
createLinkedList([1, 2, 3, 4, 5]);
insertNode(2, 10);
deleteNode(4);
reverse();`,
      'Sorting': `// Sorting Example
let arr = [64, 34, 25, 12, 22];
bubbleSort();`,
      'Searching': `// Search Example
let arr = [1, 3, 5, 7, 9];
linearSearch(7);
binarySearch(9);`
    };
    setCode(exampleCode[dsaType] || exampleCode['Array']);
  };

  return (
    <div className="flex flex-col w-full h-full bg-transparent rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-orange-400 tracking-wide flex items-center gap-2">
          <Code2 className="w-6 h-6" />
          Code Editor
        </h2>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-gray-700/80 rounded-lg text-gray-300 font-medium hover:bg-gray-600/80 transition-all duration-200 flex items-center gap-2"
            onClick={handleReset}
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            className="px-4 py-2 bg-yellow-500/90 rounded-lg text-black font-bold hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-yellow-400/30"
            onClick={() => setIsAIModalOpen(true)}
            title="Generate Code with AI"
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
          <button
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2"
            onClick={onRun}
            title="Run and Visualize"
          >
            <Play className="w-4 h-4" />
            Visualize
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-grow h-full">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "Fira Code, Consolas, Monaco, monospace",
            wordWrap: "on",
            wrappingIndent: "indent",
            lineNumbers: "on",
            glyphMargin: true,
          }}
        />
      </div>

      {/* AI Modal */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onCodeGenerated={onCodeGenerated}
        dsaType={dsaType}
      />
    </div>
  );
};

export default CodeEditor;

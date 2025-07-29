import React, { useState } from 'react';
import DSASelector from '../components/Dsa/DSASelector';
import CodeEditor from '../components/Dsa/CodeEditor';
import Visualizer from './Visualizer';

const DSAVisualizerPage = () => {
  const [currentDSA, setCurrentDSA] = useState('Array');
  const [code, setCode] = useState('// Start coding here...');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <DSASelector currentDSA={currentDSA} setCurrentDSA={setCurrentDSA} />
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        <div className="flex flex-col flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <CodeEditor code={code} setCode={setCode} onRun={handleRun} />
        </div>
        <div className="flex flex-col flex-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Visualizer dsaType={currentDSA} code={code} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
};

export default DSAVisualizerPage;

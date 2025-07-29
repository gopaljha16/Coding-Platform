import React, { useRef, useEffect, useState } from 'react';
import { useVisualization } from '../hooks/useVisualization';
import { renderArray, renderLinkedList } from '../utils/visualizers/renderers';

const Visualizer = ({ dsaType, code }) => {
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef(null);
  const { visualizationData, currentStep } = useVisualization(dsaType, code, isRunning);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!visualizationData) return;

    // Visualization rendering logic based on DSA type
    switch(dsaType) {
      case 'Array':
        renderArray(ctx, visualizationData, currentStep);
        break;
      case 'Linked List':
        renderLinkedList(ctx, visualizationData, currentStep);
        break;
      // Add other DSA cases...
    }
  }, [visualizationData, currentStep, dsaType]);

  const handlePlay = () => {
    setIsRunning(true);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        width={window.innerWidth * 0.7} 
        height={window.innerHeight * 0.7}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <button 
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 border border-gray-600"
          onClick={handlePlay}
        >
          <PlayIcon />
        </button>
        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 border border-gray-600">
          <StepBackIcon />
        </button>
        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 border border-gray-600">
          <StepForwardIcon />
        </button>
      </div>
    </div>
  );
};

// Placeholder icons
const PlayIcon = () => <span>▶️</span>;
const StepBackIcon = () => <span>⏪</span>;
const StepForwardIcon = () => <span>⏩</span>;

export default Visualizer;

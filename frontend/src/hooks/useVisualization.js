import { useState, useEffect } from 'react';
import { visualizeArray } from "../utils/visualizers/arrayVisualizer";
import { parseCode } from '../utils/codeParser';

export const useVisualization = (dsaType, code, isRunning) => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (!isRunning) return;
    
    try {
      const operations = parseCode(code, dsaType);
      const visualizationSteps = generateVisualizationSteps(operations, dsaType);
      
      setSteps(visualizationSteps);
      setCurrentStep(0);
      setVisualizationData(visualizationSteps[0]);
    } catch (error) {
      console.error('Visualization error:', error);
    }
  }, [code, dsaType, isRunning]);

  // Animation logic would go here
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setVisualizationData(steps[currentStep + 1]);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentStep, isRunning, steps]);

  return { visualizationData, currentStep };
};
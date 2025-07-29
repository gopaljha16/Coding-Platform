import { useState, useEffect, useCallback } from 'react';
import { parseCode } from '../codeParser';
import { visualizeArray } from './arrayVisualizer';

// Visualization handlers for different DSA types
const visualizationHandlers = {
  Array: visualizeArray,
  'Linked List': visualizeLinkedList,
  Stack: visualizeArray, // Can reuse array visualization with different operations
  Queue: visualizeArray,
  Sorting: visualizeArray,
  Searching: visualizeArray,
  // Add other DSA types...
};

export const useVisualization = (dsaType, code, isRunning) => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step

  // Generate visualization steps when code or DSA type changes
  useEffect(() => {
    if (!code) return;
    
    try {
      const operations = parseCode(code, dsaType);
      const handler = visualizationHandlers[dsaType] || visualizeArray;
      const generatedSteps = handler(operations);
      
      setSteps(generatedSteps);
      setCurrentStep(0);
      setVisualizationData(generatedSteps[0]);
      setIsPlaying(false);
    } catch (error) {
      console.error('Visualization generation error:', error);
    }
  }, [code, dsaType]);

  // Animation control
  useEffect(() => {
    let timer;
    
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisualizationData(steps[nextStep]);
        
        // Pause at the end
        if (nextStep >= steps.length - 1) {
          setIsPlaying(false);
        }
      }, speed);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setVisualizationData(steps[0]);
  };
  
  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisualizationData(steps[nextStep]);
    }
  }, [currentStep, steps]);
  
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setVisualizationData(steps[prevStep]);
    }
  }, [currentStep, steps]);
  
  const setStep = useCallback((step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      setVisualizationData(steps[step]);
    }
  }, [steps]);

  return {
    visualizationData,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setStep,
    setSpeed
  };
};
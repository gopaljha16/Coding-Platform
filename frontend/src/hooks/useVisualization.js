import { useState, useEffect, useCallback } from 'react';
import { parseCode } from '../utils/codeParser';
import { visualizeArray } from '../utils/visualizers/arrayVisualizer';
import { visualizeLinkedList } from '../utils/visualizers/linkedListVisualizer';

// Visualization handlers for different DSA types
const visualizationHandlers = {
  'Array': visualizeArray,
  'Linked List': visualizeLinkedList,
  'Stack': visualizeArray, // Can reuse array visualization
  'Queue': visualizeArray,
  'Binary Tree': visualizeArray, // Placeholder
  'Graph': visualizeArray, // Placeholder
  'Sorting': visualizeArray,
  'Searching': visualizeArray,
};

export const useVisualization = (dsaType, code, isRunning) => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step

  // Generate visualization steps when code or DSA type changes
  useEffect(() => {
    if (!code || code.trim() === '// Start coding here...' || code.trim() === '') {
      setSteps([]);
      setCurrentStep(0);
      setVisualizationData(null);
      setIsPlaying(false);
      return;
    }

    const operations = parseCode(code);
    if (operations.error) {
      console.error('Code parsing error:', operations.message);
      setSteps([]);
      setVisualizationData(null);
      return;
    }

    const handler = visualizationHandlers[dsaType] || visualizeArray;
    const generatedSteps = handler(operations);
    
    setSteps(generatedSteps);
    setCurrentStep(0);
    setVisualizationData(generatedSteps[0] || null);
    setIsPlaying(isRunning); // Auto-play if isRunning is true
  }, [code, dsaType, isRunning]);

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

  const play = useCallback(() => {
    if (steps.length > 0 && currentStep < steps.length - 1) {
      setIsPlaying(true);
    }
  }, [steps.length, currentStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (steps.length > 0) {
      setVisualizationData(steps[0]);
    }
  }, [steps]);
  
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
    setSpeed: (newSpeed) => setSpeed(newSpeed)
  };
};

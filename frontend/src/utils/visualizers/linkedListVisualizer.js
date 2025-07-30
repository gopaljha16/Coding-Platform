export const visualizeLinkedList = (operations) => {
  const steps = [];
  let list = [];

  const createStep = (action, list, highlights, description) => ({
    step: action,
    list: list.map(node => ({ value: node.value })),
    highlights: [...highlights],
    description,
    pointers: getPointerInfo(list)
  });

  const getPointerInfo = (list) => {
    const pointers = [];
    for (let i = 0; i < list.length - 1; i++) {
      pointers.push({ from: i, to: i + 1, color: '#3B82F6' });
    }
    return pointers;
  };

  steps.push(createStep('initial', list, [], "Ready to visualize linked list"));

  for (const op of operations) {
    switch (op.type) {
      case 'create':
        list = op.args.map(value => ({ value, next: null }));
        steps.push(createStep('create', list,
          list.map((_, i) => ({ index: i, color: '#10B981' })),
          `Created linked list with ${list.length} nodes`));
        break;

      case 'insert':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          const newNode = { value, next: null };

          if (index === 0) {
            list.unshift(newNode);
          } else if (index >= list.length) {
            list.push(newNode);
          } else {
            list.splice(index, 0, newNode);
          }

          steps.push(createStep('insert', list,
            [{ index: Math.min(index, list.length - 1), color: '#10B981' }],
            `Inserted ${value} at position ${index}`));
        }
        break;

      case 'delete':
        if (op.args.length >= 1 && list.length > 0) {
          const index = op.args[0];
          if (index >= 0 && index < list.length) {
            const deletedValue = list[index].value;
            steps.push(createStep('pre-delete', list,
              [{ index, color: '#EF4444' }],
              `Deleting node with value ${deletedValue}`));
            list.splice(index, 1);
            steps.push(createStep('delete', list, [],
              `Deleted node with value ${deletedValue}`));
          }
        }
        break;

      case 'reverse':
        steps.push(createStep('reverse-start', list, [], 'Reversing linked list'));
        list.reverse();
        steps.push(createStep('reverse-complete', list,
          list.map((_, i) => ({ index: i, color: '#10B981' })),
          'Linked list reversed'));
        break;
    }
  }

  return steps;
};

// Custom Hook for Visualization
export const useVisualization = (dsaType, code) => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const visualizationHandlers = {
    'Array': visualizeArray,
    'Linked List': visualizeLinkedList,
    'Stack': visualizeArray,
    'Queue': visualizeArray,
    'Binary Tree': visualizeArray,
    'Graph': visualizeArray,
    'Sorting': visualizeArray,
    'Searching': visualizeArray
  };

  useEffect(() => {
    if (!code || code.trim() === '// Start coding here...') {
      setSteps([]);
      setVisualizationData(null);
      return;
    }

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

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisualizationData(steps[nextStep]);

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
    if (steps.length > 0) setVisualizationData(steps[0]);
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
    setSpeed
  };
};
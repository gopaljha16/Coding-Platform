export const visualizeArray = (operations) => {
  const steps = [];
  let array = [];

  const createStep = (action, array, highlights, description) => ({
    step: action,
    array: [...array],
    highlights: [...highlights],
    description
  });

  steps.push(createStep('initial', array, [], "Ready to visualize"));

  for (const op of operations) {
    switch (op.type) {
      case 'create':
        // AST parser wraps array in another array
        array = op.args[0] ? [...op.args[0]] : [];
        steps.push(createStep('create', array,
          array.map((_, i) => ({ index: i, color: '#10B981' })),
          `Created array with ${array.length} elements`));
        break;

      case 'insert':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          if (index >= 0 && index <= array.length) {
            array.splice(index, 0, value);
            steps.push(createStep('insert', array,
              [{ index, color: '#3B82F6' }],
              `Inserted ${value} at index ${index}`));
          }
        }
        break;

      case 'delete':
        if (op.args.length >= 1) {
          const index = op.args[0];
          if (index >= 0 && index < array.length) {
            const deleted = array[index];
            steps.push(createStep('pre-delete', array,
              [{ index, color: '#EF4444' }],
              `Deleting element at index ${index}`));
            array.splice(index, 1);
            steps.push(createStep('delete', array, [],
              `Deleted ${deleted} from index ${index}`));
          }
        }
        break;

      case 'update':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          if (index >= 0 && index < array.length) {
            steps.push(createStep('pre-update', array,
              [{ index, color: '#F59E0B' }],
              `Updating index ${index} to ${value}`));
            array[index] = value;
            steps.push(createStep('update', array,
              [{ index, color: '#10B981' }],
              `Updated index ${index}`));
          }
        }
        break;

      case 'swap':
        if (op.args.length >= 2) {
          const [i, j] = op.args;
          if (i >= 0 && i < array.length && j >= 0 && j < array.length) {
            steps.push(createStep('pre-swap', array,
              [{ index: i, color: '#8B5CF6' }, { index: j, color: '#8B5CF6' }],
              `Swapping elements at positions ${i} and ${j}`));
            [array[i], array[j]] = [array[j], array[i]];
            steps.push(createStep('swap', array,
              [{ index: i, color: '#10B981' }, { index: j, color: '#10B981' }],
              `Swapped positions ${i} and ${j}`));
          }
        }
        break;

      case 'bubbleSort':
        bubbleSortVisualization(array, steps);
        break;

      case 'linearSearch':
        if (op.args.length >= 1) {
          linearSearchVisualization(array, op.args[0], steps);
        }
        break;

      case 'binarySearch':
        if (op.args.length >= 1) {
          binarySearchVisualization(array, op.args[0], steps);
        }
        break;
    }
  }

  return steps;
};

const bubbleSortVisualization = (array, steps) => {
  const n = array.length;

  const createStep = (action, array, highlights, description) => ({
    step: action, array: [...array], highlights: [...highlights], description
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(createStep('compare', array,
        [{ index: j, color: '#3B82F6' }, { index: j + 1, color: '#3B82F6' }],
        `Comparing ${array[j]} and ${array[j + 1]}`));

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push(createStep('swap', array,
          [{ index: j, color: '#10B981' }, { index: j + 1, color: '#10B981' }],
          `Swapped ${array[j + 1]} and ${array[j]}`));
      }
    }
  }
};

const linearSearchVisualization = (array, target, steps) => {
  const createStep = (action, array, highlights, description) => ({
    step: action, array: [...array], highlights: [...highlights], description
  });

  steps.push(createStep('search-start', array, [], `Searching for ${target}`));

  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      steps.push(createStep('found', array,
        [{ index: i, color: '#10B981' }],
        `Found ${target} at index ${i}`));
      return;
    }

    steps.push(createStep('search-check', array,
      [{ index: i, color: '#F59E0B' }],
      `Checking element ${array[i]} at index ${i}`));
  }

  steps.push(createStep('not-found', array, [], `${target} not found`));
};

const binarySearchVisualization = (array, target, steps) => {
  const sortedArray = [...array].sort((a, b) => a - b);
  const createStep = (action, array, highlights, description) => ({
    step: action, array: [...array], highlights: [...highlights], description
  });

  steps.push(createStep('binary-search-start', sortedArray, [],
    `Binary search for ${target} (array sorted)`));

  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = sortedArray[mid];

    const rangeHighlight = [];
    for (let i = low; i <= high; i++) {
      rangeHighlight.push({
        index: i,
        color: i === mid ? '#3B82F6' : '#6B7280'
      });
    }

    steps.push(createStep('binary-search-check', sortedArray, rangeHighlight,
      `Checking middle: ${midVal} at index ${mid}`));

    if (midVal === target) {
      steps.push(createStep('found', sortedArray,
        [{ index: mid, color: '#10B981' }],
        `Found ${target} at index ${mid}`));
      return;
    } else if (midVal < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  steps.push(createStep('not-found', sortedArray, [], `${target} not found`));
};

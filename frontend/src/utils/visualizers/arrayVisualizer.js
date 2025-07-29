/**
 * Generates visualization steps for array operations
 * @param {Array} operations - Operations from code parser
 * @returns {Array} Visualization steps
 */
export const visualizeArray = (operations) => {
  const steps = [];
  let array = [];
  let state = {};
  let stepIndex = 0;

  // Initial state
  steps.push(createStep('initial', array, [], "Initializing visualization"));

  // Process each operation
  for (const op of operations) {
    switch (op.type) {
      case 'create':
        array = [...op.args];
        steps.push(createStep(
          'create',
          array,
          [],
          `Created array with ${array.length} elements`
        ));
        break;

      case 'insert':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          if (index >= 0 && index <= array.length) {
            array.splice(index, 0, value);
            steps.push(createStep(
              'insert',
              array,
              [{ index, color: '#10B981' }],
              `Inserted ${value} at index ${index}`
            ));
          }
        }
        break;

      case 'delete':
        if (op.args.length >= 1) {
          const index = op.args[0];
          if (index >= 0 && index < array.length) {
            const deleted = array[index];
            steps.push(createStep(
              'pre-delete',
              array,
              [{ index, color: '#EF4444' }],
              `Deleting element at index ${index}`
            ));
            
            array.splice(index, 1);
            steps.push(createStep(
              'delete',
              array,
              [],
              `Deleted ${deleted} from index ${index}`
            ));
          }
        }
        break;

      case 'update':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          if (index >= 0 && index < array.length) {
            const original = array[index];
            steps.push(createStep(
              'pre-update',
              array,
              [{ index, color: '#F59E0B' }],
              `Updating index ${index} from ${original} to ${value}`
            ));
            
            array[index] = value;
            steps.push(createStep(
              'update',
              array,
              [{ index, color: '#10B981' }],
              `Updated index ${index} to ${value}`
            ));
          }
        }
        break;

      case 'swap':
        if (op.args.length >= 2) {
          const [i, j] = op.args;
          if (i >= 0 && i < array.length && j >= 0 && j < array.length) {
            // Highlight both elements
            steps.push(createStep(
              'pre-swap',
              array,
              [
                { index: i, color: '#3B82F6' },
                { index: j, color: '#3B82F6' }
              ],
              `Swapping elements at positions ${i} and ${j}`
            ));
            
            // Perform swap
            [array[i], array[j]] = [array[j], array[i]];
            steps.push(createStep(
              'swap',
              array,
              [
                { index: i, color: '#10B981' },
                { index: j, color: '#10B981' }
              ],
              `Swapped positions ${i} and ${j}`
            ));
          }
        }
        break;

      case 'sort':
        if (op.name === 'bubbleSort') {
          bubbleSortVisualization(array, steps);
        }
        // Add other sort algorithms...
        break;

      case 'search':
        if (op.name === 'linearSearch') {
          linearSearchVisualization(array, op.args[0], steps);
        } else if (op.name === 'binarySearch') {
          binarySearchVisualization(array, op.args[0], steps);
        }
        break;
    }
  }

  return steps;
};

/**
 * Creates a visualization step
 */
const createStep = (action, array, highlights, description) => ({
  step: action,
  array: [...array],
  highlights: [...highlights],
  description,
  codeLine: null
});

/**
 * Generates visualization steps for bubble sort
 */
const bubbleSortVisualization = (array, steps) => {
  const arr = [...array];
  const n = arr.length;
  
  steps.push(createStep(
    'sort-start',
    arr,
    [],
    'Starting Bubble Sort'
  ));

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      const highlights = [
        { index: j, color: '#3B82F6' },
        { index: j + 1, color: '#3B82F6' }
      ];
      
      steps.push(createStep(
        'compare',
        arr,
        highlights,
        `Comparing ${arr[j]} and ${arr[j+1]}`
      ));

      if (arr[j] > arr[j + 1]) {
        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        steps.push(createStep(
          'swap',
          arr,
          [
            { index: j, color: '#10B981' },
            { index: j + 1, color: '#10B981' }
          ],
          `Swapped ${arr[j+1]} and ${arr[j]}`
        ));
      }
    }
    
    // Mark sorted element
    const sortedIndex = n - i - 1;
    steps.push(createStep(
      'sorted',
      arr,
      [{ index: sortedIndex, color: '#10B981' }],
      `Element at position ${sortedIndex} is now sorted`
    ));
  }

  steps.push(createStep(
    'sort-end',
    arr,
    arr.map((_, i) => ({ index: i, color: '#10B981' })),
    'Bubble Sort completed'
  ));
  
  return arr;
};

/**
 * Generates visualization steps for linear search
 */
const linearSearchVisualization = (array, target, steps) => {
  steps.push(createStep(
    'search-start',
    array,
    [],
    `Starting Linear Search for ${target}`
  ));

  for (let i = 0; i < array.length; i++) {
    const highlights = [{ index: i, color: '#3B82F6' }];
    
    if (array[i] === target) {
      steps.push(createStep(
        'found',
        array,
        [{ index: i, color: '#10B981' }],
        `Found ${target} at index ${i}`
      ));
      return;
    }
    
    steps.push(createStep(
      'search-check',
      array,
      highlights,
      `Checking element ${array[i]} at index ${i}`
    ));
  }

  steps.push(createStep(
    'not-found',
    array,
    [],
    `${target} not found in the array`
  ));
};

/**
 * Generates visualization steps for binary search
 */
const binarySearchVisualization = (array, target, steps) => {
  // Ensure array is sorted
  const sortedArray = [...array].sort((a, b) => a - b);
  steps.push(createStep(
    'binary-search-start',
    sortedArray,
    [],
    `Starting Binary Search for ${target}`
  ));

  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = sortedArray[mid];
    
    // Highlight current search area
    const rangeHighlight = [];
    for (let i = low; i <= high; i++) {
      rangeHighlight.push({ index: i, color: i === mid ? '#3B82F6' : '#6B7280' });
    }
    
    steps.push(createStep(
      'binary-search-check',
      sortedArray,
      rangeHighlight,
      `Checking middle element at index ${mid} (${midVal})`
    ));

    if (midVal === target) {
      steps.push(createStep(
        'found',
        sortedArray,
        [{ index: mid, color: '#10B981' }],
        `Found ${target} at index ${mid}`
      ));
      return;
    } else if (midVal < target) {
      steps.push(createStep(
        'search-right',
        sortedArray,
        rangeHighlight,
        `${target} is greater than ${midVal}, searching right half`
      ));
      low = mid + 1;
    } else {
      steps.push(createStep(
        'search-left',
        sortedArray,
        rangeHighlight,
        `${target} is less than ${midVal}, searching left half`
      ));
      high = mid - 1;
    }
  }

  steps.push(createStep(
    'not-found',
    sortedArray,
    [],
    `${target} not found in the array`
  ));
};
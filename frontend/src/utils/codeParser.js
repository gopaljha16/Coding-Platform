/**
 * Parses JavaScript code to extract DSA operations
 * @param {string} code - JavaScript code string
 * @param {string} dsaType - Type of data structure (Array, Linked List, etc.)
 * @returns {Array} Array of operations with metadata
 */
export const parseCode = (code, dsaType) => {
  try {
    // Remove single and multi-line comments
    const cleanedCode = code
      .replace(/\/\/.*$/gm, '')  // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

    // Extract all function calls from the code
    const functionCalls = [];
    const functionRegex = /(\w+)\(([\s\S]*?)\)/g;
    
    let match;
    while ((match = functionRegex.exec(cleanedCode)) !== null) {
      const functionName = match[1];
      const rawArgs = match[2].trim();
      const args = parseArguments(rawArgs);
      
      functionCalls.push({
        name: functionName,
        args,
        line: getLineNumber(cleanedCode, match.index)
      });
    }

    // Filter and map to known operations based on DSA type
    return mapToOperations(dsaType, functionCalls);
  } catch (error) {
    console.error('Code parsing error:', error);
    return [];
  }
};

/**
 * Parses function arguments string into array of values
 */
const parseArguments = (argsString) => {
  if (!argsString) return [];
  
  const args = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let quoteChar = '';

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    
    if ((char === '"' || char === "'") && !inString) {
      inString = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inString) {
      inString = false;
      current += char;
    } else if (char === '(' && !inString) {
      depth++;
      current += char;
    } else if (char === ')' && !inString) {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0 && !inString) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current) args.push(current.trim());

return args.map(arg => {
  // Try to parse numbers, otherwise return strings
  if (!isNaN(arg)) return Number(arg);
  if ((arg.startsWith('"') && arg.endsWith('"')) || 
      (arg.startsWith("'") && arg.endsWith("'"))) {
    return arg.slice(1, -1);
  }
  return arg;
});
};

/**
 * Maps function calls to known DSA operations
 */
const mapToOperations = (dsaType, calls) => {
  const operationMap = {
    Array: {
      'createArray': 'create',
      'insertAt': 'insert',
      'deleteAt': 'delete',
      'updateAt': 'update',
      'swap': 'swap',
      'bubbleSort': 'sort',
      'quickSort': 'sort',
      'mergeSort': 'sort',
      'linearSearch': 'search',
      'binarySearch': 'search'
    },
    'Linked List': {
      'createLinkedList': 'create',
      'insertNode': 'insert',
      'deleteNode': 'delete',
      'updateNode': 'update',
      'reverseLinkedList': 'reverse'
    },
    // Add other DSA types...
  };

  const typeMap = operationMap[dsaType] || {};
  return calls
    .filter(call => typeMap[call.name])
    .map(call => ({
      type: typeMap[call.name],
      name: call.name,
      args: call.args,
      line: call.line
    }));
};

/**
 * Gets line number from character index
 */
const getLineNumber = (code, index) => {
  const lines = code.substring(0, index).split('\n');
  return lines.length;
};
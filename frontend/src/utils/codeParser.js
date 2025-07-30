import { Parser } from 'acorn';

// AST-based Code Parser
export const parseCode = (code) => {
  const operations = [];
  
  try {
    const ast = Parser.parse(code, { ecmaVersion: 2020, sourceType: 'module' });

    const walk = (node) => {
      if (!node) return;

      switch (node.type) {
        case 'Program':
          node.body.forEach(walk);
          break;

        case 'ExpressionStatement':
          walk(node.expression);
          break;

        case 'VariableDeclaration':
          node.declarations.forEach(walk);
          break;

        case 'VariableDeclarator':
          if (node.init && node.init.type === 'ArrayExpression') {
            const args = node.init.elements.map(el => el.value);
            operations.push({ type: 'create', args: [args] });
          }
          break;

        case 'CallExpression':
          const calleeName = node.callee.name;
          const args = node.arguments.map(arg => arg.value);
          
          // Map function names to operation types
          const operationMap = {
            'insertAt': 'insert',
            'deleteAt': 'delete',
            'updateAt': 'update',
            'swap': 'swap',
            'bubbleSort': 'bubbleSort',
            'linearSearch': 'linearSearch',
            'binarySearch': 'binarySearch',
            'createLinkedList': 'create',
            'insertNode': 'insert',
            'deleteNode': 'delete',
            'reverse': 'reverse',
          };
          
          if (operationMap[calleeName]) {
            operations.push({ type: operationMap[calleeName], args });
          }
          break;
      }
    };

    walk(ast);
    return operations;
    
  } catch (error) {
    console.error("Code parsing error:", error);
    // Return a structured error object
    return { error: true, message: error.message, line: error.loc?.line };
  }
};

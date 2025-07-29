/**
 * Generates visualization steps for linked list operations
 * @param {Array} operations - Operations from code parser
 * @returns {Array} Visualization steps
 */
export const visualizeLinkedList = (operations) => {
  const steps = [];
  let list = [];
  let stepIndex = 0;

  // Node structure
  const createNode = (value, next = null) => ({ value, next });

  // Initial state
  steps.push(createStep('initial', list, [], "Initializing linked list"));

  // Process operations
  for (const op of operations) {
    switch (op.type) {
      case 'create':
        list = op.args.map(value => createNode(value));
        // Link nodes
        for (let i = 0; i < list.length - 1; i++) {
          list[i].next = list[i + 1];
        }
        steps.push(createStep(
          'create',
          [...list],
          list.map((_, i) => ({ index: i, color: '#10B981' })),
          `Created linked list with ${list.length} nodes`
        ));
        break;

      case 'insert':
        if (op.args.length >= 2) {
          const [index, value] = op.args;
          const newNode = createNode(value);
          
          if (index === 0) {
            // Insert at head
            newNode.next = list[0];
            list.unshift(newNode);
            steps.push(createStep(
              'insert',
              [...list],
              [{ index: 0, color: '#10B981' }],
              `Inserted ${value} at head`
            ));
          } else if (index === list.length) {
            // Insert at tail
            if (list.length > 0) list[list.length - 1].next = newNode;
            list.push(newNode);
            steps.push(createStep(
              'insert',
              [...list],
              [{ index: list.length - 1, color: '#10B981' }],
              `Inserted ${value} at tail`
            ));
          } else if (index > 0 && index < list.length) {
            // Insert in middle
            const prev = list[index - 1];
            newNode.next = prev.next;
            prev.next = newNode;
            list.splice(index, 0, newNode);
            steps.push(createStep(
              'insert',
              [...list],
              [{ index, color: '#10B981' }],
              `Inserted ${value} at position ${index}`
            ));
          }
        }
        break;

      case 'delete':
        if (op.args.length >= 1 && list.length > 0) {
          const index = op.args[0];
          if (index >= 0 && index < list.length) {
            const deletedValue = list[index].value;
            
            // Highlight before deletion
            steps.push(createStep(
              'pre-delete',
              [...list],
              [{ index, color: '#EF4444' }],
              `Deleting node with value ${deletedValue}`
            ));
            
            if (index === 0) {
              list.shift();
            } else {
              list[index - 1].next = list[index].next;
              list.splice(index, 1);
            }
            
            steps.push(createStep(
              'delete',
              [...list],
              [],
              `Deleted node with value ${deletedValue}`
            ));
          }
        }
        break;

      case 'reverse':
        steps.push(createStep(
          'reverse-start',
          [...list],
          [],
          'Starting linked list reversal'
        ));
        
        let prev = null;
        let current = list[0];
        let next = null;
        let position = 0;
        
        while (current) {
          next = current.next;
          current.next = prev;
          prev = current;
          current = next;
          
          // Visualize each step
          const tempList = [prev];
          let tempNode = prev;
          while (tempNode.next) {
            tempList.push(tempNode.next);
            tempNode = tempNode.next;
          }
          
          steps.push(createStep(
            'reverse-step',
            [...tempList],
            [{ index: position, color: '#3B82F6' }],
            `Reversing node at position ${position}`
          ));
          
          position++;
        }
        
        list = prev ? [prev] : [];
        let node = prev;
        while (node && node.next) {
          list.push(node.next);
          node = node.next;
        }
        
        steps.push(createStep(
          'reverse-complete',
          [...list],
          list.map((_, i) => ({ index: i, color: '#10B981' })),
          'Linked list reversed'
        ));
        break;
    }
  }

  return steps;
};

/**
 * Creates a linked list visualization step
 */
const createStep = (action, list, highlights, description) => ({
  step: action,
  list: list.map(node => ({ value: node.value })),
  highlights: [...highlights],
  description,
  pointers: getPointerInfo(list)
});

/**
 * Extracts pointer information for visualization
 */
const getPointerInfo = (list) => {
  const pointers = [];
  
  for (let i = 0; i < list.length; i++) {
    if (list[i].next) {
      const nextIndex = list.findIndex(node => node === list[i].next);
      if (nextIndex !== -1) {
        pointers.push({
          from: i,
          to: nextIndex,
          color: '#3B82F6'
        });
      }
    }
  }
  
  return pointers;
};
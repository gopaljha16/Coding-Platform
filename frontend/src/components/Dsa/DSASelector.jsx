import React from 'react';

const DSASelector = ({ currentDSA, setCurrentDSA }) => {
  const dsas = [
    'Array', 
    'Linked List', 
    'Stack', 
    'Queue', 
    'Binary Tree', 
    'Graph', 
    'Sorting', 
    'Searching'
  ];

  return (
    <div className="flex space-x-1 p-1.5 bg-gray-900/70 backdrop-blur-xl rounded-full border border-orange-500/30 shadow-2xl shadow-orange-500/10">
      {dsas.map((dsa) => (
        <button
          key={dsa}
          className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
            currentDSA === dsa
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
          onClick={() => setCurrentDSA(dsa)}
        >
          {dsa}
        </button>
      ))}
    </div>
  );
};

export default DSASelector;

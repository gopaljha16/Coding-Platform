import React from 'react';

const DSASelector = ({ currentDSA, setCurrentDSA }) => {
  const dsas = ['Array', 'Linked List', 'Stack', 'Queue', 'Binary Tree', 'Graph', 'Sorting', 'Searching'];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 p-2 bg-gray-900 rounded-full border border-orange-500 shadow-lg shadow-orange-500/20">
      {dsas.map((dsa) => (
        <button
          key={dsa}
          className={`px-4 py-2 rounded-full transition-all ${
            currentDSA === dsa
              ? 'bg-orange-500 text-white font-bold shadow-[0_0_15px_rgba(255,122,0,0.7)]'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
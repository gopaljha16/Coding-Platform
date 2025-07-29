import React, { useState } from 'react';
import Visualizer from './Visualizer';

const VisualizerWrapper = () => {
  const [dsaType, setDsaType] = useState('Array');
  const [code, setCode] = useState(`// Start coding here...\n`);

  // You can add UI to change dsaType and code if needed

  return (
    <div className="h-full w-full">
      <Visualizer dsaType={dsaType} code={code} />
    </div>
  );
};

export default VisualizerWrapper;

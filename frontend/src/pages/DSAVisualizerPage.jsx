import React, { useState } from "react";
import DSASelector from "../components/Dsa/DSASelector";
import CodeEditor from "../components/Dsa/CodeEditor";
import Visualizer from "./Visualizer";
import Navbar from "../components/common/Navbar";
import { motion } from "framer-motion";

const DSAVisualizerPage = () => {
  const [currentDSA, setCurrentDSA] = useState("Array");
  const [code, setCode] = useState(`// Array Operations Example
let arr = [5, 2, 8, 1, 9];
insertAt(0, 3);
swap(1, 3);
bubbleSort();`);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 0);
  };

  const handleCodeGenerated = (generatedCode) => {
    setCode(generatedCode);
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 0);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />

      {/* Floating DSA Selector */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <DSASelector currentDSA={currentDSA} setCurrentDSA={setCurrentDSA} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        {/* Code Editor Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-500/30 p-0 relative z-20 glassmorphism h-full"
        >
          <CodeEditor
            code={code}
            setCode={setCode}
            onRun={handleRun}
            onCodeGenerated={handleCodeGenerated}
            dsaType={currentDSA}
          />
        </motion.div>

        {/* Visualizer Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-yellow-400/30 p-0 relative z-20 glassmorphism h-full"
        >
          <Visualizer
            dsaType={currentDSA}
            code={code}
            isRunning={isRunning}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DSAVisualizerPage;

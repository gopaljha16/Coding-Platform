import React, { useRef, useEffect } from "react";
import { useVisualization } from "../hooks/useVisualization";
import { renderArray, renderLinkedList } from "../utils/visualizers/renderers";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Visualizer = ({ dsaType, code, isRunning }) => {
  const canvasRef = useRef(null);
  const {
    visualizationData,
    currentStep,
    totalSteps,
    isPlaying,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
  } = useVisualization(dsaType, code, isRunning);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !(canvas instanceof window.HTMLCanvasElement)) {
      return;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!visualizationData) {
      ctx.fillStyle = "#6B7280";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "Write some code to see the visualization",
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }

    switch (dsaType) {
      case "Array":
      case "Sorting":
      case "Searching":
      case "Stack":
      case "Queue":
        renderArray(canvas, visualizationData, currentStep);
        break;
      case "Linked List":
        renderLinkedList(canvas, visualizationData, currentStep);
        break;
      default:
        renderArray(canvas, visualizationData, currentStep);
    }
  }, [visualizationData, currentStep, dsaType]);

  return (
    <div className="flex flex-col w-full h-full bg-transparent rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-yellow-400 tracking-wide">
          {dsaType} Visualization
        </h2>
        {visualizationData?.description && (
          <p className="text-sm text-gray-400 mt-1">
            {visualizationData.description}
          </p>
        )}
      </div>

      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full bg-transparent"
        />
      </div>

      {totalSteps > 0 && (
        <div className="flex flex-col items-center gap-4 bg-black/30 backdrop-blur-sm border-t border-gray-700/50 p-4">
          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <button
                className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 border border-gray-600/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={stepBackward}
                disabled={currentStep === 0}
                title="Step Backward"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={isPlaying ? pause : play}
                disabled={currentStep >= totalSteps - 1 && !isPlaying}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 border border-gray-600/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={stepForward}
                disabled={currentStep >= totalSteps - 1}
                title="Step Forward"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 border border-gray-600/70 transition-all duration-200"
                onClick={reset}
                title="Reset"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Speed:</label>
                <select
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="bg-gray-700/80 border border-gray-600/70 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  <option value="2000">Slow</option>
                  <option value="1000">Normal</option>
                  <option value="500">Fast</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md flex items-center gap-4">
            <span className="text-xs text-gray-400 tabular-nums">
              {String(currentStep + 1).padStart(2, "0")}
            </span>
            <div className="flex-grow bg-gray-700/50 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 tabular-nums">
              {totalSteps}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;

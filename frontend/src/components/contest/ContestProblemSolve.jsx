import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Clock,
  Code,
  Play,
  Send,
  Terminal,
  Maximize2,
  Minimize2,
  Settings,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Zap,
  Timer,
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

import { useMemo } from 'react';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext.jsx';
import { getSocket } from '../../utils/socket';
import { useContest } from '../../context/ContestContext';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { getProfile } from '../../slice/authSlice'; // Import getProfile thunk

const ContestProblemSolve = () => {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, setUser } = useAuth();
  const dispatch = useDispatch(); // Initialize useDispatch
  const editorRef = useRef(null);
  const consoleRef = useRef(null);

  // Contest context
  const { contest, setContest, participants, setParticipants, hasEntered, setHasEntered, hasCompleted, setHasCompleted } = useContest();

  // State variables
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    theme: 'vs-dark',
  });
  const [showConsole, setShowConsole] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  // Fetch problem and contest data
  useEffect(() => {
    const savedCode = localStorage.getItem(`contest_${contestId}_problem_${problemId}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
    let isMounted = true;

    if (!contestId || !problemId || problemId === 'problems') {
      showToast('Invalid contest or problem ID', 'error');
      navigate(`/contest/${contestId}`);
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);

        console.log('Fetching contest:', contestId, 'problem:', problemId);
        
        // Fetch contest details
        const contestResponse = await axiosClient.get(`/contest/${contestId}`);
        if (!isMounted) return;

        const { contest, userStatus } = contestResponse.data;
        setContest(contest);
        setHasEntered(userStatus?.isRegistered || false);
        setHasCompleted(userStatus?.isCompleted || false);
        
        if (!contest) {
          showToast('Contest not found', 'error');
          navigate(`/contest`);
          return;
        }
        
        // Fetch problem details
        const problemResponse = await axiosClient.get(`/contest/${contestId}/problem/${problemId}`);
        if (!isMounted) return;
        
        if (problemResponse.data && problemResponse.data.problem) {
          setProblem(problemResponse.data.problem);
          
          // Set initial code based on the problem's startCode for the selected language
          if (problemResponse.data.problem.startCode && 
              problemResponse.data.problem.startCode[selectedLanguage]) {
            setCode(problemResponse.data.problem.startCode[selectedLanguage]);
          }
        } else {
          showToast('Problem not found', 'error');
          navigate(`/contest/${contestId}`);
          return;
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching data:', error);
        showToast('Failed to load problem data', 'error');
        navigate(`/contest/${contestId}`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Add a cleanup function to cancel any ongoing requests if component unmounts
    return () => {
      isMounted = false;
    };
  }, [contestId, problemId]);



  // Set up contest timer
  useEffect(() => {
    if (!contest) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      const endTime = new Date(contest.endTime);
      const timeLeft = endTime - now;
      
      if (timeLeft <= 0) {
        setRemainingTime('Contest Ended');
        if (!isSubmitting) {
            handleSubmitCode(true);
        }
        return null; // Return null to clear interval
      }
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setRemainingTime(calculateRemainingTime());
    
    const timerInterval = setInterval(() => {
      const timeLeft = calculateRemainingTime();
      setRemainingTime(timeLeft);
      
      if (timeLeft === null) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [contest, isSubmitting]);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (newLanguage === selectedLanguage) return; // Prevent unnecessary re-render
    setSelectedLanguage(newLanguage);
    
    // Update code to the problem's startCode for the new language if available
    if (problem && problem.startCode && problem.startCode[newLanguage]) {
      setCode(problem.startCode[newLanguage]);
    } else {
      // Clear code if no startCode is available for the selected language
      setCode('');
    }
  };

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
    localStorage.setItem(`contest_${contestId}_problem_${problemId}_code`, value);
  };

  // Run code
  const handleRunCode = async () => {
    if (!code.trim()) {
      showToast('Please write some code first', 'warning');
      return;
    }

    try {
      setIsRunning(true);
      setShowConsole(true);
      setRunResults(null);

      const response = await axiosClient.post(`/contest/${contestId}/problem/${problemId}/run`, {
        code,
        language: selectedLanguage,
      });

      // Defensive check for response data structure
      const data = response.data;
      if (data && data.testCases) {
        setRunResults(data);
      } else {
        setRunResults(null);
        showToast('Run results not available', 'warning');
      }
    } catch (error) {
      console.error('Error running code:', error);
      showToast('Failed to run code', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      showToast('Please write some code first', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      setShowConsole(true);
      setSubmitResults(null);

      const response = await axiosClient.post(
        `/contest/${contestId}/problem/${problemId}/submit`,
        {
          code,
          language: selectedLanguage
        }
      );

      if (response.data?.success) {
        const { submission } = response.data;
        setSubmitResults(submission);

        if (submission.status === 'Accepted') {
          showToast('Solution accepted! 🎉', 'success');
          dispatch(getProfile()); // Dispatch getProfile to update user data including streak
        } else {
          showToast(`Submission status: ${submission.status}`, 'warning');
        }
        // Navigate to leaderboard after successful submission
        setTimeout(() => {
          navigate(`/contest/${contestId}/leaderboard`);
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResults({
        status: 'Error',
        errorMessage: error.response?.data?.message || error.message || 'Failed to submit code'
      });
      showToast(error.response?.data?.message || 'Failed to submit code', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset code to initial state
  const resetCode = () => {
    if (problem && problem.startCode && problem.startCode[selectedLanguage]) {
      setCode(problem.startCode[selectedLanguage]);
    } else {
      setCode('');
    }
  };

  // Helper function to get Monaco language ID
  const getLanguageForMonaco = (language) => {
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };
    return languageMap[language] || language;
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Helper function to get difficulty background color
  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-400/10 border-green-400/30';
      case 'medium':
        return 'bg-yellow-400/10 border-yellow-400/30';
      case 'hard':
        return 'bg-red-400/10 border-red-400/30';
      default:
        return 'bg-gray-400/10 border-gray-400/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner size="lg" color="orange-primary" />
      </div>
    );
  }

  if (!problem || !contest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Problem Not Found</h2>
        <p className="text-gray-400 mb-6 text-center">The problem you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate(`/contest/${contestId}`)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-medium transition-colors"
        >
          Back to Contest
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 ${isFullScreen ? 'fixed inset-0 z-50' : 'min-h-screen'}`}>
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/contest/${contestId}`)}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back
          </button>
          <h1 className="text-xl font-bold text-white mr-3">{problem.title}</h1>
          <div
            className={`px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyBgColor(
              problem.difficulty
            )}`}
          >
            <span className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Contest Timer */}
          <div className="flex items-center bg-gray-800 rounded-md px-3 py-1.5 border border-gray-700">
            <Timer className="w-4 h-4 text-orange-400 mr-2" />
            <span className="text-white font-mono">{remainingTime}</span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
            title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
              title="Editor Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-white">Editor Settings</h3>
                </div>
                <div className="p-3">
                  <div className="mb-3">
                    <label className="block text-sm text-gray-400 mb-1">Font Size</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={editorSettings.fontSize}
                        onChange={(e) =>
                          setEditorSettings({
                            ...editorSettings,
                            fontSize: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-white">{editorSettings.fontSize}px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Theme</label>
                    <select
                      value={editorSettings.theme}
                      onChange={(e) =>
                        setEditorSettings({
                          ...editorSettings,
                          theme: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-white"
                    >
                      <option value="vs-dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="hc-black">High Contrast Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Problem Description Panel */}
        <div className="w-full md:w-2/5 lg:w-1/3 border-r border-gray-700/50 overflow-y-auto">
          <div className="border-b border-gray-700/50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-3 text-sm font-medium flex-1 ${
                  activeTab === 'description'
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Description
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'description' && (
              <div>
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-white mb-4">{problem.title}</h2>
                  <div className="mb-6">
                    <div
                      dangerouslySetInnerHTML={{ __html: problem.description }}
                      className="text-gray-300 leading-relaxed"
                    />
                  </div>

                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((testCase, index) => (
                          <div
                            key={index}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-md overflow-hidden"
                          >
                            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700/50 text-sm font-medium text-white">
                              Example {index + 1}
                            </div>
                            <div className="p-4 space-y-3">
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Input:</div>
                                <pre className="bg-gray-800/30 p-2 rounded text-sm text-gray-300 overflow-x-auto">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Output:</div>
                                <pre className="bg-gray-800/30 p-2 rounded text-sm text-gray-300 overflow-x-auto">
                                  {testCase.output}
                                </pre>
                              </div>
                              {testCase.explanation && (
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Explanation:</div>
                                  <div className="text-sm text-gray-300">{testCase.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {problem.constraints && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: problem.constraints }}
                        className="text-gray-300 leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col">
          <div className="border-b border-gray-700/50 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white mr-3"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>

              <button
                onClick={resetCode}
                className="flex items-center px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm text-gray-300 hover:text-white transition-colors"
                title="Reset Code"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reset
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white transition-colors ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Run
                  </>
                )}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isSubmitting || remainingTime === 'Contest Ended'}
                className={`flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-md text-sm text-white transition-colors ${(isSubmitting || remainingTime === 'Contest Ended') ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-grow relative">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              theme={editorSettings.theme}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: editorSettings.fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Console Output */}
          <div
            className={`border-t border-gray-700/50 transition-all duration-300 ${showConsole ? 'h-64' : 'h-10'}`}
          >
            <div
              className="flex items-center justify-between px-4 py-2 bg-gray-800 cursor-pointer"
              onClick={() => setShowConsole(!showConsole)}
            >
              <div className="flex items-center">
                <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-white">Console</span>
              </div>
              <button className="text-gray-400 hover:text-white">
                {showConsole ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {showConsole && (
              <div className="h-[calc(100%-36px)] overflow-y-auto p-4 bg-gray-800/50" ref={consoleRef}>
                {!runResults && !submitResults && (
                  <div className="text-gray-400 text-sm italic">
                    Run or submit your code to see results here.
                  </div>
                )}

                {/* Run Results */}
                {runResults && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                        <Play className="w-4 h-4 text-blue-400 mr-1" />
                        Run Results
                      </h3>
                      {runResults.testCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="mb-3 border border-gray-700/50 rounded-md overflow-hidden"
                        >
                          <div
                            className={`px-3 py-2 text-xs font-medium flex items-center justify-between ${testCase.passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}
                          >
                            <div className="flex items-center">
                              {testCase.passed ? (
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                              )}
                              Test Case {index + 1}
                            </div>
                            {testCase.runtime && (
                              <div className="text-xs opacity-80">{testCase.runtime}ms</div>
                            )}
                          </div>
                          <div className="p-3 bg-gray-800/30 text-sm space-y-2">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Input:</div>
                              <pre className="bg-gray-800/30 p-2 rounded text-xs text-gray-300 overflow-x-auto">
                                {testCase.input}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Expected Output:</div>
                              <pre className="bg-gray-800/30 p-2 rounded text-xs text-gray-300 overflow-x-auto">
                                {testCase.expectedOutput}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Your Output:</div>
                              <pre className="bg-gray-800/30 p-2 rounded text-xs text-gray-300 overflow-x-auto">
                                {testCase.actualOutput}
                              </pre>
                            </div>
                            {testCase.error && (
                              <div>
                                <div className="text-xs text-red-400 mb-1">Error:</div>
                                <pre className="bg-red-900/20 border border-red-900/30 p-2 rounded text-xs text-red-300 overflow-x-auto">
                                  {testCase.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Results */}
                {submitResults && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                        <Send className="w-4 h-4 text-orange-400 mr-1" />
                        Submission Results
                      </h3>
                      <div
                        className={`p-4 rounded-md mb-3 flex items-center ${submitResults.status === 'Accepted' ? 'bg-green-900/30 border border-green-900/50' : 'bg-red-900/30 border border-red-900/50'}`}
                      >
                        {submitResults.status === 'Accepted' ? (
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 mr-2" />
                        )}
                        <div>
                          <div
                            className={`font-medium ${submitResults.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {submitResults.status}
                          </div>
                          <div className="text-sm text-gray-300 mt-1">
                            {submitResults.testCasesPassed} / {submitResults.totalTestCases} test cases
                            passed
                          </div>
                          {submitResults.runtime && (
                            <div className="text-xs text-gray-400 mt-1">
                              Runtime: {submitResults.runtime}ms | Memory: {submitResults.memory}KB
                            </div>
                          )}
                          {submitResults.score !== undefined && (
                            <div className="text-sm text-orange-300 mt-1 flex items-center">
                              <Zap className="w-4 h-4 mr-1" />
                              Score: {submitResults.score} points
                            </div>
                          )}
                        </div>
                      </div>
                      {submitResults.errorMessage && (
                        <div className="mb-3">
                          <div className="text-xs text-red-400 mb-1">Error:</div>
                          <pre className="bg-red-900/20 border border-red-900/30 p-3 rounded text-xs text-red-300 overflow-x-auto">
                            {submitResults.errorMessage}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestProblemSolve;

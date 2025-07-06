import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import codexalogo from "../utils/logo/Codexa .png";
import axiosClient from "../utils/axiosClient";
import {
  Play,
  Send,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Clock,
  MemoryStick,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Code2,
  FileText,
  BookOpen,
  History,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router";
import Editorial from "../components/common/Editorial";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");
  const [showConsole, setShowConsole] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  const languages = [
    { id: "javascript", name: "JavaScript", icon: "🟨" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "cpp", name: "C++", icon: "⚡" },
  ];

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/getProblemById/${problemId}`
        );

        const initialCode =
          response.data.startCode.find((sc) => {
            if (sc.language === "C++" && selectedLanguage === "cpp")
              return true;
            else if (sc.language === "Java" && selectedLanguage === "java")
              return true;
            else if (
              sc.language === "Javascript" &&
              selectedLanguage === "javascript"
            )
              return true;
            return false;
          })?.initialCode || "Hello";

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find(
          (sc) =>
            (sc.language === "C++" && selectedLanguage === "cpp") ||
            (sc.language === "Java" && selectedLanguage === "java") ||
            (sc.language === "Javascript" && selectedLanguage === "javascript")
        )?.initialCode || "";
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    setShowConsole(true);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: code,
          language: selectedLanguage,
        }
      );

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const resetCode = () => {
    if (problem) {
      const initialCode =
        problem.startCode.find(
          (sc) =>
            (sc.language === "C++" && selectedLanguage === "cpp") ||
            (sc.language === "Java" && selectedLanguage === "java") ||
            (sc.language === "Javascript" && selectedLanguage === "javascript")
        )?.initialCode || "";
      setCode(initialCode);
    }
  };

  if (loading && !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <NavLink to="/">
            <div className="flex items-center space-x-2">
              <img src={codexalogo} alt="codexa" className="h-10" />
              <h1 className="text-xl font-bold text-white">Codexa</h1>
            </div>
          </NavLink>

          {problem && (
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">/</span>
              <span className="text-lg font-semibold">{problem.title}</span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty?.charAt(0).toUpperCase() +
                  problem.difficulty?.slice(1)}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          {/* Left Tabs */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            {[
              { id: "description", label: "Description", icon: FileText },
              { id: "editorial", label: "Editorial", icon: BookOpen },
              { id: "solutions", label: "Solutions", icon: Target },
              { id: "submissions", label: "Submissions", icon: History },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeLeftTab === id
                    ? "text-orange-400 border-orange-400 bg-gray-750"
                    : "text-gray-400 border-transparent hover:text-white hover:bg-gray-750"
                }`}
                onClick={() => setActiveLeftTab(id)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-white">
                          {problem.title}
                        </h1>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty?.charAt(0).toUpperCase() +
                            problem.difficulty?.slice(1)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Premium</span>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {problem.description}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-orange-400" />
                        <span>Examples</span>
                      </h3>

                      {problem.visibleTestCases?.map((example, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                        >
                          <h4 className="font-semibold text-orange-400 mb-3">
                            Example {index + 1}
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                              <div className="text-gray-400 mb-1">Input:</div>
                              <div className="text-green-400">
                                {example.input}
                              </div>
                            </div>
                            <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                              <div className="text-gray-400 mb-1">Output:</div>
                              <div className="text-blue-400">
                                {example.output}
                              </div>
                            </div>
                            {example.explanation && (
                              <div className="bg-gray-900 p-3 rounded text-sm">
                                <div className="text-gray-400 mb-1">
                                  Explanation:
                                </div>
                                <div className="text-gray-300">
                                  {example.explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLeftTab === "editorial" && (
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <BookOpen className="w-6 h-6 text-orange-400" />
                      <h2 className="text-xl font-bold text-white">
                        Editorial
                      </h2>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}></Editorial>
                    </div>
                  </div>
                )}

                {activeLeftTab === "solutions" && (
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Target className="w-6 h-6 text-orange-400" />
                      <h2 className="text-xl font-bold text-white">
                        Solutions
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                        >
                          <div className="bg-gray-750 px-4 py-3 border-b border-gray-700">
                            <h3 className="font-semibold text-white">
                              {problem.title} - {solution.language}
                            </h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto text-gray-300 border border-gray-700">
                              <code>{solution.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || (
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                          <div className="text-gray-400">
                            Solutions will be available after you solve the
                            problem.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLeftTab === "submissions" && (
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <History className="w-6 h-6 text-orange-400" />
                      <h2 className="text-xl font-bold text-white">
                        My Submissions
                      </h2>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                      <div className="text-gray-400">
                        Your submission history will appear here.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Right Tabs */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            {[
              { id: "code", label: "Code", icon: Code2 },
              { id: "testcase", label: "Testcase", icon: CheckCircle },
              { id: "result", label: "Result", icon: Trophy },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeRightTab === id
                    ? "text-orange-400 border-orange-400 bg-gray-750"
                    : "text-gray-400 border-transparent hover:text-white hover:bg-gray-750"
                }`}
                onClick={() => setActiveRightTab(id)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            {activeRightTab === "code" && (
              <div className="flex-1 flex flex-col">
                {/* Language Selector and Tools */}
                <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedLanguage === lang.id
                            ? "bg-orange-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => handleLanguageChange(lang.id)}
                      >
                        <span>{lang.icon}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={resetCode}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Reset Code"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowConsole(!showConsole)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title={showConsole ? "Hide Console" : "Show Console"}
                    >
                      {showConsole ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme={theme}
                    options={{
                      fontSize: fontSize,
                      fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: "on",
                      lineNumbers: "on",
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: "line",
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: "line",
                      mouseWheelZoom: true,
                      smoothScrolling: true,
                      cursorSmoothCaretAnimation: true,
                      contextmenu: true,
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: "on",
                      tabCompletion: "on",
                      wordBasedSuggestions: true,
                      parameterHints: { enabled: true },
                      autoClosingBrackets: "always",
                      autoClosingQuotes: "always",
                      autoSurround: "languageDefined",
                      bracketPairColorization: { enabled: true },
                    }}
                  />
                </div>

                {/* Console */}
                {showConsole && (
                  <div
                    className="border-t border-gray-700 bg-gray-900"
                    style={{ height: `${consoleHeight}px` }}
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                      <h3 className="text-sm font-medium text-gray-300">
                        Console
                      </h3>
                      <button
                        onClick={() => setShowConsole(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 overflow-y-auto text-sm font-mono text-gray-300">
                      {runResult ? (
                        <div className="space-y-2">
                          {runResult.success ? (
                            <div className="text-green-400">
                              ✓ Code executed successfully
                            </div>
                          ) : (
                            <div className="text-red-400">
                              ✗ Execution failed
                            </div>
                          )}
                          <div className="text-gray-400">
                            Runtime: {runResult.runtime || "N/A"} | Memory:{" "}
                            {runResult.memory || "N/A"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          Console output will appear here...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowConsole(!showConsole)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <span>Console</span>
                      {showConsole ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleRun}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>Run</span>
                    </button>

                    <button
                      className={`flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === "testcase" && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">Test Results</h3>
                </div>

                {runResult ? (
                  <div
                    className={`p-4 rounded-lg border ${
                      runResult.success
                        ? "bg-green-900/20 border-green-500/30"
                        : "bg-red-900/20 border-red-500/30"
                    }`}
                  >
                    {runResult.success ? (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-green-400">
                            All test cases passed!
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">
                              Runtime: {runResult.runtime || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MemoryStick className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">
                              Memory: {runResult.memory || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {runResult.testCases?.map((tc, i) => (
                            <div
                              key={i}
                              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
                            >
                              <div className="font-mono text-xs space-y-2">
                                <div>
                                  <span className="text-gray-400">Input:</span>{" "}
                                  <span className="text-blue-300">
                                    {tc.stdin}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Expected:
                                  </span>{" "}
                                  <span className="text-green-300">
                                    {tc.expected_output}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Output:</span>{" "}
                                  <span className="text-yellow-300">
                                    {tc.stdout}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 text-green-400">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Passed</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <h4 className="font-bold text-red-400">
                            Test Failed
                          </h4>
                        </div>

                        <div className="space-y-3">
                          {runResult.testCases?.map((tc, i) => (
                            <div
                              key={i}
                              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
                            >
                              <div className="font-mono text-xs space-y-2">
                                <div>
                                  <span className="text-gray-400">Input:</span>{" "}
                                  <span className="text-blue-300">
                                    {tc.stdin}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Expected:
                                  </span>{" "}
                                  <span className="text-green-300">
                                    {tc.expected_output}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Output:</span>{" "}
                                  <span className="text-yellow-300">
                                    {tc.stdout}
                                  </span>
                                </div>
                                <div
                                  className={`flex items-center space-x-1 ${
                                    tc.stdout === tc.expected_output
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {tc.stdout === tc.expected_output ? (
                                    <>
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Passed</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3" />
                                      <span>Failed</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {runResult.error && (
                          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <div className="text-red-400 font-mono text-sm">
                              {runResult.error}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Run your code to see test results</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeRightTab === "result" && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">
                    Submission Result
                  </h3>
                </div>

                {submitResult ? (
                  <div
                    className={`p-4 rounded-lg border ${
                      submitResult.success
                        ? "bg-green-900/20 border-green-500/30"
                        : "bg-red-900/20 border-red-500/30"
                    }`}
                  >
                    {submitResult.success ? (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <h4 className="font-bold text-green-400 text-lg">
                            Accepted!
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400 text-sm">
                                Runtime
                              </span>
                            </div>
                            <div className="text-xl font-bold text-white">
                              {submitResult.runtime || "N/A"}
                            </div>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MemoryStick className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-400 text-sm">
                                Memory
                              </span>
                            </div>
                            <div className="text-xl font-bold text-white">
                              {submitResult.memory || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h5 className="font-semibold text-white mb-3">
                            Test Cases
                          </h5>
                          <div className="text-green-400">
                            {submitResult.passedTestCases || "All"} /{" "}
                            {submitResult.totalTestCases || "All"} test cases
                            passed
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <XCircle className="w-6 h-6 text-red-400" />
                          <h4 className="font-bold text-red-400 text-lg">
                            Submission Failed
                          </h4>
                        </div>

                        {submitResult.error && (
                          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-4">
                            <div className="text-red-400 font-mono text-sm">
                              {submitResult.error}
                            </div>
                          </div>
                        )}

                        {submitResult.passedTestCases !== undefined && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h5 className="font-semibold text-white mb-3">
                              Test Cases
                            </h5>
                            <div className="text-red-400">
                              {submitResult.passedTestCases} /{" "}
                              {submitResult.totalTestCases} test cases passed
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Submit your code to see results</p>
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

export default ProblemPage;

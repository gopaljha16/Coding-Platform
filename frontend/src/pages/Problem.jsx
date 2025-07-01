import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  Trophy,
  Clock,
  Users,
  Star,
  ChevronDown,
  Play,
  CheckCircle,
  Circle,
  Zap,
  Target,
  Brain,
  Grid,
  List,
  ArrowUpDown,
  Eye,
  BookOpen,
  Code,
  TrendingUp,
  Award,
  Flame,
  ArrowLeft,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";
import Navbar from "../components/common/Navbar";

const Problem = () => {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("card");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/problem/getAllProblems");
        setProblems(data);

        // Calculate stats
        const newStats = {
          total: data.length,
          solved: 0,
          easy: data.filter((p) => p.difficulty === "easy").length,
          medium: data.filter((p) => p.difficulty === "medium").length,
          hard: data.filter((p) => p.difficulty === "hard").length,
        };
        setStats(newStats);
      } catch (err) {
        console.error("Error While Fetching the Problems", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemsSolvedByUser");
        setSolvedProblems(data);
        setStats((prev) => ({ ...prev, solved: data.length }));
      } catch (err) {
        console.error("Error Occurred while fetching solved problems", err);
      }
    };

    fetchProblem();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    // Handle tags properly - could be string, array, or undefined
    const problemTags = Array.isArray(problem.tags)
      ? problem.tags
      : typeof problem.tags === "string"
      ? [problem.tags]
      : [];
    const tagMatch = filters.tag === "all" || problemTags.includes(filters.tag);

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id)) ||
      (filters.status === "unsolved" &&
        !solvedProblems.some((sp) => sp._id === problem._id));
    const searchMatch =
      filters.search === "" ||
      problem.title.toLowerCase().includes(filters.search.toLowerCase());

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case "difficulty":
        const diffOrder = { easy: 1, medium: 2, hard: 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      case "title":
        return a.title.localeCompare(b.title);
      case "acceptance":
        return (b.acceptance || 0) - (a.acceptance || 0);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
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

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <Target className="w-4 h-4" />;
      case "medium":
        return <Zap className="w-4 h-4" />;
      case "hard":
        return <Brain className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const isProblemSolved = (problemId) => {
    return solvedProblems.some((sp) => sp._id === problemId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <NavLink to="/">
                    <ArrowLeft className="w-7 h-7 hover:text-orange-500  mt-1" />
                  </NavLink>
                  {/* <Code className="w-8 h-8 text-orange-500" /> */}
                  Problems
                </h1>
                <p className="text-slate-400">
                  Master coding challenges and improve your skills
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "card"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
              </div>
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">Solved</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {stats.solved}
                </div>
              </div>
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">Easy</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {stats.easy}
                </div>
              </div>
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Medium</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.medium}
                </div>
              </div>
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-slate-400">Hard</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {stats.hard}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-600/50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="title">Sort by Title</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="acceptance">Sort by Acceptance</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="px-4 py-2 bg-slate-600/50 border border-slate-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="all">All Problems</option>
                    <option value="solved">Solved</option>
                    <option value="unsolved">Unsolved</option>
                  </select>

                  <select
                    value={filters.difficulty}
                    onChange={(e) =>
                      setFilters({ ...filters, difficulty: e.target.value })
                    }
                    className="px-4 py-2 bg-slate-600/50 border border-slate-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <select
                    value={filters.tag}
                    onChange={(e) =>
                      setFilters({ ...filters, tag: e.target.value })
                    }
                    className="px-4 py-2 bg-slate-600/50 border border-slate-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="all">All Tags</option>
                    <option value="Array">Array</option>
                    <option value="Stack">Stack</option>
                    <option value="Queue">Queue</option>
                    <option value="Dp">Dynamic Programming</option>
                    <option value="LinkedList">Linked List</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Problems List */}
        <div className="container mx-auto px-6 py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-400">
              Showing {sortedProblems.length} of {problems.length} problems
            </p>
          </div>

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProblems.map((problem) => (
                <div key={problem._id} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {isProblemSolved(problem._id) ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                          <NavLink to={`/problem/${problem._id}`}>
                            {problem?.title}
                          </NavLink>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {getDifficultyIcon(problem.difficulty)}
                        {problem.difficulty.charAt(0).toUpperCase() +
                          problem.difficulty.slice(1)}
                      </span>
                    </div>

                    {problem.description && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {problem.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const tags = Array.isArray(problem.tags)
                            ? problem.tags
                            : typeof problem.tags === "string"
                            ? [problem.tags]
                            : [];
                          return tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ));
                        })()}
                        {(() => {
                          const tags = Array.isArray(problem.tags)
                            ? problem.tags
                            : typeof problem.tags === "string"
                            ? [problem.tags]
                            : [];
                          return (
                            tags.length > 2 && (
                              <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                                +{tags.length - 2}
                              </span>
                            )
                          );
                        })()}
                      </div>
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="hover:text-primary text-2xl"
                      >
                        <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors">
                          <Play className="w-3 h-3" />
                          Solve
                        </button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-600/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Tags
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {sortedProblems.map((problem) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          {isProblemSolved(problem._id) ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium hover:text-orange-400 transition-colors cursor-pointer">
                            <NavLink to={`/problem/${problem._id}`}>
                              {problem?.title}
                            </NavLink>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border w-fit ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {getDifficultyIcon(problem.difficulty)}
                            {problem.difficulty.charAt(0).toUpperCase() +
                              problem.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const tags = Array.isArray(problem.tags)
                                ? problem.tags
                                : typeof problem.tags === "string"
                                ? [problem.tags]
                                : [];
                              return tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ));
                            })()}
                            {(() => {
                              const tags = Array.isArray(problem.tags)
                                ? problem.tags
                                : typeof problem.tags === "string"
                                ? [problem.tags]
                                : [];
                              return (
                                tags.length > 2 && (
                                  <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md">
                                    +{tags.length - 2}
                                  </span>
                                )
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="hover:text-primary text-2xl"
                          >
                            <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors">
                              <Play className="w-3 h-3" />
                              Solve
                            </button>
                          </NavLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {sortedProblems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">
                No problems found
              </div>
              <p className="text-slate-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Problem;

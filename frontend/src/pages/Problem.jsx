import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Plus,
  FolderPlus,
  ListPlus,
  X,
  Folder,
  Calendar,
  BarChart3,
  Sparkles,
  Rocket,
  Crown,
  ChevronRight,
  Timer,
  Activity,
  Lightbulb,
  CodeIcon,
  Hash,
  Database,
  Layers,
  GitBranch,
  Calculator,
} from "lucide-react";
import { NavLink } from "react-router";
import axiosClient from "../utils/axiosClient";

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
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedProblemForPlaylist, setSelectedProblemForPlaylist] = useState(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsRes, solvedRes, playlistsRes] = await Promise.all([
          axiosClient.get("/problem/getAllProblems"),
          user
            ? axiosClient.get("/problem/problemsSolvedByUser")
            : Promise.resolve({ data: [] }),
          user
            ? axiosClient.get("/playlists/user")
            : Promise.resolve({ data: [] }),
        ]);

        setProblems(problemsRes.data);
        if (user) {
          setSolvedProblems(solvedRes.data);
          setPlaylists(playlistsRes.data?.data || playlistsRes.data || []);
        }

        // Calculate stats
        const newStats = {
          total: problemsRes.data.length,
          solved: user ? solvedRes.data.length : 0,
          easy: problemsRes.data.filter((p) => p.difficulty === "easy").length,
          medium: problemsRes.data.filter((p) => p.difficulty === "medium").length,
          hard: problemsRes.data.filter((p) => p.difficulty === "hard").length,
        };
        setStats(newStats);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load problems. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

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
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30 shadow-emerald-400/20";
      case "medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-amber-400/20";
      case "hard":
        return "text-rose-400 bg-rose-400/10 border-rose-400/30 shadow-rose-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/30";
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

  const handleCreatePlaylist = async () => {
    try {
      if (!newPlaylistName.trim()) {
        toast.error("Playlist name cannot be empty");
        return;
      }

      setPlaylistLoading(true);
      const { data } = await axiosClient.post("/playlists", {
        name: newPlaylistName,
      });

      setPlaylists((prevPlaylists) => [
        ...prevPlaylists,
        {
          _id: data.data._id,
          name: data.data.name,
          user: data.data.user,
          problems: data.data.problems || []
        }
      ]);

      setNewPlaylistName("");
      setShowPlaylistModal(false);
      toast.success("Playlist created successfully!");
    } catch (err) {
      console.error("Error creating playlist:", err);
      toast.error(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setPlaylistLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      setAddingToPlaylist(true);
      const { data } = await axiosClient.post(`/playlists/${playlistId}/problems`, {
        problemId: selectedProblemForPlaylist,
      });

      const problemToAdd = problems.find(p => p._id === selectedProblemForPlaylist);
      
      if (!problemToAdd) {
        throw new Error("Problem not found");
      }

      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist._id === playlistId 
            ? {
                ...playlist,
                problems: [
                  ...(playlist.problems || []),
                  {
                    _id: problemToAdd._id,
                    title: problemToAdd.title,
                    difficulty: problemToAdd.difficulty,
                    tags: problemToAdd.tags,
                    acceptance: problemToAdd.acceptance
                  }
                ]
              }
            : playlist
        )
      );

      toast.success("Problem added to playlist successfully!");
      setShowAddToPlaylistModal(false);
    } catch (err) {
      console.error("Error adding problem to playlist:", err);
      toast.error(
        err.response?.data?.message || "Failed to add problem to playlist"
      );
    } finally {
      setAddingToPlaylist(false);
    }
  };

  const getTagIcon = (tag) => {
    const tagIcons = {
      Array: <Database className="w-3 h-3" />,
      String: <Hash className="w-3 h-3" />,
      "Hash Table": <Grid className="w-3 h-3" />,
      "Dynamic Programming": <Layers className="w-3 h-3" />,
      Math: <Calculator className="w-3 h-3" />,
      Sorting: <ArrowUpDown className="w-3 h-3" />,
      Greedy: <Target className="w-3 h-3" />,
      "Depth-First Search": <GitBranch className="w-3 h-3" />,
      "Binary Search": <Search className="w-3 h-3" />,
      Tree: <GitBranch className="w-3 h-3" />,
      Graph: <Activity className="w-3 h-3" />,
    };
    return tagIcons[tag] || <Code className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-orange-300/10 animate-pulse"></div>
          </div>
          <div className="text-slate-300 font-medium">Loading Problems...</div>
          <div className="text-slate-500 text-sm mt-1">
            Preparing your coding journey
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.05),transparent_50%)]"></div>

          <div className="relative bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10">
            <div className="container mx-auto px-6 py-8">
              {/* Navigation Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/"
                    className="group flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-all duration-300"
                  >
                    <div className="p-2 rounded-xl bg-slate-700/30 group-hover:bg-orange-500/10 border border-slate-600/30 group-hover:border-orange-500/30 transition-all duration-300">
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Back to Home</span>
                  </NavLink>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
                      <Trophy className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                        Problems
                      </h1>
                      <p className="text-slate-400 mt-1">
                        Master coding challenges and level up your skills
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {user && (
                    <button
                      onClick={() => setShowPlaylistModal(true)}
                      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105"
                    >
                      <FolderPlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      Create Playlist
                      <Sparkles className="w-4 h-4 opacity-60" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 p-1 bg-slate-700/50 rounded-xl border border-slate-600/30">
                    <button
                      onClick={() => setViewMode("card")}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        viewMode === "card"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                          : "text-slate-400 hover:text-white hover:bg-slate-600/50"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                          : "text-slate-400 hover:text-white hover:bg-slate-600/50"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-slate-400 font-medium">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stats.total}
                    </div>
                    <div className="text-xs text-blue-400 font-medium">
                      Problems Available
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-slate-400 font-medium">Solved</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      {stats.solved}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium">
                      {stats.total > 0
                        ? Math.round((stats.solved / stats.total) * 100)
                        : 0}
                      % Complete
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Target className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-slate-400 font-medium">Easy</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      {stats.easy}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium">
                      Foundation Level
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-amber-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Zap className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-slate-400 font-medium">Medium</span>
                    </div>
                    <div className="text-3xl font-bold text-amber-400 mb-1">
                      {stats.medium}
                    </div>
                    <div className="text-xs text-amber-400 font-medium">
                      Intermediate
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-rose-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <Brain className="w-5 h-5 text-rose-400" />
                      </div>
                      <span className="text-slate-400 font-medium">Hard</span>
                    </div>
                    <div className="text-3xl font-bold text-rose-400 mb-1">
                      {stats.hard}
                    </div>
                    <div className="text-xs text-rose-400 font-medium">
                      Expert Level
                    </div>
                  </div>
                </div>
              </div>

              {/* Playlists Section */}
              {user && playlists.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <Folder className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Your Study Playlists
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playlists.map((playlist) => (
                      <NavLink
                        key={playlist._id}
                        to={`/playlists/${playlist._id}`}
                        state={{ playlist }}
                        className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                              <List className="w-5 h-5 text-purple-400" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <h4 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            {playlist.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <BookOpen className="w-4 h-4" />
                            <span>
                              {playlist.problems?.length || 0} problems
                            </span>
                            {playlist.problems?.length > 0 && (
                              <div className="flex gap-1 ml-2">
                                {playlist.problems.slice(0, 3).map((problem, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${
                                      problem.difficulty === 'easy'
                                        ? 'bg-emerald-400'
                                        : problem.difficulty === 'medium'
                                        ? 'bg-amber-400'
                                        : 'bg-rose-400'
                                    }`}
                                  />
                                ))}
                                {playlist.problems.length > 3 && (
                                  <span className="text-xs text-slate-500">
                                    +{playlist.problems.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {sortedProblems.length} Problems Found
                </p>
                <p className="text-slate-400 text-sm">
                  Out of {problems.length} total problems available
                </p>
              </div>
            </div>

            {sortedProblems.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Ready to code</span>
              </div>
            )}
          </div>

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="group relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {user && (
                    <button
                      onClick={() => {
                        setSelectedProblemForPlaylist(problem._id);
                        setShowAddToPlaylistModal(true);
                      }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 text-slate-400 hover:text-orange-400 border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                      title="Add to playlist"
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  )}

                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 h-full flex flex-col group-hover:bg-gradient-to-br group-hover:from-slate-700/80 group-hover:to-slate-600/80">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              isProblemSolved(problem._id)
                                ? "bg-emerald-500/20 border border-emerald-500/30"
                                : "bg-slate-700/50 border border-slate-600/30"
                            }`}
                          >
                            {isProblemSolved(problem._id) ? (
                              <CheckCircle className="w-6 h-6 text-emerald-400" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                              <NavLink to={`/problem/${problem._id}`}>
                                {problem?.title}
                              </NavLink>
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <span
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border shadow-lg ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {getDifficultyIcon(problem.difficulty)}
                          {problem.difficulty.charAt(0).toUpperCase() +
                            problem.difficulty.slice(1)}
                        </span>
                        {problem.acceptance && (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600/30">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-slate-300 font-medium">
                              {problem.acceptance}%
                            </span>
                          </div>
                        )}
                      </div>

                      {problem.description && (
                        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                          {problem.description}
                        </p>
                      )}

                      <div className="space-y-4 mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const tags = Array.isArray(problem.tags)
                              ? problem.tags
                              : typeof problem.tags === "string"
                              ? [problem.tags]
                              : [];
                            return tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs rounded-lg border border-slate-600/30 hover:border-slate-500/30 transition-all duration-300"
                              >
                                {getTagIcon(tag)}
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
                              tags.length > 3 && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs rounded-lg border border-slate-600/30">
                                  <Plus className="w-3 h-3" />
                                  {tags.length - 3} more
                                </span>
                              )
                            );
                          })()}
                        </div>

                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="block"
                        >
                          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105">
                            <Rocket className="w-4 h-4" />
                            Start Solving
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 border-b border-slate-600/30">
                    <tr>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Topics
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Acceptance
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {sortedProblems.map((problem, index) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-slate-700/30 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-8 py-6">
                          <div
                            className={`p-2 rounded-xl w-fit transition-all duration-300 ${
                              isProblemSolved(problem._id)
                                ? "bg-emerald-500/20 border border-emerald-500/30"
                                : "bg-slate-700/50 border border-slate-600/30"
                            }`}
                          >
                            {isProblemSolved(problem._id) ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-white font-semibold hover:text-orange-400 transition-colors cursor-pointer text-lg">
                            <NavLink
                              to={`/problem/${problem._id}`}
                              className="group-hover:underline"
                            >
                              {problem?.title}
                            </NavLink>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border shadow-lg w-fit ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {getDifficultyIcon(problem.difficulty)}
                            {problem.difficulty.charAt(0).toUpperCase() +
                              problem.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const tags = Array.isArray(problem.tags)
                                ? problem.tags
                                : typeof problem.tags === "string"
                                ? [problem.tags]
                                : [];
                              return tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-600/30"
                                >
                                  {getTagIcon(tag)}
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
                                  <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs rounded-lg border border-slate-600/30">
                                    <Plus className="w-3 h-3" />
                                    {tags.length - 2}
                                  </span>
                                )
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300 font-medium">
                              {problem.acceptance
                                ? `${problem.acceptance}%`
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            {user && (
                              <button
                                onClick={() => {
                                  setSelectedProblemForPlaylist(problem._id);
                                  setShowAddToPlaylistModal(true);
                                }}
                                className="p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-orange-400 border border-slate-600/30 hover:border-orange-500/30 transition-all duration-300"
                                title="Add to playlist"
                              >
                                <ListPlus className="w-4 h-4" />
                              </button>
                            )}
                            <NavLink to={`/problem/${problem._id}`}>
                              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105">
                                <Rocket className="w-4 h-4" />
                                Solve
                              </button>
                            </NavLink>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedProblems.length === 0 && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="p-6 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-500/30 w-fit mx-auto">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <div className="absolute -top-2 -right-2 p-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <X className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Problems Found
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                We couldn't find any problems matching your current filters. Try
                adjusting your search terms or filter criteria.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    difficulty: "all",
                    tag: "all",
                    status: "all",
                    search: "",
                  });
                  setShowFilters(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 mx-auto"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
                    <FolderPlus className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Create Playlist
                  </h3>
                </div>
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white border border-slate-600/30 hover:border-slate-500/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-slate-300 font-medium mb-3">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  placeholder="My Awesome Study Plan"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl border border-slate-600/30 hover:border-slate-500/30 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={playlistLoading || !newPlaylistName.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {playlistLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Playlist"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Playlist Modal */}
      {showAddToPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                    <ListPlus className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Add to Playlist
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddToPlaylistModal(false)}
                  className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white border border-slate-600/30 hover:border-slate-500/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6 max-h-96 overflow-y-auto custom-scrollbar">
                {playlists.length > 0 ? (
                  <ul className="space-y-3">
                    {playlists.map((playlist) => {
                      const isProblemInPlaylist = playlist.problems?.some(
                        (p) => p._id === selectedProblemForPlaylist
                      );
                      return (
                        <li key={playlist._id}>
                          <button
                            onClick={() =>
                              !isProblemInPlaylist &&
                              handleAddToPlaylist(playlist._id)
                            }
                            disabled={isProblemInPlaylist || addingToPlaylist}
                            className={`w-full text-left p-4 ${
                              isProblemInPlaylist
                                ? "bg-emerald-500/10 border-emerald-500/30 cursor-default"
                                : "bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/30 hover:border-purple-500/30"
                            } 
                              border rounded-2xl text-white flex items-center justify-between transition-all duration-300 group`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-xl ${
                                  isProblemInPlaylist
                                    ? "bg-emerald-500/20 border-emerald-500/30"
                                    : "bg-purple-500/20 border-purple-500/30 group-hover:bg-purple-500/30"
                                } 
                                border transition-all duration-300`}
                              >
                                <Folder
                                  className={`w-5 h-5 ${
                                    isProblemInPlaylist
                                      ? "text-emerald-400"
                                      : "text-purple-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <div
                                  className={`font-semibold ${
                                    isProblemInPlaylist
                                      ? "text-emerald-400"
                                      : "text-white group-hover:text-purple-400"
                                  } transition-colors`}
                                >
                                  {playlist.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {playlist.problems?.length || 0} problems
                                  {playlist.problems?.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {playlist.problems
                                        .slice(0, 3)
                                        .map((p, idx) => (
                                          <span
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${
                                              p.difficulty === 'easy'
                                                ? 'bg-emerald-400'
                                                : p.difficulty === 'medium'
                                                ? 'bg-amber-400'
                                                : 'bg-rose-400'
                                            }`}
                                          />
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isProblemInPlaylist ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-slate-700/50 border border-slate-600/30 w-fit mx-auto mb-4">
                      <Folder className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      No Playlists Yet
                    </h4>
                    <p className="text-slate-400 mb-6">
                      Create your first playlist to organize your problems.
                    </p>
                    <button
                      onClick={() => {
                        setShowAddToPlaylistModal(false);
                        setShowPlaylistModal(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "rgba(51, 65, 85, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(100, 116, 139, 0.3)",
          borderRadius: "12px",
          color: "white",
        }}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Problem;
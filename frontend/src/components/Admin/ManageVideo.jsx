import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  Upload, 
  Trash2, 
  Play, 
  Eye, 
  Search, 
  Filter, 
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  ExternalLink
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const ManageVideo = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/problem/getAllProblems');
      setProblems(response.data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const checkVideoIsPresent = async () =>{
  //   try{
  //     setLoading(true);
  //     const response = await axiosClient.get(`/video/videoExists/${pr}`)
  //   }
  // }

  const handleDelete = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      setDeleteLoading(problemId);
      await axiosClient.delete(`/video/delete/${problemId}`);
      
      // Update the problem in state to reflect video removal
      setProblems(problems.map(problem => 
        problem._id === problemId 
          ? { ...problem, hasVideo: false, videoUrl: null }
          : problem
      ));
      
      setSuccessMessage('Video deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete video');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  

  const handleUploadRedirect = (problemId) => {
    // Navigate to upload page with problem ID
    navigate(`/admin/upload/${problemId}`);
  };

  const handleViewVideo = (problem) => {
    // Handle viewing video - you can implement this based on your video storage
    if (problem.videoUrl) {
      window.open(problem.videoUrl, '_blank');
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    if (searchTerm) {
      filtered = filtered.filter(problem => {
        const titleMatch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
        const tagsMatch = problem.tags ? 
          (Array.isArray(problem.tags) ? 
            problem.tags.join(',').toLowerCase().includes(searchTerm.toLowerCase()) :
            problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
          ) : false;
        return titleMatch || tagsMatch;
      });
    }

    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    setFilteredProblems(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-green-600';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Hard': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getVideoStatus = (problem) => {
    if (problem.videoSolution && problem.videoSolution.length > 0) {
      return { hasVideo: true, status: 'Uploaded' };
    }
    return { hasVideo: false, status: 'No Video' };
  };

  // Helper function to safely handle tags
  const formatTags = (tags) => {
    if (!tags) return [];
    
    if (Array.isArray(tags)) {
      return tags;
    }
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading problems...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900 border border-red-600 rounded-lg p-6 max-w-md mx-4"
        >
          <div className="flex items-center mb-2">
            <AlertCircle className="text-red-400 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-red-100">Error</h3>
          </div>
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              Video Management
            </h1>
            <p className="text-gray-400">Upload and manage problem solution videos</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg flex items-center"
            >
              <CheckCircle className="text-green-400 mr-3" size={20} />
              <p className="text-green-100">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg flex items-center"
            >
              <AlertCircle className="text-red-400 mr-3" size={20} />
              <p className="text-red-100">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{problems.length}</div>
              <div className="text-sm text-gray-400">Total Problems</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {problems.filter(p => getVideoStatus(p).hasVideo).length}
              </div>
              <div className="text-sm text-gray-400">With Videos</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {problems.filter(p => !getVideoStatus(p).hasVideo).length}
              </div>
              <div className="text-sm text-gray-400">Without Videos</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {problems.length > 0 ? Math.round((problems.filter(p => getVideoStatus(p).hasVideo).length / problems.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Coverage</div>
            </div>
          </div>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Problem</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tags</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Video Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <AnimatePresence>
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        {searchTerm || difficultyFilter !== 'All' ? 
                          'No problems found matching your criteria.' : 
                          'No problems available.'
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => {
                      const videoStatus = getVideoStatus(problem);
                      const tags = formatTags(problem.tags);
                      
                      return (
                        <motion.tr
                          key={problem._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-slate-700 transition-colors cursor-pointer"
                          onClick={() => handleUploadRedirect(problem._id)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-white hover:text-orange-400 transition-colors">
                              {problem.title}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {problem.description ? problem.description.substring(0, 100) + '...' : 'No description'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r text-white ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {tags.length > 0 ? (
                                tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="px-2 py-1 bg-slate-600 text-gray-300 rounded text-xs">
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-xs">No tags</span>
                              )}
                              {tags.length > 3 && (
                                <span className="px-2 py-1 bg-slate-600 text-gray-300 rounded text-xs">
                                  +{tags.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {videoStatus.hasVideo ? (
                                <span className="flex items-center text-green-400">
                                  <CheckCircle size={16} className="mr-1" />
                                  {videoStatus.status}
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-400">
                                  <AlertCircle size={16} className="mr-1" />
                                  {videoStatus.status}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUploadRedirect(problem._id);
                                }}
                                className="flex items-center space-x-1 px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-colors"
                                title={videoStatus.hasVideo ? "Replace Video" : "Upload Video"}
                              >
                                <Upload size={16} />
                                <span>{videoStatus.hasVideo ? "Replace" : "Upload"}</span>
                              </button>
                              
                              {videoStatus.hasVideo && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewVideo(problem);
                                    }}
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
                                    title="View Video"
                                  >
                                    <Eye size={16} />
                                    <span>View</span>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(problem._id);
                                    }}
                                    disabled={deleteLoading === problem._id}
                                    className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors disabled:opacity-50"
                                    title="Delete Video"
                                  >
                                    {deleteLoading === problem._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <Trash2 size={16} />
                                    )}
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination or Load More could go here */}
        {filteredProblems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-gray-400"
          >
            Showing {filteredProblems.length} of {problems.length} problems
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageVideo;
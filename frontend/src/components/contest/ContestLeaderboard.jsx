import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Medal, Award, Zap, User, ArrowUp, ArrowDown, Minus, Shield, Star, Info, CheckCircle } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { getSocket, initializeSocket } from '../../utils/socket';

const ContestLeaderboard = ({ contestId, isContestActive }) => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token'); // or get token from context/auth
    const sock = initializeSocket(token);
    setSocket(sock);

    return () => {
      if (sock) {
        sock.disconnect();
      }
    };
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/contest/${contestId}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup refresh interval if contest is active
  useEffect(() => {
    fetchLeaderboard();

    // If contest is active, refresh leaderboard every 30 seconds
    if (isContestActive) {
      const interval = setInterval(fetchLeaderboard, 30000);
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [contestId, isContestActive]);

  // Setup socket listener for real-time leaderboard updates
  React.useEffect(() => {
    if (!socket) return;

    const handleLeaderboardUpdate = (updatedLeaderboard) => {
      if (updatedLeaderboard.contestId === contestId) {
        setLeaderboard(updatedLeaderboard.leaderboard);
      }
    };

    socket.on('leaderboardUpdate', handleLeaderboardUpdate);

    return () => {
      socket.off('leaderboardUpdate', handleLeaderboardUpdate);
    };
  }, [socket, contestId]);

  // Get medal for top 3 ranks
  const getMedal = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-400/20 rounded-full">
            <Medal className="w-4 h-4 text-gray-400" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-amber-600/20 rounded-full">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-700/20 rounded-full">
            <Shield className="w-4 h-4 text-gray-500" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!leaderboard || !leaderboard.rankings || leaderboard.rankings.length === 0) {
    return (
      <div className="p-8 text-center">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Participants Yet</h3>
        <p className="text-gray-400">
          Be the first to submit a solution and claim your spot on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden">
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Trophy className="w-5 h-5 text-orange-400 mr-2" />
          Leaderboard
        </h3>
        {isContestActive && (
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Auto-refreshes every 30s</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 bg-gray-800/30">
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Participant</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Problems Solved</th>
              <th className="px-4 py-3 text-center">Runtime</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.rankings.map((entry, index) => (
              <motion.tr
                key={entry.userId._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors"
              >
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center">
                    {getMedal(entry.rank)}
                    <span className="ml-2 font-semibold text-gray-300">{entry.rank}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-3">
                      {entry.userId.profileImage ? (
                        <img
                          src={entry.userId.profileImage}
                          alt={entry.userId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{entry.userId.name}</div>
                      <div className="text-xs text-gray-400">{entry.userId.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <Star className="w-3.5 h-3.5 text-orange-400 mr-1" />
                    <span className="text-orange-300 font-semibold">{entry.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Zap className="w-3.5 h-3.5 text-blue-400 mr-1" />
                    <span className="text-blue-300 font-semibold">{entry.problemsSolved}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <Clock className="w-3.5 h-3.5 text-purple-400 mr-1" />
                    <span className="text-purple-300 font-semibold">
                      {entry.totalRuntime.toFixed(2)}ms
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {!leaderboard.isFinalized && isContestActive && (
        <div className="p-3 bg-blue-900/20 border-t border-blue-800/30 text-xs text-blue-300 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          <span>
            Rankings are updated in real-time. Final results will be available after the contest ends.
          </span>
        </div>
      )}

      {leaderboard.isFinalized && (
        <div className="p-3 bg-green-900/20 border-t border-green-800/30 text-xs text-green-300 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>These are the final contest results. Congratulations to all participants!</span>
        </div>
      )}
    </div>
  );
};

export default ContestLeaderboard;

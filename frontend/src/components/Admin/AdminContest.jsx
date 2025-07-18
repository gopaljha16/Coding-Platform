import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminContest = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all contests
  const fetchContests = async () => {
    try {
      const res = await axios.get('/contests'); // adjust this route if needed
      setContests(res.data.contests || []);
    } catch (err) {
      setError('Failed to load contests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Contest Dashboard</h1>

      {/* Add button to create contest */}
      <div className="mb-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Create New Contest
        </button>
      </div>

      {loading ? (
        <p>Loading contests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contests.length === 0 ? (
        <p>No contests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map((contest) => (
            <div key={contest._id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold">{contest.title}</h2>
              <p className="text-sm text-gray-600">{contest.description}</p>
              <p className="text-sm mt-2">
                Start: {new Date(contest.startTime).toLocaleString()}
              </p>
              <p className="text-sm">
                End: {new Date(contest.endTime).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContest;

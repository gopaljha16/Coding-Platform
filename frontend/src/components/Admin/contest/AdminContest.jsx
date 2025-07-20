import React, { useEffect, useState } from "react";
import {
  getAllContests,
  deleteContest,
  updateConstest as updateContest,
} from "../../../utils/apis/contestApi/contest";
import CreateContestForm from "./CreateContestForm";

const AdminContest = () => {
  const [contests, setContests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getAllContests().then((res) => {
      setContests(res?.data || []);
    });
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    await deleteContest(id);
    setRefresh(!refresh);
  };

  const handleEdit = (contest) => {
    setEditData(contest);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateContest(editData._id, editData);
    setEditData(null);
    setRefresh(!refresh);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Contest Dashboard</h2>

      {/* Create Form */}
      <CreateContestForm onSuccess={() => setRefresh(!refresh)} />

      {/* Update Form Modal */}
      {editData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdateSubmit}
            className=" rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Contest</h3>

            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>

            <label className="block mb-2">
              Start Time:
              <input
                type="datetime-local"
                value={new Date(editData.startTime)
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) =>
                  setEditData({ ...editData, startTime: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>

            <label className="block mb-2">
              End Time:
              <input
                type="datetime-local"
                value={new Date(editData.endTime)
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) =>
                  setEditData({ ...editData, endTime: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>

            <label className="block mb-4">
              Public:
              <select
                value={editData.isPublic}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    isPublic: e.target.value === "true",
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditData(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Contests Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">All Contests</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Title</th>
              <th className="p-2">Public</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest._id} className="border-t">
                <td className="p-2">{contest.name}</td>
                <td className="p-2">{contest.isPublic ? "✅" : "❌"}</td>
                <td className="p-2">
                  {new Date(contest.startTime).toLocaleString()}
                </td>
                <td className="p-2">
                  {new Date(contest.endTime).toLocaleString()}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(contest)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(contest._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContest;

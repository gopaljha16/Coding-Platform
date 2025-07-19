import React, { useEffect, useState } from "react";
import { getAllContests, deleteContest } from "../../../utils/apis/contestApi/contest";
import CreateContestForm from "./CreateContestForm";

const AdminContest = () => {
  const [contests, setContests] = useState([]);
  const [refresh, setRefresh] = useState(false);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Contest Dashboard</h2>
      <CreateContestForm onSuccess={() => setRefresh(!refresh)} />

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">All Contests</h3>
        <table className="w-full border">
          <thead>
            <tr className="">
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
                <td className="p-2">{new Date(contest.startTime).toLocaleString()}</td>
                <td className="p-2">{new Date(contest.endTime).toLocaleString()}</td>
                <td className="p-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(contest._id)}>Delete</button>
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
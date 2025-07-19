import React, { useEffect, useState } from "react";
import { createContest, getAllProblems } from "../../../utils/apis/contestApi/contest";

const CreateContestForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "", // ✅ should be `name`, not `title`
    startTime: "",
    endTime: "",
    isPublic: false,
    problems: [],
  });

  const [problems, setProblems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllProblems()
      .then((res) => setProblems(res.data || []))
      .catch((err) => console.error("Error fetching problems", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProblemSelect = (id) => {
    setForm((prev) => {
      const selected = new Set(prev.problems);
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      return { ...prev, problems: Array.from(selected) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error

    try {
      await createContest(form);
      setForm({ name: "", startTime: "", endTime: "", isPublic: false, problems: [] });
      onSuccess();
    } catch (err) {
      console.error("Error creating contest:", err);
      setError("Failed to create contest. Please check the form and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6  rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Contest</h2>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Contest Title</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter contest title"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="isPublic"
          checked={form.isPublic}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm font-medium">Make this contest public</label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Problems</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2">
          {problems.map((p) => (
            <label key={p._id} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={form.problems.includes(p._id)}
                onChange={() => handleProblemSelect(p._id)}
                className="mr-2"
              />
              {p.title}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Create Contest
      </button>
    </form>
  );
};

export default CreateContestForm;

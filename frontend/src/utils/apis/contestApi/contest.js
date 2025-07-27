import axiosClient from "../../axiosClient";

export const getAllContests = () => axiosClient.get("/contest");
export const getAllProblems = () => axiosClient.get("/contest/problems");
export const createContest = (data) => axiosClient.post("/contest/create", data);
export const deleteContest = (id) => axiosClient.delete(`/contest/delete/${id}`);
export const updateContest = (id, data) => axiosClient.put(`/contest/update/${id}`, data);

// Added missing API calls
export const getContestById = (id) => axiosClient.get(`/contest/${id}`);
export const getContestProblems = (contestId) => axiosClient.get(`/contest/${contestId}/problems`);
export const getContestProblem = (contestId, problemId) => axiosClient.get(`/contest/${contestId}/problem/${problemId}`);
export const runContestCode = (contestId, problemId, data) => axiosClient.post(`/contest/${contestId}/problem/${problemId}/run`, data);
export const submitContestCode = (contestId, problemId, data) => axiosClient.post(`/contest/${contestId}/problem/${problemId}/submit`, data);

// New API call for contest registration
export const registerForContest = (contestId) => axiosClient.post(`/contest/${contestId}/register`);

import axiosClient from "../../axiosClient";

export const getAllContests = () => axiosClient.get("/contest");
export const getAllProblems = () => axiosClient.get("/problem/getAllProblems");
export const createContest = (data) => axiosClient.post("/contest/create", data);
export const deleteContest = (id) => axiosClient.delete(`/contest/${id}`);
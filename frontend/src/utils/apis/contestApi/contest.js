import axiosClient from "../../axiosClient";

export const getAllContests = () => axiosClient.get("/contest");
export const getAllProblems = () => axiosClient.get("/contest/problems");
export const createContest = (data) => axiosClient.post("/contest/create", data);
export const deleteContest = (id) => axiosClient.delete(`/contest/delete/${id}`);
export const updateContest = (id, data) => axiosClient.put(`/contest/update/${id}`, data);
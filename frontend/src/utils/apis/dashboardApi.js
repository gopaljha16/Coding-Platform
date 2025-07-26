import axios from '../axiosClient';

export const fetchUserProfile = () => axios.get('/user/getProfile');
export const fetchProblemsSolved = () => axios.get('/problem/profile/problemsSolved');
export const fetchAllProblems = () => axios.get('/problem/profile/allProblems');
export const fetchUserStreaks = () => axios.get('/user/streaks');
export const fetchUserBadges = () => axios.get('/user/badges');
export const fetchUserRank = () => axios.get('/user/rank');
export const fetchAllUserSubmissions = () => axios.get('/user/submissions'); 
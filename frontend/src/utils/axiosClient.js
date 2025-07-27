import axios from 'axios';

const axiosClient = axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true,
    headers :{
        'Content-Type': 'application/json'
    }
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 && data.message === "Token expired, please login again") {
        // Clear user session and localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Optionally reload or redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

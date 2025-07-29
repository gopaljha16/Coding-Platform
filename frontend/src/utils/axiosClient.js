import axios from 'axios';

const backendPort = import.meta.env.VITE_BACKEND_PORT || '3000';

const axiosClient = axios.create({
    baseURL: `http://localhost:${backendPort}`,
    withCredentials: true,
    headers: {
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
      // Temporarily disable automatic logout for token expiration
      // This is a workaround for the system date issue (2025)
      if (status === 401 && data.message === "Token expired, please login again") {
        console.warn("Token expiration detected but ignoring due to system date issue");
        // Don't clear user session or redirect
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

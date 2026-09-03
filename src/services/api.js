import axios from 'axios';

// Configure the base URL for the backend API
// Assuming the backend is running on localhost:8080 by default
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here later for authentication tokens (JWT)
api.interceptors.request.use(
  (config) => {
    // Example: const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors, e.g., 401 Unauthorized to redirect to login
    return Promise.reject(error);
  }
);

export default api;

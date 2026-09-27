import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,  // 60 seconds (pehle 15 tha)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studyhub_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

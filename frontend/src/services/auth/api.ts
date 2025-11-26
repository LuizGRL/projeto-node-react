import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); 
      localStorage.removeItem("user_data");
      localStorage.setItem("session_expired", "true");
      window.location.href = "/login";    
    }
    return Promise.reject(error);
  }
);
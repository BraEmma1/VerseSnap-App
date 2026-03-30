import axios from 'axios';

const api = axios.create({
  // Use Vercel's env config in production or fallback to localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

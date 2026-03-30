import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this if your backend uses a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

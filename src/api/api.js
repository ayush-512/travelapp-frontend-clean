// frontend/src/api/api.js
import axios from 'axios';

// REPLACE with your PC IPv4 from ipconfig when using local backend.
// Example: 'http://192.168.1.42:3000'
const BASE_URL = 'http://10.105.233.51:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// helper to set default Authorization header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;

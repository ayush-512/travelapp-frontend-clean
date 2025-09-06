import axios from 'axios';

// Use your PC's IPv4 from ipconfig
const BASE_URL = 'http://10.105.233.51:3000';  

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

import axios from 'axios';

// Resolve API base URL: use relative /api when deployed (same origin). Only use full URL in dev.
function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;
  // If we're in the browser and not on localhost, never use localhost — use same-origin /api (Vercel).
  if (typeof window !== 'undefined' && window.location?.hostname !== 'localhost' && window.location?.hostname !== '127.0.0.1') {
    return '/api';
  }
  return envUrl || (isDev ? 'http://localhost:5000/api' : '/api');
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;

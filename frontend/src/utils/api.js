import axios from 'axios';

// Resolve API base URL for axios.
// - Local dev: use VITE_API_URL or http://localhost:5000/api
// - Vercel (same project): use /api (frontend and API on same domain)
// - Vercel (separate backend URL): set VITE_API_URL to your backend URL, e.g. https://your-api.vercel.app/api
function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1';
    if (isLocalhost) return envUrl || (isDev ? 'http://localhost:5000/api' : '/api');
    if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) return envUrl;
    return '/api';
  }
  return envUrl || (isDev ? 'http://localhost:5000/api' : '/api');
}

const baseURL = getApiBaseUrl();
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios does not prepend baseURL when url starts with /. Normalize so baseURL is always used.
api.interceptors.request.use((config) => {
  const url = (config.url || '').trim();
  if (url.startsWith('/') && !url.startsWith('//')) {
    config.url = url.slice(1); // e.g. '/auth/login' -> 'auth/login' so baseURL '/api' is prepended
  }
  return config;
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;

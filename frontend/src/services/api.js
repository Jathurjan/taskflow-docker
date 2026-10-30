import axios from 'axios';

export const TOKEN_KEY = 'taskflow_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected, clear it and send the user to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) =>
  error.response?.data?.message ||
  (error.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : error.message) ||
  'Something went wrong';

export default api;

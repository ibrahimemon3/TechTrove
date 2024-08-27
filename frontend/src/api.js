import axios from 'axios';
import { handleError, handleSuccess } from './utils';

const api = axios.create({
  baseURL: 'https://tech-trove-api.vercel.app',
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('https://tech-trove-api.vercel.app/auth/refresh-token', { refreshToken });
        const { accessToken } = data;
        localStorage.setItem('token', accessToken);
        originalRequest.headers['Authorization'] = accessToken;
        return api(originalRequest);
      } catch (err) {
        handleError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;

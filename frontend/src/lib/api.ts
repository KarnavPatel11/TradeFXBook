import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh gracefully
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet, AND it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using httpOnly refresh cookie
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data.data;
        
        // Save new token
        localStorage.setItem('token', accessToken);
        
        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login if not already there
        if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

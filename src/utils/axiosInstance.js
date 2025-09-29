import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/signup') {
        console.warn('Unauthorized! Clearing storage and redirecting to login...');
        
        localStorage.removeItem('user');

        document.cookie = "userRole=; Max-Age=0; path=/";
        document.cookie = "is_auth=; Max-Age=0; path=/";
        window.location.href = '/signup';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

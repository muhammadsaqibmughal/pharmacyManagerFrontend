import axios from "axios";

// Create Axios instance
// const api = axios.create({
//   baseURL: "https://pharmacy-backend-five.vercel.app/api",
// });

const api = axios.create({
  baseURL: "https://pharmacybackend-ick9.onrender.com",
});

// Add JWT from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/signup") {
        console.warn(
          "Unauthorized! Clearing storage and redirecting to login..."
        );

        // Clear user info from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        // Redirect to signup/login page
        window.location.href = "/signup";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

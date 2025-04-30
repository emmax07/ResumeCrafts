import axios from "axios";

// Create an Axios instance with a default base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure this line accesses the correct base URL
  timeout: 10000, // Optional: set a timeout for requests
});

// Optional: Add a request interceptor to attach JWT tokens for authenticated requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach the token to the request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

// create an axios instance to set base url and with credentials
// allowing for easier api calls throughout the app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // by adding this, cookies will be sent to the
  // server automatically, on every single req
});

export default axiosInstance;

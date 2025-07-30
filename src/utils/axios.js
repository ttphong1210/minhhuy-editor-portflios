import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.2:8083/api/",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

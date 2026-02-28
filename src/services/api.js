import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Membersihkan kelebihan "/api" jika pengguna sudah menuliskannya di .env
const cleanBaseURL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL: cleanBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
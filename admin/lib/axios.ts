import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Read token from cookie and send as Authorization header
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) {
      config.headers["Authorization"] = `Bearer ${match[1]}`;
    }
  }
  return config;
});

export default api;

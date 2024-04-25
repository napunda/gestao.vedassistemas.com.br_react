import axios from "axios";
import useAuthStore from "@/stores/AuthStore";

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export { axiosService };

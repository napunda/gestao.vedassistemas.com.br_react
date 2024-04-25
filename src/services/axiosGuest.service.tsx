import axios from "axios";
import useAuthStore from "@/stores/AuthStore";

const axiosGuestService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosGuestService.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export { axiosGuestService };

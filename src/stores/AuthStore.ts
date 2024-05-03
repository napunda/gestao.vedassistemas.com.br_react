import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosService } from "@/services/axios.service";

interface User {
  name: string;
  email: string;
  username: string;
  is_admin: boolean;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      login: async (token) => {
        set({ token, isAuthenticated: true });
        await get().verifyToken();
      },
      logout: () => set({ token: null, isAuthenticated: false, user: null }),
      verifyToken: async () => {
        try {
          const response = await axiosService.post("/auth/verify-token");
          set({ user: response.data.user });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage-key",
    }
  )
);

export default useAuthStore;

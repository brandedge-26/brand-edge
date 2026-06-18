import { create } from "zustand";
import api from "@/lib/axios";

interface AuthState {
  checked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(() => ({
  checked: false,
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },
  logout: async () => {
    await api.post("/auth/logout").catch(() => {});
    document.cookie = "admin_token=; path=/; max-age=0";
  },
}));

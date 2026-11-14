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
    const res = await api.post("/sales/login", { email, password });
    const token = res.data.token;
    document.cookie = `sales_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },
  logout: async () => {
    await api.post("/sales/logout").catch(() => {});
    document.cookie = "sales_token=; path=/; max-age=0";
  },
}));

import { create } from "zustand";
import api from "@/lib/axios";

interface SalesMe {
  name: string;
  email: string;
}

interface AuthState {
  checked: boolean;
  me: SalesMe | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  checked: false,
  me: null,
  login: async (email, password) => {
    const res = await api.post("/sales/login", { email, password });
    const token = res.data.token;
    document.cookie = `sales_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },
  logout: async () => {
    await api.post("/sales/logout").catch(() => {});
    document.cookie = "sales_token=; path=/; max-age=0";
  },
  fetchMe: async () => {
    try {
      const res = await api.get("/sales/me");
      if (res.data.success) set({ me: res.data.data });
    } catch {}
  },
}));

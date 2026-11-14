import { create } from "zustand";
import api from "@/lib/axios";

export interface SalesDashboardStats {
  callsCount: number;
  followUpsCount: number;
  leadsAssignedCount: number;
  conversionsCount: number;
}

interface DashboardState {
  stats: SalesDashboardStats | null;
  loading: boolean;
  fetch: (from?: string, to?: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,

  fetch: async (from, to) => {
    set({ loading: true });
    try {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await api.get("/sales/dashboard", { params });
      if (res.data.success) set({ stats: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },
}));

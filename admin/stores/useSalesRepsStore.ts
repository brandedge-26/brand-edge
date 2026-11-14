import { create } from "zustand";
import api from "@/lib/axios";

export interface SalesRep {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface SalesRepStats {
  callsCount: number;
  followUpsCount: number;
  leadsAssignedCount: number;
  conversionsCount: number;
}

interface SalesRepsState {
  reps: SalesRep[];
  loading: boolean;
  fetch: () => Promise<void>;
  create: (data: { name: string; email: string; password: string }) => Promise<void>;
  toggleActive: (id: string, active: boolean) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchStats: (id: string, from?: string, to?: string) => Promise<{ rep: SalesRep; stats: SalesRepStats } | null>;
}

export const useSalesRepsStore = create<SalesRepsState>((set) => ({
  reps: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/sales-reps");
      if (res.data.success) set({ reps: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  create: async (data) => {
    const res = await api.post("/sales-reps", data);
    if (res.data.success) {
      set((s) => ({ reps: [res.data.data, ...s.reps] }));
    }
  },

  toggleActive: async (id, active) => {
    const res = await api.patch(`/sales-reps/${id}/active`, { active });
    if (res.data.success) {
      set((s) => ({ reps: s.reps.map((r) => r._id === id ? res.data.data : r) }));
    }
  },

  remove: async (id) => {
    await api.delete(`/sales-reps/${id}`).catch(() => {});
    set((s) => ({ reps: s.reps.filter((r) => r._id !== id) }));
  },

  fetchStats: async (id, from, to) => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await api.get(`/sales-reps/${id}/stats`, { params });
    return res.data.success ? res.data.data : null;
  },
}));

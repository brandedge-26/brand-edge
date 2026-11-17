import { create } from "zustand";
import api from "@/lib/axios";

interface DashStats {
  totalConsultations: number;
  totalContacts: number;
  totalApplications: number;
  pendingConsultations: number;
  completedConsultations: number;
  totalCalls: number;
  totalInterested: number;
}

export interface RecentConsultation {
  _id: string;
  name: string;
  services: string[];
  status: string;
  createdAt: string;
}

export interface RecentContact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface RecentCall {
  _id: string;
  businessName: string;
  createdAt: string;
  salesRep: { _id: string; name: string } | null;
}

interface DashboardState {
  stats: DashStats | null;
  recentConsultations: RecentConsultation[];
  recentContacts: RecentContact[];
  recentCalls: RecentCall[];
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  recentConsultations: [],
  recentContacts: [],
  recentCalls: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/dashboard");
      if (res.data.success) {
        set({
          stats: res.data.data.stats,
          recentConsultations: res.data.data.recentConsultations,
          recentContacts: res.data.data.recentContacts,
          recentCalls: res.data.data.recentCalls,
        });
      }
    } catch {}
    finally { set({ loading: false }); }
  },
}));

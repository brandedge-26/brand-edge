import { create } from "zustand";
import api from "@/lib/axios";

export interface DailyReport {
  _id: string;
  date: string;
  callsMade: number;
  interestedCount: number;
  notes: string;
}

export interface ReportInput {
  date: string;
  callsMade: number;
  interestedCount: number;
  notes: string;
}

interface ReportsState {
  reports: DailyReport[];
  loading: boolean;
  fetch: () => Promise<void>;
  submit: (data: ReportInput) => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/sales/reports");
      if (res.data.success) set({ reports: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  submit: async (data) => {
    const res = await api.post("/sales/reports", data);
    if (res.data.success) {
      const saved = res.data.data as DailyReport;
      set((s) => ({
        reports: s.reports.some((r) => r.date === saved.date)
          ? s.reports.map((r) => r.date === saved.date ? saved : r)
          : [saved, ...s.reports],
      }));
    }
  },
}));

import { create } from "zustand";
import api from "@/lib/axios";

export interface CallEntry {
  _id: string;
  businessName: string;
  createdAt: string;
}

interface CallsState {
  calls: CallEntry[];
  loading: boolean;
  fetch: () => Promise<void>;
  logCall: (businessName: string) => Promise<void>;
}

export const useCallsStore = create<CallsState>((set) => ({
  calls: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/sales/calls");
      if (res.data.success) set({ calls: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  logCall: async (businessName) => {
    const res = await api.post("/sales/calls", { businessName });
    if (res.data.success) {
      set((s) => ({ calls: [res.data.data, ...s.calls] }));
    }
  },
}));

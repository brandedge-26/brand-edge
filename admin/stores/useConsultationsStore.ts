import { create } from "zustand";
import api from "@/lib/axios";

export type ConsultationStatus = "Pending" | "In Progress" | "Completed";

export interface Consultation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  teamSize: string;
  industry: string;
  services: string[];
  urgency: string;
  goals: string;
  days: string[];
  timeSlot: string;
  timezone: string;
  status: ConsultationStatus;
  createdAt: string;
}

interface ConsultationsState {
  consultations: Consultation[];
  loading: boolean;
  fetch: () => Promise<void>;
  updateStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useConsultationsStore = create<ConsultationsState>((set) => ({
  consultations: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/consultations");
      if (res.data.success) set({ consultations: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  updateStatus: async (id, status) => {
    await api.patch(`/consultations/${id}/status`, { status }).catch(() => {});
    set((s) => ({
      consultations: s.consultations.map((c) => c._id === id ? { ...c, status } : c),
    }));
  },

  remove: async (id) => {
    await api.delete(`/consultations/${id}`).catch(() => {});
    set((s) => ({ consultations: s.consultations.filter((c) => c._id !== id) }));
  },
}));

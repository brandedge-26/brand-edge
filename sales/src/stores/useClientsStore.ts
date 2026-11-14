import { create } from "zustand";
import api from "@/lib/axios";

export type ClientStatus = "New" | "Follow-up" | "Closed";
export type ClientPriority = "Low" | "Medium" | "High";

export interface Client {
  _id: string;
  businessName: string;
  phone: string;
  note: string;
  status: ClientStatus;
  priority: ClientPriority;
  followUpDate: string | null;
  closedAt: string | null;
  createdAt: string;
}

export interface NewClient {
  businessName: string;
  phone: string;
  note: string;
  priority: ClientPriority;
}

interface ClientsState {
  clients: Client[];
  loading: boolean;
  fetch: () => Promise<void>;
  create: (data: NewClient) => Promise<void>;
  update: (id: string, data: NewClient) => Promise<void>;
  markFollowUp: (id: string, followUpDate: string) => Promise<void>;
  closeClient: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/sales/clients");
      if (res.data.success) set({ clients: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  create: async (data) => {
    const res = await api.post("/sales/clients", data);
    if (res.data.success) {
      set((s) => ({ clients: [res.data.data, ...s.clients] }));
    }
  },

  update: async (id, data) => {
    const res = await api.patch(`/sales/clients/${id}`, data);
    if (res.data.success) {
      set((s) => ({ clients: s.clients.map((c) => c._id === id ? res.data.data : c) }));
    }
  },

  markFollowUp: async (id, followUpDate) => {
    const res = await api.patch(`/sales/clients/${id}/follow-up`, { followUpDate });
    if (res.data.success) {
      set((s) => ({ clients: s.clients.map((c) => c._id === id ? res.data.data : c) }));
    }
  },

  closeClient: async (id) => {
    const res = await api.patch(`/sales/clients/${id}/close`);
    if (res.data.success) {
      set((s) => ({ clients: s.clients.map((c) => c._id === id ? res.data.data : c) }));
    }
  },
}));

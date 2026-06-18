import { create } from "zustand";
import api from "@/lib/axios";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  fetch: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/contacts");
      if (res.data.success) set({ contacts: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  remove: async (id) => {
    await api.delete(`/contacts/${id}`).catch(() => {});
    set((s) => ({ contacts: s.contacts.filter((c) => c._id !== id) }));
  },
}));

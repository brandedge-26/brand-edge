import { create } from "zustand";
import api from "@/lib/axios";

export type NotifType = "Consultation" | "Contact" | "Application";

export interface Notification {
  _id: string;
  type: NotifType;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  fetch: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/notifications");
      if (res.data.success) set({ notifications: res.data.data });
    } catch {}
    finally { set({ loading: false }); }
  },

  markRead: async (id) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    set((s) => ({
      notifications: s.notifications.map((n) => n._id === id ? { ...n, read: true } : n),
    }));
  },

  markAllRead: async () => {
    await api.patch("/notifications/read-all").catch(() => {});
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  remove: async (id) => {
    await api.delete(`/notifications/${id}`).catch(() => {});
    set((s) => ({ notifications: s.notifications.filter((n) => n._id !== id) }));
  },
}));

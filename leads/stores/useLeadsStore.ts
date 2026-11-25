import { create } from "zustand";
import api from "@/lib/axios";

export type LeadStatus = "sent" | "interested" | "follow_up" | "do_not_contact" | "bounced" | "replied";

export const LEAD_STATUSES: LeadStatus[] = ["sent", "interested", "follow_up", "do_not_contact", "bounced", "replied"];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  sent: "Sent",
  interested: "Interested",
  follow_up: "Follow Up",
  do_not_contact: "Do Not Contact",
  bounced: "Bounced",
  replied: "Replied",
};

export interface Lead {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  website: string;
  industry: string;
  employees: string | number;
  city: string;
  state: string;
  country: string;
  linkedin: string;
  keywords: string;
  company_phone: string;
  status: LeadStatus;
  category: string;
  summary: string;
  thread_id: string;
  subject: string;
  body: string;
  sent_date: string | null;
  last_reply_at: string | null;
  follow_up_at: string | null;
}

export interface LeadMessage {
  _id: string;
  lead_email: string;
  thread_id: string;
  direction: "outbound" | "inbound";
  type: "reply_received" | "reply_sent";
  subject: string;
  body: string;
  category: string;
  summary: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface LeadStats {
  sent: number;
  interested: number;
  follow_up: number;
  replied: number;
  do_not_contact: number;
  bounced: number;
}

interface FetchParams {
  search?: string;
  status?: LeadStatus | "";
  replied?: boolean;
  page?: number;
}

const EMPTY_PAGINATION: Pagination = { page: 1, pageSize: 25, total: 0, pageCount: 1 };

interface LeadsState {
  leads: Lead[];
  pagination: Pagination;
  stats: LeadStats | null;
  loading: boolean;
  fetch: (params?: FetchParams) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDetail: (id: string) => Promise<{ lead: Lead; messages: LeadMessage[] }>;
  updateStatus: (id: string, status: LeadStatus) => Promise<Lead>;
  remove: (id: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  pagination: EMPTY_PAGINATION,
  stats: null,
  loading: false,

  fetch: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await api.get("/leads", {
        params: {
          search: params.search || undefined,
          status: params.status || undefined,
          replied: params.replied ? "true" : undefined,
          page: params.page || 1,
        },
      });
      if (res.data.success) set({ leads: res.data.data, pagination: res.data.pagination });
    } catch {}
    finally { set({ loading: false }); }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/leads/stats");
      if (res.data.success) set({ stats: res.data.data });
    } catch {}
  },

  fetchDetail: async (id) => {
    const res = await api.get(`/leads/${id}`);
    return res.data.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/leads/${id}`, { status });
    const updated: Lead = res.data.data;
    set((s) => ({ leads: s.leads.map((l) => (l._id === id ? updated : l)) }));
    return updated;
  },

  remove: async (id) => {
    await api.delete(`/leads/${id}`);
    set((s) => ({ leads: s.leads.filter((l) => l._id !== id) }));
  },
}));

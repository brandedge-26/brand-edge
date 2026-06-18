import { create } from "zustand";
import api from "@/lib/axios";

export type JobStatus = "Active" | "Closed";

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  deadline: string;
  description: string;
  requirements: string;
  status: JobStatus;
  createdAt: string;
}

export interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: string;
  portfolio: string;
  linkedin: string;
  currentRole: string;
  whyJoin: string;
  skills: string[];
  cvUrl?: string;
  createdAt: string;
}

interface JobsState {
  jobs: Job[];
  applications: Application[];
  loadingJobs: boolean;
  loadingApps: boolean;
  fetchJobs: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  addJob: (data: Omit<Job, "_id" | "createdAt">) => Promise<void>;
  removeJob: (id: string) => Promise<void>;
  updateJob: (id: string, data: Omit<Job, "_id" | "createdAt">) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  applications: [],
  loadingJobs: false,
  loadingApps: false,

  fetchJobs: async () => {
    set({ loadingJobs: true });
    try {
      const res = await api.get("/jobs");
      if (res.data.success) set({ jobs: res.data.data });
    } catch {}
    finally { set({ loadingJobs: false }); }
  },

  fetchApplications: async () => {
    set({ loadingApps: true });
    try {
      const res = await api.get("/applications");
      if (res.data.success) set({ applications: res.data.data });
    } catch {}
    finally { set({ loadingApps: false }); }
  },

  addJob: async (data) => {
    const res = await api.post("/jobs", data);
    if (res.data.success) {
      set((s) => ({ jobs: [res.data.data, ...s.jobs] }));
    }
  },

  removeJob: async (id) => {
    await api.delete(`/jobs/${id}`).catch(() => {});
    set((s) => ({ jobs: s.jobs.filter((j) => j._id !== id) }));
  },

  updateJob: async (id, data) => {
    const res = await api.patch(`/jobs/${id}`, data);
    if (res.data.success) {
      set((s) => ({ jobs: s.jobs.map((j) => j._id === id ? res.data.data : j) }));
    }
  },

  removeApplication: async (id) => {
    await api.delete(`/applications/${id}`).catch(() => {});
    set((s) => ({ applications: s.applications.filter((a) => a._id !== id) }));
  },
}));

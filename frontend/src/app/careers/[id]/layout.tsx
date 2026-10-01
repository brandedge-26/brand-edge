import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

async function getJob(id: string): Promise<Job | null> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/jobs`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    const jobs = (json?.data ?? []) as Job[];
    return jobs.find((j) => j._id === id) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return pageMetadata({
      title: "Job Opening",
      description: "Explore open roles at Brand Edge Creations.",
      path: `/careers/${id}`,
    });
  }

  const plainDescription = job.description.replace(/[#*`]/g, "").replace(/\s+/g, " ").trim();
  const description = `${job.title} — ${job.department} · ${job.location} · ${job.type}. ${plainDescription}`.slice(0, 157) + "...";

  return pageMetadata({
    title: `${job.title} — Careers`,
    description,
    path: `/careers/${id}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

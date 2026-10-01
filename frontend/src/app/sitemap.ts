import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ALL_PROJECTS } from "@/lib/projects";

interface Job {
  _id: string;
  status: "Active" | "Closed";
  updatedAt?: string;
  createdAt: string;
}

async function getActiveJobs(): Promise<Job[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return [];
  try {
    const res = await fetch(`${base}/jobs`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const jobs = (json?.data ?? []) as Job[];
    return jobs.filter((j) => j.status === "Active");
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/story`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services/360-marketing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/app-development`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/branding`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/graphic-design`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/product-photography`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/seo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/software-development`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/website-designing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/consultation`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = ALL_PROJECTS.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const jobs = await getActiveJobs();
  const careerRoutes: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${SITE_URL}/careers/${j._id}`,
    lastModified: new Date(j.updatedAt ?? j.createdAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...portfolioRoutes, ...careerRoutes];
}

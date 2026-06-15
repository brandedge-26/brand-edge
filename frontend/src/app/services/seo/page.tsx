"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "SEO",
  gradient: "linear-gradient(135deg, #16a34a, #0891b2)",
  image: "/home/services/seo-service.webp",
  tag: "Page-One Rankings",
  desc: "Technical SEO, content strategy, and link building that gets you to the top — and keeps you there.",
  features: [
    { title: "Technical SEO Audit", desc: "In-depth analysis of your site's technical health — crawlability, indexing, site speed, and Core Web Vitals — with a clear action plan." },
    { title: "On-Page Optimisation", desc: "Keyword-rich title tags, meta descriptions, headings, and content structure that search engines and users both love." },
    { title: "Link Building", desc: "High-authority backlink acquisition through outreach, guest posts, and digital PR to boost your domain strength." },
    { title: "Local SEO", desc: "Google Business Profile optimisation, local citations, and map-pack strategies to dominate local search results." },
    { title: "Content Strategy", desc: "Topic cluster planning, keyword research, and content briefs that attract the right traffic at every stage of the funnel." },
    { title: "Monthly Reporting", desc: "Transparent monthly reports covering rankings, organic traffic, conversions, and the work completed — no fluff." },
  ],
};

export default function Page() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const s = localStorage.getItem("be-theme") as "dark"|"light"|null; if (s) setTheme(s); }, []);
  const toggleTheme = () => setTheme(t => { const n = t === "dark" ? "light" : "dark"; localStorage.setItem("be-theme", n); return n; });
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return <ServiceDetailLayout theme={theme} onToggle={toggleTheme} scrolled={scrolled} {...SVC} />;
}

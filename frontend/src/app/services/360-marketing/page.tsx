"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "360 Marketing",
  gradient: "linear-gradient(135deg, #ff6a00, #ee0979)",
  image: "/home/services/marketting.webp",
  tag: "Full-Funnel Growth",
  desc: "From awareness to conversion — we craft end-to-end marketing campaigns that grow your brand across every channel.",
  features: [
    { title: "Social Media Marketing", desc: "Strategic content creation and management across Instagram, Facebook, TikTok, and LinkedIn to grow your audience and drive engagement." },
    { title: "Google Ads & PPC", desc: "High-converting paid campaigns on Google and Meta that put your brand in front of the right people at the right moment." },
    { title: "Email Marketing", desc: "Automated email sequences and newsletters that nurture leads, retain customers, and drive repeat business." },
    { title: "Content Marketing", desc: "Blog posts, videos, and creative assets that build authority, attract organic traffic, and tell your brand story." },
    { title: "Influencer Marketing", desc: "Curated influencer partnerships that amplify your brand message to targeted, engaged audiences." },
    { title: "Analytics & Reporting", desc: "In-depth performance tracking, ROI reporting, and data-driven optimisation to keep campaigns improving month over month." },
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

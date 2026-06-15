"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "Website Design",
  gradient: "linear-gradient(135deg, #7c3aed, #c026d3)",
  image: "/home/services/website-service.webp",
  tag: "Conversion-First",
  desc: "Beautiful, fast, and conversion-optimised websites that turn visitors into customers.",
  features: [
    { title: "UI / UX Design", desc: "User-centred design with intuitive layouts, clear navigation, and interfaces that feel natural and effortless to use." },
    { title: "Responsive Development", desc: "Pixel-perfect websites that look and perform flawlessly on every device — desktop, tablet, and mobile." },
    { title: "Landing Pages", desc: "High-converting landing pages built around your campaign goals, with clear CTAs and persuasive copy." },
    { title: "E-Commerce Stores", desc: "Fully functional online stores with smooth checkout flows, product pages, and payment integrations." },
    { title: "CMS Integration", desc: "Easy-to-manage websites powered by Webflow, WordPress, or custom CMS so you stay in control of your content." },
    { title: "Speed & SEO Optimisation", desc: "Fast-loading, technically sound websites optimised for Core Web Vitals and search engine visibility from day one." },
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

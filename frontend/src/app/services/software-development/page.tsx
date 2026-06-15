"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "Software Development",
  gradient: "linear-gradient(135deg, #7c3aed, #0891b2)",
  image: "/home/services/software-design-service.webp",
  tag: "Custom SaaS & Platforms",
  desc: "Custom web apps, SaaS platforms, and API integrations built to solve real business problems.",
  features: [
    { title: "Custom Web Applications", desc: "Tailor-made web apps built with modern stacks — from simple internal tools to complex multi-tenant platforms." },
    { title: "SaaS Product Development", desc: "End-to-end SaaS builds including auth, billing, dashboards, and multi-user architecture." },
    { title: "API Development & Integration", desc: "RESTful and GraphQL APIs, plus seamless third-party integrations with payment gateways, CRMs, and more." },
    { title: "Database Design", desc: "Scalable, efficient database architecture — relational or NoSQL — designed for performance and data integrity." },
    { title: "Admin Dashboards", desc: "Powerful internal dashboards with analytics, user management, and real-time data visualisation." },
    { title: "Maintenance & Support", desc: "Ongoing technical support, security patches, and feature development to keep your product running and growing." },
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

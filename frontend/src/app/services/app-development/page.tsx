"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "App Development",
  gradient: "linear-gradient(135deg, #0891b2, #7c3aed)",
  image: "/home/services/mobile-app-service.webp",
  tag: "iOS & Android",
  desc: "Native and cross-platform mobile apps built for performance, usability, and scale.",
  features: [
    { title: "iOS App Development", desc: "Native Swift applications built for the Apple ecosystem — smooth, fast, and fully App Store ready." },
    { title: "Android App Development", desc: "Native Kotlin apps optimised for the full range of Android devices, from budget to flagship." },
    { title: "Cross-Platform (React Native)", desc: "One codebase, two platforms. React Native apps that deliver near-native performance on both iOS and Android." },
    { title: "Mobile UI / UX Design", desc: "Intuitive mobile interfaces designed around how people actually use their phones — thumb-friendly and distraction-free." },
    { title: "App Store Submission", desc: "We handle the full submission process for both the Apple App Store and Google Play, including review compliance." },
    { title: "Maintenance & Updates", desc: "Ongoing support, bug fixes, and feature updates to keep your app running smoothly as platforms evolve." },
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

"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "Branding",
  gradient: "linear-gradient(135deg, #ee0979, #ff6a00)",
  image: "/home/services/branding-service.webp",
  tag: "Identity Systems",
  desc: "Logo design, brand guidelines, and visual identity systems that make your brand impossible to ignore.",
  features: [
    { title: "Logo Design", desc: "Distinctive, versatile logos crafted to represent your brand across every touchpoint — print, digital, and beyond." },
    { title: "Brand Guidelines", desc: "A comprehensive brand book covering logo usage, colour palette, typography, tone of voice, and visual do's and don'ts." },
    { title: "Colour & Typography", desc: "Purposeful colour systems and typeface pairings that communicate your brand's personality at a glance." },
    { title: "Stationery & Collateral", desc: "Business cards, letterheads, envelopes, and branded collateral that make a strong first impression offline." },
    { title: "Brand Voice & Messaging", desc: "Defining how your brand speaks — taglines, mission statements, and messaging frameworks that resonate with your audience." },
    { title: "Rebranding", desc: "Strategic brand refreshes that modernise your identity while preserving the equity you've already built." },
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

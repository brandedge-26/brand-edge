"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "Graphic Design",
  gradient: "linear-gradient(135deg, #d97706, #ff6a00)",
  image: "/home/services/graphic-design-service.webp",
  tag: "Visuals That Convert",
  desc: "Print, digital, and motion graphics crafted to communicate your brand's message with impact.",
  features: [
    { title: "Social Media Graphics", desc: "Scroll-stopping posts, stories, reels covers, and ad creatives designed to perform on every platform." },
    { title: "Print Design", desc: "Brochures, flyers, posters, banners, and packaging designed for impact in the physical world." },
    { title: "Packaging Design", desc: "Product packaging that stands out on shelves and creates an unboxing experience customers want to share." },
    { title: "Motion Graphics", desc: "Animated logos, explainer videos, and social motion content that bring your brand to life." },
    { title: "Infographics", desc: "Data and complex information transformed into clear, visually compelling graphics that people actually read." },
    { title: "Presentation Design", desc: "Pitch decks, investor presentations, and branded slide templates that look professional and tell a compelling story." },
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

"use client";
import { useState, useEffect } from "react";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";

const SVC = {
  label: "Product Photography",
  gradient: "linear-gradient(135deg, #c026d3, #7c3aed)",
  image: "/home/services/product-photogrpahy.webp",
  tag: "Shots That Sell",
  desc: "Studio and lifestyle product photography that makes your products look as good as they are.",
  features: [
    { title: "Studio Product Shoots", desc: "Clean, professional studio photography with controlled lighting that showcases your product in its best form." },
    { title: "Lifestyle Photography", desc: "In-context shots that show your product being used in real-life settings — building desire and emotional connection." },
    { title: "White Background Shots", desc: "E-commerce ready white background images that meet Amazon, Shopify, and marketplace listing requirements." },
    { title: "360° Product Views", desc: "Multi-angle photography sets that give customers a complete, interactive view of your product." },
    { title: "Photo Editing & Retouching", desc: "Professional colour grading, background removal, and retouching to make every image look flawless." },
    { title: "Social & Ad-Ready Images", desc: "Cropped and formatted images ready for Instagram, Facebook ads, website banners, and print materials." },
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

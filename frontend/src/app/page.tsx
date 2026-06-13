"use client";

import { useState, useEffect } from "react";

import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import GoodbyeSection from "@/components/GoodbyeSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import OurProcess from "@/components/OurProcess";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReadyToGrow from "@/components/ReadyToGrow";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    localStorage.setItem("be-theme", next);
    return next;
  });

  return (
    <>
      <style>{`
        @keyframes slideDown {
          0%   { opacity:0; transform:translateY(-8px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes moveRight {
          0%   { left:-88px; opacity:0; } 5% { opacity:1; } 95% { opacity:1; }
          100% { left:100%;  opacity:0; }
        }
        @keyframes moveLeft {
          0%   { left:100%;  opacity:0; } 5% { opacity:1; } 95% { opacity:1; }
          100% { left:-88px; opacity:0; }
        }
        @keyframes moveDown {
          0%   { top:-88px; opacity:0; } 5% { opacity:1; } 95% { opacity:1; }
          100% { top:100%;  opacity:0; }
        }
        @keyframes moveUp {
          0%   { top:100%;  opacity:0; } 5% { opacity:1; } 95% { opacity:1; }
          100% { top:-88px; opacity:0; }
        }
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(70%); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes wordOut {
          0%   { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-70%); }
        }
      `}</style>

      <CustomCursor />

      <div data-theme={theme} style={{ color: "var(--fg)", backgroundColor: "var(--bg)" }}>
        <Header theme={theme} onToggle={toggleTheme} scrolled={scrolled} />
        <HeroSection theme={theme} />
        <GoodbyeSection theme={theme} />
        <AboutSection theme={theme} />
        <ServicesSection theme={theme} />
        <OurProcess theme={theme} />
        <TestimonialsSection theme={theme} />
        <ReadyToGrow theme={theme} />
        <FAQSection theme={theme} />
        <Footer theme={theme} />
      </div>
    </>
  );
}

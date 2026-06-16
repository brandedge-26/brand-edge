"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const TAGS = [
  "Branding", "Web Design", "Mobile App", "SEO",
  "Marketing", "Photography", "SaaS", "E-Commerce",
];

export default function PortfolioPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = [heroRef.current, tagsRef.current].filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.05 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  const isDark = theme === "dark";

  return (
    <div
      data-theme={theme}
      style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}
    >
      <style>{`
        @keyframes marquee-tags {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .portfolio-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.35;
          pointer-events: none;
        }
        @media (max-width: 600px) {
          .port-title { letter-spacing: -2px !important; }
        }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", flex: 1 }}>

        {/* Grid bg */}
        <div className="portfolio-hero-grid" />

        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,106,0,0.12) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "-10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(238,9,121,0.09) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        {/* Main content */}
        <div
          ref={heroRef}
          style={{
            maxWidth: 1100, margin: "0 auto",
            padding: "clamp(140px, 18vh, 200px) 24px clamp(60px, 8vh, 100px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", position: "relative", zIndex: 1,
            opacity: 0, transform: "translateY(32px)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 999,
            border: "1px solid var(--border)", background: "var(--surface)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--muted)", marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
            Our Work
          </span>

          {/* Headline */}
          <h1
            className="port-title"
            style={{
              fontSize: "clamp(40px, 7vw, 96px)",
              fontWeight: 400, lineHeight: 1.0,
              letterSpacing: "-4px", margin: "0 0 28px",
              color: "var(--fg)",
            }}
          >
            Brands we&apos;ve{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              built
            </span>
            {" "}&amp;{" "}
            <br />
            stories we&apos;ve{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              told.
            </span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: "clamp(14px, 1.3vw, 18px)",
            color: "var(--muted)", lineHeight: 1.75,
            maxWidth: 500, margin: "0 0 52px",
          }}>
            From bold identities to high-converting digital experiences — every project is a story of growth.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            border: "1px solid var(--border)", background: "var(--surface)",
            overflow: "hidden",
          }}>
            {[
              { val: "50+", label: "Projects" },
              { val: "8",   label: "Services" },
              { val: "98%", label: "Retention" },
              { val: "3x",  label: "Avg. ROI" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "20px 32px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 600,
                  letterSpacing: "-1.5px", lineHeight: 1, margin: "0 0 4px",
                  backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrolling tags strip ── */}
        <div
          ref={tagsRef}
          style={{
            borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            overflow: "hidden", position: "relative", zIndex: 1,
            opacity: 0, transform: "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div style={{ display: "flex", animation: "marquee-tags 22s linear infinite", width: "max-content" }}>
            {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "14px 28px",
                borderRight: "1px solid var(--border)",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                  display: "inline-block", flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      <Footer theme={theme} />
    </div>
  );
}

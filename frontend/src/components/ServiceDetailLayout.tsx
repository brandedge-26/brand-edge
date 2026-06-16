"use client";

import { useEffect, useRef } from "react";
import CustomCursor from "./CustomCursor";
import Header from "./SiteHeader";
import Footer from "./Footer";

interface Feature {
  title: string;
  desc: string;
}

interface Props {
  theme: "dark" | "light";
  onToggle: () => void;
  scrolled: boolean;
  label: string;
  tag: string;
  desc: string;
  image: string;
  gradient: string;
  features?: Feature[];
}

function FeaturesSection({ features, gradient, label, isDark }: {
  features: Feature[];
  gradient: string;
  label: string;
  isDark: boolean;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = [headerRef.current, ...cardRefs.current].filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLDivElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      }),
      { threshold: 0.06 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="svc-features-wrap">

      {/* Section header */}
      <div ref={headerRef} style={{
        marginBottom: 56,
        opacity: 0,
        transform: "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 999,
          border: "1px solid var(--border)", background: "var(--surface)",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
          What We Do
        </span>
        <h2 style={{
          fontSize: "clamp(28px, 3.8vw, 52px)", fontWeight: 500,
          letterSpacing: "-2px", lineHeight: 1.08,
          color: "var(--fg)", margin: 0,
        }}>
          Everything inside{" "}
          <span style={{ backgroundImage: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {label}
          </span>
        </h2>
      </div>

      {/* 3-col card grid — testimonials style */}
      <div className="svc-features-grid">
        {features.map((f, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el; }}
            style={{
              opacity: 0,
              transform: "translateY(36px)",
              transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
              borderRadius: 16,
              padding: "28px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 24,
              minHeight: 220,
            }}
          >
            {/* Top: gradient icon + number (like Quote icon in testimonials) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundImage: gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff",
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              {/* Title (like quote text) */}
              <p style={{
                fontSize: 15, fontWeight: 600,
                color: "var(--fg)", opacity: 0.9,
                lineHeight: 1.5, margin: 0,
                letterSpacing: "-0.3px",
              }}>
                {f.title}
              </p>
            </div>

            {/* Bottom: description (like author row in testimonials) */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
            }}>
              <div style={{
                width: 3, height: "100%", minHeight: 36,
                backgroundImage: gradient,
                borderRadius: 2, flexShrink: 0,
              }} />
              <p style={{
                fontSize: 13, color: "var(--muted)",
                lineHeight: 1.7, margin: 0,
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceDetailLayout({ theme, onToggle, scrolled, label, tag, desc, image, gradient, features }: Props) {
  const isDark = theme === "dark";

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}>
      <style>{`
        .svc-hero {
          padding: clamp(110px, 16vh, 180px) 20px clamp(32px, 5vh, 64px);
          text-align: center;
        }
        .svc-hero-title {
          font-size: clamp(32px, 4.5vw, 64px);
          letter-spacing: -2.5px;
        }
        .svc-hero-desc {
          font-size: clamp(14px, 1.2vw, 17px);
          max-width: 520px;
          margin: 0 auto 40px;
        }
        .svc-image-wrap {
          margin: 0 auto;
          max-width: 1100px;
          border-radius: 20px;
          overflow: hidden;
          height: clamp(200px, 48vw, 580px);
          position: relative;
        }
        .svc-features-wrap {
          padding: 80px 24px 100px;
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
        }
        .svc-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .svc-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .svc-features-wrap {
            padding: 60px 20px 80px;
          }
        }
        @media (max-width: 560px) {
          .svc-features-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .svc-features-wrap {
            padding: 48px 16px 64px;
          }
          .svc-hero {
            padding: 100px 16px 28px;
          }
          .svc-hero-title {
            letter-spacing: -1.5px;
          }
          .svc-image-wrap {
            border-radius: 12px;
            height: clamp(180px, 56vw, 320px);
          }
        }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={onToggle} scrolled={scrolled} />

      {/* ── Hero text ── */}
      <div className="svc-hero">
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: 999,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            color: "var(--muted)",
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" stroke="#ff6a00" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
            </svg>
            Service Details
          </span>
        </div>

        {/* Title */}
        <h1 className="svc-hero-title" style={{
          fontWeight: 400,
          lineHeight: 1.05,
          margin: "0 0 20px",
          backgroundImage: gradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {label}
        </h1>

        {/* Description */}
        <p className="svc-hero-desc" style={{
          color: "var(--muted)",
          lineHeight: 1.75,
        }}>
          {desc}
        </p>

        {/* ── Image ── */}
        <div className="svc-image-wrap">
          <img
            src={image}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%)",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* ── Features ── */}
      {features && features.length > 0 && (
        <FeaturesSection features={features} gradient={gradient} label={label} isDark={isDark} />
      )}

      <Footer theme={theme} />
    </div>
  );
}

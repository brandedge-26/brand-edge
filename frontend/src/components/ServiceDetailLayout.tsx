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

// col spans for bento layout (6 cards)
const SPANS = [2, 1, 1, 1, 1, 2];

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
          el.style.transform = "translateY(0) scale(1)";
          observer.unobserve(el);
        }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: "90px 24px 110px", maxWidth: 1160, margin: "0 auto", width: "100%" }}>

      {/* Section header */}
      <div ref={headerRef} style={{
        marginBottom: 56,
        opacity: 0,
        transform: "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ width: 28, height: 1.5, background: "#ff6a00", display: "inline-block", borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6a00" }}>
            What We Do
          </span>
        </div>
        <h2 style={{
          fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 500,
          letterSpacing: "-2px", lineHeight: 1.08,
          color: "var(--fg)", margin: 0,
        }}>
          Everything inside{" "}
          <span style={{ backgroundImage: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {label}
          </span>
        </h2>
      </div>

      {/* Bento grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {features.map((f, i) => {
          const span = SPANS[i] ?? 1;
          return (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                gridColumn: span === 2 ? "span 2" : "span 1",
                opacity: 0,
                transform: "translateY(44px) scale(0.97)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                position: "relative",
                overflow: "hidden",
                borderRadius: 20,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                padding: span === 2 ? "36px 40px" : "32px 28px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                minHeight: span === 2 ? 160 : 200,
                cursor: "default",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                el.style.borderColor = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.13)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
                el.style.borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
              }}
            >
              {/* Big watermark number */}
              <span style={{
                position: "absolute",
                bottom: -20, right: 12,
                fontSize: 120, fontWeight: 900, lineHeight: 1,
                backgroundImage: gradient,
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0.07,
                userSelect: "none", pointerEvents: "none",
                letterSpacing: "-6px",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Top: number chip */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "4px 10px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: span === 2 ? "clamp(16px, 1.4vw, 20px)" : "clamp(15px, 1.2vw, 17px)",
                fontWeight: 600, color: "var(--fg)",
                margin: "0 0 10px", letterSpacing: "-0.4px", lineHeight: 1.3,
                position: "relative", zIndex: 1,
              }}>
                {f.title}
              </h3>

              {/* Desc */}
              <p style={{
                fontSize: 13, color: "var(--muted)",
                lineHeight: 1.7, margin: 0,
                position: "relative", zIndex: 1,
                maxWidth: span === 2 ? 640 : "100%",
              }}>
                {f.desc}
              </p>

              {/* Bottom gradient line */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 2, backgroundImage: gradient, opacity: 0.3,
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ServiceDetailLayout({ theme, onToggle, scrolled, label, tag, desc, image, gradient, features }: Props) {
  const isDark = theme === "dark";

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column" }}>
      <CustomCursor />
      <Header theme={theme} onToggle={onToggle} scrolled={scrolled} />

      {/* ── Hero text ── */}
      <div style={{
        padding: "clamp(110px,16vh,180px) 24px clamp(40px,5vh,64px)",
        textAlign: "center",
      }}>
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
        <h1 style={{
          fontSize: "clamp(32px, 4.5vw, 64px)",
          fontWeight: 400,
          letterSpacing: "-2.5px",
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
        <p style={{
          fontSize: "clamp(14px, 1.2vw, 17px)",
          color: "var(--muted)",
          lineHeight: 1.75,
          maxWidth: 520,
          margin: "0 auto 40px",
        }}>
          {desc}
        </p>

        {/* ── Image ── */}
        <div style={{
          margin: "0 auto",
          maxWidth: 1100,
          borderRadius: 20,
          overflow: "hidden",
          height: "clamp(240px, 48vw, 580px)",
          position: "relative",
        }}>
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

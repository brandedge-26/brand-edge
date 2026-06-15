"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const CELL = 44;

const SERVICES = [
  { label: "360 Marketing", gradient: "linear-gradient(135deg, #ff6a00, #ee0979)", image: "/home/services/marketting.webp", tag: "Full-Funnel Growth" },
  { label: "Website Design", gradient: "linear-gradient(135deg, #7c3aed, #c026d3)", image: "/home/services/website-service.webp", tag: "Conversion-First" },
  { label: "App Development", gradient: "linear-gradient(135deg, #0891b2, #7c3aed)", image: "/home/services/mobile-app-service.webp", tag: "iOS & Android" },
  { label: "SEO", gradient: "linear-gradient(135deg, #16a34a, #0891b2)", image: "/home/services/seo-service.webp", tag: "Page-One Rankings" },
  { label: "Branding", gradient: "linear-gradient(135deg, #ee0979, #ff6a00)", image: "/home/services/branding-service.webp", tag: "Identity Systems" },
  { label: "Graphic Design", gradient: "linear-gradient(135deg, #d97706, #ff6a00)", image: "/home/services/graphic-design-service.webp", tag: "Visuals That Convert" },
  { label: "Software Development", gradient: "linear-gradient(135deg, #7c3aed, #0891b2)", image: "/home/services/software-design-service.webp", tag: "Custom SaaS & Platforms" },
  { label: "Product Photography", gradient: "linear-gradient(135deg, #c026d3, #7c3aed)", image: "/home/services/product-photogrpahy.webp", tag: "Shots That Sell" },
];

const ROW1 = SERVICES.slice(0, 4);
const ROW2 = SERVICES.slice(4);


// Tokens: plain words or inline service chips
type Token =
  | { type: "word"; text: string }
  | { type: "chip"; svcIdx: number };

const TOKENS: Token[] = [
  { type: "word", text: "From" },
  { type: "chip", svcIdx: 0 }, // 360 Marketing
  { type: "word", text: "and" },
  { type: "chip", svcIdx: 4 }, // Branding
  { type: "word", text: "to" },
  { type: "chip", svcIdx: 1 }, // Website Design
  { type: "word", text: "and" },
  { type: "chip", svcIdx: 2 }, // App Development
  { type: "word", text: "—" },
  { type: "word", text: "plus" },
  { type: "chip", svcIdx: 3 }, // SEO
  { type: "word", text: "," },
  { type: "chip", svcIdx: 5 }, // Graphic Design
  { type: "word", text: "," },
  { type: "chip", svcIdx: 6 }, // Software Development
  { type: "word", text: "and" },
  { type: "chip", svcIdx: 7 }, // Product Photography
  { type: "word", text: "—" },
  { type: "word", text: "every" },
  { type: "word", text: "service" },
  { type: "word", text: "your" },
  { type: "word", text: "brand" },
  { type: "word", text: "needs," },
  { type: "word", text: "all" },
  { type: "word", text: "under" },
  { type: "word", text: "one" },
  { type: "word", text: "roof." },
];

function ServicesRevealSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = containerRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={containerRef} style={{ height: "300vh", borderTop: "1px solid var(--border)" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-6 md:px-16 overflow-hidden">

        {/* Badge */}
        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
            Our Services
          </span>
        </div>

        {/* Revealed text */}
        <p className="text-center leading-[1.4] max-w-5xl mx-auto"
          style={{ fontSize: "clamp(24px,3.8vw,56px)", letterSpacing: "-1.5px" }}>
          {TOKENS.map((token, i) => {
            const tokenProgress = TOKENS.length * progress;
            const filled = tokenProgress >= i + 1;
            const partial = !filled && tokenProgress > i ? tokenProgress - i : 0;
            const opacity = filled ? 1 : partial > 0 ? 0.12 + partial * 0.88 : 0.12;

            if (token.type === "word") {
              return (
                <span key={i} style={{
                  display: "inline",
                  opacity,
                  color: "var(--fg)",
                  transition: "opacity 0.12s ease",
                }}>
                  {token.text}{" "}
                </span>
              );
            }

            // chip token
            const svc = SERVICES[token.svcIdx];
            return (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                verticalAlign: "middle",
                padding: "4px 14px 4px 6px",
                borderRadius: "999px",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                margin: "0 4px 6px",
                opacity,
                transition: "opacity 0.12s ease",
                position: "relative", top: "-2px",
              }}>
                {/* Tiny image */}
                <span style={{
                  width: 44, height: 44, borderRadius: 999,
                  overflow: "hidden", flexShrink: 0, display: "inline-block",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                }}>
                  <img src={svc.image} alt={svc.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </span>
                {/* Label */}
                <span style={{
                  fontSize: "0.75em", fontWeight: 400, letterSpacing: "-0.5px", whiteSpace: "nowrap",
                  backgroundImage: svc.gradient,
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent", color: "transparent",
                }}>
                  {svc.label}
                </span>
              </span>
            );
          })}
        </p>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: progress < 0.08 ? 1 : 0 }}>
          <span className="text-[11px] tracking-widest uppercase text-[var(--muted)]">Scroll</span>
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
        </div>
      </div>
    </section>
  );
}

const SHOWCASE = [
  { label: "360 Marketing",        href: "/services/360-marketing",        image: "/home/services/marketting.webp",           tags: ["Campaign Strategy", "Brand Storytelling"] },
  { label: "Website Design",       href: "/services/website-designing",    image: "/home/services/website-service.webp",      tags: ["UI / UX Design", "Conversion Optimised"] },
  { label: "App Development",      href: "/services/app-development",      image: "/home/services/mobile-app-service.webp",   tags: ["iOS & Android", "React Native"] },
  { label: "SEO",                  href: "/services/seo",                  image: "/home/services/seo-service.webp",          tags: ["Technical SEO", "Link Building"] },
  { label: "Branding",             href: "/services/branding",             image: "/home/services/branding-service.webp",     tags: ["Logo Design", "Brand Systems"] },
  { label: "Graphic Design",       href: "/services/graphic-design",       image: "/home/services/graphic-design-service.webp", tags: ["Print & Digital", "Motion Graphics"] },
  { label: "Software Development", href: "/services/software-development", image: "/home/services/software-design-service.webp", tags: ["SaaS Platforms", "API Integration"] },
  { label: "Product Photography",  href: "/services/product-photography",  image: "/home/services/product-photogrpahy.webp",  tags: ["Studio Shoots", "Lifestyle Photos"] },
];
const HEADER_H = 44;

function ServiceShowcaseSection({ theme, onActiveChange }: { theme: "dark" | "light"; onActiveChange?: (active: boolean) => void }) {
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const clipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);
  const N = SHOWCASE.length;

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const prog = Math.min(1, scrolled / total);

      const inSection = scrolled > 0 && scrolled < total;
      if (inSection !== isActiveRef.current) {
        isActiveRef.current = inSection;
        onActiveChange?.(inSection);
      }

      const raw = prog * N;
      const idx = Math.min(Math.floor(raw), N - 1);
      const localProg = Math.min(raw - idx, 1);

      if (idx !== activeIdxRef.current) {
        activeIdxRef.current = idx;
        setActiveIdx(idx);
      }

      // Image: reveal left → right, completes in first 35% of each service's scroll
      if (clipRef.current) {
        const fastProg = Math.min(localProg / 0.35, 1);
        const eased = fastProg < 0.5 ? 2 * fastProg * fastProg : 1 - Math.pow(-2 * fastProg + 2, 2) / 2;
        const inset = Math.max(0, (1 - eased) * 100);
        clipRef.current.style.clipPath = `inset(0 ${inset.toFixed(2)}% 0 0)`;
      }

      // Title fades out as first service starts
      if (titleRef.current) {
        const opacity = Math.max(0, 1 - raw * 4);
        titleRef.current.style.opacity = String(opacity);
        titleRef.current.style.transform = `translateY(${-Math.min(raw * 40, 40)}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [N]);

  return (
    <section ref={containerRef} style={{ height: `${N * 100}vh`, borderTop: "1px solid var(--border)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "var(--bg)" }}>

        {/* Section title */}
        <div ref={titleRef} style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 1, pointerEvents: "none",
        }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
            What We Do
          </span>
          <h2 style={{ fontSize: "clamp(36px,5.5vw,76px)", letterSpacing: "-2px", lineHeight: 1.05, color: "var(--fg)", margin: 0, textAlign: "center" }}>
            Our{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Services
            </span>
          </h2>
        </div>

        {/* Stacked horizontal header bars */}
        {SHOWCASE.slice(0, activeIdx + 1).map((svc, i) => (
          <div key={i} style={{
            position: "absolute",
            top: i * HEADER_H + 10,
            left: 20, right: 20, height: HEADER_H,
            display: "flex", alignItems: "center",
            padding: "0 clamp(16px,3vw,36px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 14,
            background: isDark ? "rgba(14,15,26,0.75)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            zIndex: 20,
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ff6a00", textTransform: "uppercase", flexShrink: 0 }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: "clamp(10px,1vw,13px)", fontWeight: 700, color: "var(--fg)" }}>
                {svc.label}
              </span>
            </div>

            {/* Center — pill chips with gradient text */}
            <div className="hidden md:flex" style={{ flex: 1, gap: 8, alignItems: "center", justifyContent: "center" }}>
              {svc.tags.map((tag, ti) => (
                <span key={ti} style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "3px 10px", borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "rgba(128,128,128,0.12)",
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent", color: "transparent",
                  }}>
                    {tag}
                  </span>
                </span>
              ))}
            </div>

            {/* CTA — no glow */}
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Link
                href={svc.href}
                className="group inline-flex items-center gap-1.5 rounded-full no-underline"
                style={{ height: 28, paddingLeft: 14, paddingRight: 6, background: "#ff6a00", transition: "filter 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1)"; }}
              >
                <span className="relative overflow-hidden inline-flex flex-col text-white font-bold" style={{ fontSize: 11, letterSpacing: "0.02em", height: "1.2em" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Learn More</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Learn More</span>
                </span>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ArrowRight size={9} stroke="#ff6a00" strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        ))}

        {/* Image — reveals left-to-right */}
        <div ref={clipRef} style={{
          position: "absolute",
          top: (activeIdx + 1) * HEADER_H + 20, left: 0, right: 0, bottom: 0,
          clipPath: "inset(0 100% 0 0)",
        }}>
          <img src={SHOWCASE[activeIdx].image} alt={SHOWCASE[activeIdx].label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

      </div>
    </section>
  );
}

function GridOverlay() {
  const [size, setSize] = useState({ rows: 0, cols: 0 });
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({
        rows: Math.ceil(window.innerHeight / CELL) + 1,
        cols: Math.ceil(window.innerWidth / CELL) + 1,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size.rows) return null;

  return (
    <div
      className="absolute inset-0 z-[2]"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size.cols}, ${CELL}px)`,
        gridTemplateRows: `repeat(${size.rows}, ${CELL}px)`,
      }}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: size.rows * size.cols }).map((_, i) => {
        const r = Math.floor(i / size.cols);
        const c = i % size.cols;
        const dist = hovered ? Math.abs(r - hovered.r) + Math.abs(c - hovered.c) : 99;
        const active = dist <= 1;
        return (
          <div
            key={i}
            onMouseEnter={() => setHovered({ r, c })}
            className="transition-all duration-200"
            style={{
              width: CELL, height: CELL, boxSizing: "border-box",
              border: "1px solid transparent",
              background: active ? "rgba(255,106,0,0.08)" : "transparent",
              borderColor: active ? "rgba(255,106,0,0.35)" : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

export default function ServicesPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [svcIdx, setSvcIdx] = useState(0);
  const [prevSvcIdx, setPrevSvcIdx] = useState<number | null>(null);
  const svcIdxRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () =>
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("be-theme", next);
      return next;
    });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cycle service chips
  useEffect(() => {
    const t = setInterval(() => {
      const current = svcIdxRef.current;
      const next = (current + 1) % SERVICES.length;
      setPrevSvcIdx(current);
      setSvcIdx(next);
      svcIdxRef.current = next;
      setTimeout(() => setPrevSvcIdx(null), 480);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(60%) skewY(4deg); }
          100% { opacity:1; transform:translateY(0)   skewY(0deg); }
        }
        @keyframes wordOut {
          0%   { opacity:1; transform:translateY(0)    skewY(0deg); }
          100% { opacity:0; transform:translateY(-60%) skewY(-4deg); }
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
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes slideDown {
          0%   { opacity:0; transform:translateY(-8px); }
          100% { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
        <CustomCursor />
        <Header theme={theme} onToggle={toggleTheme} scrolled={scrolled} hidden={headerHidden} />

        {/* ── Hero ── */}
        <div className="hero-grid min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center">
          <GridOverlay />

          {/* Glows */}
          <div style={{
            position: "absolute", top: "-100px", right: "-100px",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,106,0,0.14) 0%, rgba(238,9,121,0.06) 45%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", left: "-80px",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />
          <div style={{
            position: "absolute", top: "40%", left: "10%",
            width: "260px", height: "260px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />

          {/* Animated segments */}
          {[
            { h: true, top: "120px", anim: "moveRight 7s linear infinite" },
            { h: true, top: "340px", anim: "moveRight 9.5s linear infinite 3.2s" },
            { h: true, top: "250px", anim: "moveLeft 8.5s linear infinite 1.5s" },
            { h: false, left: "280px", anim: "moveDown 6.5s linear infinite 0.5s" },
            { h: false, left: "580px", anim: "moveDown 10s linear infinite 4s" },
            { h: false, left: "460px", anim: "moveUp 8s linear infinite 2s" },
          ].map((s, i) => (
            <div key={i} className="absolute z-[6] pointer-events-none" style={{
              ...(s.h
                ? { height: "1px", width: "88px", top: s.top, background: "linear-gradient(90deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }
                : { width: "1px", height: "88px", left: s.left, background: "linear-gradient(180deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }),
              animation: s.anim,
            }} />
          ))}

          {/* Hero content */}
          <div className="relative z-[8] flex flex-col items-center text-center px-6 max-w-5xl pointer-events-none select-none" style={{ paddingTop: "80px" }}>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7 border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_16px_rgba(0,0,0,0.18)]"
              style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span className="text-[13px] font-medium text-[var(--fg)] tracking-wide">What We Do</span>
            </div>

            {/* Heading */}
            <div
              className="leading-[1.06] tracking-tighter text-[var(--fg)] m-0 mb-4 text-center"
              style={{ fontSize: "clamp(40px,6vw,86px)", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              <div>We build brands</div>
              {/* "that" + chip on the same stable flex line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3em" }}>
                <span>that</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                  borderRadius: "999px",
                  padding: "0 28px",
                  height: "1.18em",
                  overflow: "hidden",
                  minWidth: "clamp(160px, 22vw, 420px)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}`,
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                }}>
                  {prevSvcIdx !== null && (
                    <span className="absolute whitespace-nowrap tracking-tighter" style={{
                      animation: "wordOut 0.45s ease forwards",
                      backgroundImage: SERVICES[prevSvcIdx].gradient,
                      WebkitBackgroundClip: "text", backgroundClip: "text",
                      WebkitTextFillColor: "transparent", color: "transparent",
                    }}>
                      {SERVICES[prevSvcIdx].label}
                    </span>
                  )}
                  <span key={svcIdx} className="whitespace-nowrap tracking-tighter" style={{
                    animation: prevSvcIdx !== null ? "wordIn 0.45s ease forwards" : "none",
                    backgroundImage: SERVICES[svcIdx].gradient,
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent", color: "transparent",
                  }}>
                    {SERVICES[svcIdx].label}
                  </span>
                </span>
              </div>
            </div>

            {/* Sub */}
            <p
              className="text-[var(--fg)] opacity-55 leading-relaxed max-w-2xl mb-10"
              style={{ fontSize: "clamp(14px,1.3vw,18px)", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}
            >
              From strategy and identity to code and campaigns — we handle every
              moving part so you can focus on building what matters.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-3 flex-wrap justify-center pointer-events-auto mb-14"
              style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}
            >
              <button
                className="group inline-flex items-center gap-2.5 h-[52px] px-6 rounded-full cursor-pointer border-none"
                style={{
                  background: "linear-gradient(150deg, #ff8c30 0%, #d94400 100%)",
                  boxShadow: "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
                  transition: "box-shadow 0.25s ease, filter 0.25s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 36px rgba(255,106,0,0.52), inset 0 1px 0 rgba(255,255,255,0.18)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)";
                }}
              >
                <span className="relative overflow-hidden inline-flex flex-col text-white font-bold text-sm" style={{ height: "1.2em" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Get a Free Quote</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Get a Free Quote</span>
                </span>
                <ArrowRight size={14} stroke="white" strokeWidth={2} className="opacity-90" />
              </button>

              <button
                className="group inline-flex items-center gap-2.5 h-[52px] px-6 rounded-full cursor-pointer backdrop-blur-md"
                style={{
                  background: isDark
                    ? "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(150deg, rgba(255,106,0,0.5), rgba(255,106,0,0.08)) border-box"
                    : "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, rgba(255,106,0,0.45), rgba(255,106,0,0.08)) border-box",
                  border: "1.5px solid transparent",
                  transition: "background 0.25s ease",
                }}
              >
                <span className="relative overflow-hidden inline-flex flex-col font-semibold text-sm" style={{ height: "1.2em", color: "var(--fg)" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Explore Services</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Explore Services</span>
                </span>
                <ArrowRight size={14} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
              </button>
            </div>

          </div>

        </div>

        {/* ── Services Reveal ── */}
        <ServicesRevealSection theme={theme} />

        {/* ── Service Showcase ── */}
        <ServiceShowcaseSection theme={theme} onActiveChange={setHeaderHidden} />

        {/* ── Footer ── */}
        <Footer theme={theme} />
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";

const CELL = 44;

const ROLES = [
  { text: "Designers",   gradient: "linear-gradient(135deg, #ff6a00, #ee0979)" },
  { text: "Developers",  gradient: "linear-gradient(135deg, #c026d3, #7c3aed)" },
  { text: "Strategists", gradient: "linear-gradient(135deg, #16a34a, #0891b2)" },
  { text: "Creators",    gradient: "linear-gradient(135deg, #0891b2, #7c3aed)" },
  { text: "Builders",    gradient: "linear-gradient(135deg, #d97706, #ff6a00)" },
];

const STATS = [
  { target: 18,  suffix: "+", label: "Team Members" },
  { target: 5,   suffix: "+", label: "Years Together" },
  { target: 200, suffix: "+", label: "Projects Shipped" },
  { target: 98,  suffix: "%", label: "Client Satisfaction" },
];

function GridOverlay() {
  const [size, setSize] = useState({ rows: 0, cols: 0 });
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  useEffect(() => {
    const update = () => setSize({
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

function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !triggered) setTriggered(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1800;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCounts(STATS.map(s => Math.round(s.target * ease)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [triggered]);

  return (
    <section ref={ref} className="w-full" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-2 py-10 px-8"
            style={{ borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
            <span className="tracking-tighter font-bold" style={{
              fontSize: "clamp(38px,4.5vw,62px)", lineHeight: 1, letterSpacing: "-2px",
              backgroundImage: triggered ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
              WebkitBackgroundClip: triggered ? "text" : "unset",
              backgroundClip: triggered ? "text" : "unset",
              WebkitTextFillColor: triggered ? "transparent" : "unset",
              color: triggered ? "transparent" : "var(--muted)",
              transition: `color 0.55s ease ${(i * 0.13).toFixed(2)}s`,
            }}>
              {counts[i]}{s.suffix}
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.12em]" style={{
              color: "var(--muted)",
              opacity: triggered ? 1 : 0,
              transition: `opacity 0.55s ease ${(i * 0.13 + 0.2).toFixed(2)}s`,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TeamPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [prevRoleIdx, setPrevRoleIdx] = useState<number | null>(null);
  const roleIdxRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    localStorage.setItem("be-theme", next);
    return next;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const current = roleIdxRef.current;
      const next = (current + 1) % ROLES.length;
      setPrevRoleIdx(current);
      setRoleIdx(next);
      roleIdxRef.current = next;
      setTimeout(() => setPrevRoleIdx(null), 480);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @keyframes slideDown {
          0%   { opacity:0; transform:translateY(-8px); }
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
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
        <CustomCursor />
        <Header theme={theme} onToggle={toggleTheme} scrolled={scrolled} />

        {/* ── Hero ── */}
        <div className="hero-grid min-h-screen w-full relative overflow-hidden flex items-center justify-center">
          <GridOverlay />

          {/* Glows */}
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "520px", height: "520px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,106,0,0.13) 0%, rgba(238,9,121,0.06) 45%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", left: "-80px",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />

          {/* Animated segments */}
          {[
            { h: true,  top: "132px",  anim: "moveRight 7s linear infinite" },
            { h: true,  top: "352px",  anim: "moveRight 9s linear infinite 3s" },
            { h: true,  top: "264px",  anim: "moveLeft 8s linear infinite 1.5s" },
            { h: false, left: "308px", anim: "moveDown 6s linear infinite 0.5s" },
            { h: false, left: "616px", anim: "moveDown 10s linear infinite 4s" },
            { h: false, left: "484px", anim: "moveUp 8s linear infinite 2s" },
          ].map((s, i) => (
            <div key={i} className="absolute z-[6] pointer-events-none" style={{
              ...(s.h
                ? { height: "1px", width: "88px", top: s.top, background: "linear-gradient(90deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }
                : { width: "1px", height: "88px", left: s.left, background: "linear-gradient(180deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }),
              animation: s.anim,
            }} />
          ))}

          {/* Hero content */}
          <div className="relative z-[8] flex flex-col items-center text-center px-6 max-w-4xl pointer-events-none select-none">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_16px_rgba(0,0,0,0.18)]"
              style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0" />
              <span className="text-[13px] font-medium text-[var(--fg)] tracking-wide">Meet the Team</span>
            </div>

            {/* Heading */}
            <h1
              className="leading-[1.06] tracking-tighter text-[var(--fg)] m-0 mb-5"
              style={{ fontSize: "clamp(40px,6vw,88px)", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              The{" "}
              <span style={{
                display: "inline-flex", alignItems: "center", verticalAlign: "middle",
                position: "relative", top: "-3px", borderRadius: "999px",
                padding: "0 20px", height: "1.2em", overflow: "hidden",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                margin: "0 4px",
              }}>
                {prevRoleIdx !== null && (
                  <span className="absolute whitespace-nowrap tracking-tighter" style={{
                    animation: "wordOut 0.45s ease forwards",
                    backgroundImage: ROLES[prevRoleIdx].gradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", color: "transparent",
                  }}>
                    {ROLES[prevRoleIdx].text}
                  </span>
                )}
                <span key={roleIdx} className="whitespace-nowrap tracking-tighter" style={{
                  animation: prevRoleIdx !== null ? "wordIn 0.45s ease forwards" : "none",
                  backgroundImage: ROLES[roleIdx].gradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", color: "transparent",
                }}>
                  {ROLES[roleIdx].text}
                </span>
              </span>{" "}
              Behind the Brand
            </h1>

            {/* Subtext */}
            <p
              className="font-normal text-[var(--fg)] opacity-60 leading-relaxed max-w-xl mb-10"
              style={{ fontSize: "clamp(14px,1.3vw,17px)", animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}
            >
              A tight-knit crew of creatives and engineers who obsess over craft,
              sweat the details, and build things that actually move the needle.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-3 flex-wrap justify-center pointer-events-auto"
              style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}
            >
              <button
                className="group inline-flex items-center gap-2.5 h-[50px] px-6 rounded-full cursor-pointer border-none"
                style={{
                  background: "linear-gradient(150deg, #ff8c30 0%, #d94400 100%)",
                  boxShadow: "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
                  transition: "box-shadow 0.25s ease, filter 0.25s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 36px rgba(255,106,0,0.52), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
              >
                <span className="relative overflow-hidden inline-flex flex-col text-white font-bold text-sm" style={{ height: "1.2em" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Get Consultation</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Get Consultation</span>
                </span>
                <ArrowRight size={13} stroke="white" strokeWidth={2} className="opacity-90" />
              </button>

              <button
                className="group inline-flex items-center gap-2.5 h-[50px] px-6 rounded-full cursor-pointer backdrop-blur-md"
                style={{
                  background: isDark
                    ? "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(150deg, rgba(255,106,0,0.55), rgba(255,106,0,0.08)) border-box"
                    : "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, rgba(255,106,0,0.5), rgba(255,106,0,0.08)) border-box",
                  border: "1.5px solid transparent",
                  transition: "background 0.25s ease",
                }}
              >
                <span className="relative overflow-hidden inline-flex flex-col font-semibold text-sm" style={{ height: "1.2em", color: "var(--fg)" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Our Work</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Our Work</span>
                </span>
                <ArrowRight size={13} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <StatsStrip />

      </div>
    </>
  );
}

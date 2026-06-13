"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const CELL = 44;

const WORDS = [
  { text: "Authentic", gradient: "linear-gradient(135deg, #ff6a00, #ee0979)" },
  { text: "Bold", gradient: "linear-gradient(135deg, #c026d3, #7c3aed)" },
  { text: "Purposeful", gradient: "linear-gradient(135deg, #16a34a, #0891b2)" },
  { text: "Daring", gradient: "linear-gradient(135deg, #0891b2, #7c3aed)" },
  { text: "Relentless", gradient: "linear-gradient(135deg, #d97706, #ff6a00)" },
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
          <div key={i} onMouseEnter={() => setHovered({ r, c })}
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

export default function StoryPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const wordIdxRef = useRef(0);

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
      const current = wordIdxRef.current;
      const next = (current + 1) % WORDS.length;
      setPrevIdx(current);
      setWordIdx(next);
      wordIdxRef.current = next;
      setTimeout(() => setPrevIdx(null), 480);
    }, 2600);
    return () => clearInterval(t);
  }, []);

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
        @keyframes marqueeRight {
          0%   { transform:translateX(-50%); }
          100% { transform:translateX(0); }
        }
        @keyframes digitInDown {
          0%   { transform:translateY(110%); opacity:0; }
          100% { transform:translateY(0);    opacity:1; }
        }
        @keyframes digitOutUp {
          0%   { transform:translateY(0);     opacity:1; }
          100% { transform:translateY(-110%); opacity:0; }
        }
        @keyframes digitInUp {
          0%   { transform:translateY(-110%); opacity:0; }
          100% { transform:translateY(0);     opacity:1; }
        }
        @keyframes digitOutDown {
          0%   { transform:translateY(0);    opacity:1; }
          100% { transform:translateY(110%); opacity:0; }
        }
        @keyframes mvContentInRight {
          0%   { opacity:0; transform:translateX(36px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes mvContentInLeft {
          0%   { opacity:0; transform:translateX(-36px); }
          100% { opacity:1; transform:translateX(0); }
        }
      `}</style>

      <CustomCursor />

      <div data-theme={theme} style={{ color: "var(--fg)", backgroundColor: "var(--bg)", minHeight: "100vh" }}>
        <Header theme={theme} onToggle={toggleTheme} scrolled={scrolled} />

        {/* ── Hero ── */}
        <div className="hero-grid min-h-screen w-full relative overflow-hidden flex items-center justify-center">
          <GridOverlay />

          {/* Radial glow — top-right */}
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "520px", height: "520px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,106,0,0.13) 0%, rgba(238,9,121,0.06) 45%, transparent 70%)",
            pointerEvents: "none", zIndex: 3,
          }} />

          {/* Animated segments */}
          {[
            { h: true, top: "132px", anim: "moveRight 7s linear infinite" },
            { h: true, top: "352px", anim: "moveRight 9s linear infinite 3s" },
            { h: true, top: "264px", anim: "moveLeft 8s linear infinite 1.5s" },
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
          <div className="relative z-[8] flex flex-col items-center text-center px-6 max-w-3xl pointer-events-none select-none">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_16px_rgba(0,0,0,0.18)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0" />
              <span className="text-[13px] font-medium text-[var(--fg)] tracking-wide">Who We Are</span>
            </div>

            <h1 className="text-[clamp(40px,6vw,86px)] leading-[1.06] tracking-tighter text-[var(--fg)] m-0 mb-5">
              The Story Behind{" "}
              {/* Cycling word — chip style */}
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                verticalAlign: "middle",
                position: "relative",
                top: "-3px",
                borderRadius: "999px",
                padding: "0 20px",
                height: "1.2em",
                overflow: "hidden",
                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                margin: "0 4px",
              }}>
                {prevIdx !== null && (
                  <span className="absolute whitespace-nowrap tracking-tighter" style={{
                    animation: "wordOut 0.45s ease forwards",
                    backgroundImage: WORDS[prevIdx].gradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", color: "transparent",
                  }}>
                    {WORDS[prevIdx].text}
                  </span>
                )}
                <span key={wordIdx} className="whitespace-nowrap tracking-tighter" style={{
                  animation: prevIdx !== null ? "wordIn 0.45s ease forwards" : "none",
                  backgroundImage: WORDS[wordIdx].gradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", color: "transparent",
                }}>
                  {WORDS[wordIdx].text}
                </span>
              </span>
              {" "}Branding
            </h1>

            <p className="font-normal text-[clamp(14px,1.3vw,17px)] text-[var(--fg)] opacity-60 leading-relaxed max-w-lg mb-10">
              From a small studio with a big dream to a full-service creative agency trusted by brands worldwide — here&apos;s how we got here.
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center pointer-events-auto">
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
                  background: theme === "dark"
                    ? "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(150deg, rgba(255,106,0,0.55), rgba(255,106,0,0.08)) border-box"
                    : "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, rgba(255,106,0,0.5), rgba(255,106,0,0.08)) border-box",
                  border: "1.5px solid transparent",
                  transition: "background 0.25s ease",
                }}
              >
                <span className="relative overflow-hidden inline-flex flex-col font-semibold text-sm" style={{ height: "1.2em", color: "var(--fg)" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Our Team</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Our Team</span>
                </span>
                <ArrowRight size={13} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Ticker ── */}
        <TickerSection theme={theme} />

        {/* ── Mission & Vision ── */}
        <MissionVisionSection theme={theme} />

        {/* ── Values ── */}
        <ValuesSection theme={theme} />

        {/* ── Milestones ── */}
        <MilestonesSection theme={theme} />

        {/* ── CTA ── */}
        <StoryCTA theme={theme} />

        <Footer theme={theme} />

      </div>
    </>
  );
}

/* ── Story CTA Section ───────────────────────────── */
function StoryCTA({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hoverPrimary, setHoverPrimary] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(48px)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section ref={sectionRef}
      style={{ borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>

      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />

      {/* Large center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 900, height: 500, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(255,106,0,0.1) 0%, rgba(238,9,121,0.05) 40%, transparent 70%)",
        transition: "opacity 1s ease",
        opacity: inView ? 1 : 0,
      }} />

      {/* Animated segments — decorative */}
      {[
        { h: true,  top: "22%",  anim: "moveRight 9s linear infinite 1s" },
        { h: true,  top: "75%",  anim: "moveLeft 11s linear infinite 2s" },
        { h: false, left: "18%", anim: "moveDown 8s linear infinite 0.5s" },
        { h: false, left: "82%", anim: "moveUp 10s linear infinite 3s" },
      ].map((s, i) => (
        <div key={i} className="absolute z-[2] pointer-events-none" style={{
          ...(s.h
            ? { height: "1px", width: "88px", top: s.top, background: "linear-gradient(90deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }
            : { width: "1px", height: "88px", left: s.left, background: "linear-gradient(180deg,transparent,#ff6a00 40%,#ffb347 60%,transparent)" }),
          animation: s.anim,
        }} />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-28 md:py-36">

        {/* Label */}
        <div style={reveal(0)} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-pulse inline-block" />
            Available for New Projects
          </span>
        </div>

        {/* Headline */}
        <div style={reveal(0.1)}>
          <h2 style={{
            fontSize: "clamp(40px,7vw,100px)",
            letterSpacing: "-2px", lineHeight: 0.95,
            color: "var(--fg)", margin: "0 0 8px",
          }}>
            Ready to build
          </h2>
          <h2 style={{
            fontSize: "clamp(40px,7vw,100px)",
            letterSpacing: "-2px", lineHeight: 0.95,
            backgroundImage: "linear-gradient(135deg,#ff6a00 0%,#ee0979 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 8px",
          }}>
            something iconic?
          </h2>
        </div>

        {/* Sub */}
        <p style={{
          ...reveal(0.2),
          fontSize: "clamp(14px,1.3vw,17px)", color: "var(--muted)",
          lineHeight: 1.75, maxWidth: 480, margin: "28px auto 40px",
        }}>
          You&apos;ve read our story. Now let&apos;s write yours. Book a free strategy call and let&apos;s figure out what your brand is missing.
        </p>

        {/* Buttons */}
        <div style={reveal(0.3)} className="flex items-center gap-4 flex-wrap justify-center">

          {/* Primary */}
          <button
            className="group inline-flex items-center gap-2.5 h-[54px] px-8 rounded-full cursor-pointer border-none"
            style={{
              background: "linear-gradient(150deg,#ff8c30 0%,#d94400 100%)",
              boxShadow: hoverPrimary
                ? "0 8px 40px rgba(255,106,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
                : "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              transform: hoverPrimary ? "translateY(-2px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
          >
            <span className="relative overflow-hidden inline-flex flex-col text-white font-bold text-[15px]" style={{ height: "1.2em" }}>
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Book a Free Call</span>
              <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Book a Free Call</span>
            </span>
            <ArrowRight size={14} stroke="white" strokeWidth={2.5} />
          </button>

          {/* Secondary */}
          <button
            className="group inline-flex items-center gap-2.5 h-[54px] px-8 rounded-full cursor-pointer"
            style={{
              background: isDark
                ? "linear-gradient(#0d0d0d,#0d0d0d) padding-box, linear-gradient(150deg,rgba(255,106,0,0.5),rgba(255,106,0,0.08)) border-box"
                : "linear-gradient(var(--surface),var(--surface)) padding-box, linear-gradient(150deg,rgba(255,106,0,0.45),rgba(255,106,0,0.08)) border-box",
              border: "1.5px solid transparent",
            }}
          >
            <span className="relative overflow-hidden inline-flex flex-col font-semibold text-[15px]" style={{ height: "1.2em", color: "var(--fg)" }}>
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">View Our Work</span>
              <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">View Our Work</span>
            </span>
            <ArrowUpRight size={14} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
          </button>
        </div>

        {/* Trust line */}
        <div style={{ ...reveal(0.42), marginTop: 52 }}
          className="flex items-center gap-6 flex-wrap justify-center">
          {["120+ brands built", "98% satisfaction", "Available Mon–Sat"].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--muted)" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
              {t}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Milestones Section ──────────────────────────── */
const MILESTONES = [
  {
    year: "2023", quarter: "Q1",
    title: "Founded in Karachi",
    body: "Brand Edge started as a two-person design studio with one obsessive goal — build brands that actually mean something. No filler, no fluff, just craft.",
    tag: "The Beginning",
  },
  {
    year: "2023", quarter: "Q3",
    title: "First 10 Clients",
    body: "Word spread fast. Within months we had 10 clients across e-commerce, tech, and hospitality — all from referrals. Zero ads spent.",
    tag: "Early Traction",
  },
  {
    year: "2024", quarter: "Q1",
    title: "50 Projects Delivered",
    body: "We crossed 50 completed projects, expanded the team, and launched full brand identity work — strategy, design, and digital all under one roof.",
    tag: "Scaling Up",
  },
  {
    year: "2024", quarter: "Q3",
    title: "Full-Service Agency",
    body: "Added app development, custom software, and performance marketing. Brand Edge became the end-to-end creative partner businesses were looking for.",
    tag: "Full Stack Creative",
  },
  {
    year: "2025", quarter: "Now",
    title: "120+ Brands. Going Global.",
    body: "Over 120 happy clients, first international projects, and a reputation built entirely on results. The best chapter hasn't been written yet.",
    tag: "The Next Chapter",
  },
];

function MilestonesSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  // Refs for scroll-driven text color reveal
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bodyRefs  = useRef<(HTMLParagraphElement | null)[]>([]);
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs  = useRef<(HTMLSpanElement | null)[]>([]);

  /* Section in-view — draws the vertical line */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Per-milestone slide-in reveal */
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll("[data-ms]");
    if (!items) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          const i = parseInt((e.target as HTMLElement).dataset.ms ?? "0");
          setVisible(prev => new Set([...prev, i]));
        }
      }),
      { threshold: 0.2 }
    );
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Scroll-driven text color reveal — direct DOM updates for perf */
  useEffect(() => {
    const onScroll = () => {
      const wh = window.innerHeight;

      // Line fill — fills as you scroll down through the section
      if (lineRef.current) {
        const section = sectionRef.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          // starts filling when section top hits center of viewport
          // completes when section bottom hits center of viewport
          const start = rect.top - wh * 0.5;
          const end   = rect.bottom - wh * 0.5;
          const p = Math.max(0, Math.min(1, -start / (end - start)));
          lineRef.current.style.height = `${p * 100}%`;
        }
      }
      MILESTONES.forEach((_, i) => {
        const titleEl = titleRefs.current[i];
        const bodyEl  = bodyRefs.current[i];
        const dotEl   = dotRefs.current[i];
        const yearEl  = yearRefs.current[i];
        if (!titleEl) return;

        const rect = titleEl.getBoundingClientRect();
        // progress 0 = element at bottom of viewport, 1 = element at 35% from top
        const p = Math.max(0, Math.min(1, (wh - rect.top) / (wh * 0.65)));

        // Title: gray → full fg
        const titleAlpha = isDark
          ? 0.18 + 0.82 * p
          : 0.2 + 0.8 * p;
        titleEl.style.color = isDark
          ? `rgba(255,255,255,${titleAlpha})`
          : `rgba(0,0,0,${titleAlpha})`;

        // Body: very gray → muted
        if (bodyEl) {
          const bodyAlpha = isDark
            ? 0.12 + 0.38 * p
            : 0.18 + 0.32 * p;
          bodyEl.style.color = isDark
            ? `rgba(255,255,255,${bodyAlpha})`
            : `rgba(0,0,0,${bodyAlpha})`;
        }

        // Dot: gray → orange
        if (dotEl) {
          if (p > 0.6) {
            dotEl.style.background = "#ff6a00";
            dotEl.style.boxShadow  = "0 0 0 3px rgba(255,106,0,0.2)";
          } else {
            dotEl.style.background = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
            dotEl.style.boxShadow  = "none";
          }
        }

        // Year label: gray → orange
        if (yearEl) {
          yearEl.style.color = p > 0.6 ? "#ff6a00" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)");
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDark]);

  return (
    <section ref={sectionRef}
      style={{ borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>

      <div className="absolute inset-0 hero-grid opacity-[0.12] pointer-events-none" />

      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 600, height: 600, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 65%)",
      }} />

      <div className="relative px-6 md:px-12 pt-24 pb-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(48px)", transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              Our Journey
            </span>
            <h2 style={{ fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-2px", lineHeight: 1.0, color: "var(--fg)", margin: 0 }}>
              From zero<br />
              <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to unstoppable.
              </span>
            </h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, maxWidth: 280, margin: 0 }}>
            Two years. Five milestones. One relentless pursuit of building brands that last.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>

          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "clamp(52px,7vw,100px)",
            top: 12, bottom: 12, width: 1,
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
          }}>
            <div ref={lineRef} style={{
              position: "absolute", top: 0, left: 0, width: "100%",
              background: "linear-gradient(180deg,#ff6a00,#ee0979)",
              height: "0%",
            }} />
          </div>

          {/* Milestone items */}
          {MILESTONES.map((m, i) => {
            const isVis = visible.has(i);
            const isLast = i === MILESTONES.length - 1;
            return (
              <div key={i} data-ms={i} style={{
                display: "grid",
                gridTemplateColumns: "clamp(52px,7vw,100px) 1fr",
                marginBottom: isLast ? 0 : "clamp(52px,8vw,96px)",
                opacity: isVis ? 1 : 0,
                transform: isVis ? "translateX(0)" : "translateX(48px)",
                transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
              }}>

                {/* Left col */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-end", paddingRight: 28, paddingTop: 4 }}>
                  <div ref={el => { dotRefs.current[i] = el; }} style={{
                    position: "absolute", right: -5, top: 10,
                    width: 10, height: 10, borderRadius: "50%",
                    background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                    border: "2px solid var(--bg)",
                    transition: "background 0.5s ease, box-shadow 0.5s ease",
                    zIndex: 2,
                  }} />
                  <span ref={el => { yearRefs.current[i] = el; }} style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                    textAlign: "right", transition: "color 0.4s ease", lineHeight: 1,
                  }}>{m.year}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, textAlign: "right" }}>{m.quarter}</span>
                </div>

                {/* Right col */}
                <div style={{ paddingLeft: "clamp(20px,3vw,48px)", position: "relative" }}>

                  {/* Ghost year bg */}
                  <div style={{
                    position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                    fontSize: "clamp(80px,12vw,160px)", fontWeight: 700,
                    color: "transparent", letterSpacing: "-4px", lineHeight: 1,
                    WebkitTextStroke: `1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                    userSelect: "none", pointerEvents: "none",
                  }}>{m.year}</div>

                  {/* Tag */}
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                    color: "#ff6a00", textTransform: "uppercase",
                    display: "inline-block", marginBottom: 12,
                  }}>{m.tag}</span>

                  {/* Title — starts gray, scroll reveals to full color */}
                  <h3 ref={el => { titleRefs.current[i] = el; }} style={{
                    fontSize: "clamp(22px,2.8vw,38px)",
                    letterSpacing: "-2px", lineHeight: 1.05,
                    color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)",
                    margin: "0 0 14px",
                  }}>{m.title}</h3>

                  {/* Body — starts very gray, scroll reveals to muted */}
                  <p ref={el => { bodyRefs.current[i] = el; }} style={{
                    fontSize: 14, lineHeight: 1.85, maxWidth: 520, margin: 0,
                    color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.18)",
                  }}>{m.body}</p>

                  {!isLast && (
                    <div style={{
                      marginTop: "clamp(28px,4vw,52px)", height: 1,
                      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Values Section ─────────────────────────────── */
const VALUES = [
  { num: "01", title: "Boldness", body: "We don't play it safe. Every brand we touch is pushed beyond the obvious — because safe is invisible.", style: "grad" },
  { num: "02", title: "Craftsmanship", body: "Every pixel, every word, every line of code is placed with intention. Mediocrity isn't an option here.", style: "fill" },
  { num: "03", title: "Transparency", body: "No smoke and mirrors. You always know where your project stands, what it costs, and why we made every call.", style: "stroke" },
  { num: "04", title: "Speed", body: "We move fast without breaking what matters. Weeks, not months. Decisions, not meetings.", style: "fill" },
  { num: "05", title: "Obsession", body: "We genuinely care more about your brand than most people care about their own. That obsession shows in the work.", style: "grad" },
  { num: "06", title: "Legacy", body: "We build for the long game — brand equity that compounds, digital products that scale, identities that last.", style: "stroke" },
];

function ValuesSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reveal = (i: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(56px)",
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${0.08 * i}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${0.08 * i}s`,
  });

  return (
    <section ref={sectionRef}
      style={{ borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>

      <div className="absolute inset-0 hero-grid opacity-[0.15] pointer-events-none" />

      <div className="relative px-6 md:px-12 pt-24 pb-20">

        {/* Header row */}
        <div style={reveal(0)} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              What Drives Us
            </span>
            <h2 style={{
              fontSize: "clamp(32px,5vw,64px)",
              letterSpacing: "-2px", lineHeight: 1.0,
              color: "var(--fg)", margin: 0,
            }}>
              Six values.<br />
              <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Zero compromise.
              </span>
            </h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, maxWidth: 300, margin: 0 }}>
            These aren&apos;t words on a wall. They&apos;re the principles that show up in every project, every call, every deliverable.
          </p>
        </div>

        {/* Card grid — 3 col on desktop, 1 on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
        }}>
          {VALUES.map((v, i) => {
            const isHovered = hovered === i;
            const isGrad = v.style === "grad";
            const isStroke = v.style === "stroke";

            return (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  ...reveal(i + 1),
                  background: isHovered
                    ? (isDark ? "rgba(255,106,0,0.06)" : "rgba(255,106,0,0.04)")
                    : "var(--bg)",
                  padding: "clamp(24px,3vw,40px)",
                  cursor: "default",
                  transition: "background 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top row: number + animated dot */}
                <div className="flex items-center justify-between mb-8">
                  <span style={{
                    fontSize: "clamp(48px,6vw,80px)", fontWeight: 700,
                    letterSpacing: "-3px", lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${isHovered ? "#ff6a00" : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")}`,
                    transition: "WebkitTextStroke 0.3s ease",
                    userSelect: "none",
                  }}>{v.num}</span>

                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: isHovered ? "#ff6a00" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"),
                    transition: "background 0.3s ease, transform 0.3s ease",
                    transform: isHovered ? "scale(1.4)" : "scale(1)",
                  }} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "clamp(18px,1.8vw,24px)",
                  letterSpacing: "-1px", lineHeight: 1.1,
                  margin: "0 0 12px",
                  ...(isGrad && isHovered ? {
                    backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  } : { color: "var(--fg)" }),
                  transition: "all 0.3s ease",
                }}>{v.title}</h3>

                {/* Body */}
                <p style={{
                  fontSize: 13, lineHeight: 1.8,
                  color: "var(--muted)", margin: 0,
                }}>{v.body}</p>

                {/* Bottom accent bar on hover */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  height: 2, borderRadius: 1,
                  background: "linear-gradient(90deg,#ff6a00,#ee0979)",
                  width: isHovered ? "100%" : "0%",
                  transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ── Ticker Section ─────────────────────────────── */
function TickerSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  const ROW1 = [
    { text: "Brand Edge", style: "fill" },
    { text: "Born to Build", style: "grad" },
    { text: "Karachi → World", style: "fill" },
    { text: "Bold by Design", style: "stroke" },
    { text: "We Build Brands", style: "fill" },
    { text: "Story-Driven Agency", style: "grad" },
    { text: "No Shortcuts", style: "stroke" },
  ];

  const ROW2 = [
    { text: "Your Vision. Our Craft.", style: "fill" },
    { text: "From Idea to Icon", style: "grad" },
    { text: "Real Results. Real Brands.", style: "fill" },
    { text: "Design That Lasts", style: "stroke" },
    { text: "Built With Obsession", style: "grad" },
    { text: "Every Pixel Counts", style: "fill" },
    { text: "Trust the Process", style: "stroke" },
  ];

  const renderItem = (item: { text: string; style: string }, i: number) => {
    const base: React.CSSProperties = {
      fontSize: "clamp(20px,2.8vw,38px)",
      fontWeight: 700,
      letterSpacing: "-0.5px",
      whiteSpace: "nowrap",
      lineHeight: 1,
    };

    let textStyle: React.CSSProperties = {};
    if (item.style === "grad") {
      textStyle = {
        backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      };
    } else if (item.style === "stroke") {
      textStyle = {
        color: "transparent",
        WebkitTextStroke: `1.5px ${isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)"}`,
      };
    } else {
      textStyle = { color: "var(--fg)" };
    }

    return (
      <span key={i} className="inline-flex items-center gap-5 px-5 shrink-0">
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff6a00", flexShrink: 0, display: "inline-block" }} />
        <span style={{ ...base, ...textStyle }} className="uppercase">{item.text}</span>
      </span>
    );
  };

  return (
    <section style={{ borderTop: "1px solid var(--border)", overflow: "hidden", height: 320, position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark
          ? "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(255,106,0,0.05) 0%, transparent 70%)"
          : "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(255,106,0,0.04) 0%, transparent 70%)",
      }} />

      {/* Row 1 — rotated -9deg, scrolls left */}
      <div style={{
        position: "absolute", top: "50%", left: "-10%", right: "-10%",
        transform: "translateY(-72%) rotate(-9deg)",
        transformOrigin: "center center",
        overflow: "hidden",
      }}>
        <div className="flex w-max marquee-left" style={{ animationDuration: "26s" }}>
          {[...ROW1, ...ROW1].map((item, i) => renderItem(item, i))}
        </div>
      </div>

      {/* Row 2 — rotated +9deg, scrolls right */}
      <div style={{
        position: "absolute", top: "50%", left: "-10%", right: "-10%",
        transform: "translateY(-28%) rotate(9deg)",
        transformOrigin: "center center",
        overflow: "hidden",
      }}>
        <div className="flex w-max" style={{ animation: "marqueeRight 30s linear infinite" }}>
          {[...ROW2, ...ROW2].map((item, i) => renderItem(item, i))}
        </div>
      </div>
    </section>
  );
}

/* ── Mission & Vision Section ───────────────────── */
const G = { backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text" as const, backgroundClip: "text" as const, WebkitTextFillColor: "transparent" as const };

const MV_DATA = [
  {
    label: "Mission",
    heading: <>To make bold, <span style={G}>measurable impact.</span></>,
    body: "We exist to help ambitious businesses cut through the noise. Every brand we build, every campaign we run, every product we ship — it all serves one goal: helping you grow faster, smarter, and with a brand that actually means something.",
    tags: ["Impact-Driven", "Results First", "Brand-Led Growth"],
  },
  {
    label: "Vision",
    heading: <>To become the world&apos;s <span style={G}>most trusted studio.</span></>,
    body: "A future where every business — from early-stage startups to global enterprises — has access to world-class design and strategy. We're building the agency we always wished existed: fearless, transparent, and obsessed with outcomes.",
    tags: ["Global Reach", "Fearless Creative", "Transparent Partnership"],
  },
  {
    label: "Strategy",
    heading: <>Built on research, <span style={G}>not guesswork.</span></>,
    body: "Every project starts with deep discovery — market analysis, competitor audits, and audience mapping. We don't guess what will work. We build the evidence, then we build the brand on top of it.",
    tags: ["Research-First", "Data-Backed", "Strategic Clarity"],
  },
  {
    label: "Culture",
    heading: <>A team that <span style={G}>obsesses over craft.</span></>,
    body: "We hire for obsession, not just skills. Every designer, developer, and strategist at Brand Edge shares one thing: an unreasonable commitment to doing things right. That's what separates good from unforgettable.",
    tags: ["Craft-Obsessed", "Always Learning", "Radically Honest"],
  },
  {
    label: "Legacy",
    heading: <>Work that <span style={G}>outlives the brief.</span></>,
    body: "We don't build campaigns. We build brands that compound — assets that appreciate over time, identities that customers love, and digital products that scale. This is what we mean by legacy.",
    tags: ["Long-Term Thinking", "Compounding Value", "Brand Equity"],
  },
];

function MissionVisionSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [outDigit, setOutDigit] = useState<string | null>(null);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll-driven step calc */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalH = el.offsetHeight - window.innerHeight;
      if (totalH <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(0.9999, scrolled / totalH);
      const newStep = Math.floor(progress * MV_DATA.length);

      if (newStep !== stepRef.current) {
        const dir = newStep > stepRef.current ? "down" : "up";
        const old = stepRef.current;
        stepRef.current = newStep;
        setDirection(dir);
        setOutDigit(String(old + 1));
        setStep(newStep);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOutDigit(null), 620);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NUM_SIZE = "clamp(130px,23vw,320px)";
  const STROKE = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";

  const TAG: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 999,
    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    color: "var(--fg)",
    letterSpacing: "0.02em", display: "inline-block",
    backdropFilter: "blur(8px)",
  };

  const curDigit = String(step + 1);
  const data = MV_DATA[step];
  const inAnim = direction === "down" ? "digitInDown" : "digitInUp";
  const outAnim = direction === "down" ? "digitOutUp" : "digitOutDown";
  const contAnim = direction === "down" ? "mvContentInRight" : "mvContentInLeft";
  const EASE_IN = "0.6s cubic-bezier(0.16,1,0.3,1) forwards";
  const EASE_OUT = "0.45s cubic-bezier(0.4,0,0.6,1) forwards";

  return (
    /* Tall section — scroll drives the steps */
    <section ref={sectionRef}
      style={{ height: `${MV_DATA.length * 100}vh`, position: "relative", borderTop: "1px solid var(--border)" }}>

      {/* Sticky viewport-height panel */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />

        <div style={{
          height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 clamp(24px,6vw,88px)",
        }}>

          {/* Two-col */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-0">

            {/* LEFT — "0" static + animated digit */}
            <div style={{ display: "flex", alignItems: "flex-start", userSelect: "none" }}>

              {/* Static zero */}
              <span style={{
                fontSize: NUM_SIZE, fontWeight: 700, lineHeight: 0.85,
                letterSpacing: "-6px", color: "transparent",
                WebkitTextStroke: `2px ${STROKE}`, flexShrink: 0,
              }}>0</span>

              {/* Slot — clips sliding digit */}
              <div style={{
                fontSize: NUM_SIZE, fontWeight: 700, lineHeight: 0.85,
                letterSpacing: "-6px",
                position: "relative", overflow: "hidden",
                width: "0.62em", flexShrink: 0,
              }}>
                {/* Exiting */}
                {outDigit && (
                  <span style={{
                    position: "absolute", top: 0, left: 0,
                    color: "transparent", WebkitTextStroke: `2px ${STROKE}`,
                    animation: `${outAnim} ${EASE_OUT}`,
                  }}>{outDigit}</span>
                )}
                {/* Entering */}
                <span key={curDigit} style={{
                  display: "block",
                  color: "transparent", WebkitTextStroke: `2px ${STROKE}`,
                  animation: `${inAnim} ${EASE_IN}`,
                }}>{curDigit}</span>
              </div>
            </div>

            {/* RIGHT — content */}
            <div key={step} style={{ animation: `${contAnim} ${EASE_IN}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 20 }}>
                {data.label}
              </p>
              <h3 style={{
                fontSize: "clamp(26px,3.6vw,50px)",
                letterSpacing: "-1.5px", lineHeight: 1.05,
                color: "var(--fg)", margin: "0 0 20px",
              }}>
                {data.heading}
              </h3>
              <p style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "var(--muted)", lineHeight: 1.85, maxWidth: 440, margin: "0 0 28px" }}>
                {data.body}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {data.tags.map(t => <span key={t} style={TAG}>{t}</span>)}
              </div>

              {/* Step dots */}
              <div className="flex items-center gap-2">
                {MV_DATA.map((_, i) => (
                  <div key={i} style={{
                    height: 6, borderRadius: 999,
                    width: i === step ? 22 : 6,
                    background: i === step ? "#ff6a00" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"),
                    transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 44 }}>
            <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            <div style={{
              height: 1, marginTop: -1,
              background: "linear-gradient(90deg,#ff6a00,#ee0979)",
              width: `${((step + 1) / MV_DATA.length) * 100}%`,
              transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>

        </div>
      </div>
    </section>
  );
}




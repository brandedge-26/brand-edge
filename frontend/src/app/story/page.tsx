"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";

const CELL = 44;

const WORDS = [
  { text: "Authentic",  gradient: "linear-gradient(135deg, #ff6a00, #ee0979)" },
  { text: "Bold",       gradient: "linear-gradient(135deg, #c026d3, #7c3aed)" },
  { text: "Purposeful", gradient: "linear-gradient(135deg, #16a34a, #0891b2)" },
  { text: "Daring",     gradient: "linear-gradient(135deg, #0891b2, #7c3aed)" },
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

      </div>
    </>
  );
}

/* ── Ticker Section ─────────────────────────────── */
function TickerSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  const ROW1 = [
    { text: "Brand Edge",           style: "fill" },
    { text: "Born to Build",        style: "grad" },
    { text: "Karachi → World",      style: "fill" },
    { text: "Bold by Design",       style: "stroke" },
    { text: "We Build Brands",      style: "fill" },
    { text: "Story-Driven Agency",  style: "grad" },
    { text: "No Shortcuts",         style: "stroke" },
  ];

  const ROW2 = [
    { text: "Your Vision. Our Craft.",   style: "fill" },
    { text: "From Idea to Icon",         style: "grad" },
    { text: "Real Results. Real Brands.", style: "fill" },
    { text: "Design That Lasts",         style: "stroke" },
    { text: "Built With Obsession",      style: "grad" },
    { text: "Every Pixel Counts",        style: "fill" },
    { text: "Trust the Process",         style: "stroke" },
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
  const inAnim  = direction === "down" ? "digitInDown"  : "digitInUp";
  const outAnim = direction === "down" ? "digitOutUp"   : "digitOutDown";
  const contAnim = direction === "down" ? "mvContentInRight" : "mvContentInLeft";
  const EASE_IN  = "0.6s cubic-bezier(0.16,1,0.3,1) forwards";
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




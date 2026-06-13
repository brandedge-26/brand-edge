"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const CELL = 44;

const WORDS = [
  { text: "Stand Out",   gradient: "linear-gradient(135deg, #ff6a00, #ee0979)" },
  { text: "Dominate",    gradient: "linear-gradient(135deg, #c026d3, #7c3aed)" },
  { text: "Grow Fast",   gradient: "linear-gradient(135deg, #16a34a, #0891b2)" },
  { text: "Shine Bright",gradient: "linear-gradient(135deg, #0891b2, #7c3aed)" },
  { text: "Win Big",     gradient: "linear-gradient(135deg, #d97706, #ff6a00)" },
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

export default function HeroSection({ theme }: { theme: "dark" | "light" }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const wordIdxRef = useRef(0);

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
          <span className="text-[13px] font-medium text-[var(--fg)] tracking-wide">The Future of Design</span>
        </div>

        <h1 className="text-[clamp(40px,6vw,86px)] leading-[1.06] tracking-tighter text-[var(--fg)] m-0 mb-5">
          Building Brands That{" "}
          {/* Cycling word — chip style like GoodbyeSection */}
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
        </h1>

        <p className="font-normal text-[clamp(14px,1.3vw,17px)] text-[var(--fg)] opacity-60 leading-relaxed max-w-lg mb-10">
          To become a trusted partner for businesses worldwide, helping them build a lasting digital presence and strong brand identities.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center pointer-events-auto">
          {/* Primary CTA */}
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

          {/* Secondary CTA */}
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
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">View Portfolio</span>
              <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">View Portfolio</span>
            </span>
            <ArrowRight size={13} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}

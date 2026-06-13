"use client";

import { useState, useEffect, useRef } from "react";

const WORDS = [
  "We", "are", "Brand", "Edge", "—", "a", "full-service", "creative",
  "agency", "built", "by", "designers,", "strategists,", "and", "engineers",
  "obsessed", "with", "results.", "We", "don't", "just", "build", "brands,",
  "we", "build", "businesses", "that", "grow", "faster", "and", "last", "longer.",
];

export default function AboutSection({ theme }: { theme: "dark" | "light" }) {
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
    <section ref={containerRef} style={{ height: "280vh", borderTop: "1px solid var(--border)" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-16 overflow-hidden">

        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
            About Us
          </span>
        </div>

        <p className="text-center leading-[1.15] max-w-5xl mx-auto"
          style={{ fontSize: "clamp(28px, 4.5vw, 62px)", letterSpacing: "-2px" }}>
          {WORDS.map((word, i) => {
            const wordProgress = WORDS.length * progress;
            const filled = wordProgress >= i + 1;
            const partial = !filled && wordProgress > i ? wordProgress - i : 0;
            const isBrand = word === "Brand" || word === "Edge";
            const opacity = filled ? 1 : partial > 0 ? 0.15 + partial * 0.85 : 0.12;

            return (
              <span key={i} style={{
                display: "inline",
                transition: "opacity 0.15s ease",
                opacity,
                ...(isBrand && filled ? {
                  backgroundImage: "linear-gradient(135deg, #ff6a00, #ee0979)",
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent", color: "transparent",
                } : { color: "var(--fg)" }),
              }}>
                {word}{" "}
              </span>
            );
          })}
        </p>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: progress < 0.1 ? 1 : 0 }}>
          <span className="text-[11px] tracking-widest uppercase text-[var(--muted)]">Scroll</span>
          <div className="w-px h-8 bg-[var(--border)]" style={{ animation: "seg-down 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

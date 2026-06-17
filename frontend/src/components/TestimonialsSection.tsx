"use client";

import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

const ROW1 = [
  { type: "quote" as const, text: "Brand Edge completely transformed our online presence. Our conversion rate went up 3x within two months of launch.", name: "Sarah K.", role: "CEO at NovaTech", initial: "S", w: 360 },
  { type: "img"   as const, src: "/home/client-review-1.avif", stat: "3X",  label: "More projects delivered", w: 440 },
  { type: "quote" as const, text: "I've tried multiple agencies but Brand Edge stands out — the attention to detail and speed of delivery is unmatched.", name: "William Harris", role: "Founder & CEO", initial: "W", w: 360 },
  { type: "quote" as const, text: "From strategy to execution, the Brand Edge team delivered beyond expectations. Highly recommend.", name: "Priya Singh", role: "CMO, BrightLoop", initial: "P", w: 360 },
];

const ROW2 = [
  { type: "img"   as const, src: "/home/client-review-2.avif", stat: "98%", label: "Client satisfaction rate", w: 440 },
  { type: "quote" as const, text: "Thanks to Brand Edge's marketing strategy, our lead generation doubled in the first month alone.", name: "Matthew Brooks", role: "Founder & CEO, FlowApp", initial: "M", w: 360 },
  { type: "quote" as const, text: "We integrated Brand Edge last quarter and they generated incredible ROI by identifying the right growth channels automatically. Truly a game-changer.", name: "Daniel Parker", role: "CMO, GrowthLab", initial: "D", w: 400 },
  { type: "img"   as const, src: "/home/client-review-1.avif", stat: "50+", label: "Brands launched", w: 400 },
];

type Card = typeof ROW1[number] | typeof ROW2[number];

function renderCard(card: Card, key: string) {
  if (card.type === "img") {
    return (
      <div key={key} className="shrink-0 rounded-none overflow-hidden flex flex-col justify-end relative"
        style={{ width: card.w, minHeight: 220, border: "1px solid var(--border)" }}>
        <img src={card.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 p-6" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.78) 0%,transparent 100%)" }}>
          <p className="font-bold text-white leading-none" style={{ fontSize: 52, letterSpacing: -3 }}>{card.stat}</p>
          <p className="text-[13px] text-white/70 font-medium mt-1">{card.label}</p>
        </div>
      </div>
    );
  }
  return (
    <div key={key} className="shrink-0 rounded-none p-7 flex flex-col justify-between gap-6"
      style={{ width: card.w, minHeight: 220, background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-col gap-4">
        <Quote size={24} style={{ color: "var(--border)" }} />
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--fg)", opacity: 0.85 }}>{card.text}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 text-white"
          style={{ background: "linear-gradient(135deg,#ff8c30,#d94400)" }}>{card.initial}</div>
        <div>
          <p className="text-[13px] font-bold" style={{ color: "var(--fg)" }}>{card.name}</p>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>{card.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ theme }: { theme: "dark" | "light" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const maxXRef = useRef(0);

  useEffect(() => {
    const computeMax = () => {
      if (!row1Ref.current) return;
      maxXRef.current = row1Ref.current.scrollWidth / 2;
    };
    computeMax();
    window.addEventListener("resize", computeMax);

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      const x = maxXRef.current;
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${-p * x}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${(p - 1) * x}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("resize", computeMax);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "350vh", position: "relative", borderTop: "1px solid var(--border)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", gap: 48, background: "var(--bg)" }}>

        <div className="flex flex-col items-center gap-4 px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
            Client Reviews
          </span>
          <h2 className="tracking-tighter text-center" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, color: "var(--fg)" }}>
            What our clients say{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
              about us
            </span>
          </h2>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", gap: 16, overflow: "hidden",
          maskImage: "linear-gradient(to right,transparent 0%,black 6%,black 94%,transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 6%,black 94%,transparent 100%)",
        }}>
          <div ref={row1Ref} style={{ display: "flex", gap: 16, width: "max-content", willChange: "transform" }}>
            {[...ROW1, ...ROW1].map((c, i) => renderCard(c, `r1-${i}`))}
          </div>
          <div ref={row2Ref} style={{ display: "flex", gap: 16, width: "max-content", willChange: "transform" }}>
            {[...ROW2, ...ROW2].map((c, i) => renderCard(c, `r2-${i}`))}
          </div>
        </div>

      </div>
    </div>
  );
}

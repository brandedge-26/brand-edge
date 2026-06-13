"use client";

import { ArrowRight } from "lucide-react";

const TAGS = [
  { text: "Startups",   gradient: "linear-gradient(90deg,#ff6a00,#ee0979)" },
  { text: "Scale-ups",  gradient: "linear-gradient(90deg,#f7971e,#ffd200)" },
  { text: "D2C Brands", gradient: "linear-gradient(90deg,#8A43E1,#D511FD)" },
  { text: "SaaS",       gradient: "linear-gradient(90deg,#ee0979,#ff6a00)" },
  { text: "Agencies",   gradient: "linear-gradient(90deg,#EF7B16,#8A43E1)" },
  { text: "Founders",   gradient: "linear-gradient(90deg,#f7971e,#ee0979)" },
];

export default function ReadyToGrow({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <section className="w-full relative overflow-hidden mt-10"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,106,0,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">

          {/* Left copy */}
          <div className="flex flex-col gap-6 md:max-w-[58%]">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0 inline-block" />
              Ready to grow?
            </span>
            <h2 className="text-[var(--fg)] leading-[1.0]" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-2px" }}>
              Let&apos;s build{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                something
              </span>
              <br />great together.
            </h2>
            <p className="text-[var(--muted)] text-[15px] leading-relaxed" style={{ maxWidth: "420px" }}>
              Book a free strategy call and see how Brand Edge can take your brand to the next level.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-8 md:items-end">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[var(--fg)]" style={{ fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-2px", lineHeight: 1 }}>50+</p>
                <p className="text-[12px] text-[var(--muted)] font-medium tracking-wide uppercase mt-1">Brands Launched</p>
              </div>
              <div style={{ width: "1px", height: "48px", background: "var(--border)" }} />
              <div className="text-center">
                <p className="text-[var(--fg)]" style={{ fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-2px", lineHeight: 1 }}>98%</p>
                <p className="text-[12px] text-[var(--muted)] font-medium tracking-wide uppercase mt-1">Client Retention</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                className="group inline-flex items-center gap-2 h-[52px] pl-6 pr-2 rounded-full border-none cursor-pointer transition-all duration-200"
                style={{ background: "#ff6a00", boxShadow: "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.12)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 36px rgba(255,106,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
              >
                <span className="relative overflow-hidden inline-flex flex-col text-white font-bold text-sm" style={{ height: "1.2em" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Book a Free Call</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Book a Free Call</span>
                </span>
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ArrowRight size={12} stroke="#ff6a00" strokeWidth={2} />
                </span>
              </button>
              <a href="#" className="h-[52px] px-6 rounded-full font-semibold text-sm flex items-center no-underline transition-all duration-200 hover:scale-[1.03]"
                style={{ border: "1px solid var(--border)", color: "var(--fg)", background: "transparent" }}>
                View Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Bottom tag pills */}
        <div className="mt-16 pt-8 overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--muted)] shrink-0">We work with</span>
            {TAGS.map(tag => (
              <span key={tag.text} className="inline-flex items-center gap-2 rounded-full shrink-0" style={{
                padding: "6px 14px",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tag.gradient }} />
                <span className="text-[11px] font-bold" style={{ backgroundImage: tag.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                  {tag.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

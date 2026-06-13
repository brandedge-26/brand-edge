"use client";

import { useState } from "react";

const FAQS = [
  { q: "What services does Brand Edge offer?",       a: "We offer end-to-end creative and digital services — brand strategy, website design, app development, custom software, graphic design, and performance marketing. Think of us as your full-stack growth partner." },
  { q: "How long does a typical project take?",      a: "It depends on scope. A landing page takes 1–2 weeks; a full brand identity 2–4 weeks; a web app 6–12 weeks. We share a clear timeline on day one so you always know where things stand." },
  { q: "Do you work with early-stage startups?",     a: "Absolutely. Some of our best work has been with founders at the idea stage. We're used to moving fast with lean budgets and helping you get to market before you run out of runway." },
  { q: "What does the onboarding process look like?",a: "We kick off with a free strategy call to understand your goals. From there we send a proposal, agree on scope and timeline, and get started within days — no months-long sales cycles." },
  { q: "Can Brand Edge handle ongoing retainer work?",a: "Yes. Many clients start with a project and then move to a monthly retainer for continued design, development, or marketing support. We flex to fit your needs." },
  { q: "How do you measure success?",               a: "We tie deliverables to metrics that matter — conversion rates, user retention, page performance, CAC/LTV. Every project ends with a results review so you can see exactly what moved the needle." },
];

export default function FAQSection({ theme }: { theme: "dark" | "light" }) {
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="w-full relative" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              FAQ
            </span>
            <h2 className="text-[var(--fg)] leading-[1.05] tracking-tighter" style={{ fontSize: "clamp(30px,4vw,52px)" }}>
              Got questions?<br />
              <span style={{ backgroundImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                We&apos;ve got answers.
              </span>
            </h2>
          </div>
          <p className="text-[var(--muted)] text-[14px] leading-relaxed md:max-w-[300px] md:text-right">
            Still have questions? Book a free call and we&apos;ll walk you through everything.
          </p>
        </div>

        <div className="flex flex-col">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  className="w-full flex items-center justify-between gap-6 text-left cursor-pointer border-none transition-all duration-200"
                  style={{
                    background: isOpen ? "transparent" : hovered === i ? (theme === "dark" ? "rgba(255,106,0,0.04)" : "rgba(255,106,0,0.03)") : "transparent",
                    borderRadius: "12px", padding: "24px 16px", margin: "0 -16px", width: "calc(100% + 32px)",
                  }}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="relative overflow-hidden inline-flex flex-col text-[17px] md:text-[25px] tracking-tighter" style={{ height: "1.35em" }}>
                    {(() => {
                      const active = hovered === i || isOpen;
                      const gradientStyle = active ? {
                        background: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
                        WebkitBackgroundClip: "text" as const,
                        WebkitTextFillColor: "transparent" as const,
                        backgroundClip: "text" as const,
                      } : { color: "var(--fg)" };
                      return (
                        <>
                          <span className={`transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] leading-snug${active ? " -translate-y-full" : ""}`} style={gradientStyle}>{faq.q}</span>
                          <span className={`absolute top-0 left-0 leading-snug transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]${active ? " translate-y-0" : " translate-y-full"}`} style={gradientStyle}>{faq.q}</span>
                        </>
                      );
                    })()}
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: isOpen ? "#ff6a00" : "var(--surface)", border: "1px solid var(--border)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke={isOpen ? "white" : "var(--fg)"} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}>
                  <p className="text-[14px] leading-relaxed pb-6" style={{ color: "var(--muted)" }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}

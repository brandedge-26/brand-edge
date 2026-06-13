"use client";

import { ArrowRight } from "lucide-react";

const STEPS = [
  { step: "01", tag: "Discover", title: "Deep-dive discovery",    desc: "We research your brand, goals, audience, and competitors to build a bulletproof strategy foundation." },
  { step: "02", tag: "Design",   title: "Pixel-perfect design",   desc: "Our designers craft visuals that align with your brand identity and conversion goals." },
  { step: "03", tag: "Build",    title: "Clean, scalable code",   desc: "Developers bring every design to life with fast, maintainable code and seamless integrations." },
  { step: "04", tag: "Launch",   title: "Ship & monitor",         desc: "We deploy, test, and watch closely — ensuring everything performs flawlessly from day one." },
];

export default function OurProcess({ theme }: { theme: "dark" | "light" }) {
  return (
    <section className="w-full py-24 px-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left sticky heading */}
          <div className="lg:w-[340px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              Our Process
            </span>
            <h2 className="tracking-tighter text-[var(--fg)]" style={{ fontSize: "clamp(30px,3.5vw,50px)", lineHeight: 1.1 }}>
              How we bring your{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg, #ff6a00, #ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                brand
              </span>
              {" "}to life,<br />step by step
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
              A proven four-step process built to deliver results — on time, every time.
            </p>
            <button
              className="group inline-flex items-center gap-2.5 self-start px-5 h-[44px] rounded-full font-bold text-[13px] text-white mt-2"
              style={{ background: "linear-gradient(150deg,#ff8c30,#d94400)", boxShadow: "0 4px 20px rgba(255,106,0,0.3)", transition: "filter 0.25s ease, box-shadow 0.25s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.45)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(255,106,0,0.3)"; }}
            >
              <span className="relative overflow-hidden inline-flex flex-col" style={{ height: "1.2em" }}>
                <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Start Your Project</span>
                <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Start Your Project</span>
              </span>
              <ArrowRight size={13} stroke="white" strokeWidth={2} />
            </button>
          </div>

          {/* Right steps */}
          <div className="flex-1 flex flex-col relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px hidden lg:block" style={{ background: "var(--border)" }} />
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-6 lg:gap-8 pb-10"
                style={{ borderBottom: i < STEPS.length - 1 ? "1px solid var(--border)" : "none", marginBottom: i < STEPS.length - 1 ? "40px" : "0" }}>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] relative z-10 shrink-0"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--fg)" }}>
                    {s.step}
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-1.5">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: "#ff6a00" }}>{s.tag}</span>
                  <p className="text-[var(--fg)] tracking-tighter" style={{ fontSize: "clamp(18px,2vw,24px)", lineHeight: 1.2 }}>{s.title}</p>
                  <p className="text-[14px] leading-relaxed max-w-lg" style={{ color: "var(--muted)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

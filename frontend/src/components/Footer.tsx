"use client";

import { useState } from "react";
import { Camera, Briefcase, X as XIcon, Globe } from "lucide-react";

function FooterBrand() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chars = "Brand Edge Creations".split("");

  return (
    <div style={{ fontSize: "clamp(28px,7vw,112px)", fontWeight: 700, letterSpacing: "-3px", lineHeight: 0.9, whiteSpace: "nowrap", display: "block" }}
      onMouseLeave={() => setHoverIdx(null)}>
      {chars.map((char, i) => {
        const dist = hoverIdx !== null ? Math.abs(i - hoverIdx) : Infinity;
        const fillOpacity = dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.2 : 0;
        const displayChar = char === " " ? "\u00A0" : char;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block" }} onMouseEnter={() => char !== " " && setHoverIdx(i)}>
            <span style={{ display: "inline-block", color: "transparent", WebkitTextStroke: "1.5px rgba(255,106,0,0.22)", opacity: 1 - fillOpacity, transition: "opacity 0.18s ease", userSelect: "none" }}>
              {displayChar}
            </span>
            <span style={{ position: "absolute", top: 0, left: 0, display: "inline-block", whiteSpace: "nowrap", background: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: fillOpacity, transition: "opacity 0.18s ease", pointerEvents: "none", userSelect: "none" }}>
              {displayChar}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Footer({ theme }: { theme: "dark" | "light" }) {
  return (
    <footer className="w-full relative overflow-hidden" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="w-full overflow-hidden px-6 pt-12 pb-0">
        <FooterBrand />
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "0 24px" }} />

      <div className="max-w-none px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ff6a00] flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
                </svg>
              </div>
              <span className="font-bold text-[15px] text-[var(--fg)]">Brand Edge</span>
            </div>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed" style={{ maxWidth: "240px" }}>
              A full-service creative agency building bold brands and digital experiences that drive real growth.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {[
                { label: "Instagram",  icon: Camera },
                { label: "LinkedIn",   icon: Briefcase },
                { label: "Twitter/X",  icon: XIcon },
                { label: "Dribbble",   icon: Globe },
              ].map(({ label, icon: Icon }) => (
                <a key={label} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ border: "1px solid var(--border)", background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#ff6a00"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ff6a00"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
                  aria-label={label}>
                  <Icon size={14} style={{ color: "var(--fg)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold text-[var(--fg)] uppercase tracking-[0.18em] mb-1">Services</p>
            {["Marketing", "Website Design", "App Development", "Software Dev", "Graphic Design"].map(l => (
              <a key={l} href="#" className="text-[13px] text-[var(--muted)] no-underline transition-colors duration-150 hover:text-[#ff6a00]">{l}</a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold text-[var(--fg)] uppercase tracking-[0.18em] mb-1">Company</p>
            {["About Us", "Our Work", "Blog", "Careers", "Privacy Policy"].map(l => (
              <a key={l} href="#" className="text-[13px] text-[var(--muted)] no-underline transition-colors duration-150 hover:text-[#ff6a00]">{l}</a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold text-[var(--fg)] uppercase tracking-[0.18em] mb-1">Contact</p>
            <div className="flex flex-col gap-3 text-[13px]">
              <div>
                <p className="font-semibold text-[var(--fg)]">Available Mon–Sat</p>
                <p className="text-[var(--muted)]">10am – 7pm PKT</p>
              </div>
              <a href="mailto:hello@brandedge.co" className="text-[var(--muted)] no-underline hover:text-[#ff6a00] transition-colors duration-150">hello@brandedge.co</a>
              <a href="tel:+923001234567" className="text-[var(--muted)] no-underline hover:text-[#ff6a00] transition-colors duration-150">+92 300 123 4567</a>
              <p className="text-[var(--muted)]">Karachi, Pakistan</p>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[12px] text-[var(--muted)]">© 2025 Brand Edge. All rights reserved.</p>
        <p className="text-[12px] text-[var(--muted)]">Crafted with care — built to perform.</p>
      </div>
    </footer>
  );
}

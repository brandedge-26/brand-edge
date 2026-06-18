"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const CELL = 44;

const ROLES = [
  { text: "Designers",   gradient: "linear-gradient(135deg, #ff6a00, #ee0979)" },
  { text: "Developers",  gradient: "linear-gradient(135deg, #c026d3, #7c3aed)" },
  { text: "Strategists", gradient: "linear-gradient(135deg, #16a34a, #0891b2)" },
  { text: "Creators",    gradient: "linear-gradient(135deg, #0891b2, #7c3aed)" },
  { text: "Builders",    gradient: "linear-gradient(135deg, #d97706, #ff6a00)" },
];


const TEAM = [
  { num: "01", name: "Muhammad Ubaid Khan", role: "Founder & CEO",            tags: "Vision · Brand Strategy",          grad: "linear-gradient(135deg,#ff6a00,#ee0979)", imgBg: "linear-gradient(145deg,#1a0800,#3d1200,#ff6a00)", initials: "MU", photo: "/profiles/ubaid.png",  female: false, linkedin: "https://pk.linkedin.com/in/ubaid-khan-a362222a6" },
  { num: "02", name: "Saghar Hassan",       role: "Creative Director",         tags: "Art Direction · Brand Identity",    grad: "linear-gradient(135deg,#c026d3,#7c3aed)", imgBg: "linear-gradient(145deg,#120020,#2d0050,#c026d3)", initials: "SH", photo: "/profiles/sagar.png", female: false, linkedin: "#" },
  { num: "03", name: "Syed Asif Shah",      role: "Senior Developer",          tags: "Next.js · System Architecture",     grad: "linear-gradient(135deg,#0891b2,#7c3aed)", imgBg: "linear-gradient(145deg,#000d1a,#001f3f,#0891b2)", initials: "SA", photo: "/profiles/asif.avif", female: false, linkedin: "#" },
  { num: "04", name: "Zaira Hussain",       role: "Full Stack Developer",      tags: "React · Node.js · APIs",            grad: "linear-gradient(135deg,#06b6d4,#3b82f6)", imgBg: "linear-gradient(145deg,#001020,#002040,#06b6d4)", initials: "ZH", photo: null as string | null, female: true,  linkedin: "#" },
  { num: "05", name: "Muhammad Hammad",     role: "Backend Developer",         tags: "Node.js · Databases · APIs",        grad: "linear-gradient(135deg,#16a34a,#0891b2)", imgBg: "linear-gradient(145deg,#001a0a,#003d18,#16a34a)", initials: "MH", photo: null as string | null, female: false, linkedin: "#" },
  { num: "06", name: "Aniq Raza",           role: "Senior Graphic Designer",   tags: "Brand Design · Visual Identity",    grad: "linear-gradient(135deg,#ff6a00,#c026d3)", imgBg: "linear-gradient(145deg,#1a0010,#3d0025,#c026d3)", initials: "AR", photo: "/profiles/aniq.jpg",  female: false, linkedin: "#" },
  { num: "07", name: "Khizar Mughal",       role: "Graphic Designer",          tags: "UI Design · Illustration",          grad: "linear-gradient(135deg,#d97706,#ff6a00)", imgBg: "linear-gradient(145deg,#1a0e00,#3d2200,#d97706)", initials: "KM", photo: null as string | null, female: false, linkedin: "#" },
  { num: "08", name: "Umaima Malik",        role: "Video Editor",              tags: "Motion · Post Production",          grad: "linear-gradient(135deg,#ee0979,#7c3aed)", imgBg: "linear-gradient(145deg,#1a0010,#3d0025,#ee0979)", initials: "UM", photo: null as string | null, female: true,  linkedin: "#" },
  { num: "09", name: "Muhammad Luqman Ali", role: "Social Media Manager",      tags: "Content Strategy · Growth",         grad: "linear-gradient(135deg,#3b82f6,#0891b2)", imgBg: "linear-gradient(145deg,#000d1a,#001840,#3b82f6)", initials: "ML", photo: null as string | null, female: false, linkedin: "#" },
  { num: "10", name: "Ahsan Khan",          role: "Digital Marketer",          tags: "SEO · Paid Media · Analytics",      grad: "linear-gradient(135deg,#22c55e,#16a34a)", imgBg: "linear-gradient(145deg,#001a08,#003315,#22c55e)", initials: "AK", photo: null as string | null, female: false, linkedin: "#" },
  { num: "11", name: "Syed Abdullah",       role: "Sales Executive",           tags: "Client Relations · BD",             grad: "linear-gradient(135deg,#f59e0b,#ff6a00)", imgBg: "linear-gradient(145deg,#1a0e00,#3d2200,#f59e0b)", initials: "SA", photo: null as string | null, female: false, linkedin: "#" },
  { num: "12", name: "Ziyan Siddique",      role: "Sales Executive",           tags: "Lead Gen · Partnerships",           grad: "linear-gradient(135deg,#8b5cf6,#c026d3)", imgBg: "linear-gradient(145deg,#0d0020,#200040,#8b5cf6)", initials: "ZS", photo: null as string | null, female: false, linkedin: "#" },
  { num: "13", name: "Ayan Kamran",         role: "Sales Executive",           tags: "Business Dev · Client Success",     grad: "linear-gradient(135deg,#06b6d4,#3b82f6)", imgBg: "linear-gradient(145deg,#000d20,#001840,#06b6d4)", initials: "AY", photo: null as string | null, female: false, linkedin: "#" },
];

const STATS = [
  { target: 13,  suffix: "+", label: "Team Members" },
  { target: 5,   suffix: "+", label: "Years Together" },
  { target: 200, suffix: "+", label: "Projects Shipped" },
  { target: 98,  suffix: "%", label: "Client Satisfaction" },
];

function FemaleAvatar({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      {/* Hair */}
      <path d="M18 34 Q18 14 36 12 Q54 14 54 34 Q54 22 46 18 Q42 26 36 26 Q30 26 26 18 Q18 22 18 34Z" fill="rgba(255,255,255,0.4)" />
      {/* Head */}
      <circle cx="36" cy="31" r="14" fill="rgba(255,255,255,0.25)" />
      {/* Neck */}
      <rect x="32" y="43" width="8" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
      {/* Dress/body */}
      <path d="M14 72 Q18 52 28 50 Q32 55 36 55 Q40 55 44 50 Q54 52 58 72Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

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


function TeamSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tappedIdx, setTappedIdx] = useState<number | null>(null);
  const mouseRef = useRef({ x: -400, y: -400 });
  const lerpRef = useRef({ x: -400, y: -400 });
  const rafRef = useRef<number>(0);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      lerpRef.current.x = lerp(lerpRef.current.x, mouseRef.current.x, 0.1);
      lerpRef.current.y = lerp(lerpRef.current.y, mouseRef.current.y, 0.1);
      if (floatRef.current)
        floatRef.current.style.transform = `translate(${lerpRef.current.x + 28}px, ${lerpRef.current.y - 130}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <section style={{ borderTop: "1px solid var(--border)" }}>

      {/* Header */}
      <div className="max-w-6xl mx-auto pt-20 pb-12 px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0 inline-block" />
            The People
          </span>
          <h2 className="text-[var(--fg)]" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-2px", lineHeight: 1.05 }}>
            Faces behind{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
              the work
            </span>
          </h2>
        </div>
        <p className="text-[var(--muted)] text-[14px] leading-relaxed md:text-right" style={{ maxWidth: "280px" }}>
          Small team. Massive output. Every person owns their craft end-to-end.
        </p>
      </div>

      {/* ── Mobile Cards Grid ── */}
      <div className="md:hidden" style={{ borderTop: "1px solid var(--border)", padding: "24px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {TEAM.map((member) => (
          <div key={member.num} style={{ border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Image area */}
            <div style={{ height: 160, position: "relative", overflow: "hidden", background: member.photo ? "#111" : member.imgBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", position: "absolute", inset: 0 }} />
              ) : member.female ? (
                <FemaleAvatar size={80} />
              ) : (
                <>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(24px)" }} />
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>{member.initials}</span>
                  </div>
                </>
              )}
              {/* Number badge */}
              <span style={{ position: "absolute", top: 8, left: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.35)", padding: "2px 6px" }}>
                {member.num}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--fg)", lineHeight: 1.3, letterSpacing: "-0.3px" }}>{member.name}</p>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.3 }}>{member.role}</p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#0a66c2", textDecoration: "none", border: "1px solid #0a66c2", padding: "4px 8px", alignSelf: "flex-start" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* List rows — desktop only */}
      <div className="hidden md:block" style={{ borderTop: "1px solid var(--border)" }}>
        {TEAM.map((member, i) => {
          const isHovered = hoveredIdx === i;
          const isTapped = tappedIdx === i;
          const isActive = isHovered || isTapped;

          return (
            <div key={member.num} className="relative"
              style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onTouchEnd={e => { e.preventDefault(); setTappedIdx(isTapped ? null : i); }}
            >
              {/* Row bg */}
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ background: "var(--surface)", opacity: isActive ? 1 : 0 }} />

              <div className="relative flex items-center gap-4 md:gap-10 px-6 py-5 md:px-10 md:py-7">
                {/* Number */}
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase shrink-0 w-7 transition-colors duration-300"
                  style={{ color: isActive ? "#ff6a00" : "var(--muted)" }}>
                  {member.num}
                </span>

                {/* Name — slide up reveal */}
                <div className="flex-1 relative overflow-hidden" style={{ height: "clamp(30px,4.8vw,62px)" }}>
                  <h3 className="absolute inset-0 flex items-center text-[var(--fg)]" style={{
                    fontSize: "clamp(22px,3.8vw,52px)", letterSpacing: "-2px",
                    transform: isActive ? "translateY(-110%)" : "translateY(0%)",
                    transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
                  }}>{member.name}</h3>
                  <h3 className="absolute inset-0 flex items-center" style={{
                    fontSize: "clamp(22px,3.8vw,52px)", letterSpacing: "-2px",
                    backgroundImage: member.grad,
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent", color: "transparent",
                    transform: isActive ? "translateY(0%)" : "translateY(110%)",
                    transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
                  }}>{member.name}</h3>
                </div>

                {/* Role + tags */}
                <div className="team-member-role hidden md:flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300"
                    style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}>
                    {member.role}
                  </span>
                  <span className="text-[10px] tracking-[0.1em] uppercase transition-colors duration-300"
                    style={{ color: isActive ? "var(--muted)" : "transparent" }}>
                    {member.tags}
                  </span>
                </div>

                {/* LinkedIn */}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="shrink-0 transition-all duration-300 hidden md:flex items-center justify-center"
                    style={{
                      width: 32, height: 32,
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: isActive ? "#0a66c2" : "var(--muted)",
                      borderColor: isActive ? "#0a66c2" : "var(--border)",
                      transition: "color 0.2s, border-color 0.2s",
                    }}
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}

                {/* Arrow */}
                <div className="shrink-0 transition-all duration-300"
                  style={{ transform: isActive ? "translate(3px,-3px)" : "translate(0,0)", color: isActive ? "#ff6a00" : "var(--muted)" }}>
                  <ArrowUpRight size={18} strokeWidth={1.8} />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating cursor image — lerp follows mouse */}
      <div ref={floatRef} style={{
        position: "fixed", top: 0, left: 0,
        width: "260px", height: "200px",
        borderRadius: "16px", overflow: "hidden",
        pointerEvents: "none", zIndex: 9998,
        opacity: hoveredIdx !== null ? 1 : 0,
        transition: "opacity 0.25s ease",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
        willChange: "transform",
      }}>
        {TEAM.map((member, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            background: member.photo ? "transparent" : member.imgBg,
            opacity: hoveredIdx === i ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {member.photo ? (
              /* Real photo */
              <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <>
                {/* Glow */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 120, height: 120, borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  filter: "blur(30px)",
                }} />
                {/* Avatar */}
                {member.female ? (
                  <FemaleAvatar size={80} />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{member.initials}</span>
                  </div>
                )}
              </>
            )}
            {/* Name tag at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "12px 16px",
              background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
            }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "-0.3px" }}>{member.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const EXPERTISE = [
  {
    category: "Design & Creative",
    accent: "#ff6a00",
    skills: ["Brand Identity", "UI / UX Design", "Motion Graphics", "Product Design", "Figma", "Illustration", "Typography", "Art Direction"],
  },
  {
    category: "Development",
    accent: "#ff6a00",
    skills: ["Next.js", "React", "Node.js", "React Native", "Swift", "PostgreSQL", "Tailwind CSS", "REST APIs", "TypeScript"],
  },
  {
    category: "Marketing & Growth",
    accent: "#ff6a00",
    skills: ["SEO", "Paid Media", "Email Marketing", "Content Strategy", "Analytics", "Social Media", "Conversion Rate Optimisation"],
  },
  {
    category: "Strategy & Production",
    accent: "#ff6a00",
    skills: ["Brand Strategy", "Market Research", "Product Photography", "Video Production", "Copywriting", "Campaign Planning"],
  },
];

function ExpertiseSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardVis, setCardVis] = useState<boolean[]>(Array(EXPERTISE.length).fill(false));

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        const idx = cardRefs.current.indexOf(e.target as HTMLDivElement);
        if (idx !== -1 && e.isIntersecting) setCardVis(p => { const n = [...p]; n[idx] = true; return n; });
      }),
      { threshold: 0.12 }
    );
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ borderTop: "1px solid var(--border)", position: "relative" }}>
      <div className="absolute inset-0 hero-grid opacity-[0.07] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row" style={{ alignItems: "flex-start" }}>

        {/* ── LEFT: sticky title ── */}
        <div style={{
          width: "100%", maxWidth: 420, flexShrink: 0,
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px 48px 80px 48px",
          borderRight: `1px solid var(--border)`,
        }} className="expertise-sidebar hidden md:flex">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              Collective Skills
            </span>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,52px)", letterSpacing: "-2px", lineHeight: 1.05, color: "var(--fg)", margin: 0 }}>
              What our team<br />
              <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                brings to<br />the table.
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8, margin: 0, maxWidth: 280 }}>
              13 specialists across four disciplines — everything under one roof so nothing gets lost in handoffs.
            </p>

            {/* Category nav dots */}
            <div className="flex flex-col gap-3 mt-4">
              {EXPERTISE.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: g.accent, opacity: 0.7 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {g.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: scrolling cards ── */}
        <div style={{ flex: 1, padding: "60px 40px 60px 40px", display: "flex", flexDirection: "column", gap: 16 }}
          className="expertise-content px-6 md:px-10">

          {/* Mobile header */}
          <div className="flex flex-col gap-4 mb-4 md:hidden">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] inline-block" />
              Collective Skills
            </span>
            <h2 style={{ fontSize: "clamp(28px,7vw,48px)", letterSpacing: "-2px", lineHeight: 1.05, color: "var(--fg)", margin: 0 }}>
              What our team{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                brings to the table.
              </span>
            </h2>
          </div>

          {EXPERTISE.map((group, gi) => {
            return (
              <div
                key={gi}
                ref={el => { cardRefs.current[gi] = el; }}
                style={{
                  // borderRadius: 20,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  padding: "clamp(24px,3vw,36px)",
                  position: "relative", overflow: "hidden", cursor: "default",
                  opacity: cardVis[gi] ? 1 : 0,
                  transform: cardVis[gi] ? "translateX(0)" : "translateX(40px)",
                  transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${gi * 0.08}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${gi * 0.08}s`,
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col gap-1.5">
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)" }}>
                      0{gi + 1}
                    </span>
                    <h3 style={{ fontSize: "clamp(18px,2vw,24px)", letterSpacing: "-0.5px", margin: 0, color: "var(--fg)", lineHeight: 1.2 }}>
                      {group.category}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, marginBottom: 20, background: "var(--border)" }} />

                {/* Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.skills.map((skill) => (
                    <span key={skill} style={{
                      fontSize: 12, fontWeight: 600,
                      padding: "4px 10px", 
                      border: "1px solid var(--border)",
                      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                      color: "var(--muted)",
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
      <div className="team-stats-grid max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
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
        @media (max-width: 767px) {
          .mvg-grid-responsive { grid-template-columns: 1fr !important; overflow-y: auto; }
          .expertise-grid { grid-template-columns: 1fr !important; }
          .team-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .team-stats-grid > div:nth-child(even) { border-right: none !important; }
          .team-stats-grid > div:nth-child(1),
          .team-stats-grid > div:nth-child(2) { border-bottom: 1px solid var(--border); }
          .expertise-layout { flex-direction: column !important; }
          .expertise-sidebar { display: none !important; }
          .expertise-content { padding: 32px 20px !important; }
          .team-member-role { display: none !important; }
        }
        @media (max-width: 480px) {
          .team-stats-grid { grid-template-columns: 1fr !important; }
          .team-stats-grid > div { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
          .team-stats-grid > div:last-child { border-bottom: none !important; }
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
              <Link href="/consultation"
                className="group inline-flex items-center gap-2.5 h-[50px] px-6 no-underline"
                style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", borderRadius: 0, boxShadow: "0 6px 28px rgba(255,106,0,0.35)", color: "#fff", fontWeight: 700, fontSize: 14, transition: "box-shadow 0.25s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 36px rgba(255,106,0,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.35)"; }}
              >
                Get Consultation
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link href="/portfolio"
                className="group inline-flex items-center gap-2.5 h-[50px] px-6 backdrop-blur-md no-underline"
                style={{
                  background: isDark
                    ? "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(150deg, rgba(255,106,0,0.55), rgba(255,106,0,0.08)) border-box"
                    : "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(150deg, rgba(255,106,0,0.5), rgba(255,106,0,0.08)) border-box",
                  border: "1.5px solid transparent",
                  borderRadius: 0,
                  transition: "background 0.25s ease",
                }}
              >
                <span className="relative overflow-hidden inline-flex flex-col font-semibold text-sm" style={{ height: "1.2em", color: "var(--fg)" }}>
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-full">Our Work</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">Our Work</span>
                </span>
                <ArrowRight size={13} stroke="var(--fg)" strokeWidth={2} className="opacity-60" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <StatsStrip />

        {/* ── Expertise ── */}
        <ExpertiseSection theme={theme} />

        {/* ── Team List ── */}
        <TeamSection theme={theme} />

        {/* ── Footer ── */}
        <Footer theme={theme} />

      </div>
    </>
  );
}

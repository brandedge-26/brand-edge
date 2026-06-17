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
  {
    num: "01",
    name: "Ahmed Raza",
    role: "Creative Director",
    tags: "Brand Strategy · Art Direction",
    grad: "linear-gradient(135deg, #ff6a00, #ee0979)",
    imgBg: "linear-gradient(145deg, #1a0800 0%, #3d1200 40%, #ff6a00 100%)",
    initials: "AR",
  },
  {
    num: "02",
    name: "Sara Khan",
    role: "Lead Designer",
    tags: "UI Design · Motion",
    grad: "linear-gradient(135deg, #c026d3, #7c3aed)",
    imgBg: "linear-gradient(145deg, #120020 0%, #2d0050 40%, #c026d3 100%)",
    initials: "SK",
  },
  {
    num: "03",
    name: "Bilal Hassan",
    role: "Full-Stack Developer",
    tags: "Next.js · Node.js",
    grad: "linear-gradient(135deg, #0891b2, #7c3aed)",
    imgBg: "linear-gradient(145deg, #000d1a 0%, #001f3f 40%, #0891b2 100%)",
    initials: "BH",
  },
  {
    num: "04",
    name: "Zara Malik",
    role: "Growth Strategist",
    tags: "SEO · Paid Media",
    grad: "linear-gradient(135deg, #16a34a, #0891b2)",
    imgBg: "linear-gradient(145deg, #001a0a 0%, #003d18 40%, #16a34a 100%)",
    initials: "ZM",
  },
  {
    num: "05",
    name: "Usman Ali",
    role: "App Developer",
    tags: "React Native · Swift",
    grad: "linear-gradient(135deg, #d97706, #ff6a00)",
    imgBg: "linear-gradient(145deg, #1a0e00 0%, #3d2200 40%, #d97706 100%)",
    initials: "UA",
  },
  {
    num: "06",
    name: "Hina Shah",
    role: "Brand Photographer",
    tags: "Studio · Lifestyle",
    grad: "linear-gradient(135deg, #ee0979, #ff6a00)",
    imgBg: "linear-gradient(145deg, #1a0010 0%, #3d0025 40%, #ee0979 100%)",
    initials: "HS",
  },
];

const STATS = [
  { target: 18,  suffix: "+", label: "Team Members" },
  { target: 5,   suffix: "+", label: "Years Together" },
  { target: 200, suffix: "+", label: "Projects Shipped" },
  { target: 98,  suffix: "%", label: "Client Satisfaction" },
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

      {/* List rows */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
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

                {/* Arrow */}
                <div className="shrink-0 transition-all duration-300"
                  style={{ transform: isActive ? "translate(3px,-3px)" : "translate(0,0)", color: isActive ? "#ff6a00" : "var(--muted)" }}>
                  <ArrowUpRight size={18} strokeWidth={1.8} />
                </div>
              </div>

              {/* Mobile tap — image reveal */}
              <div className="md:hidden overflow-hidden transition-all duration-500"
                style={{ maxHeight: isTapped ? "220px" : "0px", opacity: isTapped ? 1 : 0 }}>
                <div className="relative w-full h-[180px] flex items-center justify-center"
                  style={{ background: member.imgBg }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{member.initials}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">{member.role}</span>
                  </div>
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
            background: member.imgBg,
            opacity: hoveredIdx === i ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 120, height: 120, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              filter: "blur(30px)",
            }} />
            {/* Initials */}
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
            {/* Name tag at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "12px 16px",
              background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
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
              18+ specialists across four disciplines — everything under one roof so nothing gets lost in handoffs.
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

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

/* ── Data ───────────────────────────────────────────── */
const MARQUEE_TAGS = [
  "Branding", "Web Design", "E-Commerce", "UI/UX",
  "Identity", "Digital Marketing", "Development", "Strategy",
];

const FILTERS = ["All", "Web Design", "Branding", "E-Commerce", "App Dev"];

const PROJECTS = [
  {
    id: 1, slug: "jesup-wireless",
    title: "Jesup Wireless — Digital Store", client: "Jesup Wireless", year: "2024",
    category: "E-Commerce", tags: ["E-Commerce", "Branding", "UI/UX"],
    image: "/projects/jesup.png",
    desc: "Full e-commerce build for a US-based wireless retailer — clean storefront, smooth checkout flow, and a brand identity that converts browsers into buyers.",
    span: 2, tall: true,
  },
  {
    id: 2, slug: "nanya-cnc",
    title: "NANYA CNC — Web Presence", client: "NANYA CNC", year: "2024",
    category: "Web Design", tags: ["Web Design", "UI/UX", "Development"],
    image: "/projects/nanya.png",
    desc: "A precision-forward website for a CNC manufacturing leader — built to reflect the quality of their machines and drive serious B2B inquiries.",
    span: 1, tall: false,
  },
  {
    id: 3, slug: "action-plus-tax",
    title: "Action Plus Tax — Brand & Web", client: "Action Plus Tax", year: "2025",
    category: "Branding", tags: ["Branding", "Web Design", "Identity"],
    image: "/projects/action.png",
    desc: "A trust-first brand identity and professional website for a growing tax consultancy — designed to communicate authority and convert first-time visitors into long-term clients.",
    span: 1, tall: false,
  },
  {
    id: 4, slug: "taeri",
    title: "TAERI — Elderly Health App", client: "TAERI", year: "2025",
    category: "App Dev", tags: ["App Dev", "UI/UX", "Health"],
    image: "/projects/taeri.png",
    desc: "A thoughtful health companion app designed for senior citizens — guiding them through personalised daily tasks, movement routines, and wellness check-ins with simplicity and care.",
    span: 2, tall: false,
  },
];

/* ── Project Card ───────────────────────────────────── */
function ProjectCard({
  project, index, isDark, wrapRef,
}: {
  project: typeof PROJECTS[0];
  index: number;
  isDark: boolean;
  wrapRef: (el: HTMLDivElement | null) => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={wrapRef}
      style={{
        gridColumn: project.span === 2 ? "span 2" : "span 1",
        opacity: 0,
        transform: "translateY(48px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
      }}
    >
      <Link href={`/portfolio/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative", overflow: "hidden",
          height: project.span === 2 && project.tall ? "clamp(380px, 40vw, 580px)" : "clamp(260px, 28vw, 420px)",
          cursor: "pointer",
          border: `1px solid ${hov ? "rgba(255,106,0,0.4)" : "var(--border)"}`,
          transition: "border-color 0.4s ease",
        }}
      >
        {/* Image */}
        <img
          src={project.image} alt={project.title}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Base gradient overlay (always visible) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
          transition: "opacity 0.4s ease",
        }} />

        {/* Hover overlay — slides up */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 100%)",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />

        {/* Top: category + year */}
        <div style={{
          position: "absolute", top: 20, left: 20, right: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          zIndex: 2,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
            padding: "5px 12px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            {project.category}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
            {project.year}
          </span>
        </div>

        {/* Big watermark number */}
        <span style={{
          position: "absolute", bottom: -10, right: 16,
          fontSize: "clamp(80px, 10vw, 140px)", fontWeight: 900, lineHeight: 1,
          color: "rgba(255,255,255,0.04)",
          letterSpacing: "-6px", userSelect: "none", pointerEvents: "none",
          transition: "opacity 0.4s ease",
          opacity: hov ? 0 : 1,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Bottom info */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "24px 24px 24px",
          zIndex: 2,
          transform: hov ? "translateY(-8px)" : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Client */}
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#ff6a00", margin: "0 0 6px",
          }}>
            {project.client}
          </p>

          {/* Title */}
          <h3 style={{
            fontSize: "clamp(16px, 1.8vw, 22px)", fontWeight: 600,
            color: "#fff", margin: "0 0 12px", letterSpacing: "-0.4px", lineHeight: 1.25,
          }}>
            {project.title}
          </h3>

          {/* Description — only on hover */}
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65,
            margin: "0 0 18px",
            maxHeight: hov ? "80px" : "0px",
            opacity: hov ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease 0.05s",
          }}>
            {project.desc}
          </p>

          {/* Tags + CTA row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
          }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {project.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  padding: "3px 10px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* View arrow */}
            <div style={{
              width: 36, height: 36,
              backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              opacity: hov ? 1 : 0,
              transform: hov ? "scale(1)" : "scale(0.7)",
              transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function PortfolioPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const filtered = activeFilter === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Hero + tags reveal */
  useEffect(() => {
    const els = [heroRef.current, tagsRef.current].filter(Boolean) as HTMLDivElement[];
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = "1";
        (e.target as HTMLElement).style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    }), { threshold: 0.05 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Cards reveal */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    // reset first
    cards.forEach(c => { c.style.opacity = "0"; c.style.transform = "translateY(48px)"; });

    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = "1";
        (e.target as HTMLElement).style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    }), { threshold: 0.07 });
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [filtered]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  return (
    <div
      data-theme={theme}
      style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}
    >
      <style>{`
        @keyframes marquee-tags {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .portfolio-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.35;
          pointer-events: none;
        }
        .port-filter-btn {
          padding: 8px 20px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          border: 1px solid var(--border); background: transparent;
          color: var(--muted); cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .port-filter-btn.active {
          background: #ff6a00; border-color: #ff6a00; color: #fff;
          box-shadow: 0 4px 16px rgba(255,106,0,0.35);
        }
        .port-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .port-grid { grid-template-columns: 1fr; }
          .port-grid > div { grid-column: span 1 !important; }
          .port-title { letter-spacing: -2px !important; }
          .port-stats { flex-wrap: wrap; }
          .port-stats > div { flex: 1 1 40%; border-right: none !important; border-bottom: 1px solid var(--border); }
        }
        @media (max-width: 480px) {
          .port-filter-btn { padding: 7px 14px; font-size: 11px; }
        }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="portfolio-hero-grid" />

        {/* Glow */}
        <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(238,9,121,0.08) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div
          ref={heroRef}
          style={{
            maxWidth: 1100, margin: "0 auto",
            padding: "clamp(140px,18vh,200px) 24px clamp(60px,8vh,100px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", position: "relative", zIndex: 1,
            opacity: 0, transform: "translateY(32px)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 999,
            border: "1px solid var(--border)", background: "var(--surface)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--muted)", marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
            Our Work
          </span>

          <h1 className="port-title" style={{
            fontSize: "clamp(40px, 7vw, 96px)", fontWeight: 400,
            lineHeight: 1.0, letterSpacing: "-4px", margin: "0 0 28px", color: "var(--fg)",
          }}>
            Brands we&apos;ve{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              built
            </span>{" "}&amp;{" "}<br />
            stories we&apos;ve{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#ee0979,#ff6a00)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              told.
            </span>
          </h1>

          <p style={{ fontSize: "clamp(14px,1.3vw,18px)", color: "var(--muted)", lineHeight: 1.75, maxWidth: 500, margin: "0 0 52px" }}>
            From bold identities to high-converting digital experiences — every project is a story of growth.
          </p>

          <div className="port-stats" style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>
            {[{ val: "50+", label: "Projects" }, { val: "8", label: "Services" }, { val: "98%", label: "Satisfaction" }, { val: "3x", label: "Avg. Growth" }].map((s, i) => (
              <div key={i} style={{ padding: "20px 32px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 600, letterSpacing: "-1.5px", lineHeight: 1, margin: "0 0 4px", backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling tags strip */}
        <div
          ref={tagsRef}
          style={{
            borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            overflow: "hidden", position: "relative", zIndex: 1,
            opacity: 0, transform: "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div style={{ display: "flex", animation: "marquee-tags 22s linear infinite", width: "max-content" }}>
            {[...MARQUEE_TAGS, ...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRight: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section ref={sectionRef} style={{ padding: "clamp(64px,8vh,112px) 24px clamp(80px,10vh,140px)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          {/* Section header + filters */}
          <div style={{ marginBottom: 56 }}>

            {/* Title block */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 28, height: 1.5, background: "#ff6a00", display: "inline-block", borderRadius: 2 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6a00" }}>Our Projects</span>
                </div>
                <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 500, letterSpacing: "-1.5px", color: "var(--fg)", margin: "0 0 14px", lineHeight: 1.1 }}>
                  Work we&apos;re proud of
                </h2>
                <p style={{ fontSize: "clamp(13px,1.2vw,15px)", color: "var(--muted)", lineHeight: 1.8, margin: 0, maxWidth: 560 }}>
                  We&apos;ve had the privilege of partnering with ambitious businesses across industries — helping them build brands, launch digital products, and grow their presence online. Each project here represents real collaboration, real challenges, and real results. These are just a few of the stories we&apos;ve been part of.
                </p>
              </div>

              {/* Filter tabs */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignSelf: "flex-start" }}>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`port-filter-btn${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project grid */}
          <div className="port-grid">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isDark={isDark}
                wrapRef={el => { cardRefs.current[i] = el; }}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 72,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
            padding: "36px 40px",
            border: "1px solid var(--border)", background: "var(--surface)",
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 8px" }}>
                Next could be yours
              </p>
              <p style={{ fontSize: "clamp(18px,2vw,26px)", fontWeight: 500, letterSpacing: "-0.8px", color: "var(--fg)", margin: 0, lineHeight: 1.3 }}>
                Ready to build something that stands out?
              </p>
            </div>
            <a href="/consultation" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 28px",
              backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
              color: "#fff", textDecoration: "none",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(255,106,0,0.35)",
              whiteSpace: "nowrap",
            }}>
              Start a Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
}

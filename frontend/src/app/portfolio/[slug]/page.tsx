"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

/* ── All project case studies ───────────────────────── */
export const ALL_PROJECTS = [
  {
    slug: "jesup-wireless",
    title: "Jesup Wireless — Digital Store",
    client: "Jesup Wireless",
    category: "E-Commerce",
    year: "2024",
    duration: "3 Weeks",
    team: "1 Designer · 2 Developers · 1 Strategist",
    deliverables: "E-Commerce Website, Brand Identity, UI/UX",
    image: "/projects/jesup.png",
    liveUrl: "https://shop.jesupwireless.com",
    tags: ["E-Commerce", "Branding", "UI/UX"],
    overview: "Jesup Wireless, a US-based wireless retailer, came to us needing a complete digital storefront that matched the quality of their products. Their previous online presence was basic, slow, and failing to convert visitors. We designed and built a full e-commerce experience — fast, mobile-first, and built to sell.",
    challenge: "The wireless accessories market is crowded and highly price-competitive. The challenge was building a store that felt premium and trustworthy enough to stand out, while keeping the buying journey frictionless from product discovery to checkout.",
    phases: [
      { name: "Discovery & Strategy",    duration: "3 days",  desc: "Competitor audit of top US wireless retailers, customer journey mapping, and conversion funnel planning to prioritise the right features." },
      { name: "Brand & Visual Design",   duration: "5 days",  desc: "Logo refinement, colour system, typography, and a full UI kit designed for e-commerce — product cards, CTAs, badges, and checkout flows." },
      { name: "Development",             duration: "10 days", desc: "Full e-commerce build — product catalogue, cart, checkout, mobile-responsive layouts, and performance optimisation for fast load times." },
      { name: "QA & Launch",             duration: "3 days",  desc: "Cross-device testing, payment flow QA, page speed audit, and a smooth go-live with zero downtime." },
    ],
    results: [
      { val: "3×",  label: "Faster Page Load" },
      { val: "40%", label: "Higher Conversion Rate" },
      { val: "98",  label: "Mobile Lighthouse Score" },
      { val: "3wk", label: "Design to Live" },
    ],
    outcome: "Jesup Wireless launched their new store to immediate positive feedback from customers. The streamlined checkout and mobile-first design significantly improved the buying experience, and the brand identity gave the business a professional edge it was previously missing.",
  },
  {
    slug: "nanya-cnc",
    title: "NANYA CNC — Web Presence",
    client: "NANYA CNC",
    category: "Web Design",
    year: "2024",
    duration: "2 Weeks",
    team: "1 Designer · 1 Developer",
    deliverables: "Corporate Website, UI/UX, Copywriting",
    image: "/projects/nanya.png",
    liveUrl: "https://nye-cnc.com",
    tags: ["Web Design", "UI/UX", "Development"],
    overview: "NANYA CNC is a precision CNC manufacturing company that needed a website as precise as their machines. Their old web presence didn't communicate the scale or quality of their capabilities. We built a clean, professional corporate website that speaks directly to B2B buyers and industry partners.",
    challenge: "CNC manufacturing is a highly technical field. The website needed to be authoritative enough for engineers and procurement managers, while remaining accessible to non-technical decision-makers. Every design choice had to communicate precision and reliability.",
    phases: [
      { name: "Discovery & Positioning",   duration: "2 days",  desc: "Stakeholder interviews, target audience mapping, and competitive analysis of leading CNC manufacturers worldwide." },
      { name: "UX & Information Design",   duration: "3 days",  desc: "Sitemap and wireframes built around B2B inquiry flow — services first, capabilities second, contact always within reach." },
      { name: "Visual Design",             duration: "5 days",  desc: "Clean industrial aesthetic — dark tones, precision typography, technical imagery, and a design language built on trust and capability." },
      { name: "Development & Launch",      duration: "4 days",  desc: "Fully responsive build, enquiry form integration, SEO foundation, and cross-browser QA before a clean handoff." },
    ],
    results: [
      { val: "2×",  label: "More B2B Inquiries" },
      { val: "55%", label: "Lower Bounce Rate" },
      { val: "14d", label: "Concept to Launch" },
      { val: "A+",  label: "Client Satisfaction" },
    ],
    outcome: "NANYA CNC's new website immediately elevated the business in the eyes of potential partners. Within the first month, inbound B2B inquiries doubled — and the client reported that new leads were arriving better-informed and more decision-ready than ever before.",
  },
  {
    slug: "action-plus-tax",
    title: "Action Plus Tax — Brand & Web",
    client: "Action Plus Tax",
    category: "Branding",
    year: "2025",
    duration: "2 Weeks",
    team: "1 Designer · 1 Developer · 1 Strategist",
    deliverables: "Brand Identity, Website, Visual Guidelines",
    image: "/projects/action.png",
    liveUrl: "https://actionplustax.com",
    tags: ["Branding", "Web Design", "Identity"],
    overview: "Action Plus Tax is a growing tax consultancy that needed a brand identity and website to match its ambitions. In the financial services space, trust is everything — and their existing look wasn't earning it. We rebuilt their brand from the ground up and launched a website designed to convert first-time visitors into long-term clients.",
    challenge: "Tax consultancies often look generic and interchangeable. The challenge was creating an identity that felt authoritative and trustworthy without being cold or corporate — a brand that real people and small businesses would actually want to work with.",
    phases: [
      { name: "Brand Strategy",          duration: "2 days",  desc: "Defined the brand positioning, target audience personas, tone of voice, and a set of brand values that would drive every design decision." },
      { name: "Identity Design",         duration: "4 days",  desc: "Logo design across 3 concepts, selected colour palette (professional navy and gold), typography system, and brand guidelines document." },
      { name: "Website Design",          duration: "4 days",  desc: "Conversion-focused layout — services clearly presented, trust signals throughout, and a prominent CTA driving free consultation bookings." },
      { name: "Development & Launch",    duration: "4 days",  desc: "Fully responsive website build, contact form integration, Google Maps embed, SEO basics, and a smooth production launch." },
    ],
    results: [
      { val: "3×",  label: "More Consultation Bookings" },
      { val: "60%", label: "Lower Bounce Rate" },
      { val: "14d", label: "Strategy to Launch" },
      { val: "A+",  label: "Client Satisfaction" },
    ],
    outcome: "Action Plus Tax launched with a brand that finally matched the quality of their service. Consultation bookings tripled in the first month, and the client reported that new leads were arriving pre-sold on the brand — no longer needing to be convinced of credibility before the conversation even started.",
  },
  {
    slug: "taeri",
    title: "TAERI — Elderly Health App",
    client: "TAERI",
    category: "App Dev",
    year: "2025",
    duration: "6 Weeks",
    team: "1 Designer · 2 Developers · 1 Strategist",
    deliverables: "Mobile App UI, Task Flow System, Health Dashboard",
    image: "/projects/taeri.png",
    liveUrl: "",
    tags: ["App Dev", "UI/UX", "Health"],
    overview: "TAERI is a health companion application built specifically for senior citizens — a demographic that is often underserved by modern technology. The app was designed around one core belief: that staying healthy in old age should feel empowering, not complicated. Users begin by selecting the type of activity they want to perform, then the app gently guides them through personalised parameters — how much time they have, the physical angle or posture involved, and the difficulty level that suits their current ability. Everything is designed with large text, simple navigation, and calm visuals to ensure comfort for elderly users.",
    challenge: "Designing for senior citizens presents a unique set of challenges. Most apps assume a baseline of tech-literacy that older users may not have. Our challenge was to create an experience that felt warm and approachable — not clinical — while still being detailed enough to be genuinely useful for health management. Every tap, every screen, and every word of copy had to be considered through the lens of someone who may be encountering a smartphone app for the very first time.",
    phases: [
      { name: "Research & User Empathy",   duration: "1 week",  desc: "In-depth research into elderly UX patterns, accessibility standards, and common health concerns for senior citizens. Interviews and journey mapping focused on simplicity and trust." },
      { name: "Task Flow Design",           duration: "1 week",  desc: "Designed the core task selection system — users pick an activity (e.g. walking, stretching, physiotherapy), then set time duration, body angle/posture, and difficulty level on a simple slider scale." },
      { name: "UI Design & Accessibility", duration: "2 weeks", desc: "High-contrast visuals, large tap targets, clear iconography, and calm colour palette. Every screen was tested for readability and ease of use with minimal cognitive load." },
      { name: "Development & Testing",     duration: "2 weeks", desc: "Full mobile app build with smooth onboarding flow, task tracking, daily progress summaries, and caregiver notification feature. Tested across multiple device sizes." },
    ],
    results: [
      { val: "95%",  label: "Ease of Use Rating" },
      { val: "3 taps", label: "Avg. to Start a Task" },
      { val: "A+",   label: "Accessibility Score" },
      { val: "6wks", label: "Concept to Delivery" },
    ],
    outcome: "TAERI delivered a product that genuinely resonated with its target audience — senior citizens who often feel left behind by technology. The simple task-selection flow, combined with thoughtful accessibility design, made it easy for elderly users to engage with their health routines daily. The client praised the team's ability to translate a complex health concept into something that felt effortless and human.",
  },
];

/* ── Components ─────────────────────────────────────── */
function PhaseRow({ phase, index }: { phase: { name: string; duration: string; desc: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateX(0)"; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "28px 1fr",
      gap: "0 24px", paddingBottom: 32,
      opacity: 0, transform: "translateX(-20px)",
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
    }}>
      {/* Left: number + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff",
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, width: 1.5, background: "var(--border)", marginTop: 8 }} />
      </div>

      {/* Right: content */}
      <div style={{ paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", margin: 0, letterSpacing: "-0.3px" }}>
            {phase.name}
          </h4>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 10px", background: "var(--surface)", border: "1px solid var(--border)",
            color: "#ff6a00",
          }}>
            {phase.duration}
          </span>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
          {phase.desc}
        </p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const project = ALL_PROJECTS.find(p => p.slug === slug);
  const currentIdx = ALL_PROJECTS.findIndex(p => p.slug === slug);
  const nextProject = ALL_PROJECTS[(currentIdx + 1) % ALL_PROJECTS.length];

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 20); setScrollY(window.scrollY); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = "1";
        (e.target as HTMLElement).style.transform = "translateY(0)";
        obs.disconnect();
      }
    }, { threshold: 0.04 });
    obs.observe(contentRef.current);
    return () => obs.disconnect();
  }, [project]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  const isDark = theme === "dark";

  if (!project) {
    return (
      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, cursor: "none" }}>
        <CustomCursor />
        <Header theme={theme} onToggle={toggle} scrolled={scrolled} />
        <h1 style={{ fontSize: 32, fontWeight: 500, color: "var(--fg)" }}>Project not found</h1>
        <Link href="/portfolio" style={{ color: "#ff6a00", fontWeight: 600 }}>← Back to Portfolio</Link>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}>
      <style>{`
        .case-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 64px;
          align-items: start;
        }
        .case-stats-bar {
          display: flex;
          align-items: stretch;
          border-left: 1px solid var(--border);
        }
        .case-stats-bar > div { flex: 1; }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          margin-bottom: 28px;
        }
        .next-project-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 32px;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: border-color 0.2s ease;
        }
        .next-project-inner {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .case-layout { grid-template-columns: 1fr; gap: 40px; }
          .case-sidebar { order: -1; position: static !important; }
        }
        @media (max-width: 640px) {
          .result-grid { grid-template-columns: 1fr 1fr !important; }
          .case-stats-bar { flex-wrap: wrap; border-left: none; }
          .case-stats-bar > div {
            flex: 1 1 50%;
            border-left: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
          }
          .next-project-card { padding: 20px; gap: 12px; }
          .next-project-inner { gap: 12px; }
        }
        @media (max-width: 420px) {
          .case-stats-bar > div { flex: 1 1 100%; }
          .next-project-card { flex-wrap: wrap; }
        }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: "clamp(380px, 55vh, 640px)", overflow: "hidden" }}>
        {/* Parallax image */}
        <div ref={heroImgRef} style={{
          position: "absolute", inset: "-20%",
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: "transform",
        }}>
          <img src={project.image} alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </div>

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,106,0,0.15) 0%, rgba(238,9,121,0.1) 100%)" }} />

        {/* Hero content */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "clamp(24px,5vw,60px)",
          maxWidth: 1160, margin: "0 auto", width: "100%",
          left: "50%", transform: "translateX(-50%)",
        }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 600 }}>
              Portfolio
            </Link>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>/</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{project.category}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "5px 14px", background: "rgba(255,106,0,0.9)", color: "#fff",
            }}>
              {project.category}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{project.year}</span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4.5vw, 64px)", fontWeight: 400,
            letterSpacing: "-2.5px", lineHeight: 1.05, color: "#fff",
            margin: "0 0 16px", maxWidth: 760,
          }}>
            {project.title}
          </h1>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
            Client — {project.client}
          </p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="case-stats-bar">
          {[
            { label: "Duration",     val: project.duration },
            { label: "Team",         val: project.team },
            { label: "Deliverables", val: project.deliverables },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "20px 28px",
              borderRight: "1px solid var(--border)",
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 5px" }}>
                {s.label}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: 0, lineHeight: 1.4 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        ref={contentRef}
        style={{
          maxWidth: 1160, margin: "0 auto", width: "100%",
          padding: "clamp(48px,7vh,96px) 24px clamp(64px,8vh,112px)",
          opacity: 0, transform: "translateY(28px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="case-layout">

          {/* ── Main content ── */}
          <div>
            {/* Overview */}
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ width: 24, height: 1.5, background: "#ff6a00", display: "inline-block", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6a00" }}>Overview</span>
              </div>
              <p style={{ fontSize: "clamp(15px,1.4vw,18px)", color: "var(--fg)", lineHeight: 1.8, margin: "0 0 24px", opacity: 0.9 }}>
                {project.overview}
              </p>
              <div style={{
                padding: "20px 24px",
                borderLeft: "3px solid #ff6a00",
                background: isDark ? "rgba(255,106,0,0.05)" : "rgba(255,106,0,0.04)",
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 8px" }}>The Challenge</p>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>{project.challenge}</p>
              </div>
            </section>

            {/* Process timeline */}
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                <span style={{ width: 24, height: 1.5, background: "#ff6a00", display: "inline-block", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6a00" }}>Process</span>
              </div>
              {project.phases.map((phase, i) => (
                <PhaseRow key={i} phase={phase} index={i} />
              ))}
            </section>

            {/* Results */}
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <span style={{ width: 24, height: 1.5, background: "#ff6a00", display: "inline-block", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ff6a00" }}>Results</span>
              </div>
              <div className="result-grid">
                {project.results.map((r, i) => (
                  <div key={i} style={{ background: "var(--bg)", padding: "24px 20px", textAlign: "center" }}>
                    <p style={{
                      fontSize: "clamp(24px,3vw,36px)", fontWeight: 600, letterSpacing: "-1.5px",
                      backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                      WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                      margin: "0 0 6px", lineHeight: 1,
                    }}>{r.val}</p>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>{r.label}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>{project.outcome}</p>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="case-sidebar" style={{ position: "sticky", top: 100 }}>
            {/* Project info card */}
            <div style={{ border: "1px solid var(--border)", background: "var(--surface)", marginBottom: 16 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 4px" }}>Project Info</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", margin: 0, letterSpacing: "-0.3px" }}>{project.client}</p>
              </div>
              {[
                { label: "Service",  val: project.category },
                { label: "Year",     val: project.year },
                { label: "Duration", val: project.duration },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{row.val}</span>
                </div>
              ))}
              <div style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>Tags</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {project.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                      padding: "4px 10px", border: "1px solid var(--border)",
                      background: "var(--bg)", color: "var(--muted)",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href="/consultation" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px",
              backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
              color: "#fff", textDecoration: "none",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 6px 24px rgba(255,106,0,0.35)",
              marginBottom: 10,
            }}>
              Start a Similar Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {(project as typeof ALL_PROJECTS[0] & { liveUrl?: string }).liveUrl && (
              <a
                href={(project as typeof ALL_PROJECTS[0] & { liveUrl?: string }).liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 24px", border: "1px solid var(--border)",
                  color: "var(--fg)", textDecoration: "none",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                Visit Live Site
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}

            <Link href="/portfolio" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 24px", border: "1px solid var(--border)",
              color: "var(--muted)", textDecoration: "none",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              ← All Projects
            </Link>
          </div>
        </div>

        {/* ── Next project ── */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 48, marginTop: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 20px" }}>
            Next Project
          </p>
          <Link href={`/portfolio/${nextProject.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div className="next-project-card"
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#ff6a00"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
            >
              <div className="next-project-inner">
                <div style={{ width: 64, height: 48, overflow: "hidden", flexShrink: 0 }}>
                  <img src={nextProject.image} alt={nextProject.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 4px" }}>{nextProject.category}</p>
                  <p style={{ fontSize: "clamp(13px,1.3vw,16px)", fontWeight: 600, color: "var(--fg)", margin: 0, letterSpacing: "-0.3px" }}>{nextProject.title}</p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: "var(--muted)" }}>
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}

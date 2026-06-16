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
    slug: "novatech-brand-identity",
    title: "NovaTech Brand Identity",
    client: "NovaTech",
    category: "Branding",
    year: "2024",
    duration: "3 Weeks",
    team: "2 Designers · 1 Strategist",
    deliverables: "Logo, Guidelines, Assets",
    image: "/home/services/branding-service.webp",
    tags: ["Logo", "Guidelines", "Identity"],
    overview: "NovaTech approached us needing a complete brand overhaul before their Series A fundraise. Their existing identity felt dated and misrepresented the cutting-edge software they were building. We rebuilt their brand from the ground up — creating a system that would scale from a business card to a billboard.",
    challenge: "The biggest challenge was capturing NovaTech's dual identity: technically rigorous yet human-centered. Investors needed to trust the numbers, while customers needed to trust the product.",
    phases: [
      { name: "Discovery & Research",   duration: "3 days",  desc: "Stakeholder interviews, competitor analysis, and audience profiling to define the brand positioning." },
      { name: "Brand Strategy",          duration: "4 days",  desc: "Crafted brand pillars, tone of voice, and a positioning statement that became the north star for all design decisions." },
      { name: "Identity Design",         duration: "8 days",  desc: "Logo development across 3 concept directions, colour palette, typography system, and iconography." },
      { name: "Refinement & Delivery",   duration: "3 days",  desc: "Client iterations, final artwork, brand guidelines PDF, and asset exports across all formats." },
    ],
    results: [
      { val: "3×",   label: "Brand Recognition" },
      { val: "40%",  label: "More Investor Inquiries" },
      { val: "2wks", label: "Faster Deck Sign-offs" },
      { val: "A+",   label: "Client Satisfaction" },
    ],
    outcome: "NovaTech closed their Series A within 6 weeks of the rebrand launch. The founding team cited the refreshed identity as a key factor in building investor confidence during pitch meetings.",
  },
  {
    slug: "flowapp-website",
    title: "FlowApp Website",
    client: "FlowApp",
    category: "Web Design",
    year: "2024",
    duration: "2 Weeks",
    team: "1 Designer · 1 Developer",
    deliverables: "Landing Page, CMS, Analytics",
    image: "/home/services/website-service.webp",
    tags: ["UI/UX", "Dev", "CMS"],
    overview: "FlowApp's previous website was losing 80% of visitors within 10 seconds. They needed a conversion-focused redesign that clearly communicated their product value and funneled visitors toward a free trial. We redesigned from wireframe to live in 14 days.",
    challenge: "The product had a complex feature set that was hard to explain quickly. Our challenge was distilling FlowApp's value into a homepage experience that could be understood in under 8 seconds.",
    phases: [
      { name: "UX Research & Audit",   duration: "2 days",  desc: "Heatmap analysis of the old site, user interviews with churned leads, and conversion funnel mapping." },
      { name: "Wireframes",             duration: "3 days",  desc: "Low-fi wireframes for all key sections. Rapid iteration with the client on content hierarchy and CTA placement." },
      { name: "Visual Design",          duration: "4 days",  desc: "High-fidelity UI in Figma — animations, micro-interactions, and responsive layouts for all breakpoints." },
      { name: "Development & QA",       duration: "5 days",  desc: "Next.js build with CMS integration, performance optimisation (99 Lighthouse score), and live QA across devices." },
    ],
    results: [
      { val: "210%", label: "More Trial Sign-ups" },
      { val: "68%",  label: "Lower Bounce Rate" },
      { val: "99",   label: "Lighthouse Score" },
      { val: "8s",   label: "Avg. Time to Value" },
    ],
    outcome: "Within 30 days of launch, FlowApp's trial-to-paid conversion rate increased from 4% to 11%. The homepage became their top sales tool in investor demos.",
  },
  {
    slug: "growthlab-360-campaign",
    title: "GrowthLab 360 Campaign",
    client: "GrowthLab",
    category: "Marketing",
    year: "2024",
    duration: "3 Months",
    team: "2 Marketers · 1 Content Creator · 1 Analyst",
    deliverables: "Ads, Email Flows, Content, Reports",
    image: "/home/services/marketting.webp",
    tags: ["Ads", "Email", "Content"],
    overview: "GrowthLab was spending heavily on paid ads but seeing minimal returns. They needed a full-funnel partner — not just an ads agency. We audited their entire marketing stack, rebuilt their funnel, and launched a coordinated 360° campaign across Google, Meta, and email.",
    challenge: "GrowthLab had siloed marketing channels with no attribution model. Money was being wasted on bottom-funnel ads before any awareness was built. We had to restructure the entire approach.",
    phases: [
      { name: "Audit & Attribution Setup", duration: "1 week",  desc: "Full marketing audit, GA4 setup, UTM framework, and ad account restructure. Identified Rs. 2L/month in wasted spend." },
      { name: "Strategy & Creative Brief",  duration: "1 week",  desc: "Full-funnel strategy document, messaging framework per audience segment, and creative brief for all ad formats." },
      { name: "Campaign Launch",            duration: "2 weeks", desc: "Google Search + Display, Meta prospecting + retargeting, and a 6-email welcome flow — all launched with A/B test variants." },
      { name: "Optimise & Scale",           duration: "Ongoing", desc: "Weekly performance reviews, creative rotation, budget reallocation, and monthly reporting with ROI breakdowns." },
    ],
    results: [
      { val: "4.2×", label: "ROAS" },
      { val: "180%", label: "More Leads" },
      { val: "Rs. 2L", label: "Monthly Waste Eliminated" },
      { val: "90d",  label: "To Profitability" },
    ],
    outcome: "GrowthLab went from unprofitable paid marketing to their best-performing quarter ever — all within 90 days. The email flow alone generates Rs. 8L/month in attributed revenue.",
  },
  {
    slug: "brightloop-mobile-app",
    title: "BrightLoop Mobile App",
    client: "BrightLoop",
    category: "App Dev",
    year: "2023",
    duration: "8 Weeks",
    team: "2 Developers · 1 Designer",
    deliverables: "iOS App, Android App, Admin Panel",
    image: "/home/services/mobile-app-service.webp",
    tags: ["iOS", "Android", "UI"],
    overview: "BrightLoop wanted to bring gamified micro-learning to students in Pakistan and the region. They had a concept and content library but needed a full-stack team to design and build the app from zero to App Store in 8 weeks.",
    challenge: "Building a smooth, gamified experience on both iOS and Android simultaneously while keeping the codebase maintainable. Offline mode was critical given variable network conditions in target markets.",
    phases: [
      { name: "Discovery & UX Research",  duration: "2 weeks", desc: "User journey mapping, competitor analysis of Duolingo/Quizlet, and interactive prototype testing with 12 students." },
      { name: "UI Design System",          duration: "2 weeks", desc: "Full design system in Figma — components, motion spec, gamification UI (streaks, badges, XP bars), and dark mode." },
      { name: "Development",               duration: "3 weeks", desc: "React Native build with offline-first architecture, push notifications, progress tracking, and admin content panel." },
      { name: "Testing & App Store",       duration: "1 week",  desc: "QA across 8 devices, performance profiling, App Store and Play Store submission with ASO-optimised listings." },
    ],
    results: [
      { val: "50k+", label: "Downloads (Q1)" },
      { val: "4.8★", label: "App Store Rating" },
      { val: "72%",  label: "Day-7 Retention" },
      { val: "8wks", label: "Zero to Live" },
    ],
    outcome: "BrightLoop hit 50,000 downloads in their first quarter without any paid marketing — purely through word-of-mouth and App Store optimisation. They are now raising seed funding.",
  },
  {
    slug: "acmeco-visual-identity",
    title: "AcmeCo Visual Identity",
    client: "AcmeCo",
    category: "Branding",
    year: "2023",
    duration: "2 Weeks",
    team: "1 Designer · 1 Art Director",
    deliverables: "Packaging, Social Kit, Ad Creatives",
    image: "/home/services/graphic-design-service.webp",
    tags: ["Print", "Digital", "Motion"],
    overview: "AcmeCo was launching a new D2C product line and needed a full visual system — fast. Packaging, social media templates, and performance ad creatives all needed to launch simultaneously with their product drop.",
    challenge: "Speed without sacrificing quality. Everything needed to feel premium and cohesive across wildly different formats — from a 5cm product label to a fullscreen Instagram reel.",
    phases: [
      { name: "Moodboard & Direction",   duration: "3 days",  desc: "3 distinct creative directions presented. Client selected the 'bold minimalism' route — high contrast, limited palette, strong type." },
      { name: "Concept Development",      duration: "4 days",  desc: "Packaging die-lines designed and printed for physical review. Social template grid built in Figma with auto-layout." },
      { name: "Refinement",               duration: "3 days",  desc: "Client feedback rounds, packaging colour proofing, and motion design for 3 animated social assets." },
      { name: "Final Delivery",           duration: "4 days",  desc: "Print-ready packaging files, 40-piece social template kit, 6 ad creative sets in all Meta/TikTok specs." },
    ],
    results: [
      { val: "2M",   label: "Launch Impressions" },
      { val: "40pc", label: "Social Template Library" },
      { val: "6",    label: "Ad Creative Sets" },
      { val: "14d",  label: "Full Delivery" },
    ],
    outcome: "AcmeCo's product launch sold out their first batch in 72 hours. The creative system was built to scale — they have since used the templates for 3 more product drops without needing additional design work.",
  },
  {
    slug: "luxeshoot-product-series",
    title: "LuxeShoot Product Series",
    client: "LuxeStore",
    category: "Photography",
    year: "2024",
    duration: "10 Days",
    team: "1 Photographer · 1 Stylist · 1 Editor",
    deliverables: "800+ Images, Lifestyle Shots, Ad-Ready Edits",
    image: "/home/services/product-photogrpahy.webp",
    tags: ["Studio", "Lifestyle", "Editing"],
    overview: "LuxeStore was running paid ads with low-quality product images shot on a phone. Their CTR was well below industry average. We planned and executed a full production shoot — studio white-background shots, lifestyle scenes, and ad-ready hero images — across 3 days.",
    challenge: "800+ SKUs across 3 shoot days with consistent lighting, styling, and colour accuracy. Every image needed to work as a standalone product shot and as part of a lifestyle scene.",
    phases: [
      { name: "Pre-Production",        duration: "3 days",  desc: "Shot list planning (800+ SKUs), prop sourcing, studio booking, lighting setup, and mood board approval per product category." },
      { name: "Studio Shoot — Day 1",  duration: "1 day",   desc: "White background product photography — all SKUs. Tethered shooting with live client review for immediate reshoots." },
      { name: "Studio Shoot — Day 2",  duration: "1 day",   desc: "Lifestyle flat-lays and contextual scenes. 3 set changes, multiple lighting setups per category." },
      { name: "Studio Shoot — Day 3",  duration: "1 day",   desc: "Hero shots for top 20 products, model shots for wearable SKUs, and video B-roll for paid social." },
      { name: "Post-Production",        duration: "7 days",  desc: "Colour correction, background removal, retouching, and export in all required formats (web, print, social, ads)." },
    ],
    results: [
      { val: "35%",  label: "Lower CAC" },
      { val: "2.8×", label: "Product Page CVR" },
      { val: "800+", label: "Images Delivered" },
      { val: "10d",  label: "Full Turnaround" },
    ],
    outcome: "Replacing old product images with the new photography cut LuxeStore's cost per acquisition by 35% within the first month. Their best-performing Meta ad now uses one of our lifestyle shots.",
  },
  {
    slug: "datasync-saas-platform",
    title: "DataSync SaaS Platform",
    client: "DataSync",
    category: "Software",
    year: "2023",
    duration: "12 Weeks",
    team: "2 Developers · 1 Designer · 1 PM",
    deliverables: "Web App, REST API, Admin Dashboard",
    image: "/home/services/software-design-service.webp",
    tags: ["SaaS", "API", "Dashboard"],
    overview: "DataSync needed a custom internal platform to replace a patchwork of spreadsheets and manual processes. Their team was spending 20+ hours/week on data reconciliation. We designed and built a full-stack SaaS with a real-time dashboard, REST API, and multi-tenant admin panel.",
    challenge: "Complex data relationships across 6 source systems, a team with varying technical literacy, and a hard deadline tied to a client contract renewal. Every feature had to be intuitive enough for non-technical staff.",
    phases: [
      { name: "Discovery & Architecture",  duration: "2 weeks", desc: "Requirements workshops, data flow mapping, database schema design, and technical spec documentation." },
      { name: "UI/UX Design",              duration: "2 weeks", desc: "Dashboard wireframes, component library design, and usability testing with 5 end-users before any code was written." },
      { name: "Core Development",          duration: "6 weeks", desc: "Next.js frontend, Node.js API, PostgreSQL database, real-time sync engine, and role-based access control system." },
      { name: "Testing & Deployment",      duration: "2 weeks", desc: "Unit + integration testing, load testing (10k concurrent records), CI/CD pipeline, and AWS deployment with auto-scaling." },
    ],
    results: [
      { val: "60%",   label: "Less Manual Work" },
      { val: "99.9%", label: "Uptime" },
      { val: "10k",   label: "Records/min Processed" },
      { val: "12wks", label: "Zero to Production" },
    ],
    outcome: "DataSync eliminated 22 hours of manual work per week across their team. The platform now processes over 500k records monthly and has become the core infrastructure for their client offering.",
  },
  {
    slug: "rankup-seo-strategy",
    title: "RankUp SEO Strategy",
    client: "RankUp",
    category: "Marketing",
    year: "2024",
    duration: "8 Months",
    team: "1 SEO Specialist · 1 Content Writer",
    deliverables: "Technical SEO, Content, Link Building",
    image: "/home/services/seo-service.webp",
    tags: ["SEO", "Content", "Links"],
    overview: "RankUp was getting 2,000 monthly organic visitors and spending heavily on paid ads to compensate. They wanted to build a sustainable organic channel. We started with a full technical audit, rebuilt their content strategy, and executed an aggressive link-building campaign.",
    challenge: "Their site had 200+ technical errors, thin content across 80% of pages, and zero domain authority backlinks. We had to fix the foundation before any growth could happen.",
    phases: [
      { name: "Technical SEO Audit",    duration: "2 weeks", desc: "Full site crawl, Core Web Vitals analysis, indexation issues, duplicate content, and structured data gaps — 200+ fixes identified and prioritised." },
      { name: "On-Page Optimisation",   duration: "1 month", desc: "Title tags, meta descriptions, internal linking, content depth, and schema markup across all 120 key pages." },
      { name: "Content Strategy",        duration: "Ongoing", desc: "Monthly content calendar — 8 long-form articles/month targeting high-intent keywords. Each piece built for featured snippets." },
      { name: "Link Building",           duration: "Ongoing", desc: "Digital PR outreach, guest posting, and resource page link building — 15–20 quality backlinks per month." },
    ],
    results: [
      { val: "24×",  label: "Organic Traffic Growth" },
      { val: "320%", label: "Organic Revenue" },
      { val: "48k",  label: "Monthly Visitors" },
      { val: "8mo",  label: "To Top Rankings" },
    ],
    outcome: "RankUp now gets 48,000 monthly organic visitors, up from 2,000. Organic has overtaken paid as their #1 acquisition channel, reducing their total marketing spend by 40% while growing revenue.",
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
              marginBottom: 16,
            }}>
              Start a Similar Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

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

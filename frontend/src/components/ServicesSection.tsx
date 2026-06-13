"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, TrendingUp, Monitor, Smartphone, Code2, Palette } from "lucide-react";

const SERVICES = [
  { num: "01", label: "360 Marketing",        title: "Marketing That Moves People",         desc: "Full-funnel campaigns, brand storytelling, and growth strategies that turn audiences into loyal customers.",   features: ["Brand Strategy", "SEO & SEM", "Social Media", "Email Campaigns", "Content Marketing"],  image: "/home/services/marketting.webp",              bg: "#0b2010", accent: "#ff6a00", icon: (a: string) => <TrendingUp size={64} stroke={a} strokeWidth={2} /> },
  { num: "02", label: "Website Design",        title: "Websites That Convert",               desc: "Beautiful, fast, and conversion-optimised web experiences that make your brand look world-class.",           features: ["UI/UX Design", "Landing Pages", "E-Commerce", "CMS Integration", "Responsive"],            image: "/home/services/website-service.webp",         bg: "#07102a", accent: "#ff6a00", icon: (a: string) => <Monitor size={64} stroke={a} strokeWidth={2} /> },
  { num: "03", label: "App Development",       title: "Apps People Love to Use",             desc: "Native and cross-platform mobile apps built for performance, scale, and seamless user experience.",         features: ["iOS & Android", "React Native", "Flutter", "API Integration", "App Store Launch"],          image: "/home/services/mobile-app-service.webp",      bg: "#221e05", accent: "#ff6a00", icon: (a: string) => <Smartphone size={64} stroke={a} strokeWidth={2} /> },
  { num: "04", label: "Software Development",  title: "Software Built for Scale",            desc: "Custom software from MVPs to enterprise platforms — clean architecture and reliable, fast delivery.",       features: ["SaaS Products", "Backend Systems", "Cloud Architecture", "DevOps", "API Integrations"],      image: "/home/services/software-design-service.webp", bg: "#160825", accent: "#ff6a00", icon: (a: string) => <Code2 size={64} stroke={a} strokeWidth={2} /> },
  { num: "05", label: "SEO",                   title: "Rank Higher, Grow Faster",            desc: "Technical SEO, content strategy, and link building that gets you to page one and keeps you there.",        features: ["Technical SEO", "Keyword Research", "Link Building", "On-Page SEO", "Analytics"],            image: "/home/services/seo-service.webp",             bg: "#071a10", accent: "#ff6a00", icon: (a: string) => <TrendingUp size={64} stroke={a} strokeWidth={2} /> },
  { num: "06", label: "Branding",              title: "Identity That Sticks",                desc: "From logo to brand system — we craft identities that are memorable, consistent, and built to scale.",      features: ["Logo Design", "Brand Guidelines", "Typography", "Colour Systems", "Brand Voice"],            image: "/home/services/branding-service.webp",        bg: "#1a0a20", accent: "#ff6a00", icon: (a: string) => <Palette size={64} stroke={a} strokeWidth={2} /> },
  { num: "07", label: "Graphic Design",        title: "Visuals That Make You Unforgettable", desc: "From marketing materials to social graphics — design that tells your story powerfully at a glance.",      features: ["Print Design", "Social Graphics", "Packaging", "Presentations", "Motion Graphics"],          image: "/home/services/graphic-design-service.webp",  bg: "#25060e", accent: "#ff6a00", icon: (a: string) => <Palette size={64} stroke={a} strokeWidth={2} /> },
  { num: "08", label: "Product Photography",   title: "Shots That Sell",                     desc: "Studio-quality product photography that makes your products irresistible on any platform.",                features: ["Studio Shoots", "Lifestyle Photos", "E-Commerce Images", "Retouching", "Video"],            image: "/home/services/product-photogrpahy.webp",     bg: "#0a1020", accent: "#ff6a00", icon: (a: string) => <Monitor size={64} stroke={a} strokeWidth={2} /> },
];

const STATS = [
  { target: 120, suffix: "+", label: "Happy Clients" },
  { target: 300, suffix: "+", label: "Projects Delivered" },
  { target: 5,   suffix: "+", label: "Years of Experience" },
  { target: 98,  suffix: "%", label: "Client Satisfaction" },
];

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    <section ref={ref} className="w-full py-20 px-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-2 py-8 px-8"
            style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <span className="tracking-tighter" style={{
              fontSize: "clamp(38px,4.5vw,62px)", lineHeight: 1, letterSpacing: "-2px",
              color: triggered ? "var(--fg)" : "var(--muted)",
              transition: `color 0.55s ease ${(i * 0.13).toFixed(2)}s`,
            }}>
              {counts[i]}{s.suffix}
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.12em]" style={{
              color: "var(--muted)",
              opacity: triggered ? 1 : 0,
              transform: triggered ? "translateY(0)" : "translateY(5px)",
              transition: `opacity 0.45s ease ${(i * 0.13 + 0.2).toFixed(2)}s, transform 0.45s ease ${(i * 0.13 + 0.2).toFixed(2)}s`,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServicesSection({ theme }: { theme: "dark" | "light" }) {
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
        floatRef.current.style.transform = `translate(${lerpRef.current.x + 28}px, ${lerpRef.current.y - 110}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <>
      <section style={{ borderTop: "1px solid var(--border)" }}>
        {/* Header */}
        <div className="max-w-6xl mx-auto pt-20 pb-12 px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shrink-0 inline-block" />
              Our Services
            </span>
            <h2 className="text-[var(--fg)]" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-2px", lineHeight: 1.05 }}>
              What we{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                do best
              </span>
            </h2>
          </div>
          <p className="text-[var(--muted)] text-[14px] leading-relaxed md:text-right" style={{ maxWidth: "280px" }}>
            Five disciplines. One studio. All built to move your brand forward.
          </p>
        </div>

        {/* List rows */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {SERVICES.map((svc, i) => {
            const isHovered = hoveredIdx === i;
            const isTapped = tappedIdx === i;
            const isActive = isHovered || isTapped;
            return (
              <div key={svc.num} className="relative" data-cursor-link
                style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onTouchEnd={e => { e.preventDefault(); setTappedIdx(isTapped ? null : i); }}
              >
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ background: "var(--surface)", opacity: isActive ? 1 : 0 }} />

                <div className="relative flex items-center gap-4 md:gap-10 px-6 py-5 md:px-10 md:py-7">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase shrink-0 w-7 transition-colors duration-300"
                    style={{ color: isActive ? "#ff6a00" : "var(--muted)" }}>
                    {svc.num}
                  </span>

                  <div className="flex-1 relative overflow-hidden" style={{ height: "clamp(30px,4.8vw,62px)" }}>
                    <h3 className="absolute inset-0 flex items-center text-[var(--fg)]" style={{
                      fontSize: "clamp(22px,3.8vw,52px)", letterSpacing: "-2px",
                      transform: isActive ? "translateY(-110%)" : "translateY(0%)",
                      transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
                    }}>{svc.label}</h3>
                    <h3 className="absolute inset-0 flex items-center" style={{
                      fontSize: "clamp(22px,3.8vw,52px)", letterSpacing: "-2px",
                      backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                      WebkitBackgroundClip: "text", backgroundClip: "text",
                      WebkitTextFillColor: "transparent", color: "transparent",
                      transform: isActive ? "translateY(0%)" : "translateY(110%)",
                      transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
                    }}>{svc.label}</h3>
                  </div>

                  <div className="hidden md:flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300"
                      style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}>
                      {svc.features.slice(0, 2).join(" · ")}
                    </span>
                  </div>

                  <div className="shrink-0 transition-all duration-300"
                    style={{ transform: isActive ? "translate(3px,-3px) rotate(0deg)" : "translate(0,0)", color: isActive ? "#ff6a00" : "var(--muted)" }}>
                    <ArrowUpRight size={18} stroke="currentColor" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Mobile tap image */}
                <div className="md:hidden overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isTapped ? "240px" : "0px", opacity: isTapped ? 1 : 0 }}>
                  <div className="relative w-full h-[200px]">
                    <img src={svc.image} alt={svc.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">{svc.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating cursor image */}
        <div ref={floatRef} style={{
          position: "fixed", top: 0, left: 0,
          width: "300px", height: "195px",
          borderRadius: "14px", overflow: "hidden",
          pointerEvents: "none", zIndex: 9998,
          opacity: hoveredIdx !== null ? 1 : 0,
          transition: "opacity 0.25s ease",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
          willChange: "transform",
        }}>
          {SERVICES.map((svc, i) => (
            <img key={svc.num} src={svc.image} alt={svc.label} style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: hoveredIdx === i ? 1 : 0,
              transition: "opacity 0.3s ease",
            }} />
          ))}
        </div>
      </section>

      <StatsSection />
    </>
  );
}

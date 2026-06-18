"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const MEGA_SERVICES = [
  { label: "360 Marketing", desc: "Full-funnel campaigns", img: "/home/services/marketting.webp", href: "/services/360-marketing" },
  { label: "Website Design", desc: "Conversion-first websites", img: "/home/services/website-service.webp", href: "/services/website-designing" },
  { label: "App Development", desc: "iOS & Android apps", img: "/home/services/mobile-app-service.webp", href: "/services/app-development" },
  { label: "Software Development", desc: "Custom SaaS & platforms", img: "/home/services/software-design-service.webp", href: "/services/software-development" },
  { label: "SEO", desc: "Rank higher, grow faster", img: "/home/services/seo-service.webp", href: "/services/seo" },
  { label: "Branding", desc: "Identity that sticks", img: "/home/services/branding-service.webp", href: "/services/branding" },
  { label: "Graphic Design", desc: "Visuals that convert", img: "/home/services/graphic-design-service.webp", href: "/services/graphic-design" },
  { label: "Product Photography", desc: "Shots that sell", img: "/home/services/product-photogrpahy.webp", href: "/services/product-photography" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/story" },
  { label: "Our Team", href: "/team" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const ACTIVE_GRAD: React.CSSProperties = {
  background: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ── Services Mega Menu ─────────────────────────── */
function ServicesMegaMenu({ isDark, isServicesActive }: { isDark: boolean; isServicesActive: boolean }) {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navColor = isDark ? "text-white/65" : "text-black/60";
  const navHover = isDark ? "hover:bg-white/[0.07] hover:text-white" : "hover:bg-black/[0.05] hover:text-black";

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 130); };

  const gradStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <div className={`inline-flex items-center transition-all duration-150 ${open ? (isDark ? "bg-white/[0.07]" : "bg-black/[0.05]") : ""}`}>
        <Link href="/services"
          className={`flex items-center px-3 py-1.5 text-[13px] font-medium transition-all duration-150 no-underline
            ${isServicesActive ? "" : `${navColor} ${navHover}`}`}
          style={isServicesActive ? ACTIVE_GRAD : {}}
        >
          Services
        </Link>
        <button
          onClick={() => { if (timer.current) clearTimeout(timer.current); setOpen(o => !o); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px 6px 0", display: "flex", alignItems: "center", ...(isServicesActive ? ACTIVE_GRAD : { color: "currentColor" }) }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            style={{ transition: "transform 0.22s", transform: open ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.5 }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dropdown panel */}
      <div onMouseEnter={show} onMouseLeave={hide} style={{
        position: "absolute", top: "calc(100% + 10px)", left: "50%",
        width: 580, zIndex: 200,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transform: open ? "translateX(-50%) translateY(0px)" : "translateX(-50%) translateY(-8px)",
        transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Tip */}
        <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 5, overflow: "hidden" }}>
          <div style={{
            width: 8, height: 8, margin: "2px auto 0",
            background: isDark ? "rgb(14,15,26)" : "rgb(255,255,255)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            transform: "rotate(45deg)",
          }} />
        </div>
        <div style={{
          background: isDark ? "rgb(14,15,26)" : "rgb(255,255,255)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 0, padding: 12,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 24px 64px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.9)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4,
        }}>
          {MEGA_SERVICES.map((svc, i) => {
            const isHov = hoveredItem === i;
            return (
              <Link key={i} href={svc.href}
                className="no-underline flex items-center gap-3 p-2.5 transition-colors duration-150"
                style={{ color: "var(--fg)" }}
                onMouseEnter={e => { setHoveredItem(i); (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { setHoveredItem(null); (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                <div style={{ width: 54, height: 42, borderRadius: 0, overflow: "hidden", flexShrink: 0, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                  <img src={svc.img} alt={svc.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, height: "1.3em", overflow: "hidden", position: "relative" }}>
                    <span style={{
                      display: "block",
                      transform: isHov ? "translateY(-100%)" : "translateY(0)",
                      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                      ...(isHov ? gradStyle : { color: "var(--fg)" }),
                    }}>{svc.label}</span>
                    <span style={{
                      display: "block", position: "absolute", top: 0, left: 0,
                      transform: isHov ? "translateY(0)" : "translateY(100%)",
                      transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                      ...gradStyle,
                    }}>{svc.label}</span>
                  </div>
                  <p style={{ fontSize: 11, margin: "2px 0 0", lineHeight: 1.3, color: "var(--muted)" }}>{svc.desc}</p>
                </div>
                <ArrowUpRight size={12} style={{ color: "var(--muted)", flexShrink: 0, opacity: isHov ? 0.6 : 0, transition: "opacity 0.15s" }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Header ─────────────────────────────────────── */
export default function Header({
  theme, onToggle, scrolled, hidden = false,
}: {
  theme: "dark" | "light";
  onToggle: () => void;
  scrolled: boolean;
  hidden?: boolean;
}) {
  const pathname = usePathname();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const borderCls = isDark ? "border-white/10" : "border-black/10";
  const glassBg = isDark ? "bg-[rgba(14,15,26,0.75)]" : "bg-white/75";
  const navColor = isDark ? "text-white/65" : "text-black/60";
  const navHover = isDark ? "hover:bg-white/[0.07] hover:text-white" : "hover:bg-black/[0.05] hover:text-black";
  const iconBg = isDark ? "bg-white/[0.07] border-white/10" : "bg-black/[0.05] border-black/[0.08]";

  const isActive = (href: string) => pathname === href;

  return (
    <div
      className="fixed z-50"
      style={{
        top: scrolled ? "10px" : "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 60px)",
        maxWidth: scrolled ? "1400px" : "960px",
        transition: "top 0.45s cubic-bezier(0.4,0,0.2,1), max-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        willChange: "max-width, top",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : undefined,
      }}
    >
      {/* Main bar */}
      <header className={`
        flex items-center h-12 px-1.5 pl-4
        ${glassBg} backdrop-blur-xl
        border-t border-l border-r ${borderCls}
        ${menuOpen ? "rounded-t-[14px] border-b border-b-transparent" : `border-b ${borderCls}`}
        ${isDark
          ? "shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"}
      `}>
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline whitespace-nowrap">
          <img src={isDark ? "/brand-white-logo.png" : "/brand-black-logo.png"} alt="Brand Edge" style={{ height: 30, width: "auto", display: "block" }} />
        </Link>

        {!isMobile && <div className={`w-px h-5 mx-5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />}

        {/* Nav — desktop */}
        {!isMobile && (
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.slice(0, 2).map(({ label, href }) => (
              <Link
                key={label} href={href}
                className={`px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150
                  ${isActive(href) ? "" : `${navColor} ${navHover}`}`}
                style={isActive(href) ? ACTIVE_GRAD : {}}
              >
                {label}
              </Link>
            ))}
            <ServicesMegaMenu isDark={isDark} isServicesActive={pathname === "/services" || pathname.startsWith("/services/")} />
            {NAV_LINKS.slice(2).map(({ label, href }) => (
              <Link
                key={label} href={href}
                className={`px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150
                  ${isActive(href) ? "" : `${navColor} ${navHover}`}`}
                style={isActive(href) ? ACTIVE_GRAD : {}}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {isMobile && <div className="flex-1" />}

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button onClick={onToggle}
            className={`w-[34px] h-[34px] border flex items-center justify-center cursor-pointer transition-all duration-200 text-[var(--fg)] ${iconBg}`}>
            {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>

          {!isMobile && (
            <Link href="/consultation"
              className="group inline-flex items-center gap-2 h-9 px-4 no-underline transition-all duration-200"
              style={{
                backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                borderRadius: 0,
                boxShadow: "0 4px 18px rgba(255,106,0,0.35)",
                color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.55)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 18px rgba(255,106,0,0.35)"; }}
            >
              Get Consultation
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)}
              className={`w-[34px] h-[34px] rounded-[9px] border flex flex-col items-center justify-center gap-[4px] cursor-pointer ${iconBg}`}>
              <span className={`block w-3.5 h-[1.5px] bg-[var(--fg)] rounded transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-[5.5px]" : ""}`} />
              <span className={`block w-3.5 h-[1.5px] bg-[var(--fg)] rounded transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-3.5 h-[1.5px] bg-[var(--fg)] rounded transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-[5.5px]" : ""}`} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div className={`${glassBg} backdrop-blur-xl border-l border-r border-b ${borderCls} rounded-b-[14px] pb-3 overflow-hidden`}
          style={{ animation: "slideDown 0.22s ease forwards" }}>
          <div className="flex flex-col gap-0.5 p-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className={`block px-3.5 py-2.5 rounded-[9px] text-sm font-medium no-underline transition-all duration-150
                  ${isActive(href) ? "" : `${navColor} ${navHover}`}`}
                style={isActive(href) ? ACTIVE_GRAD : {}}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => setMobileServicesOpen(o => !o)}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-[9px] text-sm font-medium transition-all duration-150 cursor-pointer border-none bg-transparent text-left ${navColor} ${navHover}`}
            >
              <span>Services</span>
              <svg width="14" height="14" viewBox="0 0 10 10" fill="none"
                style={{ transition: "transform 0.22s", transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.5, flexShrink: 0 }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Services sub-grid */}
          <div style={{ maxHeight: mobileServicesOpen ? "600px" : "0px", overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "4px 10px 10px" }}>
              {MEGA_SERVICES.map((svc, i) => (
                <Link key={i} href={svc.href} className="no-underline overflow-hidden flex flex-col"
                  style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}>
                  <div style={{ height: 70, overflow: "hidden" }}>
                    <img src={svc.img} alt={svc.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: "var(--fg)", lineHeight: 1.3 }}>{svc.label}</p>
                    <p style={{ fontSize: 10, margin: "2px 0 0", color: "var(--muted)", lineHeight: 1.3 }}>{svc.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="px-2 pt-1">
            <Link href="/consultation" className="w-full h-10 text-white font-bold text-sm flex items-center justify-center gap-2 no-underline"
              style={{ backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", borderRadius: 0, boxShadow: "0 4px 16px rgba(255,106,0,0.35)" }}>
              Get Consultation
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

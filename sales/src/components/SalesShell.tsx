"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

// ── Icons ──────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const FunnelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const CheckSquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

// ── Nav config ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/",               label: "Dashboard",      icon: GridIcon },
  { href: "/clients",        label: "Clients",        icon: UsersIcon },
  { href: "/follow-ups",     label: "Follow-ups",     icon: ClockIcon },
  { href: "/pipeline",       label: "Pipeline",       icon: FunnelIcon },
  { href: "/closed-clients", label: "Closed Clients", icon: CheckSquareIcon },
  { href: "/reports",        label: "Reports",        icon: FileTextIcon },
];

const PAGE_TITLES: Record<string, string> = {
  "/":               "Dashboard",
  "/clients":        "Clients",
  "/follow-ups":     "Follow-ups",
  "/pipeline":       "Pipeline",
  "/closed-clients": "Closed Clients",
  "/reports":        "Reports",
};

// ── SalesShell ─────────────────────────────────────────────────────────────
export default function SalesShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [theme, setTheme]     = useState<"dark" | "light">("dark");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const savedTheme     = (localStorage.getItem("sales-theme") as "dark" | "light") || "dark";
    const savedCollapsed = localStorage.getItem("sales-sidebar-collapsed") === "true";
    setTheme(savedTheme);
    setCollapsed(savedCollapsed);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.style.setProperty("--sidebar-w", savedCollapsed ? "60px" : "240px");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sales-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-w", collapsed ? "60px" : "240px");
    localStorage.setItem("sales-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname === "/login") return <>{children}</>;

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const sidebarW    = collapsed ? 60 : 240;
  const pageTitle   = PAGE_TITLES[pathname] ?? "Sales";
  const isDark      = theme === "dark";

  const sb = {
    bg:         isDark ? "#0d0d0d" : "#f8f8f8",
    border:     isDark ? "#1e1e1e" : "#e2e2e2",
    title:      isDark ? "#ffffff" : "#111111",
    sub:        isDark ? "#4a4a4a" : "#aaaaaa",
    text:       isDark ? "#888888" : "#666666",
    hover:      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    btnBg:      isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    btnBorder:  isDark ? "#2a2a2a" : "#d8d8d8",
    btnColor:   isDark ? "#888888" : "#555555",
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const isCollapsed = !isMobile && collapsed;
    return (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: sb.bg, borderRight: `1px solid ${sb.border}`, overflow: "hidden", transition: "background 0.2s",
      }}>
        <div style={{
          height: 56, display: "flex", alignItems: "center",
          padding: isCollapsed ? "0 14px" : "0 18px", gap: 10,
          borderBottom: `1px solid ${sb.border}`, flexShrink: 0,
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width: 30, height: 30,
            backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "-0.5px" }}>BE</span>
          </div>
          {!isCollapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: sb.title, fontWeight: 700, fontSize: 13, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                Brand Edge
              </div>
              <div style={{ color: sb.sub, fontSize: 10, whiteSpace: "nowrap", marginTop: 1, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Sales Panel
              </div>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{
              marginLeft: "auto", background: "transparent", border: "none",
              color: sb.text, cursor: "pointer", display: "flex", alignItems: "center", padding: 4,
            }}>
              <XIcon />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: isCollapsed ? "10px 0" : "10px 12px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                textDecoration: "none",
                color: isActive ? "#fff" : sb.text,
                backgroundImage: isActive ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
                backgroundColor: isActive ? undefined : "transparent",
                borderLeft: isActive ? "3px solid rgba(255,255,255,0.55)" : "3px solid transparent",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: "color 0.15s, background 0.15s", cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = sb.title;
                  (e.currentTarget as HTMLAnchorElement).style.background = sb.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = sb.text;
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }
              }}>
                <span style={{ flexShrink: 0, display: "flex" }}><Icon /></span>
                {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{
          borderTop: `1px solid ${sb.border}`,
          padding: isCollapsed ? "12px 8px" : "12px 16px",
          display: "flex", flexDirection: isCollapsed ? "column" : "row",
          alignItems: "center", gap: 8, flexShrink: 0,
        }}>
          <button onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"} style={{
            background: sb.btnBg, border: `1px solid ${sb.btnBorder}`, color: sb.btnColor, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: 0, flexShrink: 0, transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = sb.title; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = sb.btnColor; }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          {!isCollapsed && (
            <button onClick={handleLogout} style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: sb.text, fontSize: 12, fontWeight: 500, fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6, padding: "4px 0", whiteSpace: "nowrap",
            }}>
              <LogOutIcon />
              Logout
            </button>
          )}
          {!isMobile && (
            <button onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expand" : "Collapse"} style={{
              background: sb.btnBg, border: `1px solid ${sb.btnBorder}`, color: sb.btnColor, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: 0, flexShrink: 0,
              marginLeft: isCollapsed ? 0 : "auto", transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = sb.title; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = sb.btnColor; }}>
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: sidebarW,
        zIndex: 100, display: "none", transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
      }} className="md-sidebar">
        <style>{`@media(min-width:768px){.md-sidebar{display:block!important}}`}</style>
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
          <div style={{ position: "relative", zIndex: 201, height: "100%", width: 240 }}>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      <div className="sales-main" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{
          height: 56, borderBottom: "1px solid var(--border)", background: "var(--surface)",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 12,
          position: "sticky", top: 0, zIndex: 50, flexShrink: 0,
        }}>
          <button onClick={() => setMobileOpen(true)} style={{
            background: "transparent", border: "none", color: "var(--fg)",
            cursor: "pointer", display: "flex", alignItems: "center", padding: 4, borderRadius: 0,
          }} className="mobile-menu-btn">
            <style>{`@media(min-width:768px){.mobile-menu-btn{display:none!important}}`}</style>
            <MenuIcon />
          </button>

          <h1 style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", margin: 0, flex: 1 }}>
            {pageTitle}
          </h1>

          <button onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 0,
          }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
}

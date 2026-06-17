"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

/* ── Constants ─────────────────────────────────────── */
const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

const STEPS = [
  { id: 1, label: "About You",    desc: "Your contact info" },
  { id: 2, label: "Company",      desc: "Tell us about your team" },
  { id: 3, label: "Project",      desc: "Goals & requirements" },
  { id: 4, label: "Schedule",     desc: "Pick a meeting slot" },
  { id: 5, label: "Confirm",      desc: "Review & submit" },
];

const SERVICES = [
  "360 Marketing", "Website Design", "App Development",
  "SEO", "Branding", "Graphic Design",
  "Software Development", "Product Photography",
];

const TEAM_SIZES = [
  { label: "Solo", sub: "Just me" },
  { label: "2–10", sub: "Small team" },
  { label: "11–50", sub: "Growing team" },
  { label: "50+", sub: "Enterprise" },
];

const BUDGETS = [
  { label: "< Rs. 50k",      sub: "Starter" },
  { label: "Rs. 50k–2L",    sub: "Growth" },
  { label: "Rs. 2L–5L",     sub: "Scale" },
  { label: "Rs. 5L+",       sub: "Enterprise" },
];

const URGENCY = [
  { label: "ASAP",         sub: "Within 1 week" },
  { label: "This Month",   sub: "2–4 weeks" },
  { label: "Next Quarter", sub: "1–3 months" },
  { label: "Flexible",     sub: "No rush" },
];

const INDUSTRIES = [
  "E-Commerce", "SaaS / Tech", "Healthcare", "Education",
  "Finance", "Fashion & Lifestyle", "Food & Beverage",
  "Real Estate", "Agency", "Other",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const TIME_SLOTS = [
  { label: "Morning",   sub: "9am – 12pm" },
  { label: "Afternoon", sub: "12pm – 4pm" },
  { label: "Evening",   sub: "4pm – 7pm" },
];

const TIMEZONE = "PKT (UTC+5:00)";

/* ── Form state ─────────────────────────────────────── */
interface Form {
  // Step 1
  name: string; email: string; phone: string;
  // Step 2
  company: string; teamSize: string; industry: string; website: string;
  // Step 3
  services: string[]; budget: string; urgency: string; goals: string;
  // Step 4
  days: string[]; timeSlot: string; timezone: string;
}

const EMPTY: Form = {
  name: "", email: "", phone: "",
  company: "", teamSize: "", industry: "", website: "",
  services: [], budget: "", urgency: "", goals: "",
  days: [], timeSlot: "", timezone: TIMEZONE,
};

/* ── Shared input styles ────────────────────────────── */
function useInputStyles(isDark: boolean, focused: string | null) {
  const base = (name: string): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%", borderRadius: 0, fontSize: 14, color: "var(--fg)",
      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
      padding: "13px 15px",
      backgroundColor: isFoc ? "transparent" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
      backgroundImage: isFoc
        ? (isDark
            ? "linear-gradient(rgba(14,15,26,1),rgba(14,15,26,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
            : "linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1)), linear-gradient(135deg,#ff6a00,#ee0979)")
        : "none",
      backgroundOrigin: isFoc ? "border-box" : "padding-box",
      backgroundClip: isFoc ? "padding-box, border-box" : "border-box",
      border: isFoc ? "2px solid transparent" : "2px solid var(--border)",
      transition: "background-color 0.2s ease",
    };
  };
  return base;
}

/* ── Chip button (multi-select) ─────────────────────── */
function Chip({ label, sub, selected, onClick, gradient }: {
  label: string; sub?: string; selected: boolean;
  onClick: () => void; gradient: string;
}) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      gap: 2, padding: sub ? "14px 18px" : "10px 18px",
      border: selected ? "2px solid transparent" : "2px solid var(--border)",
      borderRadius: 0, cursor: "pointer", fontFamily: "inherit",
      backgroundColor: selected ? "transparent" : "var(--surface)",
      backgroundImage: selected
        ? `linear-gradient(var(--bg),var(--bg)), ${gradient}`
        : "none",
      backgroundOrigin: selected ? "border-box" : "padding-box",
      backgroundClip: selected ? "padding-box, border-box" : "border-box",
      transition: "background-color 0.2s ease, border-color 0.2s ease",
      flex: "1 1 auto",
      minWidth: 100,
    }}>
      <span style={{
        fontSize: 13, fontWeight: 700,
        backgroundImage: selected ? gradient : "none",
        WebkitBackgroundClip: selected ? "text" : "unset",
        backgroundClip: selected ? "text" : "unset",
        WebkitTextFillColor: selected ? "transparent" : "unset",
        color: selected ? "transparent" : "var(--fg)",
      }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{sub}</span>}
    </button>
  );
}

/* ── Step indicator ─────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: "50%",
                backgroundImage: done || active ? GRADIENT : "none",
                backgroundColor: done || active ? "transparent" : "var(--surface)",
                border: done || active ? "none" : "2px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: done || active ? "#fff" : "var(--muted)",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : s.id}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                color: active ? "#ff6a00" : done ? "var(--fg)" : "var(--muted)",
                display: "none",
              }} className="step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 6px",
                marginBottom: 20,
                backgroundImage: done ? GRADIENT : "none",
                backgroundColor: done ? "transparent" : "var(--border)",
                transition: "background-color 0.3s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Summary row ─────────────────────────────────────── */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      gap: 20, padding: "14px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500, textAlign: "right" }}>
        {value || "—"}
      </span>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function ConsultationPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field: string, val: string) => {
    if (field === "name") return val.trim().length >= 2;
    if (field === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    if (field === "phone") return val === "" || val.replace(/\D/g, "").length >= 10;
    if (field === "company") return val.trim().length >= 1;
    if (field === "website") return val === "" || val.trim().length > 3;
    if (field === "goals") return val.trim().length >= 10;
    return true;
  };

  const touch = (field: string) => setTouched(t => ({ ...t, [field]: true }));

  const fieldIcon = (field: string, val: string, forTextarea = false) => {
    if (!touched[field]) return null;
    const ok = validate(field, val);
    const style: React.CSSProperties = forTextarea
      ? { position: "absolute", right: 12, top: 14, pointerEvents: "none" }
      : { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" };
    return ok ? (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
        <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5"/>
        <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
        <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5"/>
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const inputStyle = useInputStyles(isDark, focused);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  const set = (key: keyof Form, val: string) => setForm(f => ({ ...f, [key]: val }));

  const toggleArr = (key: "services" | "days", val: string) => {
    setForm(f => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const goNext = () => {
    if (contentRef.current) {
      contentRef.current.style.opacity = "0";
      contentRef.current.style.transform = "translateX(20px)";
    }
    setTimeout(() => {
      setStep(s => s + 1);
      if (contentRef.current) {
        contentRef.current.style.transform = "translateX(-20px)";
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)";
            contentRef.current.style.opacity = "1";
            contentRef.current.style.transform = "translateX(0)";
          }
        }, 30);
      }
    }, 200);
  };

  const goBack = () => {
    if (contentRef.current) {
      contentRef.current.style.opacity = "0";
      contentRef.current.style.transform = "translateX(-20px)";
    }
    setTimeout(() => {
      setStep(s => s - 1);
      if (contentRef.current) {
        contentRef.current.style.transform = "translateX(20px)";
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)";
            contentRef.current.style.opacity = "1";
            contentRef.current.style.transform = "translateX(0)";
          }
        }, 30);
      }
    }, 200);
  };

  const handleSubmit = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1600));
    setSending(false);
    setSubmitted(true);
  };

  const canNext = () => {
    if (step === 1) return form.name && form.email;
    if (step === 2) return form.company && form.teamSize;
    if (step === 3) return form.services.length > 0 && form.urgency;
    if (step === 4) return form.days.length > 0 && form.timeSlot;
    return true;
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--muted)", marginBottom: 8,
  };

  const fieldGap: React.CSSProperties = { marginBottom: 20 };

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}>
      <style>{`
        ::placeholder { color: var(--muted); opacity: 0.55; }
        select option { background: var(--bg); color: var(--fg); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      {submitted ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "120px 24px 80px", textAlign: "center",
          animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          <div style={{
            width: 72, height: 72, backgroundImage: GRADIENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 28,
          }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M5 15l7 7L25 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 999,
            border: "1px solid var(--border)", background: "var(--surface)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#ff6a00", marginBottom: 20,
          }}>
            Confirmed
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-2px", color: "var(--fg)", margin: "0 0 16px", lineHeight: 1.1 }}>
            We&apos;ll see you{" "}
            <span style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              soon, {form.name.split(" ")[0]}.
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, maxWidth: 420, margin: "0 0 36px" }}>
            Your consultation request has been received. Our team will reach out to <strong style={{ color: "var(--fg)" }}>{form.email}</strong> within 24 hours to confirm your slot.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", backgroundImage: GRADIENT, color: "#fff",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(255,106,0,0.35)",
            }}>
              Back to Home
            </a>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm(EMPTY); }}
              style={{
                padding: "13px 28px", border: "2px solid var(--border)",
                background: "transparent", color: "var(--fg)",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}>
              New Request
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "clamp(80px,10vh,120px) 24px 80px", display: "flex", flexDirection: "column" }}>

            {/* Mobile step bar */}
            <div style={{ marginBottom: 40 }}>
              <StepBar current={step} />
            </div>

            {/* Step header */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 8px" }}>
                Step {step} of {STEPS.length}
              </p>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 500, letterSpacing: "-1px", color: "var(--fg)", margin: "0 0 8px", lineHeight: 1.15 }}>
                {STEPS[step - 1].label}
              </h1>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
                {STEPS[step - 1].desc}
              </p>
            </div>

            {/* Step content */}
            <div ref={contentRef} style={{ flex: 1, transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}>

              {/* ── Step 1: About You ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", maxWidth: 520 }}>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Full Name <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input type="text" placeholder="John Doe" value={form.name}
                        onChange={e => set("name", e.target.value)}
                        onFocus={() => setFocused("name")} onBlur={() => { setFocused(null); touch("name"); }}
                        style={{ ...inputStyle("name"), paddingRight: touched["name"] ? 40 : 15 }} />
                      {fieldIcon("name", form.name)}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Email Address <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input type="email" placeholder="john@company.com" value={form.email}
                        onChange={e => set("email", e.target.value)}
                        onFocus={() => setFocused("email")} onBlur={() => { setFocused(null); touch("email"); }}
                        style={{ ...inputStyle("email"), paddingRight: touched["email"] ? 40 : 15 }} />
                      {fieldIcon("email", form.email)}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Phone Number</label>
                    <div style={{ position: "relative" }}>
                      <input type="tel" placeholder="+92 300 1234567" value={form.phone}
                        onChange={e => set("phone", e.target.value)}
                        onFocus={() => setFocused("phone")} onBlur={() => { setFocused(null); touch("phone"); }}
                        style={{ ...inputStyle("phone"), paddingRight: touched["phone"] ? 40 : 15 }} />
                      {fieldIcon("phone", form.phone)}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Company ── */}
              {step === 2 && (
                <div style={{ maxWidth: 560 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={labelStyle}>Company Name <span style={{ color: "#ff6a00" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <input type="text" placeholder="Acme Inc." value={form.company}
                          onChange={e => set("company", e.target.value)}
                          onFocus={() => setFocused("company")} onBlur={() => { setFocused(null); touch("company"); }}
                          style={{ ...inputStyle("company"), paddingRight: touched["company"] ? 40 : 15 }} />
                        {fieldIcon("company", form.company)}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Website</label>
                      <div style={{ position: "relative" }}>
                        <input type="url" placeholder="acme.com" value={form.website}
                          onChange={e => set("website", e.target.value)}
                          onFocus={() => setFocused("website")} onBlur={() => { setFocused(null); touch("website"); }}
                          style={{ ...inputStyle("website"), paddingRight: touched["website"] ? 40 : 15 }} />
                        {fieldIcon("website", form.website)}
                      </div>
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Team Size <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {TEAM_SIZES.map(t => (
                        <Chip key={t.label} label={t.label} sub={t.sub}
                          selected={form.teamSize === t.label}
                          onClick={() => set("teamSize", t.label)} gradient={GRADIENT} />
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Industry</label>
                    <div style={{ position: "relative" }}>
                      <select value={form.industry} onChange={e => set("industry", e.target.value)}
                        onFocus={() => setFocused("industry")} onBlur={() => setFocused(null)}
                        style={{ ...inputStyle("industry"), appearance: "none", WebkitAppearance: "none", paddingRight: 40 }}>
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Project ── */}
              {step === 3 && (
                <div style={{ maxWidth: 600 }}>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Service(s) Needed <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {SERVICES.map(svc => (
                        <button key={svc} type="button"
                          onClick={() => toggleArr("services", svc)}
                          style={{
                            padding: "9px 16px", fontSize: 13, fontWeight: 600,
                            border: form.services.includes(svc) ? "2px solid transparent" : "2px solid var(--border)",
                            borderRadius: 0, cursor: "pointer", fontFamily: "inherit",
                            backgroundColor: form.services.includes(svc) ? "transparent" : "var(--surface)",
                            backgroundImage: form.services.includes(svc) ? `linear-gradient(var(--bg),var(--bg)), ${GRADIENT}` : "none",
                            backgroundOrigin: form.services.includes(svc) ? "border-box" : "padding-box",
                            backgroundClip: form.services.includes(svc) ? "padding-box, border-box" : "border-box",
                            color: form.services.includes(svc) ? "transparent" : "var(--muted)",
                          }}>
                          <span style={{
                            backgroundImage: form.services.includes(svc) ? GRADIENT : "none",
                            WebkitBackgroundClip: form.services.includes(svc) ? "text" : "unset",
                            backgroundClip: form.services.includes(svc) ? "text" : "unset",
                            WebkitTextFillColor: form.services.includes(svc) ? "transparent" : "unset",
                            color: form.services.includes(svc) ? "transparent" : "var(--muted)",
                          }}>{svc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Budget Range</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {BUDGETS.map(b => (
                        <Chip key={b.label} label={b.label} sub={b.sub}
                          selected={form.budget === b.label}
                          onClick={() => set("budget", b.label)} gradient={GRADIENT} />
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Urgency <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {URGENCY.map(u => (
                        <Chip key={u.label} label={u.label} sub={u.sub}
                          selected={form.urgency === u.label}
                          onClick={() => set("urgency", u.label)} gradient={GRADIENT} />
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Project Goals / Brief</label>
                    <div style={{ position: "relative" }}>
                      <textarea rows={4} placeholder="Tell us what you're trying to achieve — the more detail, the better our call will be."
                        value={form.goals} onChange={e => set("goals", e.target.value)}
                        onFocus={() => setFocused("goals")} onBlur={() => { setFocused(null); touch("goals"); }}
                        style={{ ...inputStyle("goals"), resize: "vertical", minHeight: 110, paddingRight: touched["goals"] ? 40 : 15 }} />
                      {fieldIcon("goals", form.goals, true)}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Schedule ── */}
              {step === 4 && (
                <div style={{ maxWidth: 520 }}>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Preferred Days <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {DAYS.map(d => (
                        <button key={d} type="button"
                          onClick={() => toggleArr("days", d)}
                          style={{
                            flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 700,
                            border: form.days.includes(d) ? "2px solid transparent" : "2px solid var(--border)",
                            borderRadius: 0, cursor: "pointer", fontFamily: "inherit",
                            backgroundColor: form.days.includes(d) ? "transparent" : "var(--surface)",
                            backgroundImage: form.days.includes(d) ? `linear-gradient(var(--bg),var(--bg)), ${GRADIENT}` : "none",
                            backgroundOrigin: form.days.includes(d) ? "border-box" : "padding-box",
                            backgroundClip: form.days.includes(d) ? "padding-box, border-box" : "border-box",
                          }}>
                          <span style={{
                            backgroundImage: form.days.includes(d) ? GRADIENT : "none",
                            WebkitBackgroundClip: form.days.includes(d) ? "text" : "unset",
                            backgroundClip: form.days.includes(d) ? "text" : "unset",
                            WebkitTextFillColor: form.days.includes(d) ? "transparent" : "unset",
                            color: form.days.includes(d) ? "transparent" : "var(--muted)",
                          }}>{d}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Preferred Time <span style={{ color: "#ff6a00" }}>*</span></label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {TIME_SLOTS.map(t => (
                        <Chip key={t.label} label={t.label} sub={t.sub}
                          selected={form.timeSlot === t.label}
                          onClick={() => set("timeSlot", t.label)} gradient={GRADIENT} />
                      ))}
                    </div>
                  </div>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Timezone</label>
                    <div style={{
                      ...inputStyle("tz"),
                      display: "flex", alignItems: "center", gap: 10,
                      color: "var(--muted)", pointerEvents: "none",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M7 3v4l2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                      {TIMEZONE}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: Confirm ── */}
              {step === 5 && (
                <div style={{ maxWidth: 560 }}>
                  <div style={{
                    padding: "24px 28px", border: "1px solid var(--border)",
                    background: "var(--surface)", marginBottom: 28,
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>
                      Your Details
                    </p>
                    <SummaryRow label="Name" value={form.name} />
                    <SummaryRow label="Email" value={form.email} />
                    <SummaryRow label="Phone" value={form.phone} />
                  </div>
                  <div style={{
                    padding: "24px 28px", border: "1px solid var(--border)",
                    background: "var(--surface)", marginBottom: 28,
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>
                      Company
                    </p>
                    <SummaryRow label="Company" value={form.company} />
                    <SummaryRow label="Team Size" value={form.teamSize} />
                    <SummaryRow label="Industry" value={form.industry} />
                    <SummaryRow label="Website" value={form.website} />
                  </div>
                  <div style={{
                    padding: "24px 28px", border: "1px solid var(--border)",
                    background: "var(--surface)", marginBottom: 28,
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>
                      Project
                    </p>
                    <SummaryRow label="Services" value={form.services.join(", ")} />
                    <SummaryRow label="Budget" value={form.budget} />
                    <SummaryRow label="Urgency" value={form.urgency} />
                    {form.goals && <SummaryRow label="Goals" value={form.goals} />}
                  </div>
                  <div style={{
                    padding: "24px 28px", border: "1px solid var(--border)",
                    background: "var(--surface)", marginBottom: 0,
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>
                      Meeting Slot
                    </p>
                    <SummaryRow label="Days" value={form.days.join(", ")} />
                    <SummaryRow label="Time" value={form.timeSlot} />
                    <SummaryRow label="Timezone" value={form.timezone} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Navigation buttons ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40, gap: 16 }}>
              {step > 1 ? (
                <button onClick={goBack} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 24px", border: "2px solid var(--border)",
                  background: "transparent", color: "var(--fg)",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10 7H4M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
              ) : <div />}

              {step < 5 ? (
                <button onClick={goNext} disabled={!canNext()} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 32px", border: "none", cursor: canNext() ? "pointer" : "not-allowed",
                  backgroundImage: GRADIENT, color: "#fff",
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  boxShadow: canNext() ? "0 6px 24px rgba(255,106,0,0.35)" : "none",
                  opacity: canNext() ? 1 : 0.45,
                  transition: "opacity 0.2s ease, box-shadow 0.2s ease",
                }}>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M4 7h6M7 4l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={sending} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 32px", border: "none", cursor: sending ? "not-allowed" : "pointer",
                  backgroundImage: GRADIENT, color: "#fff",
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  boxShadow: "0 6px 24px rgba(255,106,0,0.35)",
                  opacity: sending ? 0.75 : 1,
                }}>
                  {sending ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M7.5 2a5.5 5.5 0 0 1 5.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 32, height: 2, background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                backgroundImage: GRADIENT,
                width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{Math.round(((step - 1) / (STEPS.length - 1)) * 100)}% complete</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Step {step} of {STEPS.length}</span>
            </div>
          </div>
      )}

      <Footer theme={theme} />
    </div>
  );
}

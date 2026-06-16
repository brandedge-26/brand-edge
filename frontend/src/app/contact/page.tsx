"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

const INFO = [
  {
    label: "Email",
    value: "hello@brandedge.co",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="3.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1.5 6l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+91 98765 43210",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 2.5h3.5l1.5 4-2 1.2A10.5 10.5 0 0 0 10.3 12l1.2-2 4 1.5V15c-7.5.5-13-6-12.5-12.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Mumbai, India",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5a5.5 5.5 0 0 1 5.5 5.5c0 4-5.5 9.5-5.5 9.5S3.5 11 3.5 7A5.5 5.5 0 0 1 9 1.5Z" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
];

const SERVICES = [
  "360 Marketing", "Website Design", "App Development",
  "SEO", "Branding", "Graphic Design",
  "Software Development", "Product Photography",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function ContactPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.06 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  const isDark = theme === "dark";
  const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSubmitted(true);
  };

  // Use only specific (non-shorthand) bg properties to avoid React's background vs backgroundImage warning
  const inputBase: React.CSSProperties = {
    width: "100%",
    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    backgroundImage: "none",
    backgroundOrigin: "padding-box",
    backgroundClip: "border-box",
    border: "2px solid var(--border)",
    borderRadius: 0,
    padding: "13px 15px",
    fontSize: 14,
    color: "var(--fg)",
    outline: "none",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const inputFocused: React.CSSProperties = {
    width: "100%",
    backgroundColor: "transparent",
    backgroundImage: isDark
      ? "linear-gradient(rgba(14,15,26,1),rgba(14,15,26,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
      : "linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1)), linear-gradient(135deg,#ff6a00,#ee0979)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    border: "2px solid transparent",
    borderRadius: 0,
    padding: "13px 15px",
    fontSize: 14,
    color: "var(--fg)",
    outline: "none",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const getInputStyle = (name: string) => focused === name ? inputFocused : inputBase;

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column" }}>
      <style>{`
        ::placeholder { color: var(--muted); opacity: 0.6; }
        select option { background: var(--bg); color: var(--fg); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; align-items: start; }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 500px) {
          .contact-grid { gap: 36px; }
        }
      `}</style>

      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        style={{
          padding: "clamp(120px,16vh,180px) 24px 0",
          maxWidth: 1100, margin: "0 auto", width: "100%",
          opacity: 0, transform: "translateY(28px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Badge */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 999,
            border: "1px solid var(--border)", background: "var(--surface)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--muted)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6a00", display: "inline-block" }} />
            Get In Touch
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 80px)",
          fontWeight: 400, letterSpacing: "-3px", lineHeight: 1.02,
          margin: "0 0 24px", color: "var(--fg)",
        }}>
          Let&apos;s build something{" "}
          <span style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            great.
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(14px, 1.3vw, 17px)",
          color: "var(--muted)", lineHeight: 1.75,
          maxWidth: 480, margin: 0,
        }}>
          Tell us about your project and we&apos;ll get back to you within 24 hours with a plan tailored to your goals.
        </p>
      </div>

      {/* ── Main content ── */}
      <div
        ref={formRef}
        style={{
          padding: "clamp(56px,8vh,100px) 24px clamp(64px,10vh,120px)",
          maxWidth: 1100, margin: "0 auto", width: "100%",
          opacity: 0, transform: "translateY(32px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s",
          boxSizing: "border-box",
        }}
      >
        <div className="contact-grid">

          {/* ── Left: info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

            {/* Info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {INFO.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "20px 0",
                  borderBottom: i < INFO.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{
                    width: 42, height: 42, flexShrink: 0,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted)",
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--fg)", margin: 0 }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
              border: "1px solid var(--border)",
              background: "var(--border)",
              overflow: "hidden",
            }}>
              {[
                { val: "50+", label: "Brands Launched" },
                { val: "98%", label: "Client Retention" },
                { val: "24h", label: "Response Time" },
                { val: "5★", label: "Avg. Rating" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "var(--bg)",
                  padding: "24px 20px",
                  textAlign: "center",
                }}>
                  <p style={{
                    fontSize: "clamp(28px, 3vw, 36px)",
                    letterSpacing: "-1.5px", lineHeight: 1,
                    backgroundImage: GRADIENT,
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: "0 0 6px",
                  }}>{s.val}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "clamp(28px,4vw,48px)",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div style={{
                  width: 56, height: 56,
                  backgroundImage: GRADIENT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--fg)", margin: "0 0 10px" }}>
                    Message Sent!
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
                    We&apos;ll review your message and get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                  style={{
                    padding: "10px 24px", border: "1px solid var(--border)",
                    background: "transparent", color: "var(--fg)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    borderRadius: 0, fontFamily: "inherit",
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 8px" }}>
                    Start a Project
                  </p>
                  <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 500, letterSpacing: "-0.8px", color: "var(--fg)", margin: 0, lineHeight: 1.2 }}>
                    Tell us about yourself
                  </h2>
                </div>

                {/* Name + Phone row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                      Name <span style={{ color: "#ff6a00" }}>*</span>
                    </label>
                    <input
                      type="text" name="name" required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      style={getInputStyle("name")}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                      Phone
                    </label>
                    <input
                      type="tel" name="phone"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      style={getInputStyle("phone")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                    Email <span style={{ color: "#ff6a00" }}>*</span>
                  </label>
                  <input
                    type="email" name="email" required
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={getInputStyle("email")}
                  />
                </div>

                {/* Service */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                    Service Needed
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      onFocus={() => setFocused("service")}
                      onBlur={() => setFocused(null)}
                      style={{ ...getInputStyle("service"), appearance: "none", WebkitAppearance: "none", paddingRight: 40, cursor: "pointer" }}
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                    Message <span style={{ color: "#ff6a00" }}>*</span>
                  </label>
                  <textarea
                    name="message" required
                    rows={5}
                    placeholder="Tell us about your project, goals, timeline..."
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    style={{ ...getInputStyle("message"), resize: "vertical", minHeight: 130 }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    padding: "16px 32px", border: "none", cursor: sending ? "not-allowed" : "pointer",
                    backgroundImage: GRADIENT, color: "#fff",
                    fontSize: 14, fontWeight: 700, letterSpacing: "0.02em",
                    fontFamily: "inherit", borderRadius: 0,
                    boxShadow: "0 6px 28px rgba(255,106,0,0.35)",
                    opacity: sending ? 0.75 : 1,
                    transition: "opacity 0.2s ease, box-shadow 0.2s ease",
                    width: "100%",
                  }}
                  onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 36px rgba(255,106,0,0.55)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,106,0,0.35)"; }}
                >
                  {sending ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}

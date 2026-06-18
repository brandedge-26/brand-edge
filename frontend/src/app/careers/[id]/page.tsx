"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import api from "@/lib/axios";
import { useToast } from "@/components/Toast";

const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,106,0,0.1);color:#ff6a00;padding:1px 6px;font-size:13px;font-family:monospace">$1</code>');
}

function renderMarkdown(md: string): string {
  if (!md) return "";
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.split("\n").map(line => {
    if (/^### /.test(line)) return `<h3 style="font-size:15px;font-weight:700;color:var(--fg);margin:16px 0 6px;letter-spacing:-0.3px">${applyInline(line.replace(/^### /, ""))}</h3>`;
    if (/^## /.test(line))  return `<h2 style="font-size:17px;font-weight:700;color:var(--fg);margin:20px 0 8px;letter-spacing:-0.4px">${applyInline(line.replace(/^## /, ""))}</h2>`;
    if (/^# /.test(line))   return `<h1 style="font-size:20px;font-weight:700;color:var(--fg);margin:24px 0 10px;letter-spacing:-0.5px">${applyInline(line.replace(/^# /, ""))}</h1>`;
    if (/^[-*] /.test(line)) return `<div style="display:flex;align-items:flex-start;gap:10px;margin:5px 0"><span style="color:#ff6a00;font-weight:700;flex-shrink:0;margin-top:2px">•</span><span style="font-size:15px;color:var(--fg);line-height:1.7">${applyInline(line.replace(/^[-*] /, ""))}</span></div>`;
    if (line.trim() === "") return `<div style="height:8px"></div>`;
    return `<p style="margin:5px 0;font-size:15px;color:var(--fg);line-height:1.7">${applyInline(line)}</p>`;
  }).join("");
}

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements?: string;
  deadline?: string;
  status: "Active" | "Closed";
  createdAt: string;
}

/* ── Apply Form types ───────────────────────────────────────── */
interface ApplyForm {
  name: string;
  email: string;
  phone: string;
  portfolio: string;
  linkedin: string;
  experience: string;
  currentRole: string;
  whyJoin: string;
  skills: string[];
  cv: File | null;
}

const EMPTY_FORM: ApplyForm = {
  name: "",
  email: "",
  phone: "",
  portfolio: "",
  linkedin: "",
  experience: "",
  currentRole: "",
  whyJoin: "",
  skills: [],
  cv: null,
};

const APPLY_STEPS = [
  { id: 1, label: "Personal",     desc: "Your contact details" },
  { id: 2, label: "Professional", desc: "Experience & links" },
  { id: 3, label: "Application",  desc: "Tell us about yourself" },
  { id: 4, label: "Confirm",      desc: "Review & submit" },
];

const EXP_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "10+ years",
];

/* ── Input styles hook ──────────────────────────────────────── */
function useInputStyle(isDark: boolean, focused: string | null) {
  return (name: string): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      borderRadius: 0,
      fontSize: 14,
      color: "var(--fg)",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      padding: "0 14px",
      height: 44,
      backgroundColor: isFoc
        ? "transparent"
        : isDark
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.03)",
      backgroundImage: isFoc
        ? isDark
          ? "linear-gradient(rgba(14,15,26,1),rgba(14,15,26,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
          : "linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
        : "none",
      backgroundOrigin: isFoc ? "border-box" : "padding-box",
      backgroundClip: isFoc ? "padding-box, border-box" : "border-box",
      border: isFoc ? "2px solid transparent" : "2px solid var(--border)",
      transition: "background-color 0.2s ease",
      appearance: "none",
      WebkitAppearance: "none",
    };
  };
}

function useTextareaStyle(isDark: boolean, focused: string | null) {
  return (name: string): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      borderRadius: 0,
      fontSize: 14,
      color: "var(--fg)",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      padding: "12px 14px",
      resize: "vertical",
      backgroundColor: isFoc
        ? "transparent"
        : isDark
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.03)",
      backgroundImage: isFoc
        ? isDark
          ? "linear-gradient(rgba(14,15,26,1),rgba(14,15,26,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
          : "linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
        : "none",
      backgroundOrigin: isFoc ? "border-box" : "padding-box",
      backgroundClip: isFoc ? "padding-box, border-box" : "border-box",
      border: isFoc ? "2px solid transparent" : "2px solid var(--border)",
      transition: "background-color 0.2s ease",
    };
  };
}

/* ── Field validation icon ──────────────────────────────────── */
function FieldIcon({ ok, forTextarea }: { ok: boolean; forTextarea?: boolean }) {
  const style: React.CSSProperties = forTextarea
    ? { position: "absolute", right: 12, top: 14, pointerEvents: "none" }
    : { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" };
  return ok ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Step indicator ─────────────────────────────────────────── */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {APPLY_STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < total - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundImage: done || active ? GRADIENT : "none",
                backgroundColor: done || active ? "transparent" : "var(--surface2)",
                border: done || active ? "none" : "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: done || active ? "#fff" : "var(--muted)",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}>
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : s.id}
              </div>
            </div>
            {i < total - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                margin: "0 6px",
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

/* ── Summary row ────────────────────────────────────────────── */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 20,
      padding: "12px 0",
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

/* ── Apply Overlay ──────────────────────────────────────────── */
function ApplyOverlay({
  job,
  onClose,
  isDark,
}: {
  job: Job;
  onClose: () => void;
  isDark: boolean;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ApplyForm>(EMPTY_FORM);
  const [focused, setFocused] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const inputStyle = useInputStyle(isDark, focused);
  const textareaStyle = useTextareaStyle(isDark, focused);

  const set = (key: keyof ApplyForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setCV = (file: File | null) =>
    setForm((f) => ({ ...f, cv: file }));

  const addSkill = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || form.skills.includes(trimmed)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }));
    setSkillInput("");
  };

  const removeSkill = (idx: number) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((_, i) => i !== idx) }));

  const touch = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const validate = (field: string, val: string) => {
    if (field === "name") return val.trim().length >= 2;
    if (field === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    if (field === "experience") return val.length > 0;
    if (field === "whyJoin") return val.trim().length >= 20;
    return true;
  };

  const canNext = () => {
    if (step === 1) return form.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (step === 2) return form.experience.length > 0 && !!form.cv;
    if (step === 3) return form.whyJoin.trim().length >= 20;
    return true;
  };

  const animateStep = (direction: "forward" | "back", callback: () => void) => {
    if (contentRef.current) {
      contentRef.current.style.opacity = "0";
      contentRef.current.style.transform = direction === "forward" ? "translateX(20px)" : "translateX(-20px)";
    }
    setTimeout(() => {
      callback();
      if (contentRef.current) {
        contentRef.current.style.transform = direction === "forward" ? "translateX(-20px)" : "translateX(20px)";
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)";
            contentRef.current.style.opacity = "1";
            contentRef.current.style.transform = "translateX(0)";
          }
        }, 20);
      }
    }, 180);
  };

  const goNext = () => animateStep("forward", () => setStep((s) => s + 1));
  const goBack = () => animateStep("back", () => setStep((s) => s - 1));

  const handleSubmit = async () => {
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("portfolio", form.portfolio);
      fd.append("linkedin", form.linkedin);
      fd.append("experience", form.experience);
      fd.append("currentRole", form.currentRole);
      fd.append("whyJoin", form.whyJoin);
      fd.append("skills", JSON.stringify(form.skills));
      fd.append("jobId", job._id);
      fd.append("jobTitle", job.title);
      if (form.cv) fd.append("cv", form.cv);

      await api.post("/applications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast("Application submitted! We'll review it within 5 business days.");
    } catch {
      toast("Something went wrong. Please try again.", "error");
    }
    setSending(false);
    setSubmitted(true);
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: 8,
  };

  const fieldGap: React.CSSProperties = { marginBottom: 18 };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 4px" }}>
              Apply for
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{job.title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 0,
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {submitted ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 28px",
              textAlign: "center",
            }}>
              <div style={{
                width: 64,
                height: 64,
                backgroundImage: GRADIENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M4 13l6 6L22 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
                Application Submitted!
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, maxWidth: 360, margin: "0 0 32px" }}>
                We&apos;ll review your application and get back to you within 5 business days.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: "13px 28px",
                  backgroundImage: GRADIENT,
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderRadius: 0,
                  boxShadow: "0 6px 24px rgba(255,106,0,0.35)",
                }}
              >
                Back to Careers
              </button>
            </div>
          ) : (
            <div style={{ padding: "28px 28px 0" }}>
              {/* Step indicator */}
              <StepBar current={step} total={APPLY_STEPS.length} />

              {/* Step label */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 4px" }}>
                  Step {step} of {APPLY_STEPS.length}
                </p>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--fg)", margin: 0, letterSpacing: "-0.4px" }}>
                  {APPLY_STEPS[step - 1].label}
                </h3>
              </div>

              {/* Step content */}
              <div ref={contentRef} style={{ transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}>

                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Full Name <span style={{ color: "#ff6a00" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          onFocus={() => setFocused("name")}
                          onBlur={() => { setFocused(null); touch("name"); }}
                          style={{ ...inputStyle("name"), paddingRight: touched["name"] ? 40 : 14 }}
                        />
                        {touched["name"] && <FieldIcon ok={validate("name", form.name)} />}
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Email Address <span style={{ color: "#ff6a00" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          onFocus={() => setFocused("email")}
                          onBlur={() => { setFocused(null); touch("email"); }}
                          style={{ ...inputStyle("email"), paddingRight: touched["email"] ? 40 : 14 }}
                        />
                        {touched["email"] && <FieldIcon ok={validate("email", form.email)} />}
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Phone Number</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="tel"
                          placeholder="+92 300 1234567"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          onFocus={() => setFocused("phone")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("phone")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional */}
                {step === 2 && (
                  <div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Portfolio / Website URL</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="url"
                          placeholder="yourportfolio.com"
                          value={form.portfolio}
                          onChange={(e) => set("portfolio", e.target.value)}
                          onFocus={() => setFocused("portfolio")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("portfolio")}
                        />
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>LinkedIn Profile</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="url"
                          placeholder="linkedin.com/in/yourname"
                          value={form.linkedin}
                          onChange={(e) => set("linkedin", e.target.value)}
                          onFocus={() => setFocused("linkedin")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("linkedin")}
                        />
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Years of Experience <span style={{ color: "#ff6a00" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <select
                          value={form.experience}
                          onChange={(e) => set("experience", e.target.value)}
                          onFocus={() => setFocused("experience")}
                          onBlur={() => { setFocused(null); touch("experience"); }}
                          style={{ ...inputStyle("experience"), paddingRight: touched["experience"] ? 44 : 36 }}
                        >
                          <option value="">Select experience level...</option>
                          {EXP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{ position: "absolute", right: touched["experience"] ? 32 : 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {touched["experience"] && <FieldIcon ok={validate("experience", form.experience)} />}
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Current Role / Title</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          placeholder="e.g. Frontend Developer at Acme"
                          value={form.currentRole}
                          onChange={(e) => set("currentRole", e.target.value)}
                          onFocus={() => setFocused("currentRole")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("currentRole")}
                        />
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Resume / CV <span style={{ color: "#ff6a00" }}>*</span>{" "}
                        <span style={{ color: "var(--muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
                          (PDF or Word, max 10 MB)
                        </span>
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "0 14px",
                          height: 44,
                          border: focused === "cv"
                            ? "2px solid transparent"
                            : "2px solid var(--border)",
                          backgroundImage: focused === "cv"
                            ? (isDark
                              ? "linear-gradient(rgba(14,15,26,1),rgba(14,15,26,1)), linear-gradient(135deg,#ff6a00,#ee0979)"
                              : "linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1)), linear-gradient(135deg,#ff6a00,#ee0979)")
                            : "none",
                          backgroundOrigin: focused === "cv" ? "border-box" : "padding-box",
                          backgroundClip: focused === "cv" ? "padding-box, border-box" : "border-box",
                          backgroundColor: focused === "cv" ? "transparent" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, flexShrink: 0,
                          backgroundImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
                        }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 13, color: form.cv ? "var(--fg)" : "var(--muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {form.cv ? form.cv.name : "Click to upload your CV..."}
                        </span>
                        {form.cv && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setCV(null); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 0, display: "flex", alignItems: "center", fontSize: 16 }}
                          >×</button>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: "none" }}
                          onFocus={() => setFocused("cv")}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setCV(f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Application */}
                {step === 3 && (
                  <div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Why do you want to join Brand Edge? <span style={{ color: "#ff6a00" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <textarea
                          rows={4}
                          placeholder="Tell us what excites you about this role and our agency..."
                          value={form.whyJoin}
                          onChange={(e) => set("whyJoin", e.target.value)}
                          onFocus={() => setFocused("whyJoin")}
                          onBlur={() => { setFocused(null); touch("whyJoin"); }}
                          style={{ ...textareaStyle("whyJoin"), minHeight: 120, paddingRight: touched["whyJoin"] ? 40 : 14 }}
                        />
                        {touched["whyJoin"] && <FieldIcon ok={validate("whyJoin", form.whyJoin)} forTextarea />}
                      </div>
                    </div>
                    <div style={fieldGap}>
                      <label style={labelStyle}>Skills <span style={{ color: "var(--muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(press Enter to add)</span></label>
                      {form.skills.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                          {form.skills.map((skill, i) => (
                            <span key={i} style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "4px 10px",
                              background: isDark ? "rgba(255,106,0,0.12)" : "rgba(255,106,0,0.08)",
                              border: "1px solid rgba(255,106,0,0.35)",
                              borderRadius: 0, fontSize: 12, fontWeight: 600, color: "#ff6a00",
                            }}>
                              {skill}
                              <button type="button" onClick={() => removeSkill(i)} style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#ff6a00", padding: 0, lineHeight: 1,
                                display: "flex", alignItems: "center", fontSize: 16,
                              }}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="e.g. React, Figma, SEO..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onFocus={() => setFocused("skills")}
                        onBlur={() => { setFocused(null); if (skillInput.trim()) addSkill(skillInput); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                        style={inputStyle("skills")}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && (
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ padding: "20px 24px", border: "1px solid var(--border)", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", marginBottom: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 12px" }}>Personal</p>
                      <SummaryRow label="Name" value={form.name} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                    </div>
                    <div style={{ padding: "20px 24px", border: "1px solid var(--border)", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", marginBottom: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 12px" }}>Professional</p>
                      <SummaryRow label="Experience" value={form.experience} />
                      {form.currentRole && <SummaryRow label="Current Role" value={form.currentRole} />}
                      {form.portfolio && <SummaryRow label="Portfolio" value={form.portfolio} />}
                      {form.linkedin && <SummaryRow label="LinkedIn" value={form.linkedin} />}
                      {form.cv && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", flexShrink: 0 }}>CV</span>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "3px 10px",
                            background: isDark ? "rgba(255,106,0,0.12)" : "rgba(255,106,0,0.08)",
                            border: "1px solid rgba(255,106,0,0.35)",
                            borderRadius: 0, fontSize: 12, fontWeight: 600, color: "#ff6a00",
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            {form.cv.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "20px 24px", border: "1px solid var(--border)", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 12px" }}>Application</p>
                      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Why Brand Edge</span>
                        <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.65, margin: 0 }}>{form.whyJoin || "—"}</p>
                      </div>
                      {form.skills.length > 0 && (
                        <div style={{ padding: "12px 0" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Skills</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {form.skills.map((s, i) => (
                              <span key={i} style={{
                                display: "inline-block", padding: "3px 10px",
                                background: isDark ? "rgba(255,106,0,0.12)" : "rgba(255,106,0,0.08)",
                                border: "1px solid rgba(255,106,0,0.35)",
                                borderRadius: 0, fontSize: 12, fontWeight: 600, color: "#ff6a00",
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", gap: 12 }}>
                {step > 1 ? (
                  <button
                    onClick={goBack}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 22px",
                      border: "2px solid var(--border)",
                      background: "transparent",
                      color: "var(--fg)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      borderRadius: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M10 7H4M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    onClick={goNext}
                    disabled={!canNext()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 28px",
                      border: "none",
                      backgroundImage: GRADIENT,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: canNext() ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      borderRadius: 0,
                      opacity: canNext() ? 1 : 0.45,
                      boxShadow: canNext() ? "0 6px 24px rgba(255,106,0,0.3)" : "none",
                      transition: "opacity 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    Continue
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M4 7h6M7 4l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 28px",
                      border: "none",
                      backgroundImage: GRADIENT,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: sending ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      borderRadius: 0,
                      opacity: sending ? 0.75 : 1,
                      boxShadow: "0 6px 24px rgba(255,106,0,0.3)",
                    }}
                  >
                    {sending ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                          <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                          <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ height: 2, background: "var(--border)", overflow: "hidden", marginBottom: 28 }}>
                <div style={{
                  height: "100%",
                  backgroundImage: GRADIENT,
                  width: `${((step - 1) / (APPLY_STEPS.length - 1)) * 100}%`,
                  transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const saved = localStorage.getItem("be-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    api.get("/jobs")
      .then((r) => {
        const found = (r.data.data as Job[]).find((j) => j._id === id);
        setJob(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (applying) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [applying]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("be-theme", next);
  };

  if (loading) {
    return (
      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "var(--muted)", fontSize: 16 }}>Job not found.</p>
        <Link href="/careers" style={{ color: "#ff6a00", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>← Back to Careers</Link>
      </div>
    );
  }

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", cursor: "none" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } } ::placeholder { color: var(--muted); opacity: 0.55; } select option { background: var(--bg); color: var(--fg); }`}</style>
      <CustomCursor />
      <Header theme={theme} onToggle={toggle} scrolled={scrolled} />

      <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "clamp(100px,12vh,140px) 24px clamp(64px,8vh,96px)" }}>
        {/* Back link */}
        <Link href="/careers" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 700, color: "var(--muted)",
          textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 36,
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M10 7H4M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Careers
        </Link>

        {/* Job header */}
        <div style={{ marginBottom: 36, animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[job.department, job.type, job.level].map((tag) => (
              <span key={tag} style={{
                padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--muted)", borderRadius: 0,
              }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "var(--fg)", margin: "0 0 16px" }}>
            {job.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
            {job.deadline && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Deadline: {job.deadline}
              </span>
            )}
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Posted {fmtDate(job.createdAt)}</span>
          </div>

          {/* Apply button */}
          <button
            onClick={() => setApplying(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", backgroundImage: GRADIENT, color: "#fff",
              border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", borderRadius: 0, boxShadow: "0 6px 24px rgba(255,106,0,0.3)",
            }}
          >
            Apply for this Role
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", marginBottom: 36 }} />

        {/* Description */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>About the Role</p>
          <p style={{ fontSize: 15, color: "var(--fg)", lineHeight: 1.8, margin: 0 }}>{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "0 0 16px" }}>Requirements</p>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(job.requirements) }} />
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          padding: 28, background: "var(--surface)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", margin: "0 0 4px" }}>Interested in this role?</p>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Submit your application and we&apos;ll get back to you within 5 business days.</p>
          </div>
          <button
            onClick={() => setApplying(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 24px", backgroundImage: GRADIENT, color: "#fff",
              border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", borderRadius: 0, boxShadow: "0 4px 16px rgba(255,106,0,0.25)", flexShrink: 0,
            }}
          >
            Apply Now
          </button>
        </div>
      </main>

      <Footer theme={theme} />

      {applying && (
        <ApplyOverlay
          job={job}
          onClose={() => setApplying(false)}
          isDark={isDark}
        />
      )}
    </div>
  );
}

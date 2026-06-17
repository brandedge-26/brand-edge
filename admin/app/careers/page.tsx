"use client";

import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────
type JobStatus = "Active" | "Closed";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  deadline: string;
  description: string;
  requirements: string;
  status: JobStatus;
}

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  date: string;
  portfolio: string;
  linkedin: string;
  currentRole: string;
  whyJoin: string;
  extra: string;
}

// ── Mock data ───────────────────────────────────────────────────────────────
const INITIAL_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    deadline: "Jul 31, 2025",
    description: "Build cutting-edge web experiences using React, Next.js, and modern CSS. You'll work directly with our design team to translate bold visual concepts into fast, accessible, and production-ready interfaces.",
    requirements: "4+ years of React/Next.js experience\nStrong TypeScript skills\nExperience with CSS-in-JS or modern CSS\nFamiliarity with performance optimization\nEye for design and attention to detail",
    status: "Active",
  },
  {
    id: 2,
    title: "Brand Strategist",
    department: "Marketing",
    location: "Karachi, PK",
    type: "Full-time",
    level: "Mid-level",
    deadline: "Jul 15, 2025",
    description: "Develop brand identities, positioning strategies, and creative direction for our clients across industries. You'll work on diverse projects from startups to enterprise brands.",
    requirements: "3+ years in brand strategy or marketing\nPortfolio of brand identity projects\nStrong written and verbal communication\nExperience with market research\nAbility to present concepts to clients",
    status: "Active",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Hybrid",
    type: "Full-time",
    level: "Mid-level",
    deadline: "Jul 20, 2025",
    description: "Craft pixel-perfect interfaces and user flows that convert. Figma expertise required. You'll own the design process from wireframe to final handoff.",
    requirements: "Proficiency in Figma\nStrong portfolio of web/app UI work\nUnderstanding of UX principles and usability\nExperience with design systems\nAbility to collaborate with developers",
    status: "Active",
  },
  {
    id: 4,
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
    level: "Junior",
    deadline: "Jun 30, 2025",
    description: "Manage paid ads, SEO campaigns, and social media strategy for a diverse client portfolio. You'll report on performance and iterate campaigns for continuous improvement.",
    requirements: "Experience with Google Ads and Meta Ads\nBasic SEO knowledge\nData-driven mindset\nStrong analytical skills\nExcellent written communication",
    status: "Closed",
  },
  {
    id: 5,
    title: "Content Writer",
    department: "Content",
    location: "Remote",
    type: "Contract",
    level: "Junior",
    deadline: "Jun 25, 2025",
    description: "Write compelling copy for websites, blogs, and social media. Strong English and storytelling skills needed. You'll work across multiple client verticals.",
    requirements: "Excellent written English\nProven copywriting or content writing portfolio\nAbility to adapt tone to different brands\nFamiliarity with SEO writing best practices\nFast turnaround with strong attention to detail",
    status: "Closed",
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    name: "Zara Ahmed",
    email: "zara@gmail.com",
    phone: "+92 301 111 2222",
    position: "UI/UX Designer",
    experience: "3–5 years",
    date: "Jun 14",
    portfolio: "zaraahmed.design",
    linkedin: "linkedin.com/in/zaraahmed",
    currentRole: "UI Designer at PixelStudio",
    whyJoin: "I've admired Brand Edge's work for years — the way the team blends sharp strategy with stunning visual execution is exactly what I want to be part of. I believe my experience designing for SaaS and e-commerce clients will bring immediate value to the team.",
    extra: "I've published a Figma plugin used by 5,000+ designers and regularly mentor junior designers in my spare time.",
  },
  {
    id: 2,
    name: "Ali Hassan",
    email: "ali@dev.io",
    phone: "+92 321 234 5678",
    position: "Senior Frontend Developer",
    experience: "6–10 years",
    date: "Jun 13",
    portfolio: "alihassan.dev",
    linkedin: "linkedin.com/in/alihassan-dev",
    currentRole: "Lead Frontend Engineer at TechFlow",
    whyJoin: "I want to move from a product-only environment to an agency where I can work across diverse, high-impact projects. Brand Edge's portfolio shows the kind of craftsmanship I care deeply about — performance, accessibility, and design fidelity.",
    extra: "Open-source contributor to React ecosystem. Speaker at JSConf Karachi 2024.",
  },
  {
    id: 3,
    name: "Sara Malik",
    email: "sara@creative.pk",
    phone: "+92 333 456 7890",
    position: "Brand Strategist",
    experience: "1–2 years",
    date: "Jun 12",
    portfolio: "saramalik.pk",
    linkedin: "linkedin.com/in/saramalik-brand",
    currentRole: "Junior Brand Consultant at IdeaHouse",
    whyJoin: "Brand Edge sits at the intersection of creativity and strategy — that's exactly where I thrive. I've worked on brand refreshes for 12+ clients and I'm eager to step into a more senior creative environment with real ownership.",
    extra: "",
  },
  {
    id: 4,
    name: "Bilal Raza",
    email: "bilal@copy.co",
    phone: "+1 555 234 9876",
    position: "Content Writer",
    experience: "Less than 1 year",
    date: "Jun 11",
    portfolio: "bilalwrites.com",
    linkedin: "linkedin.com/in/bilalraza-copy",
    currentRole: "Freelance Copywriter",
    whyJoin: "I discovered Brand Edge through a project you did for a Karachi-based fashion label and was immediately hooked on the copy quality. I write fast, adapt tone effortlessly, and have already delivered 80+ pieces of web and social copy for clients across niches.",
    extra: "Native-level English. Bilingual in Urdu.",
  },
  {
    id: 5,
    name: "Nadia Khan",
    email: "nadia@mkt.io",
    phone: "+92 302 987 6543",
    position: "Digital Marketing Specialist",
    experience: "1–2 years",
    date: "Jun 10",
    portfolio: "nadiakhan.io/work",
    linkedin: "linkedin.com/in/nadiakhan-mkt",
    currentRole: "Marketing Executive at GrowFast",
    whyJoin: "I'm passionate about performance marketing and have managed ad spend of up to $15k/month across Google and Meta. I want to grow in an environment that values both creativity and data — Brand Edge seems to balance both exceptionally well.",
    extra: "Google Ads certified. HubSpot inbound marketing certified.",
  },
  {
    id: 6,
    name: "Hassan Ali",
    email: "hassan@eng.pk",
    phone: "+92 345 678 0011",
    position: "Senior Frontend Developer",
    experience: "3–5 years",
    date: "Jun 9",
    portfolio: "hassanali.pk",
    linkedin: "linkedin.com/in/hassanali-eng",
    currentRole: "Frontend Developer at CodeCraft",
    whyJoin: "After 4 years in product development, I'm ready for the pace and variety of agency work. I love the challenge of adapting to new design systems and constraints with every project, and Brand Edge's reputation for quality is what drew me here.",
    extra: "",
  },
  {
    id: 7,
    name: "Fatima Shah",
    email: "fatima@design.co",
    phone: "+92 311 222 3344",
    position: "UI/UX Designer",
    experience: "1–2 years",
    date: "Jun 8",
    portfolio: "fatimashah.design",
    linkedin: "linkedin.com/in/fatimashah-ux",
    currentRole: "Product Designer at Launchpad",
    whyJoin: "I believe great design is never just cosmetic — it's strategic. Brand Edge's work proves that philosophy at every level. I'm eager to bring my product thinking into a creative agency context and contribute to client-facing design that truly moves the needle.",
    extra: "Published UX case study featured in UX Collective.",
  },
  {
    id: 8,
    name: "David Park",
    email: "david@startup.io",
    phone: "+1 310 456 7890",
    position: "Brand Strategist",
    experience: "3–5 years",
    date: "Jun 7",
    portfolio: "davidpark.co",
    linkedin: "linkedin.com/in/davidpark-brand",
    currentRole: "Brand Manager at Nova Ventures",
    whyJoin: "I've spent 5 years building brand strategies for venture-backed startups and I'm looking for a creative team that punches above its weight — that's Brand Edge. I want to bring Silicon Valley strategy thinking to a global creative context.",
    extra: "Previously consulted for 3 Y Combinator companies on brand positioning.",
  },
];

// ── Table styles ───────────────────────────────────────────────────────────
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thStyle: React.CSSProperties = {
  padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.08em",
  color: "var(--muted)", background: "var(--surface2)",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "12px 16px", borderBottom: "1px solid var(--border)",
  color: "var(--fg)", verticalAlign: "middle",
};

const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Content", "Operations", "Management"];
const JOB_TYPES = ["Full-time", "Part-time", "Remote", "Contract"];
const LEVELS = ["Junior", "Mid-level", "Senior", "Lead"];
const STATUSES: JobStatus[] = ["Active", "Closed"];

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: JobStatus }) {
  const isActive = status === "Active";
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 8px",
      fontSize: 11,
      fontWeight: 600,
      borderRadius: 0,
      background: isActive ? "rgba(34,197,94,0.12)" : "rgba(100,100,100,0.12)",
      color: isActive ? "#22c55e" : "var(--muted)",
    }}>
      {status}
    </span>
  );
}

// ── Label style ─────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--muted)",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 14px",
  border: "1px solid var(--border)",
  borderRadius: 0,
  background: "var(--surface2)",
  color: "var(--fg)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: 32,
  cursor: "pointer",
};

const textareaInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid var(--border)",
  borderRadius: 0,
  background: "var(--surface2)",
  color: "var(--fg)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const fieldGap: React.CSSProperties = { marginBottom: 18 };

// ── SelectField helper ─────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  fieldStyle,
  name,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  fieldStyle?: (name: string, textarea?: boolean) => React.CSSProperties;
  name?: string;
  onFocus?: (name: string) => void;
  onBlur?: () => void;
}) {
  const style = fieldStyle && name
    ? { ...fieldStyle(name), appearance: "none" as const, WebkitAppearance: "none" as const, paddingRight: 32, height: 42, cursor: "pointer" }
    : selectStyle;

  return (
    <div style={fieldGap}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#ff6a00" }}> *</span>}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocus?.(name ?? "")}
          onBlur={() => onBlur?.()}
          style={style}
        >
          <option value="">Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ── Add Job Modal ───────────────────────────────────────────────────────────
function AddJobModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (job: Omit<Job, "id">) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    level: "",
    deadline: "",
    description: "",
    requirements: "",
    status: "Active" as JobStatus,
  });
  const [focused, setFocused] = useState<string | null>(null);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const fStyle = (name: string, textarea = false): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      ...(textarea ? { padding: "10px 14px", resize: "vertical" as const } : { height: 42, padding: "0 14px" }),
      borderRadius: 0,
      backgroundColor: isFoc ? "transparent" : "var(--surface2)",
      backgroundImage: isFoc
        ? "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg,#ff6a00,#ee0979)"
        : "none",
      backgroundOrigin: isFoc ? "border-box" : ("padding-box" as const),
      backgroundClip: isFoc ? "padding-box, border-box" : ("border-box" as const),
      border: isFoc ? "2px solid transparent" : "1px solid var(--border)",
      color: "var(--fg)",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box" as const,
      transition: "background-color 0.18s ease",
    };
  };

  const canSubmit =
    form.title.trim() &&
    form.department &&
    form.location.trim() &&
    form.type &&
    form.level &&
    form.description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd(form);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          width: 560, maxWidth: "100%", maxHeight: "90vh",
          borderRadius: 0, display: "flex", flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Add New Job</h3>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 0,
          }}>
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "24px" }}>
          <style>{`::placeholder { color: var(--muted); opacity: 0.55; } select option { background: var(--bg); color: var(--fg); }`}</style>

          <div style={fieldGap}>
            <label style={labelStyle}>Job Title <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="text" placeholder="e.g. Senior Frontend Developer" value={form.title}
              onChange={(e) => set("title", e.target.value)}
              onFocus={() => setFocused("title")} onBlur={() => setFocused(null)}
              style={fStyle("title")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <SelectField label="Department" value={form.department} onChange={(v) => set("department", v)} options={DEPARTMENTS} required
              fieldStyle={fStyle} name="department" onFocus={setFocused} onBlur={() => setFocused(null)} />
            <SelectField label="Job Type" value={form.type} onChange={(v) => set("type", v)} options={JOB_TYPES} required
              fieldStyle={fStyle} name="type" onFocus={setFocused} onBlur={() => setFocused(null)} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Location <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="text" placeholder="e.g. Remote, Karachi PK, Hybrid" value={form.location}
              onChange={(e) => set("location", e.target.value)}
              onFocus={() => setFocused("location")} onBlur={() => setFocused(null)}
              style={fStyle("location")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <SelectField label="Experience Level" value={form.level} onChange={(v) => set("level", v)} options={LEVELS} required
              fieldStyle={fStyle} name="level" onFocus={setFocused} onBlur={() => setFocused(null)} />
            <div style={fieldGap}>
              <label style={labelStyle}>Application Deadline</label>
              <input type="text" placeholder="e.g. Jul 31, 2025" value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                onFocus={() => setFocused("deadline")} onBlur={() => setFocused(null)}
                style={fStyle("deadline")} />
            </div>
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Job Description <span style={{ color: "#ff6a00" }}>*</span></label>
            <textarea rows={4} placeholder="Describe the role, responsibilities, and what success looks like..."
              value={form.description} onChange={(e) => set("description", e.target.value)}
              onFocus={() => setFocused("description")} onBlur={() => setFocused(null)}
              style={fStyle("description", true)} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Requirements</label>
            <textarea rows={4} placeholder="One requirement per line..."
              value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
              onFocus={() => setFocused("requirements")} onBlur={() => setFocused(null)}
              style={fStyle("requirements", true)} />
          </div>

          <SelectField label="Status" value={form.status} onChange={(v) => set("status", v)} options={STATUSES}
            fieldStyle={fStyle} name="status" onFocus={setFocused} onBlur={() => setFocused(null)} />
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{
            padding: "9px 22px", border: "none",
            backgroundImage: canSubmit ? GRADIENT : "none",
            backgroundColor: canSubmit ? "transparent" : "var(--surface2)",
            color: canSubmit ? "#fff" : "var(--muted)",
            fontSize: 13, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed",
            borderRadius: 0, fontFamily: "inherit",
            opacity: canSubmit ? 1 : 0.6,
          }}>
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Job Detail Modal ────────────────────────────────────────────────────────
function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
      <span style={{ width: 100, flexShrink: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        width: 580, maxWidth: "100%", maxHeight: "85vh",
        borderRadius: 0, display: "flex", flexDirection: "column",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>{job.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
              Job #{job.id} &nbsp;·&nbsp; <StatusBadge status={job.status} />
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 0,
          }}>
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", marginBottom: 12 }}>
            Overview
          </p>
          <Row label="Department" value={job.department} />
          <Row label="Location" value={job.location} />
          <Row label="Type" value={job.type} />
          <Row label="Level" value={job.level} />
          <Row label="Deadline" value={job.deadline} />

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "20px 0 12px" }}>
            Description
          </p>
          <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.7, margin: "0 0 4px" }}>{job.description}</p>

          {job.requirements && (
            <>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "20px 0 12px" }}>
                Requirements
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "disc" }}>
                {job.requirements.split("\n").filter(Boolean).map((req, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.7, marginBottom: 4 }}>{req}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Job Modal ────────────────────────────────────────────────────────
function DeleteModal({
  jobTitle,
  onConfirm,
  onClose,
}: {
  jobTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        width: 400, maxWidth: "100%", borderRadius: 0, padding: 32,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          width: 44, height: 44, background: "rgba(239,68,68,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="square">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Job Posting</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{jobTitle}</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", border: "none",
            background: "#ef4444", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Application Detail Modal ─────────────────────────────────────────────────
function AppDetailModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
      <span style={{ width: 100, flexShrink: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        width: 580, maxWidth: "100%", maxHeight: "85vh",
        borderRadius: 0, display: "flex", flexDirection: "column",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: "0 0 3px" }}>{app.name}</h3>
            <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
              Application #{app.id} &nbsp;·&nbsp; Applied {app.date} &nbsp;·&nbsp;
              <span style={{ color: "var(--fg)", fontWeight: 500 }}>{app.position}</span>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 0,
          }}>
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", marginBottom: 12 }}>
            Contact Info
          </p>
          <Row label="Email" value={app.email} />
          <Row label="Phone" value={app.phone} />

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "20px 0 12px" }}>
            Professional
          </p>
          <Row label="Position" value={app.position} />
          <Row label="Experience" value={app.experience} />
          <Row label="Current Role" value={app.currentRole} />
          {app.portfolio && <Row label="Portfolio" value={app.portfolio} />}
          {app.linkedin && <Row label="LinkedIn" value={app.linkedin} />}

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff6a00", margin: "20px 0 12px" }}>
            Application
          </p>
          <div style={{ paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: 8 }}>
              Why Brand Edge
            </span>
            <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.7, margin: 0 }}>{app.whyJoin}</p>
          </div>
          {app.extra && (
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: 8 }}>
                Additional Info
              </span>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.7, margin: 0 }}>{app.extra}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
type Tab = "Job Postings" | "Applications";

export default function CareersAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Job Postings");
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const [viewApp, setViewApp] = useState<Application | null>(null);

  const nextId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;

  const handleAddJob = (data: Omit<Job, "id">) => {
    setJobs((prev) => [{ id: nextId, ...data }, ...prev]);
  };

  const handleDeleteJob = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleteJob(null);
  };

  const TABS: Tab[] = ["Job Postings", "Applications"];

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <style>{`::placeholder { color: var(--muted); opacity: 0.55; } select option { background: var(--bg); color: var(--fg); }`}</style>

      {/* Page heading */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Careers</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Manage job postings and review incoming applications.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "9px 20px",
                border: "1px solid var(--border)",
                borderLeft: tab === "Applications" ? "none" : "1px solid var(--border)",
                borderRadius: 0,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                backgroundImage: isActive ? GRADIENT : "none",
                backgroundColor: isActive ? "transparent" : "var(--surface)",
                color: isActive ? "#fff" : "var(--muted)",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {tab}
              {tab === "Applications" && (
                <span style={{
                  marginLeft: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  background: isActive ? "rgba(255,255,255,0.25)" : "var(--surface2)",
                  color: isActive ? "#fff" : "var(--muted)",
                }}>
                  {applications.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Job Postings ── */}
      {activeTab === "Job Postings" && (
        <>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>Job Postings</span>
              <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 10 }}>{jobs.length} total</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                backgroundImage: GRADIENT,
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: 0,
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(255,106,0,0.25)",
              }}
            >
              <PlusIcon />
              Add Job
            </button>
          </div>

          {/* Jobs table */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 36 }}>#</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Department</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Level</th>
                    <th style={thStyle}>Deadline</th>
                    <th style={thStyle}>Status</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>
                        No job postings yet.
                      </td>
                    </tr>
                  ) : jobs.map((job) => (
                    <tr key={job.id}>
                      <td style={{ ...tdStyle, color: "var(--muted)" }}>{job.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{job.title}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{job.department}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{job.location}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{job.type}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{job.level}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{job.deadline || "—"}</td>
                      <td style={tdStyle}><StatusBadge status={job.status} /></td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            onClick={() => setViewJob(job)}
                            title="View details"
                            style={{
                              width: 30, height: 30, border: "1px solid var(--border)",
                              background: "transparent", color: "var(--muted)",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              borderRadius: 0, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => setDeleteJob(job)}
                            title="Delete"
                            style={{
                              width: 30, height: 30, border: "1px solid rgba(239,68,68,0.35)",
                              background: "transparent", color: "#ef4444",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              borderRadius: 0, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted)" }}>
              {jobs.filter((j) => j.status === "Active").length} active &nbsp;·&nbsp; {jobs.filter((j) => j.status === "Closed").length} closed
            </div>
          </div>
        </>
      )}

      {/* ── Tab 2: Applications ── */}
      {activeTab === "Applications" && (
        <>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>Applications</span>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px 10px",
              fontSize: 12,
              fontWeight: 700,
              background: "var(--surface2)",
              color: "var(--muted)",
              borderRadius: 0,
              border: "1px solid var(--border)",
            }}>
              {applications.length}
            </span>
          </div>

          {/* Applications table */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 36 }}>#</th>
                    <th style={thStyle}>Applicant</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Position Applied</th>
                    <th style={thStyle}>Experience</th>
                    <th style={thStyle}>Date</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ ...tdStyle, color: "var(--muted)" }}>{app.id}</td>
                      <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{app.name}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.email}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.phone}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{app.position}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.experience}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.date}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() => setViewApp(app)}
                          title="View application"
                          style={{
                            width: 30, height: 30, border: "1px solid var(--border)",
                            background: "transparent", color: "var(--muted)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: 0, margin: "0 auto", transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted)" }}>
              Showing {applications.length} applications
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddJob}
        />
      )}
      {viewJob && <JobDetailModal job={viewJob} onClose={() => setViewJob(null)} />}
      {deleteJob && (
        <DeleteModal
          jobTitle={deleteJob.title}
          onConfirm={() => handleDeleteJob(deleteJob.id)}
          onClose={() => setDeleteJob(null)}
        />
      )}
      {viewApp && <AppDetailModal app={viewApp} onClose={() => setViewApp(null)} />}
    </main>
  );
}

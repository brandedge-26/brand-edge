"use client";

import { useState, useEffect } from "react";
import { useJobsStore, Job, Application } from "@/stores/useJobsStore";
import { useToast } from "@/components/Toast";

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

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
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ── Markdown renderer ───────────────────────────────────────────────────────
function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,106,0,0.1);color:#ff6a00;padding:1px 6px;font-size:12px;font-family:monospace">$1</code>');
}

function renderMarkdown(md: string): string {
  if (!md) return "";
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.split("\n").map(line => {
    if (/^### /.test(line)) return `<h3 style="font-size:13px;font-weight:700;color:var(--fg);margin:10px 0 4px;letter-spacing:0">${applyInline(line.replace(/^### /, ""))}</h3>`;
    if (/^## /.test(line)) return `<h2 style="font-size:14px;font-weight:700;color:var(--fg);margin:12px 0 6px;letter-spacing:0">${applyInline(line.replace(/^## /, ""))}</h2>`;
    if (/^# /.test(line)) return `<h1 style="font-size:15px;font-weight:700;color:var(--fg);margin:14px 0 6px;letter-spacing:0">${applyInline(line.replace(/^# /, ""))}</h1>`;
    if (/^[-*] /.test(line)) return `<div style="display:flex;align-items:flex-start;gap:8px;margin:3px 0"><span style="color:#ff6a00;font-weight:700;flex-shrink:0;margin-top:1px">•</span><span style="font-size:13px;color:var(--fg);line-height:1.6">${applyInline(line.replace(/^[-*] /, ""))}</span></div>`;
    if (line.trim() === "") return `<div style="height:6px"></div>`;
    return `<p style="margin:3px 0;font-size:13px;color:var(--fg);line-height:1.6">${applyInline(line)}</p>`;
  }).join("");
}

// ── Types ──────────────────────────────────────────────────────────────────
type JobStatus = "Active" | "Closed";

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
  onAdd: (job: Omit<Job, "_id" | "createdAt">) => void;
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
  const [reqTab, setReqTab] = useState<"Write" | "Preview">("Write");

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={labelStyle}>Requirements <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>— supports **bold**, *italic*, - lists, ## headings</span></label>
              <div style={{ display: "flex", gap: 0 }}>
                {(["Write", "Preview"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setReqTab(tab)} style={{ padding: "3px 10px", border: "1px solid var(--border)", borderLeft: tab === "Preview" ? "none" : "1px solid var(--border)", background: reqTab === tab ? "var(--fg)" : "transparent", color: reqTab === tab ? "var(--bg)" : "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderRadius: 0 }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {reqTab === "Write" ? (
              <textarea rows={5} placeholder={"Use markdown:\n- List item\n**Bold text**\n## Section heading"}
                value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
                onFocus={() => setFocused("requirements")} onBlur={() => setFocused(null)}
                style={fStyle("requirements", true)} />
            ) : (
              <div style={{ minHeight: 120, padding: "10px 14px", border: "1px solid var(--border)", background: "var(--surface2)", fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.requirements) || '<span style="color:var(--muted);font-style:italic">Nothing to preview...</span>' }} />
            )}
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

// ── Edit Job Modal ──────────────────────────────────────────────────────────
function EditJobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job;
  onClose: () => void;
  onSave: (id: string, data: Omit<Job, "_id" | "createdAt">) => void;
}) {
  const [form, setForm] = useState({
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    level: job.level,
    deadline: job.deadline,
    description: job.description,
    requirements: job.requirements,
    status: job.status as JobStatus,
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [reqTab, setReqTab] = useState<"Write" | "Preview">("Write");

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
    onSave(job._id, form);
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
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Edit Job</h3>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={labelStyle}>Requirements <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>— supports **bold**, *italic*, - lists, ## headings</span></label>
              <div style={{ display: "flex", gap: 0 }}>
                {(["Write", "Preview"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setReqTab(tab)} style={{ padding: "3px 10px", border: "1px solid var(--border)", borderLeft: tab === "Preview" ? "none" : "1px solid var(--border)", background: reqTab === tab ? "var(--fg)" : "transparent", color: reqTab === tab ? "var(--bg)" : "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderRadius: 0 }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {reqTab === "Write" ? (
              <textarea rows={5} placeholder={"Use markdown:\n- List item\n**Bold text**\n## Section heading"}
                value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
                onFocus={() => setFocused("requirements")} onBlur={() => setFocused(null)}
                style={fStyle("requirements", true)} />
            ) : (
              <div style={{ minHeight: 120, padding: "10px 14px", border: "1px solid var(--border)", background: "var(--surface2)", fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.requirements) || '<span style="color:var(--muted);font-style:italic">Nothing to preview...</span>' }} />
            )}
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
            Save Changes
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
              ID: {job._id.slice(-8)} &nbsp;·&nbsp; <StatusBadge status={job.status} />
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
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(job.requirements) }} />
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
  const handleDownloadCV = async () => {
    try {
      const res = await fetch(app.cvUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${app.name.replace(/\s+/g, "_")}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(app.cvUrl, "_blank");
    }
  };

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
              ID: {app._id.slice(-8)} &nbsp;·&nbsp; Applied {fmtDate(app.createdAt)} &nbsp;·&nbsp;
              <span style={{ color: "var(--fg)", fontWeight: 500 }}>{app.jobTitle}</span>
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
          <Row label="Position" value={app.jobTitle} />
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
          {app.skills && app.skills.length > 0 && (
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", display: "block", marginBottom: 8 }}>
                Skills
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {app.skills.map((s: string, i: number) => (
                  <span key={i} style={{ padding: "3px 10px", background: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.3)", fontSize: 12, fontWeight: 600, color: "#ff6a00" }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          {app.cvUrl ? (
            <button
              onClick={handleDownloadCV}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 18px",
                backgroundImage: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
                color: "#fff", border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                textDecoration: "none", borderRadius: 0, fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(255,106,0,0.3)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CV
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>No CV attached</span>
          )}
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("Job Postings");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteApp, setDeleteApp] = useState<Application | null>(null);
  const { jobs, applications, loadingJobs, loadingApps, fetchJobs, fetchApplications, addJob, removeJob, updateJob, removeApplication } = useJobsStore();

  useEffect(() => { fetchJobs(); fetchApplications(); }, [fetchJobs, fetchApplications]);

  const handleAddJob = async (data: Omit<Job, "_id" | "createdAt">) => {
    try {
      await addJob(data);
      toast("Job posted successfully!");
    } catch {
      toast("Failed to post job.", "error");
    }
  };

  const handleDeleteJob = async (id: string) => {
    await removeJob(id);
    setDeleteJob(null);
    toast("Job deleted.", "error");
  };

  const handleEditJob = async (id: string, data: Omit<Job, "_id" | "createdAt">) => {
    try {
      await updateJob(id, data);
      setEditJob(null);
      toast("Job updated successfully!");
    } catch {
      toast("Failed to update job.", "error");
    }
  };

  const handleDeleteApp = async (id: string) => {
    await removeApplication(id);
    setDeleteApp(null);
    toast("Application deleted.", "error");
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
                  {loadingJobs ? (
                    <tr><td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>
                        No job postings yet.
                      </td>
                    </tr>
                  ) : jobs.map((job, i) => (
                    <tr key={job._id}>
                      <td style={{ ...tdStyle, color: "var(--muted)" }}>{i + 1}</td>
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
                          <button onClick={() => setEditJob(job)} title="Edit" style={{
                            width: 30, height: 30, border: "1px solid var(--border)",
                            background: "transparent", color: "var(--muted)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: 0, transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                            <EditIcon />
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
                  {loadingApps ? (
                    <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
                  ) : applications.length === 0 ? (
                    <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No applications yet.</td></tr>
                  ) : null}
                  {!loadingApps && applications.map((app, i) => (
                    <tr key={app._id}>
                      <td style={{ ...tdStyle, color: "var(--muted)" }}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{app.name}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.email}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.phone || "—"}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{app.jobTitle}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{app.experience}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(app.createdAt)}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            onClick={() => setViewApp(app)}
                            title="View application"
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
                          <button onClick={() => setDeleteApp(app)} title="Delete" style={{
                            width: 30, height: 30, border: "1px solid rgba(239,68,68,0.35)",
                            background: "transparent", color: "#ef4444",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: 0, transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
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
          onConfirm={() => handleDeleteJob(deleteJob._id)}
          onClose={() => setDeleteJob(null)}
        />
      )}
      {viewApp && <AppDetailModal app={viewApp} onClose={() => setViewApp(null)} />}
      {editJob && (
        <EditJobModal
          job={editJob}
          onClose={() => setEditJob(null)}
          onSave={handleEditJob}
        />
      )}
      {deleteApp && (
        <DeleteModal
          jobTitle={`${deleteApp.name}'s application`}
          onConfirm={() => handleDeleteApp(deleteApp._id)}
          onClose={() => setDeleteApp(null)}
        />
      )}
    </main>
  );
}

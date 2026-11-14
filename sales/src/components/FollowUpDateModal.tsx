"use client";

import { useState, useEffect } from "react";

const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

// Produces a value compatible with <input type="datetime-local">, e.g. "2026-11-14T09:30"
function nowForDateTimeLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function FollowUpDateModal({
  businessName,
  onClose,
  onConfirm,
}: {
  businessName: string;
  onClose: () => void;
  onConfirm: (dateTime: string) => Promise<void>;
}) {
  const [dateTime, setDateTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setDateTime(nowForDateTimeLocal()); }, []);

  const handleSubmit = async () => {
    if (!dateTime || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(dateTime);
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: 400, maxWidth: "100%", borderRadius: 0, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Mark for Follow-up</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
          When should you follow up with <strong style={{ color: "var(--fg)" }}>{businessName}</strong>?
        </p>
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} style={{
          width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--border)", borderRadius: 0,
          background: "var(--surface2)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
        }} />
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid var(--border)", background: "transparent", color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!dateTime || submitting} style={{
            padding: "9px 20px", border: "none",
            backgroundImage: !submitting ? GRADIENT : "none",
            backgroundColor: !submitting ? "transparent" : "var(--surface2)",
            color: !submitting ? "#fff" : "var(--muted)",
            fontSize: 13, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            {submitting ? "Saving..." : "Mark for Follow-up"}
          </button>
        </div>
      </div>
    </div>
  );
}

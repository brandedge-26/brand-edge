"use client";

import { useEffect } from "react";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  fields: DetailField[];
  footer?: React.ReactNode;
}

export default function DetailPanel({ open, onClose, title, subtitle, fields, footer }: DetailPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes detailPanelSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes detailPanelSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .detail-panel {
          position: fixed; left: 0; right: 0; bottom: 0; top: auto;
          width: 100%; max-height: 85vh;
          background: var(--surface); border-top: 1px solid var(--border);
          z-index: 999; display: flex; flex-direction: column;
          box-shadow: 0 -8px 24px rgba(0,0,0,0.25);
          animation: detailPanelSlideUp 0.22s ease-out;
          border-radius: 16px 16px 0 0;
        }
        @media (min-width: 768px) {
          .detail-panel {
            top: 0 !important; bottom: 0 !important; left: auto !important; right: 0 !important;
            width: 420px !important; max-width: 420px !important; max-height: 100vh !important;
            border-radius: 0 !important; border-top: none !important; border-left: 1px solid var(--border) !important;
            box-shadow: -8px 0 24px rgba(0,0,0,0.25) !important;
            animation: detailPanelSlideIn 0.22s ease-out !important;
          }
        }
      `}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 }} />
      <div className="detail-panel">
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{title}</h3>
            {subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 0, flexShrink: 0,
          }}>
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          {fields.map(({ label, value, fullWidth }, i) =>
            fullWidth ? (
              <div key={i} style={{ paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 8 }}>{label}</span>
                <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{value || "—"}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
                <span style={{ width: 110, flexShrink: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", paddingTop: 1 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5, wordBreak: "break-word" }}>{value ?? "—"}</span>
              </div>
            )
          )}
        </div>
        {footer && <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>{footer}</div>}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import DetailPanel from "@/components/DetailPanel";
import { useToast } from "@/components/Toast";
import { useLeadsStore, Lead, LeadMessage, LeadStatus, LEAD_STATUSES, STATUS_LABELS } from "@/stores/useLeadsStore";

const fmtDateTime = (iso?: string | null) => iso ? new Date(iso).toLocaleString("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
}) : "—";

const linkStyle: React.CSSProperties = { color: "#ff6a00", textDecoration: "none" };

export default function LeadDetailDrawer({ leadId, onClose }: { leadId: string | null; onClose: () => void }) {
  const { toast } = useToast();
  const { fetchDetail, updateStatus } = useLeadsStore();
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!leadId) { setLead(null); setMessages([]); return; }
    setLoading(true);
    fetchDetail(leadId)
      .then((detail) => { setLead(detail.lead); setMessages(detail.messages); })
      .catch(() => toast("Failed to load lead detail.", "error"))
      .finally(() => setLoading(false));
  }, [leadId, fetchDetail, toast]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    setSavingStatus(true);
    try {
      const updated = await updateStatus(lead._id, status);
      setLead(updated);
      toast("Status updated.");
    } catch {
      toast("Failed to update status.", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const name = lead ? (`${lead.first_name || ""} ${lead.last_name || ""}`.trim() || lead.email || "—") : "";

  const timeline = lead ? [
    { key: "cold-email", direction: "outbound" as const, subject: lead.subject, body: lead.body, at: lead.sent_date, category: null as string | null },
    ...messages.map((m) => ({
      key: m._id,
      direction: m.direction,
      subject: m.subject,
      body: m.body,
      at: m.created_at,
      category: m.direction === "inbound" ? (m.category || null) : null,
    })),
  ] : [];

  return (
    <DetailPanel
      open={!!leadId}
      onClose={onClose}
      title={loading ? "Loading..." : name}
      subtitle={lead && [lead.company, lead.title].filter(Boolean).join(" · ") || undefined}
      fields={lead ? [
        { label: "Email", value: lead.email || "—" },
        { label: "Phone", value: lead.company_phone || "—" },
        {
          label: "Website",
          value: lead.website
            ? <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>{lead.website}</a>
            : "—",
        },
        {
          label: "LinkedIn",
          value: lead.linkedin
            ? <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>View Profile</a>
            : "—",
        },
        { label: "Location", value: [lead.city, lead.state, lead.country].filter(Boolean).join(", ") || "—" },
        { label: "Industry", value: lead.industry || "—" },
        { label: "Employees", value: lead.employees || "—" },
        { label: "Keywords", value: lead.keywords || "—" },
        { label: "AI Summary", value: lead.summary || "—", fullWidth: true },
        {
          label: "Conversation",
          fullWidth: true,
          value: (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {timeline.map((item) => (
                <div key={item.key} style={{ padding: 10, border: "1px solid var(--border)", background: "var(--surface2)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                      color: item.direction === "outbound" ? "#60a5fa" : "#22c55e",
                    }}>
                      {item.direction === "outbound" ? "→ Sent" : "← Received"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDateTime(item.at)}</span>
                  </div>
                  {item.subject && <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>{item.subject}</div>}
                  <div style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{item.body || "—"}</div>
                  {item.category && (
                    <span style={{ display: "inline-block", marginTop: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600, background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
                      {item.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ),
        },
      ] : []}
      footer={lead && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, flexShrink: 0 }}>Status:</span>
            <select
              value={lead.status || "sent"}
              disabled={savingStatus}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              style={{
                flex: 1, height: 32, padding: "0 8px", border: "1px solid var(--border)", borderRadius: 0,
                background: "var(--surface2)", color: "var(--fg)", fontSize: 12, fontFamily: "inherit",
                cursor: savingStatus ? "not-allowed" : "pointer", outline: "none",
              }}
            >
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          {lead.thread_id && (
            <a
              href={`https://mail.google.com/mail/u/0/#all/${lead.thread_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", textAlign: "center", height: 36, lineHeight: "36px",
                border: "1px solid var(--border)", color: "var(--fg)", fontSize: 12, fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Open in Gmail →
            </a>
          )}
        </div>
      )}
    />
  );
}

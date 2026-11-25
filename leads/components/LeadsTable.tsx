"use client";

import { useState, useEffect, useRef } from "react";
import { useLeadsStore, Lead, LeadStatus, LEAD_STATUSES, STATUS_LABELS } from "@/stores/useLeadsStore";
import { useToast } from "@/components/Toast";
import Pagination from "@/components/Pagination";
import LeadDetailDrawer from "@/components/LeadDetailDrawer";

const fmtDate = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const STATUS_STYLES: Record<LeadStatus, { bg: string; color: string }> = {
  sent:            { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
  interested:      { bg: "rgba(34,197,94,0.15)",   color: "#22c55e" },
  follow_up:       { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b" },
  replied:         { bg: "rgba(96,165,250,0.15)",  color: "#60a5fa" },
  do_not_contact:  { bg: "rgba(239,68,68,0.15)",   color: "#ef4444" },
  bounced:         { bg: "rgba(168,85,247,0.15)",  color: "#a855f7" },
};
function StatusBadge({ status }: { status: LeadStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.sent;
  return <span style={{ display: "inline-block", padding: "2px 8px", fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, borderRadius: 0 }}>{STATUS_LABELS[status] ?? status}</span>;
}

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

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

function DeleteModal({ item, onConfirm, onClose }: { item: Lead; onConfirm: () => void; onClose: () => void }) {
  const name = `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.email || "this lead";
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
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Lead</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{name}</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)", background: "transparent",
            color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", border: "none", background: "#ef4444", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0,
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsTable({ repliedOnly = false }: { repliedOnly?: boolean }) {
  const { toast } = useToast();
  const { leads, pagination, loading, fetch, remove } = useLeadsStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [page, setPage] = useState(1);
  const [viewLeadId, setViewLeadId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<Lead | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch({ search, status, replied: repliedOnly, page });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, status, page, repliedOnly, fetch]);

  const handleDelete = async (id: string) => {
    await remove(id);
    setDeleteItem(null);
    toast("Lead deleted.", "error");
  };

  const fullName = (l: Lead) => `${l.first_name || ""} ${l.last_name || ""}`.trim() || "—";

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{repliedOnly ? "Replied Leads" : "Leads"}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {repliedOnly ? "Leads who have replied to an outreach email." : "All leads from email outreach campaigns."}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search by name, email or company..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
              height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
              background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 260,
            }}
          />
          {!repliedOnly && (
            <select value={status} onChange={(e) => { setStatus(e.target.value as LeadStatus | ""); setPage(1); }} style={{
              height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
              background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit", cursor: "pointer",
            }}>
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          )}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Sent</th>
                <th style={thStyle}>Last Reply</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No leads found.</td></tr>
              ) : leads.map((l) => (
                <tr key={l._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{fullName(l)}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{l.company || "—"}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{l.email || "—"}</td>
                  <td style={tdStyle}><StatusBadge status={l.status || "sent"} /></td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.subject || "—"}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(l.sent_date)}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(l.last_reply_at)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => setViewLeadId(l._id)} title="View details" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <InfoIcon />
                      </button>
                      <button onClick={() => setDeleteItem(l)} title="Delete" style={{
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
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>Showing {leads.length === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1}–{(pagination.page - 1) * pagination.pageSize + leads.length} of {pagination.total} leads</span>
          {pagination.pageCount > 1 && <Pagination page={pagination.page} pageCount={pagination.pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <LeadDetailDrawer leadId={viewLeadId} onClose={() => setViewLeadId(null)} />

      {deleteItem && (
        <DeleteModal item={deleteItem} onConfirm={() => handleDelete(deleteItem._id)} onClose={() => setDeleteItem(null)} />
      )}
    </>
  );
}

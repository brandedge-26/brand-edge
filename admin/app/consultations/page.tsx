"use client";

import { useState, useEffect } from "react";
import { useConsultationsStore, Consultation, ConsultationStatus } from "@/stores/useConsultationsStore";
import { useToast } from "@/components/Toast";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Icons ──────────────────────────────────────────────────────────────────
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
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
// ── Types ──────────────────────────────────────────────────────────────────
type Status = ConsultationStatus;

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  "Pending":     { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  "In Progress": { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  "Completed":   { bg: "rgba(34,197,94,0.15)",  color: "#22c55e" },
};

const TABS: Array<"All" | Status> = ["All", "Pending", "In Progress", "Completed"];

// ── Sub-components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      display: "inline-block", padding: "3px 8px",
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, borderRadius: 0,
    }}>
      {status}
    </span>
  );
}

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

// ── Status change control (used inside the detail panel footer) ───────────
function StatusChanger({ status, onChange }: { status: ConsultationStatus; onChange: (s: ConsultationStatus) => void }) {
  const colors: Record<ConsultationStatus, string> = {
    "Pending": "#f59e0b",
    "In Progress": "#60a5fa",
    "Completed": "#22c55e",
  };
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {(["Pending", "In Progress", "Completed"] as ConsultationStatus[]).map((s) => {
        const isActive = status === s;
        return (
          <button key={s} onClick={() => { if (!isActive) onChange(s); }} style={{
            padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: isActive ? "default" : "pointer",
            border: `1px solid ${isActive ? colors[s] : "var(--border)"}`,
            background: isActive ? `${colors[s]}20` : "transparent",
            color: isActive ? colors[s] : "var(--muted)",
            borderRadius: 0, fontFamily: "inherit",
            transition: "all 0.15s",
          }}>
            {s}
          </button>
        );
      })}
    </div>
  );
}

// ── Delete Modal ───────────────────────────────────────────────────────────
function DeleteModal({ item, onConfirm, onClose }: { item: Consultation; onConfirm: () => void; onClose: () => void }) {
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
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Consultation</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{item.name}</strong>&apos;s consultation?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", border: "none",
            background: "#ef4444", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0,
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ConsultationsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"All" | ConsultationStatus>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<Consultation | null>(null);
  const [deleteItem, setDeleteItem] = useState<Consultation | null>(null);
  const { consultations, loading, fetch, remove, updateStatus } = useConsultationsStore();

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = consultations.filter((c) => {
    const matchTab = activeTab === "All" || c.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q) || c.services.join(" ").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusChange = async (id: string, status: ConsultationStatus) => {
    await updateStatus(id, status);
    if (viewItem && viewItem._id === id) {
      setViewItem((prev) => prev ? { ...prev, status } : prev);
    }
    toast(`Status updated to "${status}".`);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setDeleteItem(null);
    toast("Consultation deleted.", "error");
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Consultations</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Manage and track all consultation requests.</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                padding: "8px 16px",
                border: "1px solid var(--border)",
                borderLeft: tab === "All" ? "1px solid var(--border)" : "none",
                borderRadius: 0, cursor: "pointer", fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                backgroundImage: isActive ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
                backgroundColor: isActive ? "transparent" : "var(--surface)",
                color: isActive ? "#fff" : "var(--muted)",
              }}>
                {tab}
              </button>
            );
          })}
        </div>
        <input type="text" placeholder="Search by name, email, company..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px",
            border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)",
            fontSize: 13, outline: "none", width: 240,
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40 }}>#</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Services</th>
                <th style={thStyle}>Urgency</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>
                    No consultations found.
                  </td>
                </tr>
              ) : pageItems.map((c, i) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.name}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.email}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{c.company || "—"}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", maxWidth: 180 }}>
                    <span title={c.services.join(", ")}>
                      {c.services[0]}{c.services.length > 1 ? ` +${c.services.length - 1}` : ""}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 7px",
                      background: c.urgency === "ASAP" ? "rgba(239,68,68,0.12)" : "var(--surface2)",
                      color: c.urgency === "ASAP" ? "#ef4444" : "var(--muted)",
                    }}>
                      {c.urgency || "—"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(c.createdAt)}</td>
                  <td style={tdStyle}><StatusBadge status={c.status} /></td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => setViewItem(c)} title="View details" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <InfoIcon />
                      </button>
                      <button onClick={() => setDeleteItem(c)} title="Delete" style={{
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
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} consultations</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <DetailPanel
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ""}
        subtitle={viewItem && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            ID: {viewItem._id.slice(-8)} · {fmtDate(viewItem.createdAt)} <StatusBadge status={viewItem.status} />
          </span>
        )}
        fields={viewItem ? [
          { label: "Email", value: viewItem.email },
          { label: "Phone", value: viewItem.phone },
          { label: "Company", value: viewItem.company },
          { label: "Website", value: viewItem.website },
          { label: "Team Size", value: viewItem.teamSize },
          { label: "Industry", value: viewItem.industry },
          { label: "Services", value: viewItem.services.join(", ") },
          { label: "Urgency", value: viewItem.urgency },
          ...(viewItem.goals ? [{ label: "Goals", value: viewItem.goals, fullWidth: true }] : []),
          { label: "Days", value: viewItem.days.join(", ") },
          { label: "Time", value: viewItem.timeSlot },
        ] : []}
        footer={viewItem && <StatusChanger status={viewItem.status} onChange={(s) => handleStatusChange(viewItem._id, s)} />}
      />
      {deleteItem && <DeleteModal item={deleteItem} onConfirm={() => handleDelete(deleteItem._id)} onClose={() => setDeleteItem(null)} />}
    </main>
  );
}

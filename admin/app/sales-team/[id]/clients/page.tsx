"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { SalesRep } from "@/stores/useSalesRepsStore";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});

const dateInputStyle: React.CSSProperties = {
  height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const dateBtnStyle: React.CSSProperties = {
  height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "var(--surface2)",
  color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
};
const mobileCardStyle: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)", padding: 14, marginBottom: 10,
};
const iconBtnStyle: React.CSSProperties = {
  width: 30, height: 30, border: "1px solid var(--border)",
  background: "transparent", color: "var(--muted)",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
  borderRadius: 0, transition: "all 0.15s",
};

type ClientPriority = "Low" | "Medium" | "High";
const PRIORITY_STYLES: Record<ClientPriority, { bg: string; color: string }> = {
  Low: { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
  Medium: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
  High: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
};
function PriorityBadge({ priority }: { priority: ClientPriority }) {
  const s = PRIORITY_STYLES[priority];
  return (
    <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, borderRadius: 0 }}>
      {priority}
    </span>
  );
}

function StatusBadge({ client }: { client: ClientRow }) {
  if (client.status === "Follow-up") {
    return (
      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(245,158,11,0.15)", color: "#f59e0b", whiteSpace: "nowrap" }}>
        Follow-up{client.followUpDate ? ` · ${fmtDateTimeFull(client.followUpDate)}` : ""}
      </span>
    );
  }
  if (client.status === "Closed") {
    return (
      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(34,197,94,0.15)", color: "#22c55e", whiteSpace: "nowrap" }}>
        Closed{client.closedAt ? ` · ${fmtDateTimeFull(client.closedAt)}` : ""}
      </span>
    );
  }
  return (
    <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "var(--surface2)", color: "var(--muted)", whiteSpace: "nowrap" }}>
      New
    </span>
  );
}

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
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

function DeleteModal({ businessName, onConfirm, onClose }: { businessName: string; onConfirm: () => void; onClose: () => void }) {
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
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Client</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{businessName}</strong>?
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

interface ClientRow {
  _id: string;
  businessName: string;
  phone: string;
  note: string;
  status: "New" | "Follow-up" | "Closed";
  priority: ClientPriority;
  followUpDate: string | null;
  closedAt: string | null;
  createdAt: string;
}

export default function SalesRepClientsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rep, setRep] = useState<SalesRep | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(todayISO());
  const [page, setPage] = useState(1);
  const [viewClient, setViewClient] = useState<ClientRow | null>(null);
  const [deleteClient, setDeleteClient] = useState<ClientRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [repRes, clientsRes] = await Promise.all([
        api.get(`/sales-reps/${id}`),
        api.get(`/sales-reps/${id}/clients`),
      ]);
      if (repRes.data.success) setRep(repRes.data.data);
      if (clientsRes.data.success) setClients(clientsRes.data.data);
    } catch {}
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
    const matchDate = !date || c.createdAt.slice(0, 10) === date;
    return matchSearch && matchDate;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (clientId: string) => {
    try {
      await api.delete(`/sales-reps/clients/${clientId}`);
      setClients((prev) => prev.filter((c) => c._id !== clientId));
    } catch {}
    finally { setDeleteClient(null); }
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <button onClick={() => router.push(`/sales-team/${id}`)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
        color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 16, padding: 0,
      }}>
        <BackIcon /> Back to {rep?.name ?? "Salesman"}
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Clients — {rep?.name ?? ""}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>All clients added by this salesman.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search by business name or phone..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
              height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
              background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 280,
            }}
          />
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} style={dateInputStyle} />
          <button onClick={() => { setDate(todayISO()); setPage(1); }} style={dateBtnStyle}>Today</button>
          {date && <button onClick={() => { setDate(""); setPage(1); }} style={{ ...dateBtnStyle, background: "transparent" }}>Clear</button>}
        </div>
      </div>

      <div className="table-desktop" style={{ display: "none", background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <style>{`@media(min-width:768px){.table-desktop{display:block!important}.card-mobile{display:none!important}}`}</style>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Business Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Added</th>
                <th style={{ ...thStyle, textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No clients found.</td></tr>
              ) : pageItems.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.note || "—"}</td>
                  <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}><StatusBadge client={c} /></td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDateTimeFull(c.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => setViewClient(c)} title="View details" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <InfoIcon />
                      </button>
                      <button onClick={() => setDeleteClient(c)} title="Delete" style={{
                        width: 30, height: 30, border: "1px solid rgba(239,68,68,0.35)",
                        background: "transparent", color: "#ef4444",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
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
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} clients</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <div className="card-mobile">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No clients found.</div>
        ) : (
          <>
            {pageItems.map((c) => (
              <div key={c._id} style={mobileCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{c.businessName}</span>
                  <PriorityBadge priority={c.priority} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{c.phone}</div>
                <div style={{ marginBottom: 8 }}><StatusBadge client={c} /></div>
                {c.note && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>{c.note}</div>}
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Added {fmtDateTimeFull(c.createdAt)}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setViewClient(c)} title="View details" style={iconBtnStyle}><InfoIcon /></button>
                  <button onClick={() => setDeleteClient(c)} title="Delete" style={{ ...iconBtnStyle, border: "1px solid rgba(239,68,68,0.35)", color: "#ef4444" }}><TrashIcon /></button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} clients</span>
              {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
            </div>
          </>
        )}
      </div>

      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient && `Added ${fmtDateTimeFull(viewClient.createdAt)}`}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Status", value: viewClient.status },
          ...(viewClient.status === "Follow-up" && viewClient.followUpDate ? [{ label: "Follow-up On", value: fmtDateTimeFull(viewClient.followUpDate) }] : []),
          ...(viewClient.status === "Closed" && viewClient.closedAt ? [{ label: "Closed On", value: fmtDateTimeFull(viewClient.closedAt) }] : []),
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
      {deleteClient && (
        <DeleteModal
          businessName={deleteClient.businessName}
          onConfirm={() => handleDelete(deleteClient._id)}
          onClose={() => setDeleteClient(null)}
        />
      )}
    </main>
  );
}

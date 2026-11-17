"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});

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

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

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
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Call</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete the call logged for <strong style={{ color: "var(--fg)" }}>{businessName}</strong>?
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

interface CallRow {
  _id: string;
  businessName: string;
  createdAt: string;
  salesRep: { _id: string; name: string } | null;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteCall, setDeleteCall] = useState<CallRow | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/sales-reps/calls");
        if (res.data.success) setCalls(res.data.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = calls.filter((c) => {
    const q = search.toLowerCase();
    return !q
      || c.businessName.toLowerCase().includes(q)
      || (c.salesRep?.name ?? "").toLowerCase().includes(q);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (callId: string) => {
    try {
      await api.delete(`/sales-reps/calls/${callId}`);
      setCalls((prev) => prev.filter((c) => c._id !== callId));
    } catch {}
    finally { setDeleteCall(null); }
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Calls</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Every call logged by any salesman, across the whole sales team.</p>
        </div>
        <input type="text" placeholder="Search by business name or salesman..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 300,
          }}
        />
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Business Name</th>
                <th style={thStyle}>Salesman</th>
                <th style={thStyle}>Time</th>
                <th style={{ ...thStyle, textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No calls logged yet.</td></tr>
              ) : pageItems.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.salesRep?.name ?? "(deleted rep)"}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDateTimeFull(c.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button onClick={() => setDeleteCall(c)} title="Delete" style={{
                      width: 30, height: 30, border: "1px solid rgba(239,68,68,0.35)",
                      background: "transparent", color: "#ef4444",
                      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 0, transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} calls</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>
      {deleteCall && (
        <DeleteModal
          businessName={deleteCall.businessName}
          onConfirm={() => handleDelete(deleteCall._id)}
          onClose={() => setDeleteCall(null)}
        />
      )}
    </main>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { SalesRep } from "@/stores/useSalesRepsStore";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const dateInputStyle: React.CSSProperties = {
  height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const dateBtnStyle: React.CSSProperties = {
  height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "var(--surface2)",
  color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
};

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

function DeleteModal({ label, onConfirm, onClose }: { label: string; onConfirm: () => void; onClose: () => void }) {
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
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Report</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete the report for <strong style={{ color: "var(--fg)" }}>{label}</strong>?
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

interface ReportRow {
  _id: string;
  date: string;
  callsMade: number;
  interestedCount: number;
  notes: string;
}

export default function SalesRepReportsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rep, setRep] = useState<SalesRep | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(todayISO());
  const [page, setPage] = useState(1);
  const [viewReport, setViewReport] = useState<ReportRow | null>(null);
  const [deleteReport, setDeleteReport] = useState<ReportRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [repRes, reportsRes] = await Promise.all([
        api.get(`/sales-reps/${id}`),
        api.get(`/sales-reps/${id}/reports`),
      ]);
      if (repRes.data.success) setRep(repRes.data.data);
      if (reportsRes.data.success) setReports(reportsRes.data.data);
    } catch {}
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.notes.toLowerCase().includes(q) || fmtDate(r.date).toLowerCase().includes(q);
    const matchDate = !date || r.date === date;
    return matchSearch && matchDate;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (reportId: string) => {
    try {
      await api.delete(`/sales-reps/reports/${reportId}`);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch {}
    finally { setDeleteReport(null); }
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Daily Reports — {rep?.name ?? ""}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>All daily reports submitted by this salesman.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search notes or date..." value={search}
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

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Calls Made</th>
                <th style={thStyle}>Interested</th>
                <th style={thStyle}>Notes</th>
                <th style={{ ...thStyle, textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No reports found.</td></tr>
              ) : pageItems.map((r) => (
                <tr key={r._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(r.date)}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.callsMade}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.interestedCount}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes || "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => setViewReport(r)} title="View details" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <InfoIcon />
                      </button>
                      <button onClick={() => setDeleteReport(r)} title="Delete" style={{
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
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} reports</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <DetailPanel
        open={!!viewReport}
        onClose={() => setViewReport(null)}
        title={viewReport ? fmtDate(viewReport.date) : ""}
        fields={viewReport ? [
          { label: "Calls Made", value: viewReport.callsMade },
          { label: "Interested", value: viewReport.interestedCount },
          { label: "Notes", value: viewReport.notes, fullWidth: true },
        ] : []}
      />
      {deleteReport && (
        <DeleteModal
          label={fmtDate(deleteReport.date)}
          onConfirm={() => handleDelete(deleteReport._id)}
          onClose={() => setDeleteReport(null)}
        />
      )}
    </main>
  );
}

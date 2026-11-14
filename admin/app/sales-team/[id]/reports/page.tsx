"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { SalesRep } from "@/stores/useSalesRepsStore";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="15 18 9 12 15 6"/>
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
  const [page, setPage] = useState(1);

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
    return !q || r.notes.toLowerCase().includes(q) || fmtDate(r.date).toLowerCase().includes(q);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
        <input type="text" placeholder="Search notes or date..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 280,
          }}
        />
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No reports found.</td></tr>
              ) : pageItems.map((r) => (
                <tr key={r._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(r.date)}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.callsMade}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.interestedCount}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 400 }}>{r.notes || "—"}</td>
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
    </main>
  );
}

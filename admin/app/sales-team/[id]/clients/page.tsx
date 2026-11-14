"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { SalesRep } from "@/stores/useSalesRepsStore";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});

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
  const [page, setPage] = useState(1);

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
    return !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Clients — {rep?.name ?? ""}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>All clients added by this salesman.</p>
        </div>
        <input type="text" placeholder="Search by business name or phone..." value={search}
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
                <th style={thStyle}>Business Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Added</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No clients found.</td></tr>
              ) : pageItems.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 280 }}>{c.note || "—"}</td>
                  <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                  <td style={tdStyle}>
                    {c.status === "Follow-up" ? (
                      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                        Follow-up{c.followUpDate ? ` · ${fmtDateTimeFull(c.followUpDate)}` : ""}
                      </span>
                    ) : c.status === "Closed" ? (
                      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                        Closed{c.closedAt ? ` · ${fmtDateTimeFull(c.closedAt)}` : ""}
                      </span>
                    ) : (
                      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "var(--surface2)", color: "var(--muted)" }}>
                        New
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDateTimeFull(c.createdAt)}</td>
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
    </main>
  );
}

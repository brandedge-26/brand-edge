"use client";

import { useState, useEffect, useMemo } from "react";
import { useClientsStore, Client, ClientPriority } from "@/stores/useClientsStore";
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

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
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

export default function ClosedClientsPage() {
  const { clients, loading, fetch } = useClientsStore();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setDate(todayISO()); }, []);

  const closed = useMemo(() =>
    clients
      .filter((c) => c.status === "Closed")
      .sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? "")),
    [clients]
  );

  const filtered = closed.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
    const matchDate = !date || (c.closedAt ?? "").slice(0, 10) === date;
    return matchSearch && matchDate;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Closed Clients</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Clients you&apos;ve marked done — follow-up finished.</p>
        </div>
        <input type="text" placeholder="Search by business name or phone..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 280,
          }}
        />
      </div>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} style={dateInputStyle} />
        <button onClick={() => { setDate(todayISO()); setPage(1); }} style={dateBtnStyle}>Today</button>
        {date && <button onClick={() => { setDate(""); setPage(1); }} style={{ ...dateBtnStyle, background: "transparent" }}>Clear</button>}
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
                <th style={thStyle}>Closed On</th>
                <th style={{ ...thStyle, textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No closed clients yet.</td></tr>
              ) : pageItems.map((c) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.note || "—"}</td>
                  <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.closedAt ? fmtDateTimeFull(c.closedAt) : "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} closed clients</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <div className="card-mobile">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No closed clients yet.</div>
        ) : (
          <>
            {pageItems.map((c) => (
              <div key={c._id} style={mobileCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{c.businessName}</span>
                  <PriorityBadge priority={c.priority} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{c.phone}</div>
                {c.note && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>{c.note}</div>}
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>{c.closedAt ? `Closed ${fmtDateTimeFull(c.closedAt)}` : ""}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setViewClient(c)} title="View details" style={iconBtnStyle}><InfoIcon /></button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} closed clients</span>
              {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
            </div>
          </>
        )}
      </div>

      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient?.closedAt ? `Closed ${fmtDateTimeFull(viewClient.closedAt)}` : ""}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
    </main>
  );
}

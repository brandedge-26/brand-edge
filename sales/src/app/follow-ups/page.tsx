"use client";

import { useState, useEffect, useMemo } from "react";
import { useClientsStore, Client, ClientPriority } from "@/stores/useClientsStore";
import { useToast } from "@/components/Toast";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});
const todayISO = () => new Date().toISOString().slice(0, 10);

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

export default function FollowUpsPage() {
  const { toast } = useToast();
  const { clients, loading, fetch, closeClient } = useClientsStore();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [page, setPage] = useState(1);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setToday(todayISO()); }, []);

  const followUps = useMemo(() =>
    clients
      .filter((c) => c.status === "Follow-up" && c.followUpDate)
      .sort((a, b) => (a.followUpDate! < b.followUpDate! ? -1 : 1)),
    [clients]
  );

  const filtered = followUps.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
    const due = c.followUpDate!.slice(0, 10);
    const matchDate = !date || due === date;
    return matchSearch && matchDate;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleClose = async (c: Client) => {
    setClosingId(c._id);
    try {
      await closeClient(c._id);
      toast("Client closed.");
    } catch {
      toast("Failed to close client.", "error");
    } finally {
      setClosingId(null);
    }
  };

  const isOverdue = (dueDate: string) => dueDate.slice(0, 10) < today;
  const isToday = (dueDate: string) => dueDate.slice(0, 10) === today;

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Follow-ups</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Clients marked for follow-up, sorted by due date — overdue first.</p>
      </div>

      <FilterBar
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by business name, phone..."
        date={date} onDateChange={(v) => { setDate(v); setPage(1); }}
        onToday={() => { setDate(today); setPage(1); }}
        onClear={() => { setDate(""); setPage(1); }}
      />

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Business Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Due Date &amp; Time</th>
                <th style={thStyle}>Note</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No follow-ups found.</td></tr>
              ) : pageItems.map((c) => {
                const due = c.followUpDate!;
                const overdue = isOverdue(due);
                const dueToday = isToday(due);
                return (
                  <tr key={c._id}>
                    <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone || "—"}</td>
                    <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <span style={{ color: overdue ? "#ef4444" : dueToday ? "#f59e0b" : "var(--fg)", fontWeight: overdue || dueToday ? 700 : 400 }}>
                        {fmtDateTimeFull(due)}
                      </span>
                      {overdue && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>Overdue</span>}
                      {dueToday && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase" }}>Today</span>}
                    </td>
                    <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.note || "—"}</td>
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
                        <button onClick={() => handleClose(c)} disabled={closingId === c._id} style={{
                          padding: "0 16px", height: 30, border: "none",
                          backgroundImage: closingId !== c._id ? "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)" : "none",
                          backgroundColor: closingId !== c._id ? "transparent" : "var(--surface2)",
                          color: closingId !== c._id ? "#fff" : "var(--muted)",
                          fontSize: 12, fontWeight: 600, cursor: closingId === c._id ? "not-allowed" : "pointer", borderRadius: 0, fontFamily: "inherit",
                        }}>
                          {closingId === c._id ? "Saving..." : "Mark Done"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} follow-ups</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient?.followUpDate ? `Due ${fmtDateTimeFull(viewClient.followUpDate)}` : ""}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone || "—" },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
    </main>
  );
}

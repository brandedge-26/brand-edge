"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useClientsStore, Client, ClientPriority } from "@/stores/useClientsStore";
import { useReportsStore, DailyReport } from "@/stores/useReportsStore";
import { useCallsStore } from "@/stores/useCallsStore";
import DetailPanel from "@/components/DetailPanel";

const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});

const dateInputStyle: React.CSSProperties = {
  height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const btnStyle: React.CSSProperties = {
  height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "var(--surface2)",
  color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
};

// ── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const infoBtnStyle: React.CSSProperties = {
  width: 28, height: 28, border: "1px solid var(--border)",
  background: "transparent", color: "var(--muted)",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
  borderRadius: 0, transition: "all 0.15s",
};
function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} title="View details" style={infoBtnStyle}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
      <InfoIcon />
    </button>
  );
}

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

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  "New": { bg: "var(--surface2)", color: "var(--muted)" },
  "Follow-up": { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  "Closed": { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
};
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "var(--surface2)", color: "var(--muted)" };
  return <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, borderRadius: 0 }}>{status}</span>;
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

function TableCard({ title, viewAllHref, children }: { title: string; viewAllHref: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 0, marginBottom: 24, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{title}</span>
        <Link href={viewAllHref} style={{ fontSize: 12, fontWeight: 700, color: "#ff6a00", textDecoration: "none" }}>View All →</Link>
      </div>
      <div style={{ overflowX: "auto" }}>{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { clients, loading: clientsLoading, fetch: fetchClients } = useClientsStore();
  const { reports, loading: reportsLoading, fetch: fetchReports } = useReportsStore();
  const { calls, fetch: fetchCalls } = useCallsStore();
  const [today, setToday] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [viewReport, setViewReport] = useState<DailyReport | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [viewFollowUp, setViewFollowUp] = useState<Client | null>(null);

  useEffect(() => { fetchClients(); fetchReports(); fetchCalls(); }, [fetchClients, fetchReports, fetchCalls]);
  useEffect(() => {
    const t = todayISO();
    setToday(t);
    setFrom(t);
    setTo(t);
  }, []);

  const isToday = today !== "" && from === today && to === today;
  const loading = clientsLoading || reportsLoading;

  const clientsAdded = useMemo(() => {
    if (!from || !to) return 0;
    return clients.filter((c) => {
      const d = c.createdAt.slice(0, 10);
      return d >= from && d <= to;
    }).length;
  }, [clients, from, to]);

  const closedInRange = useMemo(() => {
    if (!from || !to) return 0;
    return clients.filter((c) => {
      if (c.status !== "Closed" || !c.closedAt) return false;
      const d = c.closedAt.slice(0, 10);
      return d >= from && d <= to;
    }).length;
  }, [clients, from, to]);

  const followUpsPending = useMemo(() => clients.filter((c) => c.status === "Follow-up").length, [clients]);

  const callsMade = useMemo(() => {
    if (!from || !to) return 0;
    return calls.filter((c) => {
      const d = c.createdAt.slice(0, 10);
      return d >= from && d <= to;
    }).length;
  }, [calls, from, to]);

  const recentReports = useMemo(() => reports.slice(0, 5), [reports]);
  const recentClients = useMemo(() => clients.slice(0, 5), [clients]);
  const upcomingFollowUps = useMemo(() =>
    clients
      .filter((c) => c.status === "Follow-up" && c.followUpDate)
      .sort((a, b) => (a.followUpDate! < b.followUpDate! ? -1 : 1))
      .slice(0, 5),
    [clients]
  );

  const STAT_CARDS = [
    { label: "Clients Added", value: clientsAdded, icon: UsersIcon },
    { label: "Follow-ups Pending", value: followUpsPending, icon: ClockIcon },
    { label: "Closed Clients", value: closedInRange, icon: CheckIcon },
    { label: "Calls Made", value: callsMade, icon: PhoneIcon },
  ];

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>
            {isToday ? "Today's Activity" : "Activity"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {isToday ? "Here's what you've gotten done today." : "Pick a date range to see past activity."}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={dateInputStyle} />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={dateInputStyle} />
          {!isToday && (
            <button onClick={() => { setFrom(today); setTo(today); }} style={btnStyle}>Today</button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 0, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Icon />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fg)", lineHeight: 1 }}>{loading ? "—" : String(value)}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      <TableCard title="Recent Daily Reports" viewAllHref="/reports">
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Calls Made</th><th style={thStyle}>Interested</th><th style={thStyle}>Notes</th><th style={{ ...thStyle, textAlign: "center" }}></th></tr></thead>
          <tbody>
            {recentReports.length === 0 ? (
              <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 28 }}>{reportsLoading ? "Loading..." : "No reports submitted yet"}</td></tr>
            ) : recentReports.map((r) => (
              <tr key={r._id}>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(r.date)}</td>
                <td style={tdStyle}>{r.callsMade}</td>
                <td style={tdStyle}>{r.interestedCount}</td>
                <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes || "—"}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}><InfoButton onClick={() => setViewReport(r)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard title="Recent Clients" viewAllHref="/clients">
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Business Name</th><th style={thStyle}>Phone</th><th style={thStyle}>Priority</th><th style={thStyle}>Status</th><th style={thStyle}>Added</th><th style={{ ...thStyle, textAlign: "center" }}></th></tr></thead>
          <tbody>
            {recentClients.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 28 }}>{clientsLoading ? "Loading..." : "No clients added yet"}</td></tr>
            ) : recentClients.map((c) => (
              <tr key={c._id}>
                <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                <td style={tdStyle}><StatusBadge status={c.status} /></td>
                <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(c.createdAt)}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}><InfoButton onClick={() => setViewClient(c)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard title="Upcoming Follow-ups" viewAllHref="/follow-ups">
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Business Name</th><th style={thStyle}>Phone</th><th style={thStyle}>Priority</th><th style={thStyle}>Due Date &amp; Time</th><th style={{ ...thStyle, textAlign: "center" }}></th></tr></thead>
          <tbody>
            {upcomingFollowUps.length === 0 ? (
              <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 28 }}>{clientsLoading ? "Loading..." : "No follow-ups scheduled"}</td></tr>
            ) : upcomingFollowUps.map((c) => (
              <tr key={c._id}>
                <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDateTimeFull(c.followUpDate!)}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}><InfoButton onClick={() => setViewFollowUp(c)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

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
      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient && `Added ${fmtDateTimeFull(viewClient.createdAt)}`}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Status", value: <StatusBadge status={viewClient.status} /> },
          ...(viewClient.status === "Follow-up" && viewClient.followUpDate ? [{ label: "Follow-up On", value: fmtDateTimeFull(viewClient.followUpDate) }] : []),
          ...(viewClient.status === "Closed" && viewClient.closedAt ? [{ label: "Closed On", value: fmtDateTimeFull(viewClient.closedAt) }] : []),
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
      <DetailPanel
        open={!!viewFollowUp}
        onClose={() => setViewFollowUp(null)}
        title={viewFollowUp?.businessName ?? ""}
        subtitle={viewFollowUp?.followUpDate ? `Due ${fmtDateTimeFull(viewFollowUp.followUpDate)}` : ""}
        fields={viewFollowUp ? [
          { label: "Phone", value: viewFollowUp.phone },
          { label: "Priority", value: <PriorityBadge priority={viewFollowUp.priority} /> },
          { label: "Note", value: viewFollowUp.note, fullWidth: true },
        ] : []}
      />
    </main>
  );
}

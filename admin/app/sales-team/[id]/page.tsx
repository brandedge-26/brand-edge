"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { SalesRep } from "@/stores/useSalesRepsStore";

const todayISO = () => new Date().toISOString().slice(0, 10);

// ── Icons ──────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const dateInputStyle: React.CSSProperties = {
  height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit",
};

interface ClientRow {
  _id: string;
  status: "New" | "Follow-up";
  createdAt: string;
}

interface ReportRow {
  _id: string;
  date: string;
  callsMade: number;
  interestedCount: number;
}

export default function SalesRepDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rep, setRep] = useState<SalesRep | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayISO()); // defaults to today; mandatory daily view

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [repRes, clientsRes, reportsRes] = await Promise.all([
        api.get(`/sales-reps/${id}`),
        api.get(`/sales-reps/${id}/clients`),
        api.get(`/sales-reps/${id}/reports`),
      ]);
      if (repRes.data.success) setRep(repRes.data.data);
      if (clientsRes.data.success) setClients(clientsRes.data.data);
      if (reportsRes.data.success) setReports(reportsRes.data.data);
    } catch {}
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const resetToToday = () => setDate(todayISO());
  const clearDate = () => setDate("");

  // Clients added in the selected range (or all-time if no date picked)
  const clientsInRange = date ? clients.filter((c) => c.createdAt.slice(0, 10) === date) : clients;
  // Follow-ups pending is a current snapshot, not date-scoped
  const followUpPendingCount = clients.filter((c) => c.status === "Follow-up").length;
  // Reports in the selected range (or all-time)
  const reportsInRange = date ? reports.filter((r) => r.date === date) : reports;
  const interestedSum = reportsInRange.reduce((sum, r) => sum + r.interestedCount, 0);
  const todaysReport = reports.find((r) => r.date === todayISO());

  const STAT_CARDS = [
    { label: "Clients Added",      value: clientsInRange.length,  icon: UsersIcon },
    { label: "Follow-ups Pending", value: followUpPendingCount,   icon: ClockIcon },
    { label: "Interested (Reported)", value: interestedSum,       icon: CheckIcon },
  ];

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      {/* Back + heading */}
      <button onClick={() => router.push("/sales-team")} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
        color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 16, padding: 0,
      }}>
        <BackIcon /> Back to Sales Team
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{rep?.name ?? (loading ? "Loading..." : "Not found")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {rep?.email}{rep && (
              <span style={{
                marginLeft: 10, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                background: rep.active ? "rgba(34,197,94,0.12)" : "rgba(100,100,100,0.12)",
                color: rep.active ? "#22c55e" : "var(--muted)",
              }}>
                {rep.active ? "Active" : "Inactive"}
              </span>
            )}
          </p>
        </div>

        {/* Date filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={dateInputStyle} />
          <button onClick={resetToToday} style={{
            height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "var(--surface2)",
            color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          }}>
            Today
          </button>
          {date && (
            <button onClick={clearDate} style={{
              height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "transparent",
              color: "var(--muted)", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
            }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
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

      {/* Clients Added — summary + View All */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>Clients Added</span>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, marginBottom: 0 }}>{loading ? "Loading..." : `${clients.length} total`}</p>
        </div>
        <button onClick={() => router.push(`/sales-team/${id}/clients`)} style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
          border: "1px solid var(--border)", background: "transparent", color: "var(--fg)",
          fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
        }}>
          View All <ArrowRightIcon />
        </button>
      </div>

      {/* Daily Reports — today's report + View All */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>Today&apos;s Report</span>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, marginBottom: 0 }}>
            {loading ? "Loading..." : todaysReport
              ? `${todaysReport.callsMade} calls · ${todaysReport.interestedCount} interested`
              : "No report submitted today."}
            {" "}&nbsp;·&nbsp; {reports.length} total submitted
          </p>
        </div>
        <button onClick={() => router.push(`/sales-team/${id}/reports`)} style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
          border: "1px solid var(--border)", background: "transparent", color: "var(--fg)",
          fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
        }}>
          View All <ArrowRightIcon />
        </button>
      </div>
    </main>
  );
}

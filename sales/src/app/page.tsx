"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboardStore } from "@/stores/useDashboardStore";

const todayISO = () => new Date().toISOString().slice(0, 10);

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

export default function DashboardPage() {
  const { stats, loading, fetch } = useDashboardStore();
  const [today, setToday] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const t = todayISO();
    setToday(t);
    setFrom(t);
    setTo(t);
  }, []);

  const load = useCallback(() => { if (from && to) fetch(from, to); }, [fetch, from, to]);
  useEffect(() => { load(); }, [load]);

  const isToday = today !== "" && from === today && to === today;

  const STAT_CARDS = [
    { label: "Calls Made",      value: stats?.callsCount ?? "—",       icon: PhoneIcon },
    { label: "Follow-ups Done", value: stats?.followUpsCount ?? "—",   icon: ClockIcon },
    { label: "Leads Assigned",  value: stats?.leadsAssignedCount ?? "—", icon: UsersIcon },
    { label: "Conversions",     value: stats?.conversionsCount ?? "—", icon: CheckIcon },
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
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
    </main>
  );
}

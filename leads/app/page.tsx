"use client";

import { useEffect } from "react";
import { useLeadsStore, LeadStatus, STATUS_LABELS } from "@/stores/useLeadsStore";
import LeadsTable from "@/components/LeadsTable";

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <rect x="2" y="4" width="20" height="16"/><polyline points="22 4 12 14 2 4"/>
  </svg>
);
const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const BanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const CARDS: { status: LeadStatus; icon: () => React.JSX.Element }[] = [
  { status: "sent", icon: MailIcon },
  { status: "interested", icon: TrendingUpIcon },
  { status: "follow_up", icon: ClockIcon },
  { status: "replied", icon: MessageIcon },
  { status: "do_not_contact", icon: BanIcon },
  { status: "bounced", icon: AlertIcon },
];

export default function LeadsHomePage() {
  const { stats, fetchStats } = useLeadsStore();
  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {CARDS.map(({ status, icon: Icon }) => (
          <div key={status} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 0, padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Icon />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--fg)", lineHeight: 1 }}>{stats ? stats[status] : "—"}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{STATUS_LABELS[status]}</div>
          </div>
        ))}
      </div>

      <LeadsTable />
    </main>
  );
}

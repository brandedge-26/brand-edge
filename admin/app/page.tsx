"use client";

import Link from "next/link";

// ── Icons ──────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <rect x="3" y="4" width="18" height="18"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Stat cards data ────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Consultations", value: "128", change: "+12% this month", icon: CalendarIcon },
  { label: "Total Contacts",      value: "94",  change: "+8% this month",  icon: UsersIcon   },
  { label: "Pending Reviews",     value: "17",  change: "5 new today",     icon: ClockIcon   },
  { label: "Resolved",            value: "189", change: "+23% this month", icon: CheckIcon   },
];

// ── Recent consultations ───────────────────────────────────────────────────
const RECENT_CONSULTATIONS = [
  { name: "Sarah Mitchell", service: "Website Design",  date: "Jun 15, 2025", status: "Pending"     },
  { name: "James Okafor",  service: "App Development", date: "Jun 14, 2025", status: "In Progress" },
  { name: "Priya Sharma",  service: "Marketing",       date: "Jun 13, 2025", status: "Completed"   },
  { name: "Carlos Rivera", service: "Graphic Design",  date: "Jun 12, 2025", status: "Pending"     },
  { name: "Emma Thompson", service: "Software Dev",    date: "Jun 11, 2025", status: "In Progress" },
];

// ── Recent contacts ────────────────────────────────────────────────────────
const RECENT_CONTACTS = [
  { name: "Ali Hassan",       email: "ali@gmail.com",        phone: "+92 301 234 5678", date: "Jun 15, 2025" },
  { name: "Nadia Butt",       email: "nadia@corp.pk",        phone: "+92 321 876 5432", date: "Jun 14, 2025" },
  { name: "Raza Shah",        email: "raza@startup.io",      phone: "+92 333 456 7890", date: "Jun 13, 2025" },
  { name: "Sara Malik",       email: "sara@business.co",     phone: "+92 311 234 9876", date: "Jun 12, 2025" },
  { name: "Bilal Ahmed",      email: "bilal@freelance.pk",   phone: "+92 345 678 1234", date: "Jun 11, 2025" },
];

// ── Status badge ───────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  "Pending":     { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b" },
  "In Progress": { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Completed":   { bg: "rgba(34,197,94,0.15)",   color: "#22c55e" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "rgba(255,255,255,0.1)", color: "#aaa" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        borderRadius: 0,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ── Table wrapper ─────────────────────────────────────────────────────────
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};
const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--muted)",
  background: "var(--surface2)",
  borderBottom: "1px solid var(--border)",
};
const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid var(--border)",
  color: "var(--fg)",
  verticalAlign: "middle",
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function OverviewPage() {
  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

      {/* ── Stats row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {STATS.map(({ label, value, change, icon: Icon }) => (
          <div
            key={label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 0,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Icon />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#22c55e",
                  background: "rgba(34,197,94,0.12)",
                  padding: "2px 7px",
                  borderRadius: 0,
                }}
              >
                {change}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fg)", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Consultations ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>Recent Consultations</span>
          <Link
            href="/consultations"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#ff6a00",
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CONSULTATIONS.map((row, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{row.service}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{row.date}</td>
                  <td style={tdStyle}><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Contacts ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>Recent Contacts</span>
          <Link
            href="/contacts"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#ff6a00",
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CONTACTS.map((row, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{row.email}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{row.phone}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

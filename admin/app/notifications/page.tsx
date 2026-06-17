"use client";

import { useState } from "react";

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
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────
type NotifType = "Consultation" | "Contact" | "System";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// ── Mock data ──────────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1,  type: "Consultation", title: "New Consultation",      description: "Sarah Mitchell submitted a consultation for Website Design",  timestamp: "2 min ago",   read: false },
  { id: 2,  type: "Contact",      title: "New Contact",           description: "Ali Hassan sent a message about website redesign",             timestamp: "15 min ago",  read: false },
  { id: 3,  type: "Consultation", title: "Consultation Updated",  description: "James Okafor's status changed to In Progress",                timestamp: "1 hour ago",  read: true  },
  { id: 4,  type: "Consultation", title: "New Consultation",      description: "Carlos Rivera submitted a consultation for Graphic Design",    timestamp: "3 hours ago", read: false },
  { id: 5,  type: "Contact",      title: "Contact Resolved",      description: "Nadia Butt's inquiry has been marked as resolved",            timestamp: "5 hours ago", read: true  },
  { id: 6,  type: "Consultation", title: "New Consultation",      description: "Emma Thompson submitted for Software Dev",                    timestamp: "Yesterday",   read: true  },
  { id: 7,  type: "Consultation", title: "Consultation Completed",description: "Priya Sharma's project marked as completed",                  timestamp: "Yesterday",   read: true  },
  { id: 8,  type: "Contact",      title: "New Contact",           description: "Bilal Ahmed sent a message",                                  timestamp: "2 days ago",  read: false },
  { id: 9,  type: "System",       title: "System",                description: "Admin dashboard updated to v1.2",                             timestamp: "3 days ago",  read: true  },
  { id: 10, type: "Consultation", title: "Consultation Updated",  description: "Ahmed Khan's status changed to Completed",                    timestamp: "3 days ago",  read: true  },
  { id: 11, type: "Contact",      title: "New Contact",           description: "Zara Khan sent a message",                                    timestamp: "4 days ago",  read: true  },
  { id: 12, type: "Consultation", title: "New Consultation",      description: "Michael Brown submitted for App Development",                 timestamp: "5 days ago",  read: true  },
];

// ── Icon + colour per type ─────────────────────────────────────────────────
const TYPE_CONFIG: Record<NotifType, { icon: () => React.ReactElement; iconBg: string; iconColor: string }> = {
  Consultation: {
    icon: CalendarIcon,
    iconBg: "linear-gradient(135deg,#ff6a00,#ee0979)",
    iconColor: "#fff",
  },
  Contact: {
    icon: UsersIcon,
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#3b82f6",
  },
  System: {
    icon: SettingsIcon,
    iconBg: "rgba(139,92,246,0.15)",
    iconColor: "#8b5cf6",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Notifications</h2>
            {unreadCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  height: 22,
                  padding: "0 6px",
                  backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 0,
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "All notifications are read."}
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          style={{
            padding: "8px 16px",
            border: "1px solid var(--border)",
            borderRadius: 0,
            background: "transparent",
            color: unreadCount === 0 ? "var(--muted)" : "var(--fg)",
            fontSize: 13,
            fontWeight: 500,
            cursor: unreadCount === 0 ? "default" : "pointer",
            opacity: unreadCount === 0 ? 0.5 : 1,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (unreadCount > 0)
              (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          Mark All Read
        </button>
      </div>

      {/* Notification list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {notifications.map((n) => {
          const cfg = TYPE_CONFIG[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              style={{
                background: n.read ? "var(--surface)" : "var(--surface2)",
                border: "1px solid var(--border)",
                borderTop: "none",
                borderRadius: 0,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                cursor: n.read ? "default" : "pointer",
                transition: "background 0.15s",
              }}
              // First item needs top border
              ref={(el) => {
                if (el && n.id === notifications[0]?.id) {
                  el.style.borderTop = "1px solid var(--border)";
                }
              }}
            >
              {/* Icon square */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  backgroundImage: n.type === "Consultation" ? cfg.iconBg : "none",
                  background: n.type !== "Consultation" ? cfg.iconBg : undefined,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cfg.iconColor,
                  flexShrink: 0,
                  borderRadius: 0,
                }}
              >
                <Icon />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--fg)", marginBottom: 3 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  {n.description}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, opacity: 0.7 }}>
                  {n.timestamp}
                </div>
              </div>

              {/* Unread dot */}
              <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 4, flexShrink: 0 }}>
                {!n.read && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ff6a00",
                      display: "block",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

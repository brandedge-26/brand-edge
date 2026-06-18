"use client";

import { useEffect } from "react";
import { useNotificationsStore, NotifType } from "@/stores/useNotificationsStore";
import { useToast } from "@/components/Toast";

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
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <rect x="2" y="7" width="20" height="14"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

// ── Relative time ──────────────────────────────────────────────────────────
function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ── Config per notification type ───────────────────────────────────────────
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
  Application: {
    icon: BriefcaseIcon,
    iconBg: "rgba(34,197,94,0.12)",
    iconColor: "#22c55e",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { toast } = useToast();
  const { notifications, loading, fetch, markRead, markAllRead, remove } = useNotificationsStore();

  useEffect(() => { fetch(); }, [fetch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await markAllRead();
    toast("All notifications marked as read.");
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await remove(id);
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 22, height: 22, padding: "0 6px",
                backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
                color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 0,
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading notifications..." : unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "All notifications are read."}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{
            padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 0,
            background: "transparent", color: unreadCount === 0 ? "var(--muted)" : "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: unreadCount === 0 ? "default" : "pointer",
            opacity: unreadCount === 0 ? 0.5 : 1, transition: "background 0.15s", fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { if (unreadCount > 0) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          Mark All Read
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
          No notifications yet. They will appear here when users submit forms.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {notifications.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.Contact;
            const Icon = cfg.icon;
            return (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                style={{
                  background: n.read ? "var(--surface)" : "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderRadius: 0,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  cursor: n.read ? "default" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, flexShrink: 0, borderRadius: 0,
                  backgroundImage: cfg.iconBg.startsWith("linear") ? cfg.iconBg : "none",
                  backgroundColor: cfg.iconBg.startsWith("linear") ? "transparent" : cfg.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: cfg.iconColor,
                }}>
                  <Icon />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--fg)", marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{n.description}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, opacity: 0.7 }}>{relTime(n.createdAt)}</div>
                </div>

                {/* Right: unread dot + delete */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {!n.read && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6a00", display: "block" }} />
                  )}
                  <button
                    onClick={(e) => handleDelete(e, n._id)}
                    title="Delete"
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "var(--muted)", padding: 4, display: "flex", alignItems: "center",
                      opacity: 0.5, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

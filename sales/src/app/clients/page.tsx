"use client";

import { useState, useEffect } from "react";
import { useClientsStore, Client, ClientPriority } from "@/stores/useClientsStore";
import { useToast } from "@/components/Toast";
import FollowUpDateModal from "@/components/FollowUpDateModal";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

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

function StatusBadge({ client }: { client: Client }) {
  if (client.status === "Follow-up") {
    return (
      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 0 }}>
        Follow-up{client.followUpDate ? ` · ${fmtDateTimeFull(client.followUpDate)}` : ""}
      </span>
    );
  }
  if (client.status === "Closed") {
    return (
      <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 0 }}>
        Closed
      </span>
    );
  }
  return (
    <span style={{ display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, background: "var(--surface2)", color: "var(--muted)", borderRadius: 0 }}>
      New
    </span>
  );
}

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const GRADIENT = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

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

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8,
};
const fieldGap: React.CSSProperties = { marginBottom: 18 };

// ── Add Client Modal ─────────────────────────────────────────────────────────
function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: { businessName: string; phone: string; note: string; priority: ClientPriority }) => Promise<void> }) {
  const [form, setForm] = useState<{ businessName: string; phone: string; note: string; priority: ClientPriority }>({ businessName: "", phone: "", note: "", priority: "Medium" });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const fStyle = (name: string, textarea = false): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      ...(textarea ? { padding: "10px 14px", resize: "vertical" as const } : { height: 42, padding: "0 14px" }),
      borderRadius: 0,
      backgroundColor: isFoc ? "transparent" : "var(--surface2)",
      backgroundImage: isFoc ? "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
      backgroundOrigin: isFoc ? "border-box" : ("padding-box" as const),
      backgroundClip: isFoc ? "padding-box, border-box" : ("border-box" as const),
      border: isFoc ? "2px solid transparent" : "1px solid var(--border)",
      color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
      boxSizing: "border-box" as const, transition: "background-color 0.18s ease",
    };
  };

  const canSubmit = form.businessName.trim() && form.phone.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(form);
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: 440, maxWidth: "100%", borderRadius: 0, display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Add Client</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 0 }}>
            <XIcon />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <style>{`::placeholder { color: var(--muted); opacity: 0.55; }`}</style>

          <div style={fieldGap}>
            <label style={labelStyle}>Business Name <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="text" placeholder="e.g. Ahmed Tyres" value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              onFocus={() => setFocused("businessName")} onBlur={() => setFocused(null)}
              style={fStyle("businessName")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Phone Number <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="tel" placeholder="e.g. 0300 1234567" value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
              style={fStyle("phone")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>How interested is this client?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["Low", "Medium", "High"] as ClientPriority[]).map((p) => {
                const active = form.priority === p;
                const s = PRIORITY_STYLES[p];
                return (
                  <button key={p} type="button" onClick={() => set("priority", p)} style={{
                    flex: 1, padding: "8px 0", border: `1px solid ${active ? s.color : "var(--border)"}`,
                    background: active ? s.bg : "transparent", color: active ? s.color : "var(--muted)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
                  }}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Note <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(optional)</span></label>
            <textarea rows={3} placeholder="Anything worth remembering about this client..." value={form.note}
              onChange={(e) => set("note", e.target.value)}
              onFocus={() => setFocused("note")} onBlur={() => setFocused(null)}
              style={fStyle("note", true)} />
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid var(--border)", background: "transparent", color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} style={{
            padding: "9px 22px", border: "none",
            backgroundImage: canSubmit && !submitting ? GRADIENT : "none",
            backgroundColor: canSubmit && !submitting ? "transparent" : "var(--surface2)",
            color: canSubmit && !submitting ? "#fff" : "var(--muted)",
            fontSize: 13, fontWeight: 600, cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
            borderRadius: 0, fontFamily: "inherit", opacity: canSubmit ? 1 : 0.6,
          }}>
            {submitting ? "Adding..." : "Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Client Modal ────────────────────────────────────────────────────────
function EditClientModal({ client, onClose, onSave }: { client: Client; onClose: () => void; onSave: (id: string, data: { businessName: string; phone: string; note: string; priority: ClientPriority }) => Promise<void> }) {
  const [form, setForm] = useState<{ businessName: string; phone: string; note: string; priority: ClientPriority }>({ businessName: client.businessName, phone: client.phone, note: client.note, priority: client.priority });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const fStyle = (name: string, textarea = false): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      ...(textarea ? { padding: "10px 14px", resize: "vertical" as const } : { height: 42, padding: "0 14px" }),
      borderRadius: 0,
      backgroundColor: isFoc ? "transparent" : "var(--surface2)",
      backgroundImage: isFoc ? "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
      backgroundOrigin: isFoc ? "border-box" : ("padding-box" as const),
      backgroundClip: isFoc ? "padding-box, border-box" : ("border-box" as const),
      border: isFoc ? "2px solid transparent" : "1px solid var(--border)",
      color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
      boxSizing: "border-box" as const, transition: "background-color 0.18s ease",
    };
  };

  const canSubmit = form.businessName.trim() && form.phone.trim();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSave(client._id, form);
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: 440, maxWidth: "100%", borderRadius: 0, display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Edit Client</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 0 }}>
            <XIcon />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <style>{`::placeholder { color: var(--muted); opacity: 0.55; }`}</style>

          <div style={fieldGap}>
            <label style={labelStyle}>Business Name <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="text" placeholder="e.g. Ahmed Tyres" value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              onFocus={() => setFocused("businessName")} onBlur={() => setFocused(null)}
              style={fStyle("businessName")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Phone Number <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="tel" placeholder="e.g. 0300 1234567" value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
              style={fStyle("phone")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>How interested is this client?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["Low", "Medium", "High"] as ClientPriority[]).map((p) => {
                const active = form.priority === p;
                const s = PRIORITY_STYLES[p];
                return (
                  <button key={p} type="button" onClick={() => set("priority", p)} style={{
                    flex: 1, padding: "8px 0", border: `1px solid ${active ? s.color : "var(--border)"}`,
                    background: active ? s.bg : "transparent", color: active ? s.color : "var(--muted)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
                  }}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Note <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(optional)</span></label>
            <textarea rows={3} placeholder="Anything worth remembering about this client..." value={form.note}
              onChange={(e) => set("note", e.target.value)}
              onFocus={() => setFocused("note")} onBlur={() => setFocused(null)}
              style={fStyle("note", true)} />
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid var(--border)", background: "transparent", color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} style={{
            padding: "9px 22px", border: "none",
            backgroundImage: canSubmit && !submitting ? GRADIENT : "none",
            backgroundColor: canSubmit && !submitting ? "transparent" : "var(--surface2)",
            color: canSubmit && !submitting ? "#fff" : "var(--muted)",
            fontSize: 13, fontWeight: 600, cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
            borderRadius: 0, fontFamily: "inherit", opacity: canSubmit ? 1 : 0.6,
          }}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ClientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [followUpClient, setFollowUpClient] = useState<Client | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  const { clients, loading, fetch, create, update, markFollowUp, closeClient } = useClientsStore();

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setDate(todayISO()); }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
    const matchDate = !date || c.createdAt.slice(0, 10) === date;
    return matchSearch && matchDate;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAdd = async (data: { businessName: string; phone: string; note: string; priority: ClientPriority }) => {
    try {
      await create(data);
      toast("Client added!");
    } catch (err) {
      toast("Failed to add client.", "error");
      throw err;
    }
  };

  const handleEdit = async (id: string, data: { businessName: string; phone: string; note: string; priority: ClientPriority }) => {
    try {
      await update(id, data);
      toast("Client updated!");
    } catch (err) {
      toast("Failed to update client.", "error");
      throw err;
    }
  };

  const handleMarkFollowUp = async (id: string, date: string) => {
    try {
      await markFollowUp(id, date);
      toast("Client marked for follow-up!");
    } catch (err) {
      toast("Failed to mark follow-up.", "error");
      throw err;
    }
  };

  const handleClose = async (id: string) => {
    setClosingId(id);
    try {
      await closeClient(id);
      toast("Client closed.");
    } catch {
      toast("Failed to close client.", "error");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <style>{`::placeholder { color: var(--muted); opacity: 0.55; }`}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Clients</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Interested clients you&apos;ve added from your calls.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px",
          backgroundImage: GRADIENT, color: "#fff", border: "none",
          fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(255,106,0,0.25)",
        }}>
          <PlusIcon />
          Add Client
        </button>
      </div>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <input type="text" placeholder="Search by business name or phone..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 280,
          }}
        />
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} style={dateInputStyle} />
        <button onClick={() => { setDate(todayISO()); setPage(1); }} style={dateBtnStyle}>Today</button>
        {date && <button onClick={() => { setDate(""); setPage(1); }} style={{ ...dateBtnStyle, background: "transparent" }}>Clear</button>}
      </div>

      {/* Desktop table */}
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
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Added</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No clients added yet.</td></tr>
              ) : pageItems.map((c: Client) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.businessName}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.note || "—"}</td>
                  <td style={tdStyle}><PriorityBadge priority={c.priority} /></td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}><StatusBadge client={c} /></td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDateTimeFull(c.createdAt)}</td>
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
                      <button onClick={() => setEditClient(c)} title="Edit client" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <EditIcon />
                      </button>
                      {c.status === "Follow-up" ? (
                        <button onClick={() => handleClose(c._id)} disabled={closingId === c._id} title="Mark done — move to Closed Clients" style={{
                          width: 30, height: 30, border: "1px solid rgba(34,197,94,0.35)",
                          background: "transparent", color: "#22c55e",
                          cursor: closingId === c._id ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 0, transition: "all 0.15s", opacity: closingId === c._id ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                          <CheckIcon />
                        </button>
                      ) : c.status === "New" ? (
                        <button onClick={() => setFollowUpClient(c)} title="Mark for follow-up" style={{
                          width: 30, height: 30, border: "1px solid var(--border)",
                          background: "transparent", color: "var(--muted)",
                          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 0, transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                          <ClockIcon />
                        </button>
                      ) : null}
                    </div>
                  </td>
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

      {/* Mobile cards */}
      <div className="card-mobile">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No clients added yet.</div>
        ) : (
          <>
            {pageItems.map((c: Client) => (
              <div key={c._id} style={mobileCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{c.businessName}</span>
                  <PriorityBadge priority={c.priority} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{c.phone}</div>
                <div style={{ marginBottom: 8 }}><StatusBadge client={c} /></div>
                {c.note && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>{c.note}</div>}
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Added {fmtDate(c.createdAt)}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setViewClient(c)} title="View details" style={iconBtnStyle}><InfoIcon /></button>
                  <button onClick={() => setEditClient(c)} title="Edit client" style={iconBtnStyle}><EditIcon /></button>
                  {c.status === "Follow-up" ? (
                    <button onClick={() => handleClose(c._id)} disabled={closingId === c._id} title="Mark done" style={{ ...iconBtnStyle, border: "1px solid rgba(34,197,94,0.35)", color: "#22c55e", opacity: closingId === c._id ? 0.5 : 1 }}><CheckIcon /></button>
                  ) : c.status === "New" ? (
                    <button onClick={() => setFollowUpClient(c)} title="Mark for follow-up" style={iconBtnStyle}><ClockIcon /></button>
                  ) : null}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} clients</span>
              {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
            </div>
          </>
        )}
      </div>

      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {editClient && <EditClientModal client={editClient} onClose={() => setEditClient(null)} onSave={handleEdit} />}
      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient && `Added ${fmtDateTimeFull(viewClient.createdAt)}`}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Status", value: <StatusBadge client={viewClient} /> },
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
      {followUpClient && (
        <FollowUpDateModal
          businessName={followUpClient.businessName}
          onClose={() => setFollowUpClient(null)}
          onConfirm={(date) => handleMarkFollowUp(followUpClient._id, date)}
        />
      )}
    </main>
  );
}

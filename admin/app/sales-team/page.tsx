"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalesRepsStore, SalesRep } from "@/stores/useSalesRepsStore";
import { useToast } from "@/components/Toast";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Icons ──────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
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
  display: "block", fontSize: 11, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: "var(--muted)", marginBottom: 8,
};

const fieldGap: React.CSSProperties = { marginBottom: 18 };

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 600, borderRadius: 0,
      background: active ? "rgba(34,197,94,0.12)" : "rgba(100,100,100,0.12)",
      color: active ? "#22c55e" : "var(--muted)",
    }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ── Add Salesman Modal ──────────────────────────────────────────────────────
function AddSalesRepModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: { name: string; email: string; password: string }) => Promise<void> }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const fStyle = (name: string): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%", height: 42, padding: "0 14px",
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

  const canSubmit = form.name.trim() && form.email.trim() && form.password.length >= 6;

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
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Add Salesman</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 0 }}>
            <XIcon />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <style>{`::placeholder { color: var(--muted); opacity: 0.55; }`}</style>

          <div style={fieldGap}>
            <label style={labelStyle}>Name <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="text" placeholder="e.g. Ahmed Khan" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
              style={fStyle("name")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Email <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="email" placeholder="ahmed@brandedge.com" value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              style={fStyle("email")} />
          </div>

          <div style={fieldGap}>
            <label style={labelStyle}>Password <span style={{ color: "#ff6a00" }}>*</span></label>
            <input type="password" placeholder="Minimum 6 characters" value={form.password}
              onChange={(e) => set("password", e.target.value)}
              onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
              style={fStyle("password")} />
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
            {submitting ? "Creating..." : "Create Salesman"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ rep, onConfirm, onClose }: { rep: SalesRep; onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: 400, maxWidth: "100%", borderRadius: 0, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="square">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Salesman</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: "var(--fg)" }}>{rep.name}</strong>?
          This permanently removes their account. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: "1px solid var(--border)", background: "transparent", color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: "9px 20px", border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function SalesTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteRep, setDeleteRep] = useState<SalesRep | null>(null);
  const [page, setPage] = useState(1);
  const { reps, loading, fetch, create, toggleActive, remove } = useSalesRepsStore();

  useEffect(() => { fetch(); }, [fetch]);

  const pageCount = Math.max(1, Math.ceil(reps.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = reps.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAdd = async (data: { name: string; email: string; password: string }) => {
    try {
      await create(data);
      toast("Salesman created successfully!");
    } catch (err) {
      toast("Failed to create salesman — email may already be in use.", "error");
      throw err;
    }
  };

  const handleToggleActive = async (rep: SalesRep) => {
    await toggleActive(rep._id, !rep.active);
    toast(rep.active ? "Salesman deactivated." : "Salesman activated.");
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setDeleteRep(null);
    toast("Salesman deleted.", "error");
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      {/* Heading */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Sales Team</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Create salesman accounts and track their performance.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px",
          backgroundImage: GRADIENT, color: "#fff", border: "none",
          fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(255,106,0,0.25)",
        }}>
          <PlusIcon />
          Add Salesman
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40 }}>#</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : reps.length === 0 ? (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No salesmen yet.</td></tr>
              ) : pageItems.map((rep, i) => (
                <tr key={rep._id}>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{rep.name}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{rep.email}</td>
                  <td style={tdStyle}><StatusBadge active={rep.active} /></td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(rep.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button onClick={() => router.push(`/sales-team/${rep._id}`)} title="View performance" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <EyeIcon />
                      </button>
                      <button onClick={() => handleToggleActive(rep)} title={rep.active ? "Deactivate" : "Activate"} style={{
                        padding: "0 10px", height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, fontSize: 11, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        {rep.active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => setDeleteRep(rep)} title="Delete" style={{
                        width: 30, height: 30, border: "1px solid rgba(239,68,68,0.35)",
                        background: "transparent", color: "#ef4444",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>{reps.filter((r) => r.active).length} active &nbsp;·&nbsp; {reps.filter((r) => !r.active).length} inactive</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      {showAddModal && <AddSalesRepModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {deleteRep && <DeleteModal rep={deleteRep} onConfirm={() => handleDelete(deleteRep._id)} onClose={() => setDeleteRep(null)} />}
    </main>
  );
}

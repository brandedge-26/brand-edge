"use client";

import { useState, useEffect } from "react";
import { useContactsStore, Contact } from "@/stores/useContactsStore";
import { useToast } from "@/components/Toast";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;

// ── Icons ──────────────────────────────────────────────────────────────────
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
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
// ── Types ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Table styles ───────────────────────────────────────────────────────────
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

// ── Modals ─────────────────────────────────────────────────────────────────
function DeleteModal({ item, onConfirm, onClose }: { item: Contact; onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        width: 400, maxWidth: "100%", borderRadius: 0, padding: 32,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          width: 44, height: 44, background: "rgba(239,68,68,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="square">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Delete Contact</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete the message from{" "}
          <strong style={{ color: "var(--fg)" }}>{item.name}</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--fg)",
            fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0,
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", border: "none",
            background: "#ef4444", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0,
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<Contact | null>(null);
  const [deleteItem, setDeleteItem] = useState<Contact | null>(null);
  const { contacts, loading, fetch, remove } = useContactsStore();

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    await remove(id);
    setDeleteItem(null);
    toast("Contact deleted.", "error");
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>

      {/* Heading + search */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Contacts</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>View and manage all incoming contact messages.</p>
        </div>
        <input type="text" placeholder="Search by name, email or phone..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{
            height: 36, padding: "0 12px",
            border: "1px solid var(--border)", borderRadius: 0,
            background: "var(--surface)", color: "var(--fg)",
            fontSize: 13, outline: "none", width: 260,
          }}
        />
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
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Date</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>
                    No contacts found.
                  </td>
                </tr>
              ) : pageItems.map((c, i) => (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{c.name}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.email}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{c.phone || "—"}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.message}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(c.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      {/* Info / View details */}
                      <button onClick={() => setViewItem(c)} title="View details" style={{
                        width: 30, height: 30, border: "1px solid var(--border)",
                        background: "transparent", color: "var(--muted)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 0, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}>
                        <InfoIcon />
                      </button>
                      {/* Trash / Delete */}
                      <button onClick={() => setDeleteItem(c)} title="Delete" style={{
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
          <span>Showing {pageItems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} contacts</span>
          {pageCount > 1 && <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />}
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.name ?? ""}
        subtitle={viewItem ? `ID: ${viewItem._id.slice(-8)} · ${fmtDate(viewItem.createdAt)}` : ""}
        fields={viewItem ? [
          { label: "Email", value: viewItem.email },
          { label: "Phone", value: viewItem.phone || "—" },
          { label: "Service", value: viewItem.service || "—" },
          { label: "Message", value: viewItem.message, fullWidth: true },
        ] : []}
      />

      {/* Delete Confirm Modal */}
      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          onConfirm={() => handleDelete(deleteItem._id)}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </main>
  );
}

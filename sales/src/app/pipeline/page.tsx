"use client";

import { useState, useEffect, useMemo } from "react";
import { useClientsStore, Client, ClientPriority } from "@/stores/useClientsStore";
import { useToast } from "@/components/Toast";
import FilterBar from "@/components/FilterBar";
import FollowUpDateModal from "@/components/FollowUpDateModal";
import Pagination from "@/components/Pagination";
import DetailPanel from "@/components/DetailPanel";

const PAGE_SIZE = 10;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTimeFull = (iso: string) => new Date(iso).toLocaleString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
});
const todayISO = () => new Date().toISOString().slice(0, 10);

const PRIORITY_STYLES: Record<ClientPriority, { bg: string; color: string }> = {
  Low: { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
  Medium: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
  High: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
};

function PriorityBadge({ priority }: { priority: ClientPriority }) {
  const s = PRIORITY_STYLES[priority];
  return (
    <span style={{ display: "inline-block", padding: "2px 7px", fontSize: 10, fontWeight: 700, background: s.bg, color: s.color, borderRadius: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {priority}
    </span>
  );
}

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const STAGES: { status: Client["status"]; label: string; color: string; dateField: "createdAt" | "followUpDate" }[] = [
  { status: "New",       label: "Interested", color: "#22c55e", dateField: "createdAt" },
  { status: "Follow-up", label: "Follow-up",  color: "#f59e0b", dateField: "followUpDate" },
];

export default function PipelinePage() {
  const { toast } = useToast();
  const { clients, loading, fetch, markFollowUp, closeClient } = useClientsStore();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [followUpClient, setFollowUpClient] = useState<Client | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [stagePages, setStagePages] = useState<Record<string, number>>({});
  const [viewClient, setViewClient] = useState<Client | null>(null);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    const t = todayISO();
    setToday(t);
    setDate(t); // Pipeline defaults to today's Interested/Follow-up clients
  }, []);

  const pipeline = useMemo(() => clients.filter((c) => c.status === "New" || c.status === "Follow-up"), [clients]);

  const filtered = pipeline.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.businessName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  const handleMarkFollowUp = async (id: string, followUpDate: string) => {
    try {
      await markFollowUp(id, followUpDate);
      toast("Client marked for follow-up!");
    } catch (err) {
      toast("Failed to mark follow-up.", "error");
      throw err;
    }
  };

  const handleClose = async (c: Client) => {
    setClosingId(c._id);
    try {
      await closeClient(c._id);
      toast("Client closed.");
    } catch {
      toast("Failed to close client.", "error");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Pipeline</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Clients actively in progress — interested and scheduled for follow-up.</p>
      </div>

      <FilterBar
        search={search} onSearchChange={(v) => { setSearch(v); setStagePages({}); }}
        searchPlaceholder="Search by business name, phone..."
        date={date} onDateChange={(v) => { setDate(v); setStagePages({}); }}
        onToday={() => { setDate(today); setStagePages({}); }}
        onClear={() => { setDate(""); setStagePages({}); }}
      />

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {STAGES.map((stage) => {
            const stageClients = filtered.filter((c) => {
              if (c.status !== stage.status) return false;
              if (!date) return true;
              const value = stage.dateField === "createdAt" ? c.createdAt : c.followUpDate;
              return value ? value.slice(0, 10) === date : false;
            });
            const stagePageCount = Math.max(1, Math.ceil(stageClients.length / PAGE_SIZE));
            const stagePage = Math.min(stagePages[stage.status] ?? 1, stagePageCount);
            const stagePageItems = stageClients.slice((stagePage - 1) * PAGE_SIZE, stagePage * PAGE_SIZE);
            return (
              <div key={stage.status} style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", padding: "2px 8px", background: "var(--surface2)" }}>{stageClients.length}</span>
                </div>
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, minHeight: 100 }}>
                  {stageClients.length === 0 ? (
                    <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", padding: 20 }}>No clients here.</p>
                  ) : stagePageItems.map((c) => (
                    <div key={c._id} style={{
                      padding: "12px 14px", border: "1px solid var(--border)", background: "var(--surface2)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{c.businessName}</div>
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{c.phone}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                        {stage.status === "Follow-up" && c.followUpDate
                          ? `Due ${fmtDateTimeFull(c.followUpDate)}`
                          : `Added ${fmtDate(c.createdAt)}`}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <button onClick={() => setViewClient(c)} title="View details" style={{
                          width: 26, height: 26, border: "1px solid var(--border)", background: "transparent",
                          color: "var(--muted)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 0, fontFamily: "inherit",
                        }}>
                          <InfoIcon />
                        </button>
                        {stage.status === "New" ? (
                          <button onClick={() => setFollowUpClient(c)} style={{
                            padding: "4px 10px", border: "1px solid var(--border)", background: "transparent",
                            color: "var(--fg)", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
                          }}>
                            Follow Up
                          </button>
                        ) : (
                          <button onClick={() => handleClose(c)} disabled={closingId === c._id} style={{
                            padding: "4px 10px", border: "1px solid rgba(34,197,94,0.35)", background: "transparent",
                            color: "#22c55e", fontSize: 11, fontWeight: 600, cursor: closingId === c._id ? "not-allowed" : "pointer",
                            borderRadius: 0, fontFamily: "inherit", opacity: closingId === c._id ? 0.5 : 1,
                          }}>
                            {closingId === c._id ? "Saving..." : "Mark Done"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {stagePageCount > 1 && (
                  <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center" }}>
                    <Pagination
                      page={stagePage}
                      pageCount={stagePageCount}
                      onPageChange={(p) => setStagePages((prev) => ({ ...prev, [stage.status]: p }))}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {followUpClient && (
        <FollowUpDateModal
          businessName={followUpClient.businessName}
          onClose={() => setFollowUpClient(null)}
          onConfirm={(d) => handleMarkFollowUp(followUpClient._id, d)}
        />
      )}
      <DetailPanel
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        title={viewClient?.businessName ?? ""}
        subtitle={viewClient && (viewClient.status === "Follow-up" && viewClient.followUpDate
          ? `Due ${fmtDateTimeFull(viewClient.followUpDate)}`
          : `Added ${fmtDate(viewClient.createdAt)}`)}
        fields={viewClient ? [
          { label: "Phone", value: viewClient.phone },
          { label: "Priority", value: <PriorityBadge priority={viewClient.priority} /> },
          { label: "Status", value: viewClient.status },
          { label: "Note", value: viewClient.note, fullWidth: true },
        ] : []}
      />
    </main>
  );
}

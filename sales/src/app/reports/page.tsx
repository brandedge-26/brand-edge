"use client";

import { useState, useEffect } from "react";
import { useReportsStore } from "@/stores/useReportsStore";
import { useToast } from "@/components/Toast";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const todayISO = () => new Date().toISOString().slice(0, 10);

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

const inputStyle: React.CSSProperties = {
  width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface2)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface2)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
  resize: "vertical", boxSizing: "border-box", minHeight: 90,
};

export default function ReportsPage() {
  const { toast } = useToast();
  const { reports, loading, fetch, submit } = useReportsStore();
  const [today, setToday] = useState("");
  const [callsMade, setCallsMade] = useState("");
  const [interestedCount, setInterestedCount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setToday(todayISO()); }, []);

  // Pre-fill today's report if it already exists
  useEffect(() => {
    if (!today) return;
    const existing = reports.find((r) => r.date === today);
    if (existing) {
      setCallsMade(String(existing.callsMade));
      setInterestedCount(String(existing.interestedCount));
      setNotes(existing.notes);
    }
  }, [today, reports]);

  const todaysReport = reports.find((r) => r.date === today);

  const handleSubmit = async () => {
    if (submitting || !today) return;
    setSubmitting(true);
    try {
      await submit({
        date: today,
        callsMade: Number(callsMade) || 0,
        interestedCount: Number(interestedCount) || 0,
        notes,
      });
      toast(todaysReport ? "Report updated!" : "Report submitted!");
    } catch {
      toast("Failed to save report.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const pastReports = reports.filter((r) => r.date !== today);

  const pageCount = Math.max(1, Math.ceil(pastReports.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = pastReports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: 0 }}>Daily Report</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>End of day? Log how it went — your admin can see this.</p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, maxWidth: 560, marginBottom: 32 }}>
        <style>{`::placeholder { color: var(--muted); opacity: 0.55; }`}</style>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div>
            <label style={labelStyle}>Calls Made Today</label>
            <input type="number" min="0" placeholder="0" value={callsMade} onChange={(e) => setCallsMade(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Interested</label>
            <input type="number" min="0" placeholder="0" value={interestedCount} onChange={(e) => setInterestedCount(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>How did today go?</label>
          <textarea placeholder="Write a short note about today — what worked, what didn't, anything worth flagging..."
            value={notes} onChange={(e) => setNotes(e.target.value)} style={textareaStyle} />
        </div>

        <button onClick={handleSubmit} disabled={submitting || !today} style={{
          padding: "10px 24px", border: "none",
          backgroundImage: !submitting ? GRADIENT : "none",
          backgroundColor: !submitting ? "transparent" : "var(--surface2)",
          color: !submitting ? "#fff" : "var(--muted)",
          fontSize: 13, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
          borderRadius: 0, fontFamily: "inherit",
        }}>
          {submitting ? "Saving..." : todaysReport ? "Update Today's Report" : "Submit Today's Report"}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>Past Reports</span>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Calls Made</th>
                <th style={thStyle}>Interested</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>Loading...</td></tr>
              ) : pastReports.length === 0 ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: 40 }}>No past reports yet.</td></tr>
              ) : pageItems.map((r) => (
                <tr key={r._id}>
                  <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(r.date)}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.callsMade}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{r.interestedCount}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", maxWidth: 360 }}>{r.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

const btnStyle: React.CSSProperties = {
  height: 30, padding: "0 12px", border: "1px solid var(--border)", background: "transparent",
  color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
};

export default function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const safePage = Math.min(Math.max(1, page), pageCount);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage <= 1}
        style={{ ...btnStyle, opacity: safePage <= 1 ? 0.4 : 1, cursor: safePage <= 1 ? "not-allowed" : "pointer" }}
      >
        Prev
      </button>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>Page {safePage} of {pageCount}</span>
      <button
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage >= pageCount}
        style={{ ...btnStyle, opacity: safePage >= pageCount ? 0.4 : 1, cursor: safePage >= pageCount ? "not-allowed" : "pointer" }}
      >
        Next
      </button>
    </div>
  );
}

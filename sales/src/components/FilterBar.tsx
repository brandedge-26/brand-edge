"use client";

const dateInputStyle: React.CSSProperties = {
  height: 36, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 0,
  background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", fontFamily: "inherit",
};

const btnStyle: React.CSSProperties = {
  height: 36, padding: "0 12px", border: "1px solid var(--border)", background: "var(--surface2)",
  color: "var(--fg)", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
};

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search by name, email, phone...",
  date,
  onDateChange,
  onToday,
  onClear,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  date: string;
  onDateChange: (v: string) => void;
  onToday: () => void;
  onClear: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          height: 36, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 0,
          background: "var(--surface)", color: "var(--fg)", fontSize: 13, outline: "none", width: 260,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} style={dateInputStyle} />
        <button onClick={onToday} style={btnStyle}>Today</button>
        {date && (
          <button onClick={onClear} style={{ ...btnStyle, background: "transparent", color: "var(--muted)", fontWeight: 500 }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

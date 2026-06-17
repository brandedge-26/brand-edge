"use client";

type GoodbyeWord = { text: string; gradient: string };

const ROW1: GoodbyeWord[] = [
  { text: "Poor Brand Identity", gradient: "linear-gradient(90deg,#ff6a00,#ee0979)" },
  { text: "Slow Websites", gradient: "linear-gradient(90deg,#f7971e,#ffd200)" },
  { text: "Weak Digital Presence", gradient: "linear-gradient(90deg,#8A43E1,#D511FD)" },
  { text: "Generic Designs", gradient: "linear-gradient(90deg,#EF7B16,#8A43E1)" },
];
const ROW2: GoodbyeWord[] = [
  { text: "Missed Deadlines", gradient: "linear-gradient(90deg,#ff6a00,#EF7B16)" },
  { text: "Low Conversion Rates", gradient: "linear-gradient(90deg,#ee0979,#ff6a00)" },
  { text: "Unclear Strategy", gradient: "linear-gradient(90deg,#8A43E1,#ff6a00)" },
  { text: "Mediocre Marketing", gradient: "linear-gradient(90deg,#f7971e,#ee0979)" },
];

export default function GoodbyeSection({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  const chipStyle = (grad: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: "10px",
    padding: "12px 24px", borderRadius: "999px",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer",
  });

  const gradText = (grad: string): React.CSSProperties => ({
    fontSize: "clamp(14px,1.6vw,20px)", letterSpacing: "-1px",
    background: grad, WebkitBackgroundClip: "text",
    backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent",
  });

  const renderRow = (items: GoodbyeWord[], cls: string) => {
    const doubled = [...items, ...items];
    return (
      <div className="marquee-wrap overflow-hidden w-full">
        <div className={`flex gap-3 w-max ${cls}`}>
          {doubled.map((w, i) => (
            <div key={i} style={chipStyle(w.gradient)}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: w.gradient, flexShrink: 0, display: "inline-block" }} />
              <span style={gradText(w.gradient)} className="tracking-tighter">{w.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full py-20" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-12">
        <h2 className="text-[var(--fg)] text-center sm:text-left"
          style={{ fontSize: "clamp(32px,4.5vw,60px)", letterSpacing: "-2px", lineHeight: 1.05 }}>
          Say goodbye to
        </h2>
        <img src="/home/wave-animation.svg" alt=""
          style={{ width: "clamp(90px,10vw,140px)", opacity: 0.9, marginBottom: "6px", flexShrink: 0 }} />
      </div>
      <div className="flex flex-col gap-4">
        {renderRow(ROW1, "marquee-left")}
        {renderRow(ROW2, "marquee-right")}
      </div>
    </section>
  );
}

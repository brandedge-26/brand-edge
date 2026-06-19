"use client";

const CLIENTS = [
  { name: "Ahmed Parts",   src: "/clients/ahmed-parts-Photoroom.png" },
  { name: "Auto Pub",      src: "/clients/auto-pub-Photoroom.png" },
  { name: "Green Zee",     src: "/clients/green-zee-Photoroom.png" },
  { name: "Ismail Auto",   src: "/clients/ismail-auto-Photoroom.png" },
  { name: "Memon",         src: "/clients/memon-Photoroom.png" },
  { name: "Qabil",         src: "/clients/qabil-Photoroom.png" },
  { name: "RBWM",          src: "/clients/rbwm-Photoroom.png" },
  { name: "Universal",     src: "/clients/universal-Photoroom.png" },
  { name: "NANYA CNC",     src: "/clients/nanya.webp" },
  { name: "Action Plus Tax", src: "/clients/action.png" },
  { name: "Jesup Wireless", src: "/clients/jesup.svg" },
];

// duplicate for seamless loop
const TRACK = [...CLIENTS, ...CLIENTS, ...CLIENTS];

export default function ClientsSection({ theme }: { theme: "dark" | "light" }) {
  return (
    <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg)", overflow: "hidden", padding: "56px 0" }}>
      <style>{`
        @keyframes clients-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }
        .clients-track {
          display: flex;
          width: max-content;
          animation: clients-scroll 28s linear infinite;
        }
        .clients-track:hover {
          animation-play-state: paused;
        }
        .client-logo-wrap {
          position: relative;
          width: 140px;
          height: 72px;
          margin: 0 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .client-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.35);
          transition: filter 0.35s ease, transform 0.35s ease;
          user-select: none;
          pointer-events: none;
        }
        .client-logo-wrap:hover img {
          filter: grayscale(0%) opacity(1);
          transform: scale(1.07);
        }
      `}</style>

      {/* Label */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
        }}>
          Trusted by growing businesses
        </span>
      </div>

      {/* Marquee */}
      <div style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        overflow: "hidden",
      }}>
        <div className="clients-track">
          {TRACK.map((client, i) => (
            <div key={i} className="client-logo-wrap">
              <img src={client.src} alt={client.name} draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

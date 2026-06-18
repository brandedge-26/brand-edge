"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name: string): React.CSSProperties => {
    const isFoc = focused === name;
    return {
      width: "100%",
      height: 44,
      padding: "0 14px",
      border: isFoc ? "2px solid transparent" : "2px solid var(--border)",
      borderRadius: 0,
      background: isFoc ? "transparent" : "var(--surface2)",
      backgroundImage: isFoc
        ? "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg,#ff6a00,#ee0979)"
        : "none",
      backgroundOrigin: isFoc ? "border-box" : "padding-box",
      backgroundClip: isFoc ? "padding-box, border-box" : "border-box",
      color: "var(--fg)",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box" as const,
      transition: "background-color 0.18s ease",
    };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 36, height: 36,
            backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.5px" }}>BE</span>
          </div>
          <div>
            <div style={{ color: "var(--fg)", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Brand Edge</div>
            <div style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "36px 32px",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", margin: "0 0 6px" }}>Sign in</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 28px" }}>
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: 8,
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={inputStyle("email")}
                placeholder="admin@brandedge.com"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)", marginBottom: 8,
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                style={inputStyle("password")}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                fontSize: 13,
                marginBottom: 18,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 44,
                border: "none",
                backgroundImage: loading ? "none" : "linear-gradient(135deg,#ff6a00,#ee0979)",
                backgroundColor: loading ? "var(--surface2)" : "transparent",
                color: loading ? "var(--muted)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                borderRadius: 0,
                boxShadow: loading ? "none" : "0 4px 16px rgba(255,106,0,0.3)",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

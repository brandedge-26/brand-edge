"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useCallsStore } from "@/stores/useCallsStore";
import { useToast } from "@/components/Toast";

const todayISO = () => new Date().toISOString().slice(0, 10);

// ── Document Picture-in-Picture (experimental, Chrome/Edge only) ───────────
interface DocumentPictureInPicture {
  requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
}
declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const PopOutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <rect x="2" y="3" width="20" height="14" rx="0"/>
    <rect x="12" y="11" width="9" height="7" rx="0" fill="currentColor" stroke="none"/>
  </svg>
);

const STORAGE_KEY = "sales-call-widget-pos";

export default function CallCounterWidget() {
  const { toast } = useToast();
  const { calls, fetch, logCall } = useCallsStore();
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState("");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const pipWindowRef = useRef<Window | null>(null);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    setMounted(true);
    setToday(todayISO());
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") setPos(parsed);
      }
    } catch {}
  }, []);

  // Close the pip window if this component ever unmounts (e.g. logout/reload).
  useEffect(() => () => { pipWindowRef.current?.close(); }, []);

  // Re-check the date exactly at the next local midnight, so "today's" count
  // resets on screen even if the widget is left open with no interaction —
  // and reschedules itself for the midnight after that.
  useEffect(() => {
    if (!today) return;
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    const ms = nextMidnight.getTime() - now.getTime();
    const timer = setTimeout(() => setToday(todayISO()), ms);
    return () => clearTimeout(timer);
  }, [today]);

  // Backstop: if the tab was backgrounded/throttled right through midnight,
  // catch up as soon as it's visible again.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") setToday(todayISO());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const todayCount = calls.filter((c) => c.createdAt.slice(0, 10) === today).length;

  const clampPos = useCallback((x: number, y: number) => {
    const w = 150, h = 50;
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPos(clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y));
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    setPos((p) => {
      if (p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} }
      return p;
    });
  };

  const handleSubmit = async () => {
    if (!businessName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await logCall(businessName.trim());
      setBusinessName("");
      setShowModal(false);
      toast("Call logged!");
    } catch {
      toast("Failed to log call.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openPip = async () => {
    if (!window.documentPictureInPicture) return;
    try {
      const pip = await window.documentPictureInPicture.requestWindow({ width: 320, height: 170 });

      // The pip window starts with a blank document — copy over the app's
      // theme attribute and stylesheets so CSS variables resolve correctly.
      pip.document.documentElement.setAttribute(
        "data-theme",
        document.documentElement.getAttribute("data-theme") ?? "dark"
      );
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((r) => r.cssText).join("");
          const style = pip.document.createElement("style");
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch {
          if (styleSheet.href) {
            const link = pip.document.createElement("link");
            link.rel = "stylesheet";
            link.href = styleSheet.href;
            pip.document.head.appendChild(link);
          }
        }
      });
      pip.document.body.style.margin = "0";
      pip.document.body.style.background = "var(--bg)";
      pip.document.body.style.overflow = "auto";

      pip.addEventListener("pagehide", () => {
        pipWindowRef.current = null;
        setPipWindow(null);
      }, { once: true });

      pipWindowRef.current = pip;
      setPipWindow(pip);
    } catch {}
  };

  if (!mounted) return null;

  const pipSupported = typeof window !== "undefined" && !!window.documentPictureInPicture;
  const isPip = !!pipWindow;

  const outerStyle: React.CSSProperties = isPip
    ? { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, boxSizing: "border-box" }
    : (pos
      ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 150 }
      : { position: "fixed", right: 20, bottom: 20, zIndex: 150 });

  const content = (
    <>
      <div
        style={{
          ...outerStyle,
          display: "flex", alignItems: "center", gap: 10,
          backgroundImage: "linear-gradient(135deg,#ff6a00,#ee0979)",
          border: "none", padding: isPip ? "10px 12px" : "8px 10px",
          boxShadow: "0 6px 24px rgba(255,106,0,0.55), 0 2px 8px rgba(0,0,0,0.3)",
          cursor: isPip ? "default" : (dragging ? "grabbing" : "grab"),
          userSelect: "none", touchAction: "none",
        }}
        onPointerDown={isPip ? undefined : handlePointerDown}
        onPointerMove={isPip ? undefined : handlePointerMove}
        onPointerUp={isPip ? undefined : handlePointerUp}
        onPointerCancel={isPip ? undefined : handlePointerUp}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.9)" }}>
          <PhoneIcon />
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>Calls Today</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", minWidth: 20, textAlign: "center" }}>{todayCount}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setShowModal(true)}
          title="Log a call"
          style={{
            width: 30, height: 30, border: "none",
            background: "#fff",
            color: "#ff6a00", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 0, flexShrink: 0,
          }}
        >
          <PlusIcon />
        </button>
        {!isPip && pipSupported && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={openPip}
            title="Float on top of other tabs"
            style={{
              width: 26, height: 26, border: "1px solid rgba(255,255,255,0.5)",
              background: "transparent",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 0, flexShrink: 0,
            }}
          >
            <PopOutIcon />
          </button>
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: isPip ? 10 : 24,
        }} onClick={() => !submitting && setShowModal(false)}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            width: 380, maxWidth: "100%", padding: isPip ? 16 : 24,
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>Log a Call</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Which business did you just call?</p>
            <input
              type="text" autoFocus placeholder="e.g. Ahmed Tyres"
              value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              style={{
                width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--border)",
                background: "var(--surface2)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit",
                outline: "none", boxSizing: "border-box", marginBottom: 18,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowModal(false)} disabled={submitting} style={{
                padding: "9px 18px", border: "1px solid var(--border)", background: "transparent",
                color: "var(--fg)", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 0, fontFamily: "inherit",
              }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={!businessName.trim() || submitting} style={{
                padding: "9px 20px", border: "none",
                backgroundImage: businessName.trim() && !submitting ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "none",
                backgroundColor: businessName.trim() && !submitting ? "transparent" : "var(--surface2)",
                color: businessName.trim() && !submitting ? "#fff" : "var(--muted)",
                fontSize: 13, fontWeight: 600, cursor: businessName.trim() && !submitting ? "pointer" : "not-allowed",
                borderRadius: 0, fontFamily: "inherit",
              }}>
                {submitting ? "Saving..." : "Log Call (+1)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isPip && pipWindow) {
    return createPortal(content, pipWindow.document.body);
  }
  return content;
}

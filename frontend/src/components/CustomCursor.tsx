"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const currRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const [isLink, setIsLink] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currRef.current.x = lerp(currRef.current.x, posRef.current.x, 0.14);
      currRef.current.y = lerp(currRef.current.y, posRef.current.y, 0.14);
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${currRef.current.x}px, ${currRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      const el = e.target as HTMLElement;
      setIsLink(
        el.tagName === "A" || el.tagName === "BUTTON" ||
        !!el.closest("a") || !!el.closest("button") ||
        !!el.closest("[data-cursor-link]")
      );
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: isLink ? "46px" : "18px",
        height: isLink ? "46px" : "18px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
        pointerEvents: "none", zIndex: 999999,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "width 0.18s ease, height 0.18s ease, opacity 0.2s ease",
        willChange: "transform",
      }}
    >
      {isLink && (
        <ArrowUpRight size={18} stroke="#111" strokeWidth={2.2} style={{ transform: "rotate(-25deg)", flexShrink: 0 }} />
      )}
    </div>
  );
}

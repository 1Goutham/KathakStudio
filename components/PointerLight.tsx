"use client";
import { useEffect } from "react";

// One delegated listener: any element with [data-light] gets --mx/--my set to the
// pointer position inside it, so CSS can draw a soft light that follows the cursor.
export default function PointerLight() {
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-light]") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return null;
}

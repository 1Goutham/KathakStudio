"use client";
import { useEffect, useRef, type ReactNode } from "react";

// Fills the timeline line in step with scroll and lights each step as the line reaches it.
export default function ScrollTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (anchor - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(4));
      el.querySelectorAll<HTMLElement>(".t-step").forEach((s) => {
        s.classList.toggle("is-lit", s.getBoundingClientRect().top + 30 < anchor);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return <ol className="timeline" ref={ref}>{children}</ol>;
}

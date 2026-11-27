"use client";
import { useEffect, useRef } from "react";

/**
 * Custom cursor: a red dot inside a soft gold ring.
 * States: idle · hover (links/buttons/cards) · press & drag (second ring) ·
 * click ripple · aura over the statue. Text fields keep the native caret.
 * Only runs for fine pointers that can hover; touch devices are untouched.
 */
const INTERACTIVE = 'a, button, [role="button"], select, summary, label, .pillar, .ritual, .life-card, .video-card, .review';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]';

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ringPos = useRef<HTMLDivElement>(null);
  const dotPos = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current!, rp = ringPos.current!, dp = dotPos.current!;
    document.documentElement.classList.add("has-cursor");

    const p = { x: -100, y: -100 }, r = { x: -100, y: -100 };
    let raf = 0, last = 0, shown = false, down = false;

    const set = (cls: string, on: boolean) => el.classList.toggle(cls, on);
    const loop = (now: number) => {
      // ring trails the dot with a soft lag (frame-rate independent); the dot is exact
      const dt = last ? Math.min(now - last, 100) : 16; last = now;
      const k = reduce ? 1 : 1 - Math.pow(0.78, dt / 16.67);
      r.x += (p.x - r.x) * k; r.y += (p.y - r.y) * k;
      if (Math.abs(p.x - r.x) + Math.abs(p.y - r.y) < 0.3) { r.x = p.x; r.y = p.y; }
      dp.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      rp.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      if (r.x !== p.x || r.y !== p.y) raf = requestAnimationFrame(loop); else { raf = 0; last = 0; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const classify = (t: EventTarget | null) => {
      const node = t instanceof Element ? t : null;
      const text = !!node?.closest(TEXT);
      set("is-text", text);
      set("is-aura", !text && !!node?.closest(".statue"));
      set("is-hover", !text && !!node?.closest(INTERACTIVE));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      p.x = e.clientX; p.y = e.clientY;
      if (!shown) { r.x = p.x; r.y = p.y; shown = true; set("is-hidden", false); }
      classify(e.target);
      kick();
    };
    const ripple = (x: number, y: number) => {
      if (reduce) return;
      for (let i = 0; i < 2; i++) {
        const s = document.createElement("span");
        s.className = "c-ripple";
        s.style.left = `${x}px`; s.style.top = `${y}px`; s.style.animationDelay = `${i * 120}ms`;
        el.appendChild(s);
        s.addEventListener("animationend", () => s.remove(), { once: true });
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true; set("is-press", true);
      set("is-drag", !!(e.target instanceof Element && e.target.closest(".statue")));
      ripple(e.clientX, e.clientY);
    };
    const onUp = () => { if (!down) return; down = false; set("is-press", false); set("is-drag", false); };
    const onLeave = () => { shown = false; set("is-hidden", true); };
    const onOver = (e: PointerEvent) => { if (e.pointerType === "mouse") classify(e.target); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={root} className="cursor is-hidden" aria-hidden="true">
      <div ref={ringPos} className="c-pos">
        <div className="c-ring"><span className="c-ring-outer" /></div>
      </div>
      <div ref={dotPos} className="c-pos">
        <div className="c-dot" />
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";

/**
 * Gold cursor set.
 *  default   polished gold sphere with a three-sphere trail driven by a spring chain
 *  link      target ring with ticks spins in around the sphere
 *  click     sunburst rays burst from the click point
 *  hold      concentric rings open out while the button is down
 *  statue    ←•→ arrows; while dragging they lean into the turn
 *  text      gold I-beam with a dot
 *  disabled  prohibition sign
 * Mouse devices only; touch is untouched. Reduced motion removes trail lag and bursts.
 */
const LINK = 'a, button:not([disabled]), [role="button"], select, summary, label, .pillar, .ritual, .life-card, .video-card, .review';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';
const DISABLED = 'button[disabled], [aria-disabled="true"], input[disabled], select[disabled], textarea[disabled]';

const TRAIL = [
  { size: 9, gap: 12 },
  { size: 6.5, gap: 9 },
  { size: 4.5, gap: 7 },
];

/* Shapes are drawn three times (shadow, gold body, highlight) to read as polished tubes. */
function Tube({ id }: { id: string }) {
  return (
    <>
      <use href={`#${id}`} className="t-shadow" />
      <use href={`#${id}`} className="t-body" />
      <use href={`#${id}`} className="t-hi" />
    </>
  );
}

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const trail = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current!, m = main.current!;
    const dots = trail.current.filter(Boolean) as HTMLDivElement[];
    document.documentElement.classList.add("has-cursor");

    const p = { x: -200, y: -200 };
    const pts = TRAIL.map(() => ({ x: -200, y: -200 }));
    const dir = { x: 0.6, y: 0.8 };                 // trail direction; rests down-right like the set
    const vel = { x: 0, y: 0 };
    let last = { x: p.x, y: p.y, t: 0 };
    let raf = 0, prevT = 0, shown = false, down = false, dragStartX = 0;
    const set = (c: string, on: boolean) => el.classList.toggle(c, on);

    const loop = (now: number) => {
      const dt = prevT ? Math.min(now - prevT, 64) : 16; prevT = now;
      const f = dt / 16.67;
      // velocity (smoothed) steers the trail behind the motion; at rest it eases back to down-right
      const speed = Math.hypot(vel.x, vel.y);
      const tx = speed > 0.25 ? -vel.x / speed : 0.6, ty = speed > 0.25 ? -vel.y / speed : 0.8;
      const kd = 1 - Math.pow(speed > 0.25 ? 0.75 : 0.9, f);
      dir.x += (tx - dir.x) * kd; dir.y += (ty - dir.y) * kd;
      const dl = Math.hypot(dir.x, dir.y) || 1; dir.x /= dl; dir.y /= dl;
      vel.x *= Math.pow(0.82, f); vel.y *= Math.pow(0.82, f);

      m.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      let ax = p.x, ay = p.y, moving = speed > 0.02;
      pts.forEach((pt, i) => {
        const g = TRAIL[i].gap + (i === 0 ? 8 : 0);
        const gx = ax + dir.x * g, gy = ay + dir.y * g;
        const k = reduce ? 1 : 1 - Math.pow(0.62 - i * 0.06, f);
        pt.x += (gx - pt.x) * k; pt.y += (gy - pt.y) * k;
        if (Math.abs(gx - pt.x) + Math.abs(gy - pt.y) > 0.15) moving = true;
        dots[i].style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
        ax = pt.x; ay = pt.y;
      });
      if (down && el.classList.contains("is-statue")) {
        const lean = Math.max(-1, Math.min(1, (p.x - dragStartX) / 120));
        el.style.setProperty("--lean", lean.toFixed(3));
      }
      raf = moving ? requestAnimationFrame(loop) : 0;
      if (!raf) prevT = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const classify = (t: EventTarget | null) => {
      const n = t instanceof Element ? t : null;
      const disabled = !!n?.closest(DISABLED);
      const text = !disabled && !!n?.closest(TEXT);
      const statue = !disabled && !text && !!n?.closest(".statue");
      set("is-disabled", disabled);
      set("is-text", text);
      set("is-statue", statue);
      set("is-link", !disabled && !text && !statue && !!n?.closest(LINK));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (last.t) {
        const dtm = Math.max(now - last.t, 1);
        vel.x = vel.x * 0.5 + ((e.clientX - last.x) / dtm) * 8;
        vel.y = vel.y * 0.5 + ((e.clientY - last.y) / dtm) * 8;
      }
      last = { x: e.clientX, y: e.clientY, t: now };
      p.x = e.clientX; p.y = e.clientY;
      if (!shown) {
        shown = true; set("is-hidden", false);
        pts.forEach((pt, i) => { pt.x = p.x + 0.6 * (i + 1) * 12; pt.y = p.y + 0.8 * (i + 1) * 12; });
      }
      classify(e.target);
      kick();
    };

    const burst = (x: number, y: number) => {
      if (reduce) return;
      const b = document.createElement("div");
      b.className = "c-burst";
      b.style.left = `${x}px`; b.style.top = `${y}px`;
      b.innerHTML = Array.from({ length: 8 }, (_, i) => `<i style="--a:${i * 45}deg"></i>`).join("");
      el.appendChild(b);
      setTimeout(() => b.remove(), 700);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true; dragStartX = e.clientX;
      set("is-down", true);
      if (!el.classList.contains("is-text") && !el.classList.contains("is-disabled")) burst(e.clientX, e.clientY);
      kick();
    };
    const onUp = () => {
      if (!down) return;
      down = false; set("is-down", false); el.style.setProperty("--lean", "0");
    };
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
      {/* shared gold definitions */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gold-tube" gradientUnits="userSpaceOnUse" x1="-30" y1="-30" x2="30" y2="30">
            <stop offset="0" stopColor="#fff1c2" />
            <stop offset=".35" stopColor="#f1c869" />
            <stop offset=".7" stopColor="#c48a2c" />
            <stop offset="1" stopColor="#8a5814" />
          </linearGradient>
          {/* target ring with ticks */}
          <g id="cs-target">
            <circle cx="0" cy="0" r="21" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4, r1 = i % 2 ? 17.5 : 16, r2 = i % 2 ? 24.5 : 27;
              return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} />;
            })}
          </g>
          {/* concentric rings */}
          <g id="cs-ring1"><circle cx="0" cy="0" r="17" /></g>
          <g id="cs-ring2"><circle cx="0" cy="0" r="24" /></g>
          <g id="cs-ring3"><circle cx="0" cy="0" r="31" /></g>
          {/* arrows */}
          <g id="cs-arrow-r"><path d="M14 0 H28 M22 -5 L29 0 L22 5" /></g>
          <g id="cs-arrow-l"><path d="M-14 0 H-28 M-22 -5 L-29 0 L-22 5" /></g>
          {/* I-beam */}
          <g id="cs-ibeam"><path d="M0 -11 V11 M-5 -12 C -2 -12, -1 -11, 0 -10 C 1 -11, 2 -12, 5 -12 M-5 12 C -2 12, -1 11, 0 10 C 1 11, 2 12, 5 12" /></g>
          {/* prohibition */}
          <g id="cs-no"><circle cx="0" cy="0" r="12" /><path d="M-8.5 -8.5 L8.5 8.5" /></g>
        </defs>
      </svg>

      {/* trail first so the main sphere sits on top */}
      {TRAIL.map((t, i) => (
        <div key={i} ref={(n) => { trail.current[i] = n; }} className="c-pos c-trail">
          <span className="gs" style={{ "--s": `${t.size}px` } as React.CSSProperties} />
        </div>
      ))}

      <div ref={main} className="c-pos c-main">
        <svg className="c-svg c-target" viewBox="-34 -34 68 68"><Tube id="cs-target" /></svg>
        <svg className="c-svg c-rings" viewBox="-34 -34 68 68">
          <g className="r1"><Tube id="cs-ring1" /></g>
          <g className="r2"><Tube id="cs-ring2" /></g>
          <g className="r3"><Tube id="cs-ring3" /></g>
        </svg>
        <svg className="c-svg c-arrows" viewBox="-34 -34 68 68">
          <g className="ar"><Tube id="cs-arrow-r" /></g>
          <g className="al"><Tube id="cs-arrow-l" /></g>
        </svg>
        <svg className="c-svg c-ibeam" viewBox="-34 -34 68 68"><Tube id="cs-ibeam" /></svg>
        <svg className="c-svg c-no" viewBox="-34 -34 68 68"><Tube id="cs-no" /></svg>
        <span className="gs c-core" style={{ "--s": "15px" } as React.CSSProperties} />
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Elements revealed on scroll. Kept in sync with the `.js` rules in globals.css.
const GROUPS: Record<string, string> = {
  split: "[data-split]",
  line: ".divider",
  fade: [
    ".eyebrow", ".lede", ".prose", ".outro", ".welcome", ".hero-body", ".hero-ctas", ".sub-head", ".pull",
    ".creds li", ".badge", ".checks li", ".next-steps h3", ".next-steps li", ".visit-quote", ".heritage-quote",
    ".chapter", ".note", ".stat", ".t-card", ".guru h2", ".stage-hint",
  ].join(","),
  mask: [
    ".pillar", ".ritual", ".life-card", ".video-card", ".reflection", ".review", ".observe-card",
    ".form-card", ".map-wrap", ".address-card", ".portrait-frame",
  ].join(","),
};

export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // --- reveals ---
    const targets: HTMLElement[] = [];
    for (const [kind, sel] of Object.entries(GROUPS)) {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        if (el.dataset.reveal) return;
        el.dataset.reveal = kind;
        targets.push(el);
      });
    }
    // stagger siblings that reveal together
    const byParent = new Map<Element, HTMLElement[]>();
    targets.forEach((el) => { const p = el.parentElement!; byParent.set(p, [...(byParent.get(p) || []), el]); });
    byParent.forEach((list) => list.forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 6) * 110}ms`)));

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    if (reduce) targets.forEach((t) => t.classList.add("is-in"));
    else targets.forEach((t) => io.observe(t));
    root.classList.add("motion-ready");

    // --- smooth scroll + progress line ---
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const setProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar?.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
    };
    let lenis: Lenis | null = null, raf = 0;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.075, anchors: { offset: -72 }, autoRaf: false });
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("scroll", setProgress, { passive: true });
    setProgress();

    return () => {
      io.disconnect(); cancelAnimationFrame(raf); lenis?.destroy();
      window.removeEventListener("scroll", setProgress);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}

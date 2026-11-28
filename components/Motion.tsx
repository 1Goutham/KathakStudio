"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Elements revealed on scroll. Kept in sync with the `.js` rules in globals.css.
const GROUPS: Record<string, string> = {
  split: "[data-split]",
  line: ".divider",
  fade: [
    ".eyebrow", ".lede", ".prose", ".outro", ".welcome", ".hero-body", ".hero-ctas", ".sub-head", ".pull",
    ".creds li", ".badge", ".checks li", ".next-steps h3", ".next-steps li", ".footer-quote p", ".footer-col", ".heritage-quote",
    ".chapter", ".note", ".stat", ".t-card", ".guru h2",
  ].join(","),
  mask: [
    ".pillar", ".ritual", ".life-card", ".video-card", ".reflection", ".review", ".observe-card",
    ".form-card", ".portrait-frame",
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

    // --- count-up for stats ("15+ Years", "200+") when they reveal ---
    const countUp = (el: HTMLElement) => {
      const m = el.textContent?.match(/^(\d+)([\s\S]*)$/);
      if (!m || reduce) return;
      const end = +m[1], rest = m[2], t0 = performance.now(), dur = 1600;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(end * e) + rest;
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = "0" + rest;
      requestAnimationFrame(tick);
    };
    const statIo = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      statIo.unobserve(e.target);
      setTimeout(() => countUp(e.target as HTMLElement), 350);
    }), { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>(".stat strong").forEach((el) => statIo.observe(el));

    // --- sections: reveal their background ornament, track scroll progress, light the nav ---
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a[href^="#"]'));
    const secIo = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) (e.target as HTMLElement).classList.add("in-view");
    }), { threshold: 0.12 });
    sections.forEach((s) => (reduce ? s.classList.add("in-view") : secIo.observe(s)));

    let sraf = 0;
    const onSections = () => {
      sraf = 0;
      const vh = window.innerHeight;
      let current = "";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        // -1 entering from below .. 0 centred .. 1 leaving at the top
        const sp = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
        if (!reduce) s.style.setProperty("--sp", sp.toFixed(3));
        if (s.id && r.top <= vh * 0.4 && r.bottom > vh * 0.4) current = "#" + s.id;
      }
      navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === current));
    };
    const queueSections = () => { if (!sraf) sraf = requestAnimationFrame(onSections); };
    window.addEventListener("scroll", queueSections, { passive: true });
    window.addEventListener("resize", queueSections);
    onSections();

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
      io.disconnect(); statIo.disconnect(); secIo.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(sraf); lenis?.destroy();
      window.removeEventListener("scroll", setProgress);
      window.removeEventListener("scroll", queueSections);
      window.removeEventListener("resize", queueSections);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}

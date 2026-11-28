"use client";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-logo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-light" src="/logo-light-160.png" srcSet="/logo-light-160.png 1x, /logo-light-480.png 3x" alt="" width={52} height={52} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-ink" src="/logo-ink-160.png" srcSet="/logo-ink-160.png 1x, /logo-ink-480.png 3x" alt="" width={52} height={52} />
          </span>
          <span className="brand-text">
            <span className="brand-name">{site.name}</span>
            <span className="brand-sub">The Kathak Studio</span>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <a href="#begin" className="btn btn-small" onClick={() => setOpen(false)}>Begin</a>
        </nav>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

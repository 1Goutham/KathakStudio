"use client";
import { useEffect, useRef } from "react";
import { site, whatsappLink, footer } from "@/lib/content";

const NAV = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#guru", label: "Guru Ishvarya" },
  { href: "#journey", label: "The Experience" },
  { href: "#heritage", label: "Heritage" },
  { href: "#voices", label: "Voices" },
  { href: "#observe", label: "Observe a Class" },
  { href: "#begin", label: "Begin Your Journey" },
];

const Icon = {
  instagram: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>,
  facebook: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H7.7v3h2.6V21h3.2Z" /></svg>,
  whatsapp: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" /></svg>,
  arrow: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>,
};

export default function Footer() {
  const ring = useRef<HTMLSpanElement>(null);

  // the back-to-top ring turns with the page
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; ring.current?.style.setProperty("--rot", `${window.scrollY * 0.08}deg`); });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    // the floating WhatsApp button steps aside while the footer (which has its own) is on screen
    const foot = document.getElementById("contact");
    const io = new IntersectionObserver(([e]) => document.documentElement.classList.toggle("footer-in", e.isIntersecting), { rootMargin: "0px 0px -120px 0px" });
    if (foot) io.observe(foot);
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); io.disconnect(); document.documentElement.classList.remove("footer-in"); };
  }, []);

  const tel = "+" + site.whatsappNumber;
  const telDisplay = `+${site.whatsappNumber.slice(0, 2)} ${site.whatsappNumber.slice(2, 7)} ${site.whatsappNumber.slice(7)}`;

  return (
    <footer className="footer" id="contact">
      <div className="footer-quote">
        <div className="container">
          <p>&ldquo;{footer.quote}&rdquo;</p>
        </div>
      </div>

      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <a href="#top" className="footer-logo" aria-label={`${site.fullName}, back to top`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light-480.png" alt="" width={96} height={96} />
          </a>
          <p className="footer-tag">{footer.tagline}</p>
          <div className="footer-social">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">{Icon.instagram}</a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">{Icon.facebook}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">{Icon.whatsapp}</a>
          </div>
        </div>

        <nav className="footer-col" aria-label="Footer">
          <h4>Navigate</h4>
          <ul className="footer-links">
            {NAV.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}
          </ul>
        </nav>

        <div className="footer-col">
          <h4>Visit</h4>
          <address className="footer-address">
            {site.address.slice(1).map((l) => <span key={l}>{l}</span>)}
          </address>
          <a className="footer-arrow" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions {Icon.arrow}</a>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <a className="footer-line" href={`tel:${tel}`}>{telDisplay}</a>
          <a className="footer-line" href={`mailto:${site.email}`}>{site.email}</a>
          <a className="btn footer-cta" href="#observe">Observe a Class</a>
        </div>
      </div>

      <div className="footer-mark" data-light aria-hidden="true">
        <span>{site.name}</span>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
        <p className="footer-love">Made with <span aria-label="love">♥</span> for the love of Kathak</p>
        <a href="#top" className="to-top" aria-label="Back to top">
          <span className="to-top-ring" ref={ring}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs><path id="tt-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
              <text><textPath href="#tt-circle" startOffset="0" textLength="236" lengthAdjust="spacing">BACK TO TOP · TRIBHANG · </textPath></text>
            </svg>
          </span>
          <svg className="to-top-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </a>
      </div>
    </footer>
  );
}

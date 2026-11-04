"use client";
import { useRef } from "react";
import Statue3D from "./Statue3D";
import { Mandala } from "./Motif";
import { hero } from "@/lib/content";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section className="hero" ref={ref}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.titleLead} <em>{hero.titleAccent}</em></h1>
          <p className="hero-body">{hero.body}</p>
          <div className="hero-ctas">
            <a href="#observe" className="btn">{hero.primaryCta}</a>
            <a href="#about" className="btn btn-ghost-light">{hero.secondaryCta}</a>
          </div>
        </div>
        <div className="hero-stage">
          <Mandala className="hero-mandala" />
          <div className="hero-glow" aria-hidden="true" />
          <Statue3D
            src="/nataraja.webp"
            depthSrc="/nataraja-depth.png"
            alt="Bronze Nataraja — Shiva as the cosmic dancer — within a ring of flames"
            hostRef={ref}
          />
          <p className="stage-hint" aria-hidden="true"><span className="hint-fine">Move to light · </span>Drag to turn</p>
        </div>
      </div>
    </section>
  );
}

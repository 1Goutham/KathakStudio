import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import EnquiryForm from "@/components/EnquiryForm";
import { Mandala, Divider } from "@/components/Motif";
import {
  site, whatsappLink, hero, invitation, pillars, guru, journey, rituals,
  heritage, life, voices, observe, begin, visit,
} from "@/lib/content";

function SectionHead({ eyebrow, lead, accent, tail, intro, light = false }: { eyebrow: string; lead: string; accent: string; tail?: string; intro?: string; light?: boolean }) {
  return (
    <Reveal className={`section-head ${light ? "on-dark" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>
        {lead} <em>{accent}</em>{tail ? ` ${tail}` : ""}
      </h2>
      <Divider />
      {intro && <p className="lede">{intro}</p>}
    </Reveal>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <Mandala className="hero-mandala" />
          <div className="container hero-inner">
            <Reveal><p className="eyebrow">{hero.eyebrow}</p></Reveal>
            <Reveal delay={100}>
              <h1>{hero.titleLead} <em>{hero.titleAccent}</em></h1>
            </Reveal>
            <Reveal delay={200}><p className="hero-body">{hero.body}</p></Reveal>
            <Reveal delay={300} className="hero-ctas">
              <a href="#observe" className="btn">{hero.primaryCta}</a>
              <a href="#about" className="btn btn-ghost-light">{hero.secondaryCta}</a>
            </Reveal>
          </div>
          <a href="#invitation" className="scroll-cue" aria-label="Scroll down"><span /></a>
        </section>

        {/* INVITATION */}
        <section id="invitation" className="section paper">
          <div className="container narrow">
            <SectionHead eyebrow={invitation.eyebrow} lead={invitation.titleLead} accent={invitation.titleAccent} />
            <Reveal><p className="prose center">{invitation.body}</p></Reveal>
            <div className="notes">
              {invitation.notes.map((n, i) => (
                <Reveal key={n.quote} delay={i * 90} className="note">
                  <p className="note-quote">&ldquo;{n.quote}&rdquo;</p>
                  <p className="note-meta">{n.note}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="welcome">
              <span className="big-quote" aria-hidden="true">&ldquo;</span>
              <p>{invitation.welcome}</p>
              <p className="sig">— {site.guru}, Founder of {site.name}</p>
            </Reveal>
          </div>
        </section>

        {/* PILLARS */}
        <section id="about" className="section">
          <div className="container">
            <SectionHead eyebrow={pillars.eyebrow} lead={pillars.titleLead} accent={pillars.titleAccent} intro={pillars.intro} />
            <div className="grid-3">
              {pillars.items.map((p, i) => (
                <Reveal key={p.title} delay={i * 120} className="pillar">
                  <span className="num">{pad(i + 1)}</span>
                  <p className="kicker">{p.kicker}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal><p className="outro">{pillars.outro}</p></Reveal>
          </div>
        </section>

        {/* GURU */}
        <section id="guru" className="section dark">
          <Mandala className="bg-mandala" />
          <div className="container guru">
            <Reveal className="guru-portrait">
              <div className="portrait-frame">
                {/* Replace with a real portrait: put guru.jpg in /public and use <img src="/guru.jpg" /> */}
                <div className="portrait-placeholder">
                  <Mandala className="portrait-mandala" />
                  <span>{guru.name}</span>
                </div>
              </div>
              <div className="stats">
                {guru.stats.map((s) => (
                  <div key={s.label} className="stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="eyebrow">{guru.eyebrow}</p>
                <h2>{guru.name}</h2>
                <Divider />
                <blockquote className="pull">&ldquo;{guru.quote}&rdquo;</blockquote>
              </Reveal>
              {guru.bio.map((p, i) => (
                <Reveal key={i} delay={i * 80}><p className="prose">{p}</p></Reveal>
              ))}
              <Reveal>
                <ul className="creds">
                  {guru.credentials.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="section paper">
          <div className="container">
            <SectionHead eyebrow={journey.eyebrow} lead={journey.titleLead} accent={journey.titleAccent} intro={journey.intro} />
            <ol className="timeline">
              {journey.steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={(i % 2) * 100} className="t-step">
                  <span className="t-dot">{i + 1}</span>
                  <div className="t-card">
                    <p className="kicker">Step {i + 1}</p>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <p className="t-note">{s.note}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* RITUALS */}
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={rituals.eyebrow} lead={rituals.titleLead} accent={rituals.titleAccent} tail={rituals.titleTail} intro={rituals.intro} />
            <div className="grid-3 rituals">
              {rituals.items.map((r, i) => (
                <Reveal key={r.title} delay={(i % 3) * 100} className="ritual">
                  <span className="num">{pad(i + 1)}</span>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE */}
        <section id="heritage" className="section dark heritage">
          <span className="deva-watermark" aria-hidden="true">कथक</span>
          <div className="container">
            <SectionHead light eyebrow={heritage.eyebrow} lead={heritage.titleLead} accent={heritage.titleAccent} intro={heritage.intro} />
            <div className="chapters">
              {heritage.chapters.map((c, i) => (
                <Reveal key={c.label} className="chapter">
                  <div className="chapter-side">
                    <span className="num">{pad(i + 1)}</span>
                    <p className="kicker">{c.label}</p>
                    <div className="aside">{c.aside.map((a) => <span key={a}>{a}</span>)}</div>
                  </div>
                  <div className="chapter-main">
                    <p className="chapter-line">{c.line}</p>
                    <h3>{c.title}</h3>
                    <p className="prose">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="heritage-quote">
              <p>&ldquo;{heritage.closingQuote}&rdquo;</p>
              <span>— {site.guru}</span>
            </Reveal>
          </div>
        </section>

        {/* LIFE */}
        <section className="section paper">
          <div className="container">
            <SectionHead eyebrow={life.eyebrow} lead={life.titleLead} accent={life.titleAccent} />
            <div className="life-grid">
              {life.items.map((l, i) => (
                <Reveal key={l.title} delay={(i % 2) * 120} className={`life-card tone-${i}`}>
                  <Mandala className="life-mandala" />
                  <p className="kicker">{l.kicker}</p>
                  <h3>{l.title}</h3>
                  <p>{l.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VOICES */}
        <section id="voices" className="section">
          <div className="container">
            <SectionHead eyebrow={voices.eyebrow} lead={voices.titleLead} accent={voices.titleAccent} />

            <h3 className="sub-head">Featured Video Stories</h3>
            <div className="grid-3">
              {voices.videos.map((v, i) => (
                <Reveal key={i} delay={i * 100} className="video-card">
                  <div className="video-thumb" style={{ backgroundImage: `url(${v.image})` }}>
                    <span className="play" aria-hidden="true">▶</span>
                    <span className="duration">{v.duration}</span>
                  </div>
                  <div className="video-body">
                    <p>&ldquo;{v.quote}&rdquo;</p>
                    <strong>{v.name}</strong>
                    <span>{v.meta}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <h3 className="sub-head">Student Reflections</h3>
            <div className="grid-2">
              {voices.reflections.map((r, i) => (
                <Reveal key={i} delay={(i % 2) * 100} className="reflection">
                  <p>{r.body}</p>
                  <div className="who"><strong>{r.name}</strong><span>{r.meta}</span></div>
                </Reveal>
              ))}
            </div>

            <h3 className="sub-head">Google Reviews <span className="rating">5.0 ★★★★★</span></h3>
            <div className="grid-3">
              {voices.reviews.map((r, i) => (
                <Reveal key={i} delay={i * 100} className="review">
                  <div className="review-top">
                    <span className="avatar">{r.initial}</span>
                    <span className="stars">★★★★★</span>
                  </div>
                  <p>&ldquo;{r.body}&rdquo;</p>
                  <strong>{r.name}</strong>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* OBSERVE */}
        <section id="observe" className="section observe">
          <Mandala className="bg-mandala" />
          <div className="container observe-inner">
            <Reveal>
              <p className="eyebrow">{observe.eyebrow}</p>
              <h2>{observe.titleLead} <em>{observe.titleAccent}</em></h2>
              <p className="prose">{observe.body}</p>
            </Reveal>
            <Reveal delay={150} className="observe-card">
              <ul className="checks">
                {observe.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <p className="badge">{observe.badge}</p>
              <a href="#begin" className="btn">Request a Visit</a>
            </Reveal>
          </div>
        </section>

        {/* BEGIN */}
        <section id="begin" className="section paper">
          <div className="container">
            <SectionHead eyebrow={begin.eyebrow} lead={begin.titleLead} accent={begin.titleAccent} intro={begin.body} />
            <div className="begin-grid">
              <Reveal className="next-steps">
                <h3>What Happens Next?</h3>
                <ol>
                  {begin.steps.map((s, i) => (
                    <li key={s.title}>
                      <span className="kicker">Step {pad(i + 1)}</span>
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={150}><EnquiryForm /></Reveal>
            </div>
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" className="section dark visit">
          <div className="container">
            <SectionHead light eyebrow={visit.eyebrow} lead={visit.titleLead} accent={visit.titleAccent} />
            <div className="visit-grid">
              <Reveal className="address-card">
                <h3>Studio Address</h3>
                <address>{site.address.map((l) => <span key={l}>{l}</span>)}</address>
                <a className="btn btn-ghost-light" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              </Reveal>
              <Reveal delay={120} className="map-wrap">
                <iframe
                  title="Map to Tribhang"
                  src="https://www.google.com/maps?q=Thondamuthur+Road+Vadavalli+Coimbatore+641041&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>
            </div>
            <Reveal className="visit-quote">
              <p>&ldquo;{visit.quote}&rdquo;</p>
              <span>— {site.name}, {site.city}</span>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <p className="brand-name">{site.name}</p>
            <p className="brand-sub">The Kathak Studio · {site.city}</p>
          </div>
          <div className="socials">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <p className="copy">© {new Date().getFullYear()} {site.fullName}</p>
        </div>
      </footer>

      <a className="wa-float" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
      </a>
    </>
  );
}

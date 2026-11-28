import Header from "@/components/Header";
import Box from "@/components/Box";
import Hero from "@/components/Hero";
import ScrollTimeline from "@/components/ScrollTimeline";
import FocusList from "@/components/FocusList";
import PointerLight from "@/components/PointerLight";
import Motion from "@/components/Motion";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Split, { wordCount } from "@/components/Split";
import EnquiryForm from "@/components/EnquiryForm";
import { Mandala, Divider } from "@/components/Motif";
import {
  site, whatsappLink, invitation, pillars, guru, journey, rituals,
  heritage, life, voices, observe, begin,
} from "@/lib/content";

function SectionHead({ eyebrow, lead, accent, tail, intro, light = false }: { eyebrow: string; lead: string; accent: string; tail?: string; intro?: string; light?: boolean }) {
  return (
    <Box className={`section-head ${light ? "on-dark" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 data-split>
        <Split text={lead} /> <em><Split text={accent} start={wordCount(lead)} /></em>
        {tail ? <> <Split text={tail} start={wordCount(lead) + wordCount(accent)} /></> : null}
      </h2>
      <Divider />
      {intro && <p className="lede">{intro}</p>}
    </Box>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <Header />
      <PointerLight />
      <Motion />
      <Cursor />
      <main id="top">
        <Hero />

        {/* INVITATION */}
        <section id="invitation" className="section paper">
          <div className="container narrow">
            <SectionHead eyebrow={invitation.eyebrow} lead={invitation.titleLead} accent={invitation.titleAccent} />
            <Box><p className="prose center">{invitation.body}</p></Box>
            <div className="notes">
              {invitation.notes.map((n, i) => (
                <Box key={n.quote} className="note">
                  <p className="note-quote">&ldquo;{n.quote}&rdquo;</p>
                  <p className="note-meta">{n.note}</p>
                </Box>
              ))}
            </div>
            <Box className="welcome">
              <span className="big-quote" aria-hidden="true">&ldquo;</span>
              <p>{invitation.welcome}</p>
              <p className="sig">{site.guru}, Founder of {site.name}</p>
            </Box>
          </div>
        </section>

        {/* PILLARS */}
        <section id="about" className="section">
          <div className="container">
            <SectionHead eyebrow={pillars.eyebrow} lead={pillars.titleLead} accent={pillars.titleAccent} intro={pillars.intro} />
            <div className="grid-3">
              {pillars.items.map((p, i) => (
                <Box key={p.title} className="pillar" data-light>
                  <span className="num">{pad(i + 1)}</span>
                  <p className="kicker">{p.kicker}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </Box>
              ))}
            </div>
            <Box><p className="outro">{pillars.outro}</p></Box>
          </div>
        </section>

        {/* GURU */}
        <section id="guru" className="section dark">
          <Mandala className="bg-mandala" />
          <div className="container guru">
            <Box className="guru-portrait">
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
            </Box>
            <div>
              <Box>
                <p className="eyebrow">{guru.eyebrow}</p>
                <h2 data-split><Split text={guru.name} /></h2>
                <Divider />
                <blockquote className="pull">&ldquo;{guru.quote}&rdquo;</blockquote>
              </Box>
              {guru.bio.map((p, i) => (
                <Box key={i}><p className="prose">{p}</p></Box>
              ))}
              <Box>
                <ul className="creds">
                  {guru.credentials.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Box>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="section paper">
          <div className="container">
            <SectionHead eyebrow={journey.eyebrow} lead={journey.titleLead} accent={journey.titleAccent} intro={journey.intro} />
            <ScrollTimeline>
              {journey.steps.map((s, i) => (
                <Box as="li" key={s.title} className="t-step">
                  <span className="t-dot">{i + 1}</span>
                  <div className="t-card">
                    <p className="kicker">Step {i + 1}</p>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <p className="t-note">{s.note}</p>
                  </div>
                </Box>
              ))}
            </ScrollTimeline>
          </div>
        </section>

        {/* RITUALS */}
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={rituals.eyebrow} lead={rituals.titleLead} accent={rituals.titleAccent} tail={rituals.titleTail} intro={rituals.intro} />
            <div className="grid-3 rituals">
              {rituals.items.map((r, i) => (
                <Box key={r.title} className="ritual" data-light>
                  <span className="num">{pad(i + 1)}</span>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </Box>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE */}
        <section id="heritage" className="section dark heritage">
          <span className="deva-watermark" aria-hidden="true">कथक</span>
          <div className="container">
            <SectionHead light eyebrow={heritage.eyebrow} lead={heritage.titleLead} accent={heritage.titleAccent} intro={heritage.intro} />
            <FocusList className="chapters">
              {heritage.chapters.map((c, i) => (
                <Box key={c.label} className="chapter">
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
                </Box>
              ))}
            </FocusList>
            <Box className="heritage-quote">
              <p>&ldquo;{heritage.closingQuote}&rdquo;</p>
              <span>{site.guru}</span>
            </Box>
          </div>
        </section>

        {/* LIFE */}
        <section className="section paper">
          <div className="container">
            <SectionHead eyebrow={life.eyebrow} lead={life.titleLead} accent={life.titleAccent} />
            <div className="life-grid">
              {life.items.map((l, i) => (
                <Box key={l.title} className={`life-card tone-${i}`} data-light>
                  <Mandala className="life-mandala" />
                  <p className="kicker">{l.kicker}</p>
                  <h3>{l.title}</h3>
                  <p>{l.body}</p>
                </Box>
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
                <Box key={i} className="video-card">
                  <div className="video-thumb" style={{ backgroundImage: `url(${v.image})` }}>
                    <span className="play" aria-hidden="true">▶</span>
                    <span className="duration">{v.duration}</span>
                  </div>
                  <div className="video-body">
                    <p>&ldquo;{v.quote}&rdquo;</p>
                    <strong>{v.name}</strong>
                    <span>{v.meta}</span>
                  </div>
                </Box>
              ))}
            </div>

            <h3 className="sub-head">Student Reflections</h3>
            <div className="grid-2">
              {voices.reflections.map((r, i) => (
                <Box key={i} className="reflection">
                  <p>{r.body}</p>
                  <div className="who"><strong>{r.name}</strong><span>{r.meta}</span></div>
                </Box>
              ))}
            </div>

            <h3 className="sub-head">Google Reviews <span className="rating">5.0 ★★★★★</span></h3>
            <div className="grid-3">
              {voices.reviews.map((r, i) => (
                <Box key={i} className="review">
                  <div className="review-top">
                    <span className="avatar">{r.initial}</span>
                    <span className="stars">★★★★★</span>
                  </div>
                  <p>&ldquo;{r.body}&rdquo;</p>
                  <strong>{r.name}</strong>
                </Box>
              ))}
            </div>
          </div>
        </section>

        {/* OBSERVE */}
        <section id="observe" className="section observe">
          <Mandala className="bg-mandala" />
          <div className="container observe-inner">
            <Box>
              <p className="eyebrow">{observe.eyebrow}</p>
              <h2 data-split><Split text={observe.titleLead} /> <em><Split text={observe.titleAccent} start={wordCount(observe.titleLead)} /></em></h2>
              <p className="prose">{observe.body}</p>
            </Box>
            <Box className="observe-card">
              <ul className="checks">
                {observe.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <p className="badge">{observe.badge}</p>
              <a href="#begin" className="btn">Request a Visit</a>
            </Box>
          </div>
        </section>

        {/* BEGIN */}
        <section id="begin" className="section paper">
          <div className="container">
            <SectionHead eyebrow={begin.eyebrow} lead={begin.titleLead} accent={begin.titleAccent} intro={begin.body} />
            <div className="begin-grid">
              <Box className="next-steps">
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
              </Box>
              <Box><EnquiryForm /></Box>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <a className="wa-float" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
      </a>
    </>
  );
}

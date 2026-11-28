# Tribhang · The Kathak Studio

A single-page Next.js (App Router, TypeScript) site for a Kathak dance studio in Coimbatore.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

- `lib/content.ts`: **all copy** (hero, pillars, guru bio, journey, rituals, heritage, testimonials, contact details). Edit here.
- `app/page.tsx`: page sections, in order: Hero → Invitation → Three Pillars → Guru → Journey → Rituals → Heritage → Life at Tribhang → Voices → Observe a Class → Begin Your Journey (form) → Footer.
- `app/globals.css`: design system (maroon / gold / ivory palette, Cormorant Garamond + Jost).
- `components/Statue3D.tsx`: WebGL2 Nataraja in the hero. A dense mesh is displaced by a 16-bit depth map and lit with a normal map, baked AO, a cursor-driven key light, Fresnel rim and a studio environment reflected off the gold. Pointer tilts, drag turns (with flick inertia), hover dollies in, scroll moves the camera. It forms out of gold dust on load (a grainy front rises and sheds lit grains, tumbling chips and powder) and crumbles into falling sand as you scroll away, re-forming when you return. Falls back to the flat image without WebGL2.
- `scripts/build_depth.py`: regenerates `public/nataraja-depth.png` and `public/nataraja-normal.webp` from the cut-out (models flame halo, torus ring, rounded figure, pedestal). Run it again if you swap the statue image.
- `components/Motion.tsx`: scroll reveals (masked word-rise headings, soft fade-up text, unmasking cards, drawing dividers), Lenis smooth scroll and the gold progress line. Respects `prefers-reduced-motion`; content is never hidden without JS.
- `components/Split.tsx`: splits headings into words for the reveal.
- Input-driven extras: `ScrollTimeline` (journey line fills with scroll), `FocusList` (heritage chapter in view is highlighted), `PointerLight` (cursor light on cards).
- `components/Cursor.tsx`: gold cursor set drawn in code: a single polished gold sphere; target ring on links, sunburst on click, concentric rings while held, ←•→ arrows over the statue (lean into the drag), gold I-beam in text fields, prohibition sign on disabled controls. Mouse devices only.
- `components/Footer.tsx`: closing quote, logo, navigation, address, contact, the cursor-lit giant wordmark and the back-to-top ring.
- Logos: `public/logo-ink-*.png` (for light backgrounds) and `public/logo-light-*.png` (ivory linework for dark backgrounds).
- Section backgrounds: each light section carries `data-motif` (lotus, mandala, kolam, paisley, rangoli, ghungroo, prabha, padma); the line-art SVGs live in `app/globals.css` and are drawn by `scripts/build_motifs.py`.
- `components/` also has `Header`, `EnquiryForm` (opens WhatsApp with the enquiry ready to send), `Motif` (SVG mandala).

## Before launch

- WhatsApp enquiries go to `site.whatsappNumber` in `lib/content.ts` (currently +91 81485 62853).
- Replace placeholder testimonials, reviews and video thumbnails with real, consented content.
- Add a guru portrait to `/public` and swap the placeholder in the Guru section.

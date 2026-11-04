# Tribhang – The Kathak Studio

A single-page Next.js (App Router, TypeScript) site for a Kathak dance studio in Coimbatore.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

- `lib/content.ts` — **all copy** (hero, pillars, guru bio, journey, rituals, heritage, testimonials, contact details). Edit here.
- `app/page.tsx` — page sections, in order: Hero → Invitation → Three Pillars → Guru → Journey → Rituals → Heritage → Life at Tribhang → Voices → Observe a Class → Begin Your Journey (form) → Visit → Footer.
- `app/globals.css` — design system (maroon / gold / ivory palette, Cormorant Garamond + Jost).
- `components/Statue3D.tsx` — WebGL Nataraja in the hero: the cut-out (`public/nataraja.webp`) is displaced by a depth map (`public/nataraja-depth.png`) into a 3D relief, lit by a light that follows the cursor; pointer tilts it, drag turns it (spring physics, renders only while moving). Falls back to the flat image without WebGL.
- Other interactions are input-driven only — no canned entrance animations: `ScrollTimeline` (journey line fills with scroll), `FocusList` (heritage chapter in view is highlighted), `PointerLight` (cursor-following light on cards).
- `components/` also has `Header`, `EnquiryForm` (sends via WhatsApp), `Motif` (SVG mandala).

## Before launch

- Set the real WhatsApp number in `site.whatsappNumber` (`lib/content.ts`).
- Replace placeholder testimonials, reviews and video thumbnails with real, consented content.
- Add a guru portrait to `/public` and swap the placeholder in the Guru section.

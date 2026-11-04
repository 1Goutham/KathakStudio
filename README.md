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
- `components/` — `Header` (sticky, mobile menu), `Reveal` (scroll animations), `EnquiryForm` (sends via WhatsApp), `Motif` (SVG mandala ornaments).

## Before launch

- Set the real WhatsApp number in `site.whatsappNumber` (`lib/content.ts`).
- Replace placeholder testimonials, reviews and video thumbnails with real, consented content.
- Add a guru portrait to `/public` and swap the placeholder in the Guru section.

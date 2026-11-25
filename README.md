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
- `app/page.tsx`: page sections, in order: Hero → Invitation → Three Pillars → Guru → Journey → Rituals → Heritage → Life at Tribhang → Voices → Observe a Class → Begin Your Journey (form) → Visit → Footer.
- `app/globals.css`: design system (maroon / gold / ivory palette, Cormorant Garamond + Jost).
- `components/Statue3D.tsx`: WebGL2 Nataraja in the hero. A dense mesh is displaced by a 16-bit depth map and lit with a normal map, baked AO, a cursor-driven key light, Fresnel rim and a studio environment reflected off the gold. Pointer tilts, drag turns (with flick inertia), hover dollies in, scroll moves the camera. It forms out of gold dust on load (a grainy front rises and sheds lit grains, tumbling chips and powder) and crumbles into falling sand as you scroll away, re-forming when you return. Falls back to the flat image without WebGL2.
- `scripts/build_depth.py`: regenerates `public/nataraja-depth.png` and `public/nataraja-normal.webp` from the cut-out (models flame halo, torus ring, rounded figure, pedestal). Run it again if you swap the statue image.
- `components/Motion.tsx`: scroll reveals (masked word-rise headings, soft fade-up text, unmasking cards, drawing dividers), Lenis smooth scroll and the gold progress line. Respects `prefers-reduced-motion`; content is never hidden without JS.
- `components/Split.tsx`: splits headings into words for the reveal.
- Input-driven extras: `ScrollTimeline` (journey line fills with scroll), `FocusList` (heritage chapter in view is highlighted), `PointerLight` (cursor light on cards).
- `components/` also has `Header`, `EnquiryForm`, `Motif` (SVG mandala).
- `app/api/enquiry/route.ts`: receives the enquiry form and sends it straight to the studio WhatsApp (see below).

## Automatic WhatsApp enquiries

The form posts to `/api/enquiry`, which validates the input (with a honeypot and a per-visitor rate limit) and sends it to `site.whatsappNumber`. Until a provider is configured, or if sending fails, the visitor is offered a one-tap "Open WhatsApp" with the message ready, so nothing is lost. Set ONE of these in Vercel (Project, Settings, Environment Variables), then redeploy. See `.env.example`.

**Option A: CallMeBot (free, quickest)**
1. On Guru Ishvarya's phone, open callmebot.com, find the WhatsApp API page and save the bot number it lists.
2. Send it the activation message shown there ("I allow callmebot to send me messages").
3. Copy the API key it replies with into `CALLMEBOT_APIKEY`.

**Option B: WhatsApp Business Cloud API (official)**
1. In Meta for Developers, create an app with the WhatsApp product and add a sender number. It must be a different number from hers; a number registered to the API can no longer use the normal WhatsApp app.
2. Create a permanent access token (system user) and note the sender's Phone number ID.
3. Create a Utility message template named `new_enquiry` whose body has six variables, in order: name, phone, email, age group, experience, message. For example: `New enquiry from {{1}} ({{2}}, {{3}}). Age: {{4}}. Experience: {{5}}. Message: {{6}}`. Wait for approval.
4. Set `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` (and `WHATSAPP_TEMPLATE` / `WHATSAPP_TEMPLATE_LANG` if different).

## Before launch

- WhatsApp enquiries go to `site.whatsappNumber` in `lib/content.ts` (currently +91 81485 62853).
- Replace placeholder testimonials, reviews and video thumbnails with real, consented content.
- Add a guru portrait to `/public` and swap the placeholder in the Guru section.

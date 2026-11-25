import { NextResponse } from "next/server";
import { parseEnquiry, enquiryText, type Enquiry } from "@/lib/enquiry";
import { site } from "@/lib/content";

/**
 * Sends a new enquiry straight to the studio's WhatsApp.
 *
 * Configure ONE provider with environment variables (e.g. in Vercel → Settings → Environment Variables):
 *
 *  CallMeBot (free, for notifying your own number)
 *    CALLMEBOT_APIKEY        key CallMeBot sends back after activation
 *
 *  WhatsApp Business Cloud API (Meta, official)
 *    WHATSAPP_TOKEN            permanent access token
 *    WHATSAPP_PHONE_NUMBER_ID  the sender number's ID
 *    WHATSAPP_TEMPLATE         approved template name (default "new_enquiry"), body with 6 variables:
 *                              name, phone, email, age group, experience, message
 *    WHATSAPP_TEMPLATE_LANG    template language code (default "en")
 *
 *  ENQUIRY_WHATSAPP_TO       optional: recipient in international format without + (defaults to the studio number)
 *
 * With nothing configured, or if sending fails, the route answers 503 and the form falls back
 * to opening WhatsApp with the message pre-filled, so no enquiry is lost.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = (process.env.ENQUIRY_WHATSAPP_TO || site.whatsappNumber).replace(/\D/g, "");

// Best-effort abuse limit per client (per server instance): 5 enquiries / 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

async function viaCallMeBot(text: string, apikey: string) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=%2B${TO}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) });
  const body = await res.text();
  // CallMeBot answers 200 with an HTML page; failures mention an error in the body.
  if (!res.ok || /error|invalid|not\s+(?:allowed|activated)/i.test(body)) throw new Error(`CallMeBot ${res.status}: ${body.slice(0, 200)}`);
}

async function viaCloudApi(e: Enquiry, token: string, phoneId: string) {
  // template parameters may not contain new lines, tabs or runs of spaces
  const p = (s: string) => ({ type: "text", text: (s || "-").replace(/[\n\t]+/g, " ").replace(/ {4,}/g, "   ").slice(0, 1000) });
  const res = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(phoneId)}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: TO,
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE || "new_enquiry",
        language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
        components: [{
          type: "body",
          parameters: [p(e.name), p(e.phone), p(e.email || "Not given"), p(e.age), p(e.experience), p(e.message)],
        }],
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`WhatsApp Cloud API ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try { raw = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 }); }

  // honeypot: real people never see or fill this field
  if (raw.website) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many enquiries. Please try again later." }, { status: 429 });

  const parsed = parseEnquiry(raw);
  if ("error" in parsed) return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });

  const { CALLMEBOT_APIKEY, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  try {
    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID) await viaCloudApi(parsed, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID);
    else if (CALLMEBOT_APIKEY) await viaCallMeBot(enquiryText(parsed, site.guru), CALLMEBOT_APIKEY);
    else return NextResponse.json({ ok: false, fallback: true, error: "Direct sending is not set up." }, { status: 503 });
  } catch (err) {
    console.error("[enquiry] send failed:", err);
    return NextResponse.json({ ok: false, fallback: true, error: "Could not send right now." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

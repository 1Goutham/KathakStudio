"use client";
import { useState, type FormEvent } from "react";
import { site, whatsappLink } from "@/lib/content";
import { AGE_GROUPS, EXPERIENCE, enquiryText, type Enquiry } from "@/lib/enquiry";

// Posts to /api/enquiry, which sends the introduction straight to the studio's WhatsApp.
// If direct sending is not configured or fails, the visitor gets a one-tap WhatsApp link instead.
type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback"; url: string }
  | { kind: "error"; message: string };

export default function EnquiryForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries()) as Record<string, string>;
    const enquiry: Enquiry = {
      name: data.name?.trim() || "", phone: data.phone?.trim() || "", email: data.email?.trim() || "",
      age: data.age || "", experience: data.experience || "", message: data.message?.trim() || "",
    };
    const fallbackUrl = whatsappLink(enquiryText(enquiry, site.guru));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) return setState({ kind: "sent" });
      if (out.fallback || res.status >= 500) return setState({ kind: "fallback", url: fallbackUrl });
      setState({ kind: "error", message: out.error || "Something went wrong. Please try again." });
    } catch {
      setState({ kind: "fallback", url: fallbackUrl });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="form-card"><div className="form-done" role="status">
        <h3>Thank you.</h3>
        <p>Your introduction has reached {site.guru} on WhatsApp. She will reply personally to invite you to observe a class.</p>
        <button className="btn btn-ghost" onClick={() => setState({ kind: "idle" })}>Send another</button>
      </div></div>
    );
  }

  if (state.kind === "fallback") {
    return (
      <div className="form-card"><div className="form-done" role="status">
        <h3>One last tap.</h3>
        <p>We couldn&apos;t deliver it automatically just now. Your message is ready in WhatsApp; press send and it goes straight to {site.guru}.</p>
        <a className="btn" href={state.url} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
        <button className="btn btn-ghost" onClick={() => setState({ kind: "idle" })}>Back</button>
      </div></div>
    );
  }

  const sending = state.kind === "sending";
  return (
    <div className="form-card"><form className="form-body" onSubmit={handleSubmit}>
      <h3>Introduce yourself</h3>
      {/* honeypot for bots: hidden from people and screen readers */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <div className="field-row">
        <label>Your name<input name="name" required maxLength={80} autoComplete="name" /></label>
        <label>Phone / WhatsApp<input name="phone" required type="tel" maxLength={24} autoComplete="tel" /></label>
      </div>
      <label>Email (optional)<input name="email" type="email" maxLength={120} autoComplete="email" /></label>
      <div className="field-row">
        <label>Age group
          <select name="age" defaultValue="Adult (18+)">
            {AGE_GROUPS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <label>Dance experience
          <select name="experience" defaultValue={EXPERIENCE[0]}>
            {EXPERIENCE.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>
      <label>What brings you to Tribhang?<textarea name="message" rows={4} required maxLength={1200} placeholder="Share as much or as little as you like…" /></label>
      {state.kind === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <button type="submit" className="btn" disabled={sending}>{sending ? "Sending…" : "Send my introduction"}</button>
      <p className="form-note">Goes straight to {site.guru}&apos;s WhatsApp.</p>
    </form></div>
  );
}

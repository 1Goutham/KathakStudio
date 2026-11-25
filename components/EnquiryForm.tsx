"use client";
import { useState, type FormEvent } from "react";
import { site, whatsappLink } from "@/lib/content";
import { AGE_GROUPS, EXPERIENCE, enquiryText, type Enquiry } from "@/lib/enquiry";

// Opens WhatsApp with the introduction ready to send to the studio number.
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const enquiry: Enquiry = {
      name: d.name?.trim() || "", phone: d.phone?.trim() || "", email: d.email?.trim() || "",
      age: d.age || "", experience: d.experience || "", message: d.message?.trim() || "",
    };
    const url = whatsappLink(enquiryText(enquiry, site.guru));
    // New tab where allowed; if a popup blocker stops it, open WhatsApp in this tab instead.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.href = url;
    setSent(true);
  }

  // The outer .form-card stays the same element in both states so the scroll reveal never hides it.
  if (sent) {
    return (
      <div className="form-card"><div className="form-done" role="status">
        <h3>Thank you.</h3>
        <p>Your introduction is ready in WhatsApp. Press send and it goes straight to {site.guru}, who will reply personally to invite you to observe a class.</p>
        <button className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button>
      </div></div>
    );
  }

  return (
    <div className="form-card"><form className="form-body" onSubmit={handleSubmit}>
      <h3>Introduce yourself</h3>
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
      <button type="submit" className="btn">Send my introduction</button>
      <p className="form-note">Opens WhatsApp with your message ready to send.</p>
    </form></div>
  );
}

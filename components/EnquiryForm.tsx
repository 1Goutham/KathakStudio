"use client";
import { useState, type FormEvent } from "react";
import { site, whatsappLink } from "@/lib/content";

// Sends the introduction via WhatsApp so no backend is required.
// Swap handleSubmit for an API route / form service if you prefer email.
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const text = [
      `Namaste ${site.guru},`,
      ``,
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      ...(email ? [`Email: ${email}`] : []),
      `Age group: ${f.get("age")}`,
      `Dance experience: ${f.get("experience")}`,
      ``,
      `${f.get("message")}`,
    ].join("\n");
    const url = whatsappLink(text);
    // New tab where allowed; if a popup blocker stops it, open WhatsApp in this tab instead.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.href = url;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-card form-done">
        <h3>Thank you.</h3>
        <p>Your introduction is on its way to {site.guru}. She will reply personally to invite you to observe a class.</p>
        <button className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Introduce yourself</h3>
      <div className="field-row">
        <label>Your name<input name="name" required autoComplete="name" /></label>
        <label>Phone / WhatsApp<input name="phone" required type="tel" autoComplete="tel" /></label>
      </div>
      <label>Email (optional)<input name="email" type="email" autoComplete="email" /></label>
      <div className="field-row">
        <label>Age group
          <select name="age" defaultValue="Adult (18+)">
            <option>Child (5 to 12)</option>
            <option>Teen (13 to 17)</option>
            <option>Adult (18+)</option>
          </select>
        </label>
        <label>Dance experience
          <select name="experience" defaultValue="None, complete beginner">
            <option>None, complete beginner</option>
            <option>Some, a little training</option>
            <option>Trained, returning to Kathak</option>
          </select>
        </label>
      </div>
      <label>What brings you to Tribhang?<textarea name="message" rows={4} required placeholder="Share as much or as little as you like…" /></label>
      <button type="submit" className="btn">Send my introduction</button>
      <p className="form-note">Opens WhatsApp with your message ready to send.</p>
    </form>
  );
}

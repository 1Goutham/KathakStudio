// Shared by the enquiry form (client) and the /api/enquiry route (server).

export const AGE_GROUPS = ["Child (5 to 12)", "Teen (13 to 17)", "Adult (18+)"] as const;
export const EXPERIENCE = ["None, complete beginner", "Some, a little training", "Trained, returning to Kathak"] as const;

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  age: string;
  experience: string;
  message: string;
};

const clean = (v: unknown, max: number) =>
  String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);

/** Validates and normalises raw input. Returns an error message instead when it is not usable. */
export function parseEnquiry(raw: Record<string, unknown>): Enquiry | { error: string } {
  const e: Enquiry = {
    name: clean(raw.name, 80),
    phone: clean(raw.phone, 24),
    email: clean(raw.email, 120),
    age: clean(raw.age, 40),
    experience: clean(raw.experience, 60),
    message: clean(raw.message, 1200),
  };
  if (!e.name) return { error: "Please add your name." };
  if (!/^[+\d][\d\s()-]{6,22}$/.test(e.phone)) return { error: "Please add a valid phone number." };
  if (e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) return { error: "Please check your email address." };
  if (!(AGE_GROUPS as readonly string[]).includes(e.age)) e.age = "Not given";
  if (!(EXPERIENCE as readonly string[]).includes(e.experience)) e.experience = "Not given";
  if (!e.message) return { error: "Please tell us a little about what brings you here." };
  return e;
}

export function enquiryText(e: Enquiry, guru: string) {
  return [
    `Namaste ${guru},`,
    ``,
    `Name: ${e.name}`,
    `Phone: ${e.phone}`,
    ...(e.email ? [`Email: ${e.email}`] : []),
    `Age group: ${e.age}`,
    `Dance experience: ${e.experience}`,
    ``,
    e.message,
  ].join("\n");
}

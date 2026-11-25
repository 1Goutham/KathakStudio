// Options and message layout for the enquiry form.

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

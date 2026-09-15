/**
 * Single place to configure the salon chat backend.
 * Override at build time with VITE_CHAT_WEBHOOK_URL.
 */
export const CHAT_WEBHOOK_URL: string =
  import.meta.env["VITE_CHAT_WEBHOOK_URL"] ??
  "http://localhost:5678/webhook/67f3b3b4-ed8a-419b-9c2f-fe7eff6b7745";

export const SALON_NAME = "Aura Beauty Salon";
export const SALON_TAGLINE = "Hair · Skin · Nails · Spa";
export const ASSISTANT_NAME = "Aura";

/** Tone guidance for the booking assistant. */
export const ASSISTANT_SYSTEM_INSTRUCTIONS =
  `You are ${ASSISTANT_NAME}, the warm and courteous booking assistant for ${SALON_NAME}. ` +
  "Help guests choose a service, collect their name and phone number, and confirm an appointment time.";

export const WELCOME_MESSAGE =
  `Welcome to **${SALON_NAME}** — I'm ${ASSISTANT_NAME}, your booking assistant. ` +
  "Tell me which service you'd like and a day that suits you — I'll take your name and number and get you booked in.";

export interface SalonService {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

export const SALON_SERVICES: SalonService[] = [
  {
    id: "cut-style",
    name: "Cut & Style",
    duration: "45 min",
    price: "$45",
    description: "Precision cut with a blow-dry finish.",
  },
  {
    id: "colour",
    name: "Colour & Balayage",
    duration: "2 hr",
    price: "$140",
    description: "Hand-painted, sun-kissed dimension.",
  },
  {
    id: "facial",
    name: "Signature Facial",
    duration: "60 min",
    price: "$85",
    description: "Deep cleanse, exfoliation and glow.",
  },
  {
    id: "nails",
    name: "Gel Manicure",
    duration: "40 min",
    price: "$38",
    description: "Long-lasting shine, shaped to perfection.",
  },
  {
    id: "spa",
    name: "Relax Massage",
    duration: "60 min",
    price: "$95",
    description: "Full-body aromatherapy unwind.",
  },
  {
    id: "makeup",
    name: "Event Makeup",
    duration: "50 min",
    price: "$70",
    description: "Camera-ready looks for any occasion.",
  },
];

export const SUGGESTED_PROMPTS = [
  "Book a cut & style this Saturday",
  "What time can I get a facial tomorrow?",
  "How much is balayage?",
  "Do you have evening appointments?",
];

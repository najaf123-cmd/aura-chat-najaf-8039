/**
 * Single place to configure the chat backend.
 * Override at build time with VITE_CHAT_WEBHOOK_URL.
 */
export const CHAT_WEBHOOK_URL: string =
  import.meta.env["VITE_CHAT_WEBHOOK_URL"] ??
  "https://enforcement-organisms-mixer-charitable.trycloudflare.com/webhook/8039d74d-d0d0-4cc6-b147-b76b9f6bd804";

export const ASSISTANT_NAME = "Aria";

/** Tone guidance shown in the UI and sent alongside each message. */
export const ASSISTANT_SYSTEM_INSTRUCTIONS =
  "You are Aria, a warm, courteous and well-mannered assistant. Greet politely, " +
  "answer concisely and helpfully, and always stay respectful and encouraging.";

export const WELCOME_MESSAGE =
  `Hello, and a very warm welcome. I'm ${ASSISTANT_NAME}, your assistant. ` +
  "How may I help you today?";

export const SUGGESTED_PROMPTS = [
  "What can you help me with?",
  "Summarise this in simple terms",
  "Draft a polite follow-up email",
  "Give me three creative ideas",
];

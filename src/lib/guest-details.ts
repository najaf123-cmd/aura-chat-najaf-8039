/**
 * Best-effort extraction of a guest's name and phone number from a chat message,
 * so details can be collected naturally in conversation.
 */
export interface GuestDetails {
  name?: string;
  phone?: string;
}

const NAME_PATTERNS = [
  /\bmy name is\s+([a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*)?)/i,
  /\bi am\s+([a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*)?)/i,
  /\bi'm\s+([a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*)?)/i,
  /\bthis is\s+([a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*)?)/i,
  /\bname'?s?\s*[:\-]\s*([a-z][a-z'’-]*(?:\s+[a-z][a-z'’-]*)?)/i,
];

const PHONE_PATTERN = /(\+?\d[\d\s().-]{6,}\d)/;

const NON_NAMES = new Set([
  "looking",
  "interested",
  "free",
  "available",
  "not",
  "just",
  "going",
  "trying",
  "wondering",
  "here",
  "ready",
]);

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function extractGuestDetails(message: string): GuestDetails {
  const details: GuestDetails = {};

  const phoneMatch = PHONE_PATTERN.exec(message);
  if (phoneMatch?.[1]) {
    const digits = phoneMatch[1].replace(/[^\d+]/g, "");
    if (digits.replace(/\D/g, "").length >= 7) {
      details.phone = phoneMatch[1].trim();
    }
  }

  for (const pattern of NAME_PATTERNS) {
    const match = pattern.exec(message);
    const candidate = match?.[1]?.trim();
    if (!candidate) continue;
    const firstWord = candidate.split(/\s+/)[0]?.toLowerCase() ?? "";
    if (NON_NAMES.has(firstWord)) continue;
    details.name = titleCase(candidate);
    break;
  }

  return details;
}

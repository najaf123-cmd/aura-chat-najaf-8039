/**
 * Robustly extract a human-readable answer from an n8n webhook response.
 * Handles JSON objects, arrays, nested `data`/`json`/`output` wrappers and plain text.
 */
const PREFERRED_KEYS = [
  "answer",
  "response",
  "message",
  "output",
  "text",
  "reply",
  "content",
  "result",
];

function fromUnknown(value: unknown, depth = 0): string | null {
  if (depth > 6 || value == null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = fromUnknown(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of PREFERRED_KEYS) {
      if (key in record) {
        const found = fromUnknown(record[key], depth + 1);
        if (found) return found;
      }
    }

    for (const key of ["data", "json", "body", "choices", "results"]) {
      if (key in record) {
        const found = fromUnknown(record[key], depth + 1);
        if (found) return found;
      }
    }

    // Fall back to the first useful string field.
    for (const nested of Object.values(record)) {
      const found = fromUnknown(nested, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

export function extractAnswer(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "I received an empty reply. Would you mind trying again?";
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    return (
      fromUnknown(parsed) ??
      "I received a reply I couldn't quite read. Could you please rephrase?"
    );
  } catch {
    return trimmed;
  }
}

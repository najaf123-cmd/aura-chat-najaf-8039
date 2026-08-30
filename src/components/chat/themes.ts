export type ChatThemeId = "aurora" | "nebula" | "verdant";

export interface ChatTheme {
  id: ChatThemeId;
  name: string;
  description: string;
  /** Preview swatch colors (raw values, used only inside the switcher dot). */
  swatch: [string, string];
}

export const CHAT_THEMES: ChatTheme[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Indigo and cyan",
    swatch: ["oklch(0.64 0.19 275)", "oklch(0.79 0.14 200)"],
  },
  {
    id: "nebula",
    name: "Nebula",
    description: "Purple and pink",
    swatch: ["oklch(0.62 0.22 310)", "oklch(0.74 0.19 5)"],
  },
  {
    id: "verdant",
    name: "Verdant",
    description: "Emerald and blue",
    swatch: ["oklch(0.68 0.15 168)", "oklch(0.68 0.15 240)"],
  },
];

export const DEFAULT_THEME: ChatThemeId = "aurora";

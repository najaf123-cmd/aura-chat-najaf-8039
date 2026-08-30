import { CHAT_THEMES, type ChatThemeId } from "./themes";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  value: ChatThemeId;
  onChange: (id: ChatThemeId) => void;
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="glass-panel flex items-center gap-1 rounded-full p-1"
    >
      {CHAT_THEMES.map((theme) => {
        const active = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${theme.name} theme — ${theme.description}`}
            title={`${theme.name} — ${theme.description}`}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative flex size-8 items-center justify-center rounded-full transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active ? "scale-105 bg-accent" : "hover:bg-accent/60",
            )}
          >
            <span
              className={cn(
                "size-4 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110",
                active && "ring-2 ring-foreground/70",
              )}
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.swatch[0]}, ${theme.swatch[1]})`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

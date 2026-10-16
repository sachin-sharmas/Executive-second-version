import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Green theme candidates. Each id maps to a `:root[data-theme="…"]` block in
 * src/styles.css (the first one is the `:root` default). The picker below is a
 * review aid so the team can compare variants live — once a winner is chosen,
 * promote its block to `:root`, drop the others and remove <ThemePicker />.
 */
export const THEMES = [
  { id: "forest", name: "Forest", note: "deep green · gold accent" },
  { id: "emerald", name: "Emerald", note: "vivid green · coral accent" },
  { id: "pine", name: "Pine", note: "blue-green · royal blue accent" },
  { id: "olive", name: "Olive", note: "earthy green · terracotta accent" },
  { id: "spring", name: "Spring", note: "bright green · orange accent" },
  { id: "blush", name: "Blush", note: "baby pink · deep rose" },
  { id: "mint", name: "Mint", note: "light green · deep green" },
  { id: "skyblue", name: "Sky", note: "baby blue · navy" },
  { id: "peach", name: "Peach", note: "soft peach · burnt orange" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const KEY = "averon-deck-theme";
const DEFAULT: ThemeId = "forest";

function isThemeId(v: unknown): v is ThemeId {
  return THEMES.some((t) => t.id === v);
}

function apply(id: ThemeId) {
  const root = document.documentElement;
  if (id === DEFAULT) delete root.dataset.theme;
  else root.dataset.theme = id;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT);

  // Restore the last previewed theme after hydration.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (isThemeId(saved)) {
        setTheme(saved);
        apply(saved);
      }
    } catch {
      /* storage unavailable — stay on default */
    }
  }, []);

  const select = (id: ThemeId) => {
    setTheme(id);
    apply(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  };

  // Keys 1–9 switch themes from anywhere in the deck.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= THEMES.length) select(THEMES[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { theme, select };
}

export function ThemePicker() {
  const { theme, select } = useTheme();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-[2vh] left-[1.4vw] z-50 flex items-end gap-2 font-sans text-[13px] text-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full border border-white/30 bg-black/55 px-3 py-1.5 backdrop-blur-sm hover:bg-black/70"
      >
        Theme: <b>{THEMES.find((t) => t.id === theme)?.name}</b> {open ? "▾" : "▸"}
      </button>
      {open ? (
        <div className="flex flex-col gap-1 rounded-lg border border-white/25 bg-black/60 p-2 backdrop-blur-sm">
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(t.id)}
              aria-pressed={theme === t.id}
              className={cn(
                "flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/10",
                theme === t.id && "bg-white/15",
              )}
            >
              <span
                className="h-4 w-4 shrink-0 rounded-sm border border-white/40"
                style={{ background: SWATCH[t.id] }}
              />
              <span className="w-[14ch]">
                <kbd className="mr-1 opacity-60">{i + 1}</kbd>
                {t.name}
              </span>
              <span className="opacity-60">{t.note}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* Static swatches so the picker previews each option regardless of the active theme. */
const SWATCH: Record<ThemeId, string> = {
  forest: "linear-gradient(135deg, oklch(0.48 0.13 155) 60%, oklch(0.64 0.15 72) 60%)",
  emerald: "linear-gradient(135deg, oklch(0.55 0.15 160) 60%, oklch(0.62 0.21 30) 60%)",
  pine: "linear-gradient(135deg, oklch(0.50 0.10 182) 60%, oklch(0.50 0.19 262) 60%)",
  olive: "linear-gradient(135deg, oklch(0.50 0.12 135) 60%, oklch(0.63 0.17 45) 60%)",
  spring: "linear-gradient(135deg, oklch(0.60 0.17 152) 60%, oklch(0.65 0.19 50) 60%)",
  blush: "linear-gradient(135deg, oklch(0.91 0.045 10) 60%, oklch(0.52 0.17 5) 60%)",
  mint: "linear-gradient(135deg, oklch(0.93 0.05 160) 60%, oklch(0.48 0.12 160) 60%)",
  skyblue: "linear-gradient(135deg, oklch(0.93 0.035 235) 60%, oklch(0.46 0.13 250) 60%)",
  peach: "linear-gradient(135deg, oklch(0.94 0.045 60) 60%, oklch(0.52 0.15 45) 60%)",
};

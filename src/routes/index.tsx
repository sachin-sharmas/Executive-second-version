import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SLIDES } from "@/deck/slides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMEA Strategy Review | Averon" },
      {
        name: "description",
        content:
          "Interactive EMEA Strategy Review: right-sizing the Averon EMEA organization, break-even analysis, pricing and FTE scenarios.",
      },
      { property: "og:title", content: "EMEA Strategy Review | Averon" },
      {
        property: "og:description",
        content:
          "Interactive EMEA Strategy Review: right-sizing the Averon EMEA organization, break-even analysis, pricing and FTE scenarios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);

  const onActive = useCallback((i: number) => setCurrent(i), []);

  const goTo = useCallback((i: number) => {
    const el = document.getElementById(SLIDES[i]?.id ?? "");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(Math.min(current + 1, SLIDES.length - 1));
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(Math.max(current - 1, 0));
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(SLIDES.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  return (
    <main className="relative -left-[2px] -top-px h-screen w-full">
      <div
        ref={scrollerRef}
        className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {SLIDES.map(({ id, C }, i) => (
          <C key={id} index={i} total={SLIDES.length} onActive={onActive} />
        ))}
      </div>

      <nav
        aria-label="Slide navigation"
        className="fixed right-[1.4vw] top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 mix-blend-difference md:flex"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={s.label}
            aria-current={current === i}
            className="group flex items-center gap-3"
          >
            <span
              className={cn(
                "deck-note whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                "text-white",
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "block h-[2px] transition-all duration-300",
                current === i ? "w-[38px] bg-white" : "w-[16px] bg-white/45 group-hover:w-[26px]",
              )}
            />
          </button>
        ))}
      </nav>

      <div className="pointer-events-none fixed bottom-0 left-0 z-50 h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-magenta transition-[width] duration-500"
          style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
    </main>
  );
}

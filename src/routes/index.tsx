import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { cn } from "@/lib/utils";
import { SLIDES } from "@/deck/slides";
import { ThemePicker } from "@/deck/theme";

/** Set to true to bring back the live palette picker while reviewing themes. */
const THEME_REVIEW = false;

/** Duration of one slide-to-slide move. */
const SLIDE_MS = 900;
/** After a move lands, wheel input is ignored this long so inertia can't double-step. */
const WHEEL_COOLDOWN_MS = 250;
/** Accumulated wheel delta (px) that counts as "one notch". */
const WHEEL_THRESHOLD = 40;
/** Minimum vertical swipe (px) to change slide on touch. */
const SWIPE_THRESHOLD = 50;

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [current, setCurrent] = useState(0);

  // The slide the deck is resting on or travelling to. Keys and wheel step from
  // this, not from `current`, so quick presses never target a stale slide.
  const targetRef = useRef(0);
  // True while a wheel/swipe-triggered move is in flight — later wheel ticks
  // from the same gesture (trackpad inertia) are ignored until it settles.
  const busyRef = useRef(false);

  const onActive = useCallback((i: number) => setCurrent(i), []);

  // The slide elements are created once. `current` changes mid-scroll, and if
  // the slides were re-created on every render React would re-render all 11
  // (including the large tables) in the middle of the move — a visible stall.
  const slides = useMemo(
    () =>
      SLIDES.map(({ id, C }, i) => (
        <C key={id} index={i} total={SLIDES.length} onActive={onActive} />
      )),
    [onActive],
  );

  // Lenis only animates programmatic moves: the wrapper's overflow is hidden so
  // the browser never free-scrolls it, and every wheel tick, swipe or key press
  // becomes one scrollTo() that lands exactly on a slide edge.
  useEffect(() => {
    const wrapper = scrollerRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: SLIDE_MS / 1000,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: false,
      syncTouch: false,
      autoRaf: true,
    });
    lenis.stop(); // no user-driven scrolling; scrollTo(..., { force: true }) still runs
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const goTo = useCallback((i: number, opts?: { immediate?: boolean }) => {
    const idx = Math.max(0, Math.min(SLIDES.length - 1, i));
    const el = document.getElementById(SLIDES[idx]?.id ?? "");
    if (!el) return;
    targetRef.current = idx;
    const lenis = lenisRef.current;
    if (!lenis) {
      el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth", block: "start" });
      return;
    }
    busyRef.current = true;
    const release = () => {
      busyRef.current = false;
    };
    // Safety net in case onComplete never fires (e.g. already at the target).
    const timer = setTimeout(release, SLIDE_MS + 150);
    lenis.scrollTo(el, {
      force: true,
      lock: true,
      immediate: opts?.immediate,
      duration: SLIDE_MS / 1000,
      onComplete: () => {
        clearTimeout(timer);
        // Let trackpad inertia from the triggering gesture die down first.
        setTimeout(release, WHEEL_COOLDOWN_MS);
      },
    });
  }, []);

  // Wheel: one slide per gesture. Small deltas accumulate so a light trackpad
  // flick still counts, and anything arriving mid-move is swallowed.
  useEffect(() => {
    const wrapper = scrollerRef.current;
    if (!wrapper) return;
    let acc = 0;
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (busyRef.current) return;
      const now = performance.now();
      if (now - last > 200) acc = 0;
      last = now;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      acc += dy;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      goTo(targetRef.current + dir);
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Touch: a vertical swipe moves one slide.
  useEffect(() => {
    const wrapper = scrollerRef.current;
    if (!wrapper) return;
    let startY: number | null = null;
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? null;
    };
    const onMove = (e: TouchEvent) => {
      // Keep the browser from panning the (overflow-hidden) wrapper or the page.
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      if (startY === null) return;
      const dy = startY - (e.changedTouches[0]?.clientY ?? startY);
      startY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD || busyRef.current) return;
      goTo(targetRef.current + (dy > 0 ? 1 : -1));
    };
    wrapper.addEventListener("touchstart", onStart, { passive: true });
    wrapper.addEventListener("touchmove", onMove, { passive: false });
    wrapper.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      wrapper.removeEventListener("touchstart", onStart);
      wrapper.removeEventListener("touchmove", onMove);
      wrapper.removeEventListener("touchend", onEnd);
    };
  }, [goTo]);

  // Keys always act, even mid-move: Lenis simply retargets the animation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Holding a key down must not race through the deck: one press, one slide.
      if (e.repeat) {
        e.preventDefault();
        return;
      }
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(targetRef.current + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(targetRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDES.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // A resize changes every slide's offset, and a background tab pauses the
  // animation clock; in both cases re-align to the target slide so the
  // viewport never rests across two slides.
  useEffect(() => {
    const realign = () => goTo(targetRef.current, { immediate: true });
    const onVisibility = () => {
      if (document.visibilityState === "visible") realign();
    };
    window.addEventListener("resize", realign);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("resize", realign);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [goTo]);

  return (
    <main className="relative -left-[2px] -top-px h-screen w-full">
      <div ref={scrollerRef} className="h-screen w-full overflow-hidden">
        <div ref={contentRef}>{slides}</div>
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

      {/* Review aid: live theme switcher (keys 1–9). Off now that the reference
          palette has been adopted; src/deck/theme.tsx can be deleted. */}
      {THEME_REVIEW ? <ThemePicker /> : null}
    </main>
  );
}

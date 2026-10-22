import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { A } from "./assets";
import type { Row } from "./data";

/** Below Tailwind's `md` breakpoint the deck is a normal scrolling page (see deck.tsx). */
export const MOBILE_QUERY = "(max-width: 767.98px)";

const ActiveCtx = createContext(false);
export const useActive = () => useContext(ActiveCtx);

type Anim = "rise" | "fade" | "wipe" | "wipeY" | "mask" | "grow";

const animClass: Record<Anim, string> = {
  rise: "anim-rise",
  fade: "anim-fade",
  wipe: "anim-wipe",
  wipeY: "anim-wipe-y",
  mask: "anim-mask",
  grow: "anim-grow-x",
};

export function R({
  children,
  d = 0,
  a = "rise",
  className,
  style,
}: {
  children: ReactNode;
  d?: number;
  a?: Anim;
  className?: string;
  style?: CSSProperties;
}) {
  const active = useActive();
  return (
    <div
      className={cn(className, active ? animClass[a] : "opacity-0")}
      style={{ animationDelay: `${d * 90}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/** Phones: lets a wide table keep its desktop column layout and pan sideways
 *  instead of being squeezed. No-op from `md` up. */
export function MobileScroll({
  minWidth,
  children,
  className,
}: {
  /** Natural width (px) the content needs on a phone. */
  minWidth: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("md:contents max-md:w-full max-md:min-w-0 max-md:overflow-x-auto max-md:pb-1", className)}>
      <div style={{ ["--mobile-min" as string]: `${minWidth}px` }} className="md:contents max-md:min-w-[var(--mobile-min)]">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Slide shell ---------------- */

export function Slide({
  id,
  index,
  total,
  tone = "light",
  title,
  children,
  footnote,
  onActive,
  className,
  patch,
  bg,
  bgPosition = "right center",
  bgBrand = false,
}: {
  id: string;
  index: number;
  total: number;
  /** light: paper. dark: violet gradient — darkened for legibility when the
   *  slide carries content, the full bright gradient when it carries `bg`
   *  artwork. band: the chapter-divider gradient. */
  tone?: "light" | "dark" | "band";
  title?: ReactNode;
  children: ReactNode;
  footnote?: ReactNode;
  onActive: (i: number) => void;
  className?: string;
  patch?: boolean;
  /** Full-bleed background image, rendered behind everything at the slide-section level
   *  (outside the padded content area) so it reaches the true edges of the slide. */
  bg?: string;
  /** CSS background-position for `bg` — anchor this at whichever corner holds the
   *  image's important detail, so cover-cropping eats into the plain area instead. */
  bgPosition?: string;
  /** `bg` is brand artwork — render it as a luminosity pattern over the slide
   *  gradient (`--img-filter` / `--img-opacity` in styles.css) so the gradient
   *  supplies the colour. Leave off for photos. */
  bgBrand?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(index === 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        // On phones a slide can be taller than the screen, so its visible ratio may
        // never reach 0.55 — count it as current once it fills half the viewport.
        const phone = window.matchMedia(MOBILE_QUERY).matches;
        const visible = phone
          ? e.intersectionRect.height >= Math.min(window.innerHeight * 0.5, e.boundingClientRect.height * 0.55)
          : e.intersectionRatio > 0.55;
        if (visible) {
          setActive(true);
          onActive(index);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  const dark = tone !== "light";

  return (
    <ActiveCtx.Provider value={active}>
      <section
        id={id}
        ref={ref}
        className={cn(
          "relative isolate flex h-screen w-full shrink-0 snap-start flex-col overflow-hidden max-md:h-auto max-md:min-h-dvh max-md:snap-always",
          tone === "light" && "bg-background text-foreground",
          tone === "dark" && (bg ? "surface-dark" : "surface-readable"),
          tone === "band" && "surface-band",
          className,
        )}
      >
        {bg ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: bgPosition,
              backgroundRepeat: "no-repeat",
              filter: bgBrand ? "var(--img-filter)" : undefined,
              opacity: bgBrand ? "var(--img-opacity)" : undefined,
              mixBlendMode: bgBrand ? "luminosity" : undefined,
            }}
          />
        ) : null}
        {patch ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[12px]">
            <span className="flex-[7] bg-brand" />
            <span className="flex-[2] bg-magenta" />
            <span className="flex-[1.3] bg-sky" />
            <span className="flex-[1] bg-leaf" />
          </div>
        ) : null}
        <header
          className={cn(
            "relative z-20 flex items-center justify-between pl-[4vw] pr-[6vw] max-md:px-4",
            patch ? "pt-[2.6vh] max-md:pt-6" : "pt-[2vh] max-md:pt-4",
          )}
        >
          {/* The logo SVG is white; paint it through a mask so it reads as
              brand violet on light slides and --on-dark on dark ones. */}
          <span
            role="img"
            aria-label="Averon"
            className={cn("logo-mark h-[24px] md:h-[28px]", dark ? "bg-on-dark" : "bg-brand")}
            style={{ maskImage: `url(${A.logo})`, WebkitMaskImage: `url(${A.logo})` }}
          />
          <span
            className={cn(
              "deck-note tabular",
              dark ? "text-on-dark/60" : "text-ink-soft",
            )}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </header>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pl-[4vw] pr-[6vw] pb-[2vh] pt-[1.2vh] max-md:overflow-visible max-md:px-4 max-md:pb-20 max-md:pt-3">
          {title ? (
            <R a="rise">
              <h2
                className={cn(
                  "deck-title max-w-[92%] text-balance max-md:max-w-full",
                  dark ? "text-on-dark" : "text-brand",
                )}
              >
                {title}
              </h2>
            </R>
          ) : null}
          <div className="mt-[1.6vh] flex min-h-0 flex-1 flex-col overflow-hidden max-md:mt-5 max-md:overflow-visible">
            {children}
          </div>
          {footnote ? (
            <R d={6} a="fade">
              <p className={cn("deck-note pt-[1.2vh] max-md:pt-4", dark && "text-on-dark/55")}>{footnote}</p>
            </R>
          ) : null}
        </div>
      </section>
    </ActiveCtx.Provider>
  );
}


/* ---------------- Bullets ---------------- */

export type BulletItem = ReactNode | { text: ReactNode; sub?: boolean };

export function Bullets({
  items,
  dark,
  start = 1,
  className,
}: {
  items: BulletItem[];
  dark?: boolean;
  start?: number;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-[1.15vh] max-md:space-y-3", className)}>
      {items.map((raw, i) => {
        const obj =
          raw && typeof raw === "object" && "text" in (raw as Record<string, unknown>)
            ? (raw as { text: ReactNode; sub?: boolean })
            : { text: raw as ReactNode, sub: false };
        return (
          <R key={i} d={start + i} a="rise">
            <li className={cn("flex gap-3.5", obj.sub && "pl-[2.2vw] max-md:pl-4")}>
              <span
                className={cn(
                  "mt-[0.6em] shrink-0 rotate-45",
                  obj.sub ? "h-[7px] w-[7px]" : "h-[9px] w-[9px]",
                  dark ? "bg-sky-light" : obj.sub ? "bg-brand-mid" : "bg-magenta",
                )}
              />
              <span
                className={cn(
                  obj.sub ? "deck-small" : "deck-body",
                  dark ? "text-on-dark/90" : "text-ink",
                )}
              >
                {obj.text}
              </span>
            </li>
          </R>
        );
      })}
    </ul>
  );
}

/* ---------------- Data table ---------------- */

export function DataTable({
  columns,
  rows,
  dark,
  firstColLabel = "",
  colWidth = "minmax(52px, 1fr)",
  labelWidth = "minmax(150px, 1.6fr)",
  mobileColWidth = "minmax(44px, 1fr)",
  mobileLabelWidth = "minmax(112px, 1.4fr)",
  activeCol,
  onColHover,
  flags,
  compact,
  dense,
  fill,
  stagger = true,
  headerBar,
  indent,
  boxes,
  boxDelay,
  boxDuration = "0.5s",
  highlight,
  shadeRows,
  accentRows,
  valueAlign,
}: {
  columns: string[];
  rows: Row[];
  dark?: boolean;
  firstColLabel?: string;
  colWidth?: string;
  labelWidth?: string;
  /** Column templates used on phones, where the table sits inside a `MobileScroll`. */
  mobileColWidth?: string;
  mobileLabelWidth?: string;
  activeCol?: number | null;
  onColHover?: (i: number | null) => void;
  flags?: Record<string, string>;
  compact?: boolean;
  /** Tighter padding + smaller type for packing many rows on one slide. */
  dense?: boolean;
  /** Stretch the table to the full available height, distributing row space evenly. */
  fill?: boolean;
  stagger?: boolean;
  headerBar?: boolean;
  indent?: string[];
  boxes?: Record<string, number[][]>;
  /** Delay (R's `d` units) before box outlines color in, so they read as a
   * distinct "highlight" step after the table itself has finished revealing
   * instead of appearing instantly with the rest of the layout. */
  boxDelay?: number;
  /** How gradually the box outline colors in once boxDelay elapses. */
  boxDuration?: string;
  highlight?: Record<string, number[]>;
  /** Row labels that get a light neutral background band (zebra emphasis). */
  shadeRows?: string[];
  /** Row labels rendered bold in the brand color (label + values), no background. */
  accentRows?: string[];
  /** Text alignment for the data values (not the header or row label). Defaults to right. */
  valueAlign?: "right" | "center";
}) {

  // Desktop and phone templates travel as CSS variables so the breakpoint lives in the class.
  const grid = {
    "--cols-d": `${labelWidth} repeat(${columns.length}, ${colWidth})`,
    "--cols-m": `${mobileLabelWidth} repeat(${columns.length}, ${mobileColWidth})`,
  } as CSSProperties;
  const gridCols = "grid-cols-[var(--cols-d)] max-md:grid-cols-[var(--cols-m)]";

  // Beat between rows, in R's `d` units (1 unit = 90ms) — slow enough that
  // the reveal actually reads as motion rather than everything landing at once.
  const ROW_STEP = 0.9;
  const active = useActive();
  const boxTransitionStyle: CSSProperties | undefined =
    boxDelay !== undefined
      ? {
          transition: `border-color ${boxDuration} ease-out ${boxDelay * 90}ms, background-color ${boxDuration} ease-out ${boxDelay * 90}ms`,
        }
      : undefined;
  const boxOn = boxDelay === undefined || active;

  const cellType = dense ? "deck-cell-dense" : "deck-cell";

  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        fill && "flex h-full min-h-0 flex-col",
        dark ? "text-on-dark" : "text-ink",
      )}
      onMouseLeave={() => onColHover?.(null)}
    >
      <div className={cn("min-w-full", fill && "flex min-h-0 flex-1 flex-col")}>
        <div
          className={cn(
            "grid shrink-0 items-end gap-x-1",
            gridCols,
            headerBar
              ? cn(
                  "bg-brand px-2 text-on-dark",
                  dense ? "py-[0.3vh]" : fill ? "py-[0.55vh]" : "py-[0.7vh] max-md:py-1.5",
                )
              : cn(
                  "border-b-2",
                  dense ? "pb-[0.3vh]" : fill ? "pb-[0.55vh]" : "pb-[0.7vh] max-md:pb-1.5",
                  dark ? "border-on-dark/45" : "border-brand",
                ),
          )}
          style={grid}
        >
          <div
            className={cn(
              cellType,
              "font-bold",
              headerBar ? "text-on-dark" : dark ? "text-on-dark" : "text-brand",
            )}
          >
            {firstColLabel}
          </div>
          {columns.map((c, i) => (
            <div
              key={c + i}
              onMouseEnter={() => onColHover?.(i)}
              className={cn(
                cellType,
                "font-bold tabular transition-colors",
                valueAlign === "center" ? "text-center" : "pr-[0.4vw] text-right",
                headerBar ? "text-on-dark" : dark ? "text-on-dark/80" : "text-brand",
                activeCol === i && (headerBar ? "text-sky-light" : dark ? "text-sky-light" : "text-magenta"),
              )}
            >
              {c}
            </div>
          ))}
        </div>

        {rows.map((row, ri) => {
          if (row.kind === "group") {
            // Keep the flex shell always visible so opacity animation on the
            // label can't collapse/reflow the row (that was flashing the
            // second section title). Animate only the text, same as Revenue.
            const sectionBreak = ri > 0;
            return (
              <div
                key={row.label + ri}
                className={cn(
                  "flex shrink-0 flex-col justify-end",
                  fill && "min-h-0 flex-[0.55_1_0]",
                  sectionBreak && (fill ? "mt-[1.4vh]" : "mt-[1.8vh]"),
                )}
              >
                {stagger ? (
                  <R d={ri * ROW_STEP + 1} a="fade">
                    <div
                      className={cn(
                        cellType,
                        "font-bold uppercase tracking-[0.07em]",
                        dense ? "pt-[0.25vh] pb-[0.1vh]" : "pt-[0.8vh] pb-[0.2vh]",
                        dark ? "text-sky-light" : "text-magenta",
                      )}
                    >
                      {row.label}
                    </div>
                  </R>
                ) : (
                  <div
                    className={cn(
                      cellType,
                      "font-bold uppercase tracking-[0.07em]",
                      dense ? "pt-[0.25vh] pb-[0.1vh]" : "pt-[0.8vh] pb-[0.2vh]",
                      dark ? "text-sky-light" : "text-magenta",
                    )}
                  >
                    {row.label}
                  </div>
                )}
              </div>
            );
          }
          // Cells within a row sweep left-to-right inside that row's own slot
          // (rowSlot = ROW_STEP, same as the row-to-row cadence), so a
          // whole row still lands on schedule while each value pops in on
          // its own beat instead of the row appearing as one flat block.
          const cellTotal = row.values.length + 1;
          const cellDelay = (ci: number) => 1 + ri * ROW_STEP + (ci * ROW_STEP) / cellTotal;
          return (
            <div
              key={row.label + ri}
              className={cn(
                "group grid items-center gap-x-1 border-b transition-colors",
                gridCols,
                fill
                  ? "min-h-0 flex-[1_1_0]"
                  : dense
                    ? "py-[0.06vh] max-md:py-1"
                    : compact
                      ? "py-[0.22vh] max-md:py-1"
                      : "py-[0.5vh] max-md:py-1",
                dark ? "border-on-dark/12 hover:bg-on-dark/8" : "border-rule hover:bg-panel",
                shadeRows?.includes(row.label) && (dark ? "bg-on-dark/5" : "bg-panel"),
                row.kind === "total" &&
                  (dark ? "bg-on-dark/8 font-bold" : "bg-brand/6 font-bold text-brand"),
              )}
              style={grid}
            >
              <div
                className={cn(
                  cellType,
                  "flex items-center gap-2.5 pr-2",
                  indent?.includes(row.label) && "pl-[1.6vw] max-md:pl-3",
                  accentRows?.includes(row.label) && "font-bold text-brand",
                )}
              >
                {stagger ? (
                  <R d={cellDelay(0)} a="fade" className="flex items-center gap-2.5 max-md:gap-1.5">
                    {flags?.[row.label] ? (
                      <img
                        src={flags[row.label]}
                        alt=""
                        className="h-[20px] w-[20px] shrink-0 rounded-full object-cover max-md:h-4 max-md:w-4"
                      />
                    ) : null}
                    <span className="truncate max-md:min-w-0 max-md:overflow-visible max-md:whitespace-normal">
                      {row.label}
                    </span>
                  </R>
                ) : (
                  <>
                    {flags?.[row.label] ? (
                      <img
                        src={flags[row.label]}
                        alt=""
                        className="h-[20px] w-[20px] shrink-0 rounded-full object-cover max-md:h-4 max-md:w-4"
                      />
                    ) : null}
                    <span className="truncate max-md:min-w-0 max-md:overflow-visible max-md:whitespace-normal">
                      {row.label}
                    </span>
                  </>
                )}
              </div>
              {row.values.map((v, ci) => {
                const groups = boxes?.[row.label];
                const box = groups?.find((g) => g.includes(ci));
                const inBox = !!box;
                // A single-column box hugs just the number (content width) instead
                // of stretching to fill the whole (much wider) grid column — matches
                // the source deck, where only multi-column boxes span the full width.
                const isSingleBox = inBox && box!.length === 1;
                const boxMin = box ? Math.min(...box) : -1;
                const boxMax = box ? Math.max(...box) : -1;
                // Only bridge the native grid gap between cells that share the
                // same box group — adjacent-but-separate groups (e.g. a single
                // "current" column next to a 3-column scenario box) must keep a
                // visible gap instead of visually merging into one box.
                const mergeLeft = inBox && !isSingleBox && ci !== boxMin;
                const mergeRight = inBox && !isSingleBox && ci !== boxMax;
                const isHighlighted = highlight?.[row.label]?.includes(ci);
                const content = isSingleBox ? (
                  <span
                    className={cn(
                      "inline-block border-2 px-[0.5vw] py-[0.1vh] max-md:px-1",
                      boxOn ? "border-magenta" : "border-transparent",
                    )}
                    style={boxTransitionStyle}
                  >
                    {v}
                  </span>
                ) : (
                  v
                );
                return (
                  <div
                    key={ci}
                    onMouseEnter={() => onColHover?.(ci)}
                    className={cn(
                      cellType,
                      "tabular transition-colors",
                      valueAlign === "center" ? "text-center" : "pr-[0.4vw] text-right",
                      row.kind === "pct" && (dark ? "text-on-dark/70" : "text-ink-soft"),
                      accentRows?.includes(row.label) && "font-bold text-brand",
                      isHighlighted && "-my-[2px] bg-brand-soft py-[0.2vh]",
                      inBox && !isSingleBox && "border-y-2 px-[2px] py-[0.2vh]",
                      inBox &&
                        !isSingleBox &&
                        (boxOn ? "border-magenta bg-magenta/10" : "border-transparent bg-transparent"),
                      mergeLeft && "-ml-[2px]",
                      mergeRight && "-mr-[2px]",
                      inBox && !isSingleBox && ci === boxMin && "border-l-2",
                      inBox && !isSingleBox && ci === boxMax && "border-r-2",
                      activeCol === ci &&
                        (dark ? "bg-on-dark/12 text-on-dark" : "bg-brand/10 text-brand"),
                    )}
                    style={inBox && !isSingleBox ? boxTransitionStyle : undefined}
                  >
                    {stagger ? (
                      <R d={cellDelay(ci + 1)} a="fade">
                        {content}
                      </R>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}


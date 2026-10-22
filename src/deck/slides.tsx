import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { A, FLAGS } from "./assets";
import {
  CUM_PL,
  CUM_PL_COLS,
  EBITDA_ROWS,
  FTES,
  FTE_COLS,
  FTE_DELTAS,
  NET_SALES,
  PL_2032,
  PRICING,
  YEARS_10,
  YEARS_11,
} from "./data";
import { Bullets, DataTable, MobileScroll, R, Slide, useActive } from "./ui";

type P = { index: number; total: number; onActive: (i: number) => void };

const FOOT = "All figures reflect preliminary thinking & assumptions; to be confirmed";

/* 01 — Cover */
export function SlideCover(p: P) {
  return (
    <Slide id="cover" tone="dark" bg={A.coverHero} bgPosition="right top" bgBrand {...p}>
      <div className="relative flex min-h-0 flex-1 items-center max-md:flex-col max-md:items-start max-md:justify-center">
        <R
          d={2}
          a="fade"
          className="absolute right-0 top-[7vh] z-10 w-[19vw] max-md:static max-md:order-last max-md:mt-10 max-md:w-[44vw]"
        >
          <img src={A.tagline} alt="Forward, together." className="on-dark-img w-full object-contain" />
        </R>
        <div className="relative z-10 max-w-[62vw] max-md:max-w-full">
          <R a="mask">
            <h1 className="deck-title-lg text-on-dark">EMEA Strategy Review</h1>
          </R>
          <R d={4}>
            <p className="deck-body mt-[3vh] text-on-dark/80">August, 2026</p>
          </R>
        </div>
      </div>
    </Slide>
  );
}

/* 02 — Recommendation + NPV donut */
function Donut() {
  const active = useActive();
  const c = 2 * Math.PI * 90;
  const emea = 0.035;
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      {/* Rest of Company sweeps in only its own 96.5% arc — its path is
          rotated to start just past the EMEA sliver's slot, so the sliver's
          empty space at 12 o'clock is reserved for the whole sweep. The
          EMEA sliver draws into that reserved gap as a second step; its
          delay is tuned to when the front-loaded brand-colour sweep LOOKS done
          (its last stretch is an imperceptible crawl), not its nominal
          end time, so the hand-off reads as immediate. The two arcs cover
          disjoint parts of the ring, so the slight overlap in time can
          never make them collide. */}
      <circle
        cx="120"
        cy="120"
        r="90"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="34"
        strokeDasharray={`${c * (1 - emea)} ${c}`}
        strokeDashoffset={active ? 0 : c * (1 - emea)}
        transform={`rotate(${-90 + 360 * emea} 120 120)`}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,0.61,0.24,1) 0.25s" }}
      />
      <circle
        cx="120"
        cy="120"
        r="90"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="34"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={active ? c * (1 - emea) : c}
        transform="rotate(-90 120 120)"
        style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.45,0,0.2,1) 1.3s" }}
      />
      <text
        x="120"
        y="114"
        textAnchor="middle"
        style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 26, fill: "var(--brand)" }}
      >
        $36.9B
      </text>
      <text
        x="120"
        y="144"
        textAnchor="middle"
        style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 26, fill: "var(--brand)" }}
      >
        Total NPV
      </text>
    </svg>
  );
}

export function SlideRecommend(p: P) {
  return (
    <Slide
      id="recommendation"
      tone="light"
      patch
      title="Recommend to right size EMEA organization to reflect the foreseeable opportunity"
      footnote={FOOT}
      {...p}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2.5vw] max-md:gap-8 lg:grid-cols-[1.45fr_1fr]">
        <div className="lg:border-r lg:border-dashed lg:border-rule lg:pr-[2.2vw]">
          <Bullets
            items={[
              "Most Favored Nation (MFN) policy exacerbates a deteriorating European environment for innovative pharmaceuticals",
              "EMEA contributes <5% of total company NPV ($1.3B of $36.9B) but does carry strategic value in KOL relationships, clinical trial access, and regulatory presence",
              {
                sub: true,
                text: (
                  <>
                    Under current structure, financial break-even achievable by 2032 with GTx (not
                    probability adjusted) or 2034 (AERIVAX &amp; ZEVRINA only) –{" "}
                    <em>does not account for MFN impact on US &amp; Japan</em>
                  </>
                ),
              },
              {
                sub: true,
                text: "Unique gene therapy commercialization structure could be built later, if warranted",
              },
            ]}
          />
        </div>
        <div className="flex flex-col items-center">
          <R d={2} a="fade" className="h-[30vh] w-[30vh] max-md:h-[180px] max-md:w-[180px]">
            <Donut />
          </R>
          <R d={4} className="mt-[2vh] space-y-[0.9vh]">
            <p className="deck-small flex items-center gap-3">
              <span className="h-[14px] w-[14px] bg-sky" />
              EMEA: 3.5% ($1.3B)
            </p>
            <p className="deck-small flex items-center gap-3">
              <span className="h-[14px] w-[14px] bg-brand" />
              Rest of Company: 96.5% ($35.6B)
            </p>
          </R>
        </div>
      </div>
    </Slide>
  );
}

/* 03 — Options (flow diagram, matches source) */
// Delays (R's `d` units, 1 = 90ms) chain the connector to the boxes it links:
// box 1 → stem+spine draw → upper branch draws → box 2 lands →
// lower branch draws → box 3 lands. Wide gaps between the box milestones
// (box2/box3/panel4) so 1, 2, 3, 4 read as distinct paced steps, not a blur.
const FLOW_D = {
  stem: 3,
  spine: 4.6,
  upperLine: 6.2,
  upperArrow: 7.4,
  box2: 9,
  lowerLine: 11,
  lowerArrow: 12.2,
  box3: 14,
  panel4: 18,
} as const;

function FlowConnector() {
  // R wraps children in a plain <div>; since these spans are absolutely
  // positioned (removed from flow), that wrapper collapses to zero size, and
  // clip-path's inset() — measured against the wrapper's own box — clips a
  // zero-size box to nothing. So the clip-path (wipe/wipeY) lines animate
  // directly on the span itself, which has real geometry, instead of via R.
  const active = useActive();
  const line = "absolute bg-on-dark/60";
  const arrow =
    "absolute right-0 h-0 w-0 -translate-y-1/2 border-y-[8px] border-l-[14px] border-y-transparent border-l-white/75";
  const delay = (d: number): CSSProperties => ({ animationDelay: `${d * 90}ms` });
  return (
    <div className="relative h-full min-h-[18vh] w-full">
      {/* stem out of the left card */}
      <span
        className={cn(
          line,
          "left-0 top-1/2 h-[2px] w-1/2 -translate-y-1/2",
          active ? "anim-wipe" : "opacity-0",
        )}
        style={delay(FLOW_D.stem)}
      />
      {/* vertical splitter between the two branch centres */}
      <span
        className={cn(line, "left-1/2 w-[2px]", active ? "anim-wipe-y" : "opacity-0")}
        style={{
          top: "calc(25% - 0.6vh)",
          bottom: "calc(25% - 0.6vh)",
          ...delay(FLOW_D.spine),
        }}
      />
      {/* upper branch */}
      <span
        className={cn(
          line,
          "left-1/2 h-[2px] w-[calc(50%-13px)]",
          active ? "anim-wipe" : "opacity-0",
        )}
        style={{ top: "calc(25% - 0.6vh)", ...delay(FLOW_D.upperLine) }}
      />
      <span
        className={cn(arrow, active ? "anim-fade" : "opacity-0")}
        style={{ top: "calc(25% - 0.6vh)", ...delay(FLOW_D.upperArrow) }}
      />
      {/* lower branch */}
      <span
        className={cn(
          line,
          "left-1/2 h-[2px] w-[calc(50%-13px)]",
          active ? "anim-wipe" : "opacity-0",
        )}
        style={{ top: "calc(75% + 0.6vh)", ...delay(FLOW_D.lowerLine) }}
      />
      <span
        className={cn(arrow, active ? "anim-fade" : "opacity-0")}
        style={{ top: "calc(75% + 0.6vh)", ...delay(FLOW_D.lowerArrow) }}
      />
    </div>
  );
}

export function SlideOptions(p: P) {
  return (
    <Slide
      id="options"
      tone="dark"
      patch
      title={
        <>
          EMEA is currently over-sized for the realizable opportunity.
          <span className="block text-sky-light">“Lean promotion” provides most favorable EBITDA</span>
        </>
      }
      footnote={FOOT}
      {...p}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2vw] max-md:gap-5 lg:grid-cols-[1.45fr_1fr]">
        {/* flow */}
        <div className="border border-on-dark/30 bg-on-dark/5 p-[1.6vw] max-md:p-3">
          <div className="grid grid-cols-[1fr_0.5fr_1.2fr] items-center gap-y-[2.4vh] max-md:grid-cols-1 max-md:gap-y-3">
            <R d={1} a="rise" className="row-span-2 max-md:row-span-1">
              <article className="border border-on-dark/45 bg-on-dark/8 p-[1.6vw] max-md:p-3">
                <p className="deck-body font-bold text-on-dark">EMEA Organization</p>
                <p className="deck-small mt-[0.8vh] text-on-dark/80">~166 FTEs &amp; $95 MM OPEX</p>
              </article>
            </R>
            <div className="row-span-2 h-full self-stretch max-md:hidden">
              <FlowConnector />
            </div>
            {/* phones stack the flow top-to-bottom, so the connector becomes a single down arrow */}
            <div aria-hidden className="flex justify-center md:hidden">
              <span className="h-0 w-0 border-x-[9px] border-t-[12px] border-x-transparent border-t-white/75" />
            </div>
            <R d={FLOW_D.box2} a="rise">
              <article className="border border-on-dark/45 bg-on-dark/8 p-[1.4vw] max-md:p-3">
                <p className="deck-body font-bold text-on-dark">Global Clin Ops and Tech Ops</p>
                <p className="deck-small mt-[0.6vh] text-on-dark/80">~51 FTEs &amp; ~$25 MM annual OPEX</p>
              </article>
            </R>
            <R d={FLOW_D.box3} a="rise">
              <article className="border border-on-dark/45 bg-on-dark/8 p-[1.4vw] max-md:p-3">
                <p className="deck-body font-bold text-on-dark">EMEA commercialisation engine</p>
                <p className="deck-small mt-[0.6vh] text-on-dark/80">~ 115 FTEs &amp; ~$70 MM annual OPEX</p>
              </article>
            </R>
          </div>
        </div>

        {/* options panel */}
        <R d={FLOW_D.panel4} a="rise">
          <div className="border border-on-dark/30 bg-on-dark/12 p-[1.8vw] max-md:p-4">
            <p className="deck-body font-bold text-sky-light">
              Continued commercialization options improve EBITDA
            </p>
            <div className="mt-[2.2vh] flex items-center gap-[1.2vw] max-md:mt-4 max-md:gap-3">
              <span className="deck-small shrink-0 border border-on-dark/55 px-[1vw] py-[0.7vh] text-on-dark max-md:px-2.5 max-md:py-1">
                Option 1
              </span>
              <span className="deck-small text-on-dark/85">Product availability, no promotion</span>
            </div>
            <div className="my-[1.6vh] border-t border-dotted border-on-dark/40 max-md:my-3" />
            <div className="flex items-center gap-[1.2vw] max-md:gap-3">
              <span className="deck-small shrink-0 border border-on-dark/55 px-[1vw] py-[0.7vh] text-on-dark max-md:px-2.5 max-md:py-1">
                Option 2
              </span>
              <span className="deck-small text-on-dark/85">Product availability, lean promotion</span>
            </div>
          </div>
        </R>
      </div>
    </Slide>
  );
}

/* 04 — Lean targeted effort */
export function SlideLean(p: P) {
  return (
    <Slide
      id="approach"
      tone="light"
      patch
      title="A lean, targeted commercial effort in EMEA improves EBITDA while supporting patient access to Averon’s medicines"
      footnote={
        <>
          {FOOT}
          <br />
          1. Initial Estimate to be confirmed depending on severance package, # impacted employees, etc
        </>
      }
      {...p}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-[2.5vw] max-md:gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col justify-center gap-[2.4vh]">
          <div>
            <R d={2}>
              <h3 className="deck-body font-bold text-brand">Recommended approach…</h3>
            </R>
            <Bullets
              start={3}
              className="mt-[1.2vh]"
              items={[
                "Ongoing global Tech Ops and Clin Ops/Trials support",
                "Targeted promotion of Aerivax and Zevrina in select markets",
              ]}
            />
          </div>
          <div>
            <R d={5}>
              <h3 className="deck-body font-bold text-brand">Preliminary Assessment led by EMEA leadership…</h3>
            </R>
            <Bullets
              start={6}
              className="mt-[1.2vh]"
              items={[
                "EMEA organisation reduced by around 70 FTEs",
                "Total OPEX halved",
                "4 year EBITDA improved >$180M",
                "Aerivax revenues assumed to decrease ~ $12 MM over 4 years (assumes no Zevrina reimbursement)",
                "Restructuring costs estimated at ~$5 – 10 MM1",
              ]}
            />
          </div>
        </div>
        <R d={1} a="mask" className="flex items-center justify-center">
          <img
            src={A.europeMap}
            alt="Updated Europe Map"
            className="max-h-[54vh] w-full object-contain"
          />
        </R>
      </div>
    </Slide>
  );
}

/* 05 — Trade offs */
export function SlideTradeoffs(p: P) {
  const cards = [
    {
      icon: A.iconHandshake,
      text: "Key risks of exit include cultural hit, corporate reputation, loss of KOL relationships, clinical trial recruitment impact, ceding first-mover advantage to competitors",
    },
    {
      icon: A.iconPlan,
      text: "Next Steps: Review EMEA team recommendation & assumptions, refine analysis, develop implementation and communication plan",
    },
  ];
  return (
    <Slide
      id="trade-offs"
      tone="dark"
      title="Key trade offs: Reputational & cultural risk, reduced influence with medical community; recommend proceeding"
      {...p}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-[3vw] max-md:gap-6 md:grid-cols-2">
        {cards.map((card, i) => (
          <R key={i} d={2 + i * 2} a="rise">
            <div className="relative pt-[9vh] max-md:pt-10">
              <span className="absolute left-[2.4vw] top-0 z-10 grid h-[18vh] w-[18vh] place-items-center rounded-full bg-white p-[1.3vh] shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-md:left-5 max-md:h-20 max-md:w-20 max-md:p-1.5">
                <span className="grid h-full w-full place-items-center rounded-full border-[7px] border-brand bg-white max-md:border-[5px]">
                  <img src={card.icon} alt="" className="h-[8.5vh] w-[8.5vh] object-contain max-md:h-9 max-md:w-9" />
                </span>
              </span>
              <div className="min-h-[32vh] bg-white px-[2.6vw] pb-[3.4vh] pt-[11.5vh] max-md:min-h-0 max-md:px-5 max-md:pb-6 max-md:pt-14">
                <p className="text-[clamp(25px,1.85vw,36px)] leading-[1.32] text-ink max-md:text-base max-md:leading-[1.38]">
                  {card.text}
                </p>
              </div>
            </div>
          </R>
        ))}
      </div>

    </Slide>
  );
}

/* 06 — Chapter */
export function SlideChapter(p: P) {
  return (
    <Slide id="supporting-documents" tone="band" bg={A.gradientArc} bgPosition="right bottom" bgBrand {...p}>
      <div className="relative flex min-h-0 flex-1 items-center">
        <R a="mask" className="relative z-10 max-w-[71vw] max-md:max-w-full">
          <h2 className="deck-title-lg text-on-dark">Supporting Documents – Pre-Read only</h2>
        </R>
      </div>
    </Slide>
  );
}

/* 07 — P&L to 2032 */
function Breakeven2032Body() {
  const active = useActive();
  const [col, setCol] = useState<number | null>(6);
  const [view, setView] = useState<"pl" | "functional">("pl");
  // One-time onboarding nudge: points at the view toggle, blurs the rest of
  // the slide, then clears on its own 5s after the slide first becomes active
  // (or immediately once the viewer uses the toggle).
  const [nudge, setNudge] = useState(true);

  useEffect(() => {
    if (!active || !nudge) return;
    const t = setTimeout(() => setNudge(false), 5000);
    return () => clearTimeout(t);
  }, [active, nudge]);

  // While this slide is on screen, "next" first reveals the second tab and
  // "previous" first returns to the first one; only then do the keys fall
  // through to the deck's slide navigation. Capture phase so this runs before
  // the global keydown listener in routes/index.tsx.
  useEffect(() => {
    const NEXT = ["ArrowDown", "ArrowRight", "PageDown", " "];
    const PREV = ["ArrowUp", "ArrowLeft", "PageUp"];
    const onKey = (e: KeyboardEvent) => {
      const next = NEXT.includes(e.key);
      if (!next && !PREV.includes(e.key)) return;
      const el = document.getElementById("break-even-2032");
      if (!el) return;
      const mid = window.innerHeight / 2;
      const r = el.getBoundingClientRect();
      if (r.top > mid || r.bottom < mid) return;
      if (next && view === "pl") {
        e.preventDefault();
        e.stopPropagation();
        setView("functional");
        setNudge(false);
      } else if (!next && view === "functional") {
        e.preventDefault();
        e.stopPropagation();
        setView("pl");
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [view]);

  const split = PL_2032.findIndex((r) => r.label === "Functional costs % of Net Sales");
  const rows = view === "pl" ? PL_2032.slice(0, split) : PL_2032.slice(split);
  const blurred = active && nudge;
  const blurCls = cn(
    "transition-[filter,opacity] duration-700 ease-out",
    blurred && "pointer-events-none opacity-45 blur-[7px]",
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <R a="rise" className={blurCls}>
        <h2 className="deck-title max-w-[92%] text-balance text-brand max-md:max-w-full">
          Cumulative break-even in 2032 mainly supported by significant revenue contribution from
          GTx
        </h2>
      </R>
      <div className="mt-[1.6vh] flex min-h-0 flex-1 flex-col">
        <R d={1} className="relative z-20 flex justify-end max-md:pt-14">
          <div className="relative max-md:w-full">
            <div className="flex border border-brand bg-paper">
              {(
                [
                  ["pl", "P&L"],
                  ["functional", "Functional costs % of Net Sales"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setNudge(false);
                  }}
                  className={cn(
                    "deck-cell px-5 py-2 transition-colors max-md:flex-1 max-md:px-2 max-md:py-1.5",
                    view === v ? "bg-brand text-primary-foreground" : "text-brand hover:bg-brand/8",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              aria-hidden={!blurred}
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-full flex flex-col items-center gap-[0.3vh] pb-[0.5vh] text-brand transition-opacity duration-500",
                blurred ? "opacity-100" : "opacity-0",
              )}
            >
              <p className="deck-small w-max self-end text-right font-bold">
                Click to switch between P&amp;L
                <br />
                and Functional costs view
              </p>
              <svg
                viewBox="0 0 34 52"
                className="anim-nudge-bob h-[4.6vh] w-auto shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 4 L17 45" />
                <path d="M9 38 L17 47 L25 38" />
              </svg>
            </div>
          </div>
        </R>
        <div className={cn("mt-[1.2vh] flex min-h-0 flex-1 items-start max-md:mt-4", blurCls)}>
          <MobileScroll minWidth={700}>
            <DataTable
              columns={YEARS_11}
              rows={rows}
              firstColLabel="USDm"
              activeCol={col}
              onColHover={setCol}
              colWidth="minmax(52px, 1fr)"
              labelWidth="minmax(190px, 1.5fr)"
              headerBar
              compact
            />
          </MobileScroll>
        </div>
      </div>
    </div>
  );
}

export function SlideBreakeven2032(p: P) {
  return (
    <Slide id="break-even-2032" tone="light" {...p}>
      <Breakeven2032Body />
    </Slide>
  );
}

/* 08 — Country break-even 2034 */
export function SlideBreakeven2034(p: P) {
  const [col, setCol] = useState<number | null>(8);
  return (
    <Slide
      id="break-even-2034"
      tone="light"
      title="AERIVAX & ZEVRINA only cumulative break-even in 2034"
      footnote="G&A costs have not been allocated to the individual countries; All other infrastructure costs are included"
      {...p}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[2.2vh] max-md:justify-start max-md:gap-4">
        <R d={1} className="flex justify-end">
          <p className="deck-small flex items-center gap-2.5 text-ink">
            <span className="h-[1em] w-[1em] shrink-0 rounded-sm bg-brand-soft" />
            Represents cumulative break-even
          </p>
        </R>
        {/* one shared scroller so both tables pan together on phones */}
        <MobileScroll minWidth={640}>
          <div className="md:contents max-md:flex max-md:flex-col max-md:gap-6">
            <DataTable
              columns={YEARS_10}
              rows={NET_SALES}
              firstColLabel="Net Sales"
              flags={FLAGS}
              activeCol={col}
              onColHover={setCol}
              labelWidth="minmax(230px, 1.4fr)"
              headerBar
              compact
            />
            <DataTable
              columns={YEARS_10}
              rows={EBITDA_ROWS}
              firstColLabel="EBITDA"
              flags={FLAGS}
              activeCol={col}
              onColHover={setCol}
              labelWidth="minmax(230px, 1.4fr)"
              headerBar
              compact
              highlight={{
                Germany: [8],
                UK: [7],
                Spain: [7],
                "All other countries": [6],
                "Total EMEA": [8],
              }}
            />
          </div>
        </MobileScroll>
      </div>
    </Slide>
  );
}


/* 09 — Pricing */
export function SlidePricing(p: P) {
  return (
    <Slide
      id="pricing"
      tone="dark"
      title="ZEVRINA avg net price estimated <$10K, declining to ~$8K"
      footnote="1. Prices represent direct pricing. (team is proposing import model initially)"
      {...p}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center max-md:justify-start">
        <R d={1} a="fade">
          <div className="grid grid-cols-[1fr_1.6fr_1.6fr] bg-on-dark/5 max-md:grid-cols-[1.25fr_1fr_1fr]">
            <span />
            <span className="deck-body bg-brand py-[1vh] text-center font-bold text-on-dark">
              At Launch
            </span>
            <span className="deck-body border-l border-on-dark/25 bg-brand py-[1vh] text-center font-bold text-on-dark">
              By mid-2030s
            </span>
          </div>
        </R>
        {PRICING.map((row, i) => (
          <R key={row.label} d={1.9 + i * 0.9} a="fade">
            <div
              className={cn(
                "grid grid-cols-[1fr_1.6fr_1.6fr] items-center max-md:grid-cols-[1.25fr_1fr_1fr] border-b border-dashed border-on-dark/25 transition-colors hover:bg-on-dark/8",
                row.kind === "total" && "border-solid border-on-dark/60 bg-on-dark/10 font-bold",
              )}
            >
              <span className="deck-body bg-on-dark/8 px-[1vw] py-[1vh] text-on-dark/90 max-md:px-2 max-md:py-2">
                {row.label.replace(/1$/, "")}
                {/1$/.test(row.label) ? <sup>1</sup> : null}
              </span>
              <span className="deck-body tabular py-[1vh] text-center text-on-dark max-md:py-2">{row.values[0]}</span>
              <span className="deck-body tabular py-[1vh] text-center text-sky-light max-md:py-2">
                {row.values[1]}
              </span>
            </div>
          </R>
        ))}
      </div>
    </Slide>
  );
}

/* 10 — Cumulative P&L scenarios */
export function SlideCumulativePL(p: P) {
  const [col, setCol] = useState<number | null>(5);
  const grid = "grid-cols-[minmax(180px,1fr)_repeat(6,minmax(110px,1fr))] max-md:grid-cols-7";
  return (
    <Slide
      id="cumulative-pl"
      tone="light"
      title="Cumulative P&L (2027-2030): Lean organization with product promotion provides the most favourable EBITDA"
      footnote={
        <>
          1. All figures reflect preliminary thinking & assumptions; to be confirmed
          <br />
          Note: COGS includes royalties expenses
        </>
      }
      {...p}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center max-md:justify-start">
        <MobileScroll minWidth={640}>
        {/* Incremental only bracket over the last two columns — timed to land
            together with the connector arrow + its border box below, not
            with the table, so all three read as one "reveal" beat. */}
        <R d={20} a="fade" style={{ animationDuration: "1s" }}>
          <div className={cn("grid gap-x-1", grid)}>
            <div className="col-span-5" />
            <div className="relative col-span-2 pb-[0.6vh] pt-[1.6vh] text-center max-md:pb-1 max-md:pt-3">
              <span className="deck-small font-bold text-brand">Incremental only</span>
            </div>
          </div>
        </R>

        <div className={cn("relative grid [--brk:5.22vh] max-md:[--brk:35px]", grid)}>
          <div className="col-span-7 grid">
            <div className="col-start-1 row-start-1">
              <DataTable
                columns={CUM_PL_COLS}
                rows={CUM_PL}
                firstColLabel="# in USDm"
                activeCol={col}
                onColHover={setCol}
                colWidth="minmax(110px, 1fr)"
                labelWidth="minmax(180px, 1fr)"
                mobileLabelWidth="minmax(0, 1fr)"
                mobileColWidth="minmax(0, 1fr)"
                boxes={{ EBITDA: [[0], [1, 2, 3]] }}
                boxDelay={8}
                boxDuration="1.1s"
                shadeRows={["Total Net Sales", "Gross Margin", "Total OpEx"]}
                accentRows={["Margin", "# FTEs"]}
                valueAlign="center"
                headerBar
              />
            </div>

            {/* Connector out of the EBITDA row: matches the source deck, where the
              elbow starts right at the box edges (no separate uptick) at the row's
              vertical center, then drops straight down through the FTEs row to the
              savings callout. Positioned as % of the table box so it tracks the
              "Current" EBITDA pill's right edge and the merged box's left edge.
              Timed to land once the table has cascaded in and the EBITDA boxes
              (boxDelay=8, boxDuration=1.1s above) have finished coloring in — and
              synced with "Incremental only" below, both landing on the same beat.
              Stretched to 1.3s (vs. the deck's usual 0.62s) so it reads as a slow,
              deliberate draw rather than a quick pop. */}
            <R
              d={20}
              a="rise"
              style={{ animationDuration: "1.3s" }}
              className="pointer-events-none relative col-start-1 row-start-1"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute h-[2px] bg-magenta"
                style={{ left: "23.4%", width: "5.3%", top: "82.2%" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute w-[2px] -translate-x-1/2 bg-magenta"
                style={{ left: "26%", top: "82.2%", height: "calc(17.8% + 1.6vh)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[10px] border-x-transparent border-t-magenta"
                style={{ left: "26%", top: "calc(100% + 1.6vh)" }}
              />
            </R>
          </div>

          {/* Border box around the two "Incremental only" columns. Extends
              upward past the table's own top edge to also wrap the bracket
              above it, so the two read as one continuous outline. Synced with
              the "Incremental only" label and the connector arrow above. */}
          <R d={20} a="fade" style={{ animationDuration: "1s" }} className="pointer-events-none absolute inset-0">
            <div
              aria-hidden
              className="pointer-events-none absolute border-2 border-brand"
              style={{
                left: "71.5%",
                width: "28.5%",
                top: "calc(-1 * var(--brk))",
                height: "calc(100% + var(--brk))",
              }}
            />
          </R>
        </div>

        {/* savings callout, centered under the connector's drop point —
            lands after the arrow (d=20, 1.3s duration) has finished drawing. */}
        <R d={30} a="rise" style={{ animationDuration: "1.2s" }}>
          <div className="relative mt-[3vh] h-[5.2vh] w-full max-md:mt-5 max-md:h-12">
            <p
              className="deck-body absolute w-max -translate-x-1/2 border-2 border-magenta bg-brand/8 px-6 py-[1vh] font-bold text-brand max-md:px-3"
              style={{ left: "26%" }}
            >
              Potential savings of ~140m to ~180m
            </p>
          </div>
        </R>
        </MobileScroll>
      </div>
    </Slide>
  );
}

/* 11 — FTEs */
export function SlideFtes(p: P) {
  const [col, setCol] = useState<number | null>(3);
  const grid =
    "grid-cols-[minmax(200px,1.3fr)_repeat(4,minmax(120px,1fr))] max-md:grid-cols-[1.3fr_repeat(4,1fr)]";
  return (
    <Slide
      id="ftes"
      tone="light"
      title="FTEs breakdown by function across scenarios"
      footnote="1. All figures reflect preliminary thinking & assumptions; to be confirmed"
      {...p}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center max-md:justify-start">
        <MobileScroll minWidth={600}>
        <DataTable
          columns={FTE_COLS}
          rows={FTES}
          firstColLabel=""
          activeCol={col}
          onColHover={setCol}
          colWidth="minmax(120px, 1fr)"
          labelWidth="minmax(200px, 1.3fr)"
          mobileLabelWidth="minmax(0, 1.3fr)"
          mobileColWidth="minmax(0, 1fr)"
          indent={[
            "Clinical Development",
            "Clinical Operations",
            "Drug Safety & PV",
            "Medical",
            "Program Management",
            "Quality Assurance",
            "Regulatory Affairs",
          ]}
          valueAlign="center"
          headerBar
          compact
        />

        <div className={cn("mt-[1.2vh] grid items-start gap-x-1", grid)}>
          <div />
          <div className="col-span-4">
            {/* each delta sits on the boundary between two data columns; this grid
                splits each real data column in half so col-span-2 always runs
                center-to-center between the two Total values it connects */}
            <div className="grid grid-cols-[repeat(8,minmax(60px,1fr))] gap-x-1 max-md:grid-cols-8">
              {FTE_DELTAS.map((d, i) => (
                <R
                  key={d.badge}
                  d={13 + i * 6}
                  a="rise"
                  className={cn(
                    "col-span-2",
                    ["col-start-2", "col-start-4", "col-start-6"][i],
                  )}
                >
                  <div className="flex flex-col items-center">
                    <svg
                      viewBox="0 0 220 44"
                      preserveAspectRatio="none"
                      className="h-[5.4vh] w-full overflow-visible"
                      aria-hidden
                    >
                      {/* bracket connecting the two Total-row values above */}
                      <path d="M6 14 H204" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                      <path d="M6 14 V2" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                      <path d="M204 14 V11" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                      <path d="M197 11 L204 1 L211 11 Z" fill="var(--ink-soft)" />
                      {/* stem down to the badge */}
                      <circle cx="110" cy="14" r="2.5" fill="var(--ink-soft)" />
                      <path d="M110 14 V44" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="deck-small bg-brand px-5 py-[0.5vh] font-bold text-on-dark max-md:px-3">
                      {d.badge}
                    </span>
                    <svg viewBox="0 0 20 22" className="h-[2.8vh] w-[20px]" aria-hidden>
                      <circle cx="10" cy="4" r="2.5" fill="var(--ink-soft)" />
                      <path d="M10 4 V22" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                    </svg>
                    <p className="deck-cell w-full rounded-sm border border-rule bg-white px-4 py-[0.9vh] text-center text-ink shadow-[0_2px_8px_rgba(0,0,0,0.06)] max-md:px-2 max-md:py-1.5">
                      {d.detail}
                    </p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </div>
        </MobileScroll>
      </div>
    </Slide>
  );
}

export const SLIDES = [
  { id: "cover", label: "Cover", C: SlideCover },
  { id: "recommendation", label: "Recommendation", C: SlideRecommend },
  { id: "options", label: "Options", C: SlideOptions },
  { id: "approach", label: "Recommended approach", C: SlideLean },
  { id: "trade-offs", label: "Key trade offs", C: SlideTradeoffs },
  { id: "supporting-documents", label: "Supporting documents", C: SlideChapter },
  { id: "break-even-2032", label: "Break-even 2032", C: SlideBreakeven2032 },
  { id: "break-even-2034", label: "Break-even 2034", C: SlideBreakeven2034 },
  { id: "pricing", label: "ZEVRINA price", C: SlidePricing },
  { id: "cumulative-pl", label: "Cumulative P&L", C: SlideCumulativePL },
  { id: "ftes", label: "FTEs breakdown", C: SlideFtes },
];

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/components/ui/cn";
import { ChevronRightIcon } from "@/components/ui/icons";
import { canRender3D, pickTier, prefersStill, whenIdle } from "@/components/scene/device";
import type { PlaceKey, Relief } from "@/components/scene/relief-scene";

/**
 * The province of Málaga as a relief table (see `components/scene/relief-scene.ts`), and the area explorer built
 * round it for the wine guide.
 *
 * Like the homepage's stage, it shows a pre-rendered still first and swaps in the live scene once the browser is
 * idle; visitors who asked for reduced motion or data saving, and browsers without WebGL 2, keep the stills (which
 * still change with the chosen area). The areas' keys are the slugs of their guide pages.
 */
export type TableLabels = { alt: string; hint: string; whole: string; city: string; credit: string };
type Place = { key: PlaceKey; name: string };

function ReliefTable({
  labels,
  places,
  focus,
  onFocus,
  className,
}: {
  labels: TableLabels;
  /** The wine areas, named in the page's language. */
  places: Place[];
  focus: PlaceKey | null;
  /** Given when the visitor may choose an area: the needles' labels become buttons. */
  onFocus?: (place: PlaceKey | null) => void;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<Relief | null>(null);
  const initialFocus = useRef(focus);

  useEffect(() => {
    if (!canRender3D() || prefersStill()) return;
    const frame = root.current!;
    const abort = new AbortController();
    const cancelIdle = whenIdle(() => {
      import("@/components/scene/relief-scene")
        .then(({ createRelief }) =>
          createRelief(canvas.current!, {
            tier: pickTier(),
            signal: abort.signal,
            focus: initialFocus.current,
            // Each needle's name follows its head as the table turns.
            onFrame: (points) => {
              for (const tag of frame.querySelectorAll<HTMLElement>("[data-place]")) {
                const point = points[tag.dataset.place as PlaceKey];
                tag.style.left = `${(point.x * 100).toFixed(2)}%`;
                tag.style.top = `${(point.y * 100).toFixed(2)}%`;
                tag.hidden = point.x < 0.02 || point.x > 0.98 || point.y < 0.04 || point.y > 0.96;
              }
            },
            onFirstFrame: () => frame.setAttribute("data-live", ""),
            onContextLost: () => frame.removeAttribute("data-live"),
          }),
        )
        .then((created) => {
          if (abort.signal.aborted) return created.dispose();
          scene.current = created;
        })
        .catch(() => {
          // The still stays.
        });
    });
    const resized = new ResizeObserver(() => scene.current?.resize());
    resized.observe(frame);
    return () => {
      abort.abort();
      cancelIdle();
      resized.disconnect();
      scene.current?.dispose();
      scene.current = null;
      frame.removeAttribute("data-live");
    };
  }, []);

  useEffect(() => {
    scene.current?.focus(focus);
  }, [focus]);

  const still = `/3d/posters/relief-${focus ?? "overview"}`;
  return (
    <div ref={root} role="img" aria-label={labels.alt} className={cn("relief group relative overflow-hidden rounded-md bg-[#0a0914]", className)}>
      <picture>
        <source type="image/avif" srcSet={`${still}.avif`} />
        <img src={`${still}.webp`} alt="" decoding="async" className="relief-poster absolute inset-0 size-full object-cover" />
      </picture>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {/* Names on the needles, placed by the live scene (so they only show once it runs). */}
      <div className="invisible absolute inset-0 group-data-live:visible" aria-hidden={!onFocus}>
        {places.map((place) =>
          onFocus ? (
            <button
              key={place.key}
              data-place={place.key}
              type="button"
              hidden
              onClick={() => onFocus(place.key)}
              className={cn(
                "absolute h-11 translate-x-2.5 -translate-y-1/2 px-1.5 text-footnote font-semibold whitespace-nowrap [text-shadow:0_1px_8px_#08070f] transition-colors hover:text-accent",
                focus === place.key && "text-accent",
              )}
            >
              {place.name}
            </button>
          ) : (
            <span
              key={place.key}
              data-place={place.key}
              hidden
              className={cn(
                "absolute translate-x-2.5 -translate-y-1/2 px-1.5 text-footnote font-semibold whitespace-nowrap [text-shadow:0_1px_8px_#08070f]",
                focus === place.key && "text-accent",
              )}
            >
              {place.name}
            </span>
          ),
        )}
        <span data-place="malaga" hidden className="absolute -translate-x-[calc(100%+0.6rem)] -translate-y-1/2 text-footnote text-label-secondary [text-shadow:0_1px_8px_#08070f]">
          {labels.city}
        </span>
      </div>
      {onFocus && focus && (
        <button
          type="button"
          onClick={() => onFocus(null)}
          className="absolute right-3 bottom-3 inline-flex h-11 items-center gap-2 rounded-full bg-system/75 px-4 text-subheadline font-semibold ring-1 ring-label/30 backdrop-blur-sm transition-colors hover:text-accent"
        >
          <ChevronRightIcon className="size-3.5 rotate-180" />
          {labels.whole}
        </button>
      )}
    </div>
  );
}

/** The table turned to one area and left there, at the top of that area's page. */
export function AreaTable({ labels, place, className }: { labels: TableLabels; place: Place; className?: string }) {
  return <ReliefTable labels={labels} places={[place]} focus={place.key} className={className} />;
}

export type ExplorerArea = Place & {
  summary: string;
  intro: string;
  facts: [string, string][];
  /** The link to the area's own page: its text and address. */
  more: string;
  href: string;
};

/**
 * The guide's areas section: the table, the list of areas beside it and, below, the chosen area's summary. Choosing
 * an area (in the list or on the table) turns the table to it. Every area's text is in the HTML from the start, so
 * it reads without JavaScript and crawlers see all of it; the script only decides which one is shown.
 */
export function AreaExplorer({ labels, areas, overview }: { labels: TableLabels; areas: ExplorerArea[]; overview: string }) {
  const [focus, setFocus] = useState<PlaceKey | null>(null);
  return (
    <div>
      <div className="grid items-start gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <div>
          <ReliefTable labels={labels} places={areas} focus={focus} onFocus={setFocus} className="aspect-4/3 sm:aspect-16/10" />
          <p className="mt-3 text-footnote text-label-secondary">
            {labels.hint} {labels.credit}
          </p>
        </div>
        <ul className="border-b border-separator">
          {areas.map((area) => (
            <li key={area.key} className="border-t border-separator">
              <button
                type="button"
                aria-pressed={focus === area.key}
                onClick={() => setFocus(focus === area.key ? null : area.key)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-300 hover:text-accent",
                  focus === area.key && "text-accent",
                )}
              >
                <span>
                  <span className="block font-display text-title2">{area.name}</span>
                  <span className="mt-0.5 block text-subheadline text-label-secondary">{area.summary}</span>
                </span>
                <ChevronRightIcon className={cn("size-4 shrink-0 transition-transform duration-500 ease-spring", focus === area.key && "rotate-90")} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p hidden={focus !== null} className="mt-10 max-w-3xl text-body text-label-secondary">
        {overview}
      </p>
      {areas.map((area) => (
        <section key={area.key} hidden={focus !== area.key} aria-label={area.name} className="mt-10 grid gap-x-14 gap-y-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="text-body text-label-secondary">{area.intro}</p>
            <Link href={area.href} className="mt-4 inline-flex h-11 items-center gap-1.5 text-callout text-accent underline-offset-4 hover:underline">
              {area.more} <ChevronRightIcon className="size-4" />
            </Link>
          </div>
          <dl className="border-b border-separator text-subheadline">
            {area.facts.map(([label, value]) => (
              <div key={label} className="grid gap-x-4 gap-y-0.5 border-t border-separator py-3 sm:grid-cols-[9rem_1fr]">
                <dt className="font-semibold">{label}</dt>
                <dd className="text-label-secondary">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { canRender3D, pickTier, prefersStill, whenIdle } from "@/components/scene/device";
import type { HomeScene } from "@/components/scene/home-scene";
import { ScenePoster } from "@/components/scene/poster";

/**
 * The homepage's 3D stage: a full-screen picture that stays put while its children (the hero, a stretch of empty
 * scroll, then "how it works") move over it. Scrolling walks the camera down the vineyard track, through the
 * lagar's door and along the cellar.
 *
 * What the visitor sees is always the same; how it is drawn depends on the device:
 *
 * - First, still images of the vineyard and the cellar, pre-rendered from the scene itself, so the page paints at
 *   once. They zoom and cross-fade with the scroll (styles in globals.css, driven by the custom properties set here).
 * - Then, once the browser is idle, the live three.js scene loads and fades in over the stills. Visitors who asked
 *   for reduced motion or data saving, and browsers without WebGL 2, keep the stills.
 *
 * The section that the cellar belongs to is marked with `data-stage-cellar` among the children.
 */
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function HomeStage({ description, children }: { description: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // The cellar still isn't needed until the visitor is well down the track, so it isn't downloaded before then.
  const [cellarPoster, setCellarPoster] = useState(false);

  useEffect(() => {
    const stage = root.current!, view = backdrop.current!;
    const cellar = stage.querySelector<HTMLElement>("[data-stage-cellar]")!;
    let scene: HomeScene | null = null;
    let frame = 0;
    let wantsCellar = false;

    // Turns the scroll position into the walk's progress and publishes it to the styles and to the live scene.
    const update = () => {
      frame = 0;
      const height = view.clientHeight;
      const scrolled = Math.max(0, -stage.getBoundingClientRect().top);
      const end = Math.max(1, stage.offsetHeight - height);
      // The camera reaches the doorway as the cellar section's heading comes a quarter of the way up the screen.
      const door = Math.max(height * 0.5, cellar.offsetTop - height * 0.75);
      const walk = clamp01(scrolled / door);
      const inside = scrolled >= door;
      const aisle = clamp01((scrolled - door) / Math.max(1, end - door));
      // Lamplight floods the frame on the way through the door and clears again inside.
      const wash = inside ? 1 - smoothstep(0, height * 0.32, scrolled - door) : smoothstep(0.8, 0.985, walk);
      stage.style.setProperty("--walk", walk.toFixed(4));
      stage.style.setProperty("--inside", inside ? "1" : "0");
      stage.style.setProperty("--wash", wash.toFixed(3));
      stage.style.setProperty("--hero", clamp01(1 - walk * 4).toFixed(3));
      if (walk > 0.4 && !wantsCellar) {
        wantsCellar = true;
        setCellarPoster(true);
      }
      scene?.setProgress(inside ? 1 : walk * 0.9999, aisle);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    const resized = new ResizeObserver(() => {
      scene?.resize();
      schedule();
    });
    resized.observe(view);

    const abort = new AbortController();
    let cancelIdle = () => {};
    if (canRender3D() && !prefersStill()) {
      cancelIdle = whenIdle(() => {
        import("@/components/scene/home-scene")
          .then(({ createHomeScene }) =>
            createHomeScene(canvas.current!, {
              tier: pickTier(),
              signal: abort.signal,
              onFirstFrame: () => stage.setAttribute("data-live", ""),
              onContextLost: () => stage.removeAttribute("data-live"),
            }),
          )
          .then((created) => {
            if (abort.signal.aborted) return created.dispose();
            scene = created;
            update();
          })
          .catch(() => {
            // The stills stay; nothing else to do.
          });
      });
    }

    return () => {
      abort.abort();
      cancelIdle();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      resized.disconnect();
      scene?.dispose();
      stage.removeAttribute("data-live");
    };
  }, []);

  return (
    <div ref={root} className="home-stage relative">
      <div ref={backdrop} role="img" aria-label={description} className="sticky top-0 h-svh overflow-hidden bg-system">
        <ScenePoster name="vineyard" eager className="home-stage-poster home-stage-vineyard absolute inset-0 size-full object-cover" />
        {cellarPoster && <ScenePoster name="cellar" className="home-stage-poster home-stage-cellar absolute inset-0 size-full object-cover" />}
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        <div aria-hidden className="home-stage-wash pointer-events-none absolute inset-0" />
        {/* Shade for the text that scrolls over the picture: down the left on wide screens, all over on narrow ones. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-system/35 md:bg-transparent md:bg-linear-to-r md:from-system/70 md:via-system/25 md:via-45% md:to-transparent md:to-65%" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-transparent to-system" />
      </div>
      <div className="relative -mt-[100svh]">{children}</div>
    </div>
  );
}

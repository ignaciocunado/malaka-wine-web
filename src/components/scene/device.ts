/**
 * What this visitor's device should be given. Kept apart from the scene code so pages can ask these questions
 * without downloading three.js.
 */

export type Tier = "high" | "low";

/** Whether this browser can run the live scenes at all. Without it the pages keep their still images. */
export function canRender3D() {
  if (typeof DecompressionStream === "undefined") return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * How much scene this device should get. Phones and tablets, and computers that report little memory or few cores,
 * get fewer vines and a lower pixel ratio; the picture is otherwise the same.
 */
export function pickTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  return coarse || weak ? "low" : "high";
}

/** Visitors who asked for less motion or less data get the still images instead of the live scenes. */
export function prefersStill() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || nav.connection?.saveData === true;
}

/** Runs a task once the browser has nothing more urgent to do, so it never competes with the first paint. */
export function whenIdle(task: () => void, timeout = 1500) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 200);
  return () => window.clearTimeout(id);
}

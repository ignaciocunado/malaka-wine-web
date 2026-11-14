import { buildCellar, type Cellar } from "./cellar";
import { whenIdle } from "./device";
import { createRenderer, disposeScene, loadPack, type Tier } from "./kit";
import { BAY_PACK, buildVineyard } from "./vineyard";

/**
 * The homepage's live 3D: the vineyard above the bay, then the cellar, drawn on one canvas.
 *
 * The page tells it how far the visitor has scrolled (`setProgress`) and it moves the camera there. It only draws
 * while the camera is still catching up with the scroll; a page at rest costs nothing. If frames come slowly it
 * lowers its own resolution rather than stutter.
 */
export type HomeScene = {
  /**
   * `walk` runs 0 to 1 from the vineyard to the lagar's doorway; past 1 the cellar takes over and `aisle` (0 to 1)
   * moves the camera down it.
   */
  setProgress(walk: number, aisle: number): void;
  resize(): void;
  dispose(): void;
};

type Options = { tier: Tier; signal: AbortSignal; onFirstFrame(): void; onContextLost(): void };

export async function createHomeScene(canvas: HTMLCanvasElement, { tier, signal, onFirstFrame, onContextLost }: Options): Promise<HomeScene> {
  const pack = await loadPack(BAY_PACK.url, BAY_PACK.sections, signal);
  const { renderer, fit } = createRenderer(canvas, tier);
  const vineyard = buildVineyard(pack, tier);
  let cellar: Cellar | null = null;
  let size = fit();
  vineyard.setViewport(size.height * renderer.getPixelRatio());

  const target = { walk: 0, aisle: 0 }, shown = { walk: 0, aisle: 0 };
  let frame = 0, last = 0, first = true, disposed = false;
  const shadowed = new Set<string>();
  let slow = 0, scale = 1;

  const ensureCellar = () => {
    if (!cellar) {
      cellar = buildCellar(tier);
      cellar.pose(0, size.width, size.height);
      renderer.compile(cellar.scene, cellar.camera); // so the first frame inside doesn't hitch on shaders
    }
    return cellar;
  };

  /** Draws the scene the scroll is in, with the camera where the easing has brought it. */
  const paint = () => {
    // The change of scene follows the scroll itself, not the eased camera: the page covers it with its wash of
    // lamplight at exactly that point, so it must not lag behind.
    const inside = target.walk >= 1;
    const which = inside ? "cellar" : "vineyard";
    // Nothing in either scene moves, so each one's shadows are drawn once, the first time it is shown.
    if (!shadowed.has(which)) {
      shadowed.add(which);
      renderer.shadowMap.needsUpdate = true;
    }
    if (inside) {
      const scene = ensureCellar();
      scene.pose(shown.aisle, size.width, size.height);
      renderer.toneMappingExposure = 1;
      renderer.render(scene.scene, scene.camera);
    } else {
      vineyard.pose(shown.walk, size.width / size.height);
      renderer.toneMappingExposure = 1.05;
      renderer.render(vineyard.scene, vineyard.camera);
    }
  };

  /**
   * Builds the cellar and draws it once, unseen, while the visitor is still reading the hero: its shaders, textures
   * and shadows are then ready, and walking through the door costs nothing. The vineyard is redrawn in the same
   * breath, so the cellar frame never reaches the screen.
   */
  const warmCellar = () => {
    if (disposed || cellar || target.walk >= 1) return;
    const scene = ensureCellar();
    shadowed.add("cellar");
    renderer.shadowMap.needsUpdate = true;
    renderer.toneMappingExposure = 1;
    renderer.render(scene.scene, scene.camera);
    paint();
  };

  const draw = (now: number) => {
    frame = 0;
    if (disposed) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
    // Ease towards the scroll position so a mouse wheel's steps become one continuous move.
    const ease = 1 - Math.exp(-dt * 11);
    shown.walk += (target.walk - shown.walk) * ease;
    shown.aisle += (target.aisle - shown.aisle) * ease;
    if (target.walk >= 1) shown.walk = 1;
    const settled = Math.abs(target.walk - shown.walk) < 0.0004 && Math.abs(target.aisle - shown.aisle) < 0.0004;
    if (settled) Object.assign(shown, target);

    paint();
    if (first) {
      first = false;
      onFirstFrame();
      whenIdle(warmCellar, 2500);
    }

    // If the last dozen frames of a move averaged under ~35 fps, trade resolution for smoothness, for good.
    if (last && !settled) {
      slow = slow * 0.85 + (now - last) * 0.15;
      if (slow > 28 && scale > 0.55) {
        scale *= 0.8;
        slow = 0;
        applySize();
      }
    }
    last = settled ? 0 : now;
    if (!settled) frame = requestAnimationFrame(draw);
  };
  const invalidate = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  };
  const applySize = () => {
    size = fit();
    if (scale < 1) renderer.setPixelRatio(renderer.getPixelRatio() * scale);
    renderer.setSize(size.width, size.height, false);
    vineyard.setViewport(size.height * renderer.getPixelRatio());
  };

  const lost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };
  canvas.addEventListener("webglcontextlost", lost);
  invalidate();

  return {
    setProgress(walk, aisle) {
      // Scrolling the rest of the page, with the stage out of sight, changes nothing here and draws nothing.
      if (walk === target.walk && aisle === target.aisle) return;
      // Crossing the doorway in either direction starts the far side from the door, not from wherever it was left.
      if (walk >= 1 && target.walk < 1) shown.aisle = 0;
      if (walk < 1 && target.walk >= 1) shown.walk = 0.9999;
      target.walk = walk;
      target.aisle = aisle;
      invalidate();
    },
    resize() {
      applySize();
      invalidate();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", lost);
      disposeScene(vineyard.scene);
      if (cellar) disposeScene(cellar.scene);
      renderer.dispose();
    },
  };
}

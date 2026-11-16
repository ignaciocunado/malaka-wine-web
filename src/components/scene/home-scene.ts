import * as THREE from "three";

import { buildCellar, CELLAR_DOOR, CELLAR_START, type Cellar } from "./cellar";
import { whenIdle } from "./device";
import { createRenderer, disposeScene, loadPack, smoothstep, type Tier } from "./kit";
import { PORTAL_AT } from "./lagar";
import { BAY_PACK, buildVineyard } from "./vineyard";

/**
 * The homepage's live 3D: the vineyard above the bay, then the cellar, drawn on one canvas.
 *
 * The page tells it how far the visitor has scrolled (`setProgress`) and it moves the camera there. It only draws
 * while the camera is still catching up with the scroll; a page at rest costs nothing. If frames come slowly it
 * lowers its own resolution rather than stutter.
 *
 * The two scenes are one place. The lagar's door is a passage with the cellar's nave at the far end of it: from the
 * track the vineyard is drawn first, then the cellar over it, only where the passage's mouth is (a stencil), seen from
 * the same camera moved into the cellar's coordinates. Walking in is then an ordinary camera move; once the camera
 * is past the mouth, only the cellar is drawn, and nothing changes on screen at the handover.
 */
export type HomeScene = {
  /**
   * `walk` runs 0 to 1 from the vineyard, in through the lagar's door, to the first bay of the cellar; `aisle`
   * (0 to 1) then moves the camera down the nave.
   */
  setProgress(walk: number, aisle: number): void;
  resize(): void;
  dispose(): void;
};

type Options = { tier: Tier; signal: AbortSignal; onFirstFrame(): void; onContextLost(): void };

export async function createHomeScene(canvas: HTMLCanvasElement, { tier, signal, onFirstFrame, onContextLost }: Options): Promise<HomeScene> {
  const pack = await loadPack(BAY_PACK.url, BAY_PACK.sections, signal);
  const { renderer, fit } = createRenderer(canvas, tier, { stencil: true });
  renderer.autoClear = false; // each frame clears once, then may draw two scenes into it
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

  // The vineyard camera, carried into the cellar's coordinates: the cellar's doorway plane lies where the lagar's
  // passage ends, and a metre is a metre in both.
  const place = new THREE.Vector3(), turn = new THREE.Quaternion(), upright = new THREE.Quaternion();
  const ENTRY_END = PORTAL_AT - CELLAR_DOOR + CELLAR_START.z; // the lagar-frame z at which the walk ends in the first bay

  /** Clears, then draws the cellar alone: the camera is past the door, or has come to the nave. */
  const drawCellar = (scene: Cellar) => {
    if (!shadowed.has("cellar")) {
      shadowed.add("cellar");
      renderer.shadowMap.needsUpdate = true;
    }
    scene.setPortal(false);
    renderer.clear();
    renderer.toneMappingExposure = 1;
    renderer.render(scene.scene, scene.camera);
  };

  /** Draws the scene the scroll is in, with the camera where the easing has brought it. */
  const paint = () => {
    const { width, height } = size;
    if (shown.walk >= 0.9995) {
      // In the nave: the camera drifts down the aisle.
      const scene = ensureCellar();
      scene.pose(shown.aisle, width, height);
      drawCellar(scene);
      return;
    }

    vineyard.pose(shown.walk, width / height);
    const view = vineyard.view;
    // The lagar's frame to the cellar's: one more metre into the passage is one more metre into the nave.
    place.set(view.position.x, view.position.y, view.position.z - PORTAL_AT + CELLAR_DOOR);

    if (view.position.z < PORTAL_AT) {
      // Through the door. The camera settles to the nave's lens and its place in the first bay as it goes.
      const blend = smoothstep(0, 1, (PORTAL_AT - view.position.z) / (PORTAL_AT - ENTRY_END));
      place.x = THREE.MathUtils.lerp(view.position.x, CELLAR_START.x, blend);
      place.y = THREE.MathUtils.lerp(view.position.y, CELLAR_START.y, blend);
      turn.copy(view.quaternion).slerp(upright.identity(), blend);
      const scene = ensureCellar();
      scene.enter(place, turn, view.fov, blend, width, height);
      drawCellar(scene);
      return;
    }

    // Outside: the vineyard, with the cellar showing through the door once it is built.
    if (!shadowed.has("vineyard")) {
      shadowed.add("vineyard");
      renderer.shadowMap.needsUpdate = true;
    }
    // The nave is wanted by the time the lagar is near enough for its doorway to show it.
    if (!cellar && view.position.z < 16) ensureCellar();
    const opening = view.open > 0.01; // behind a shut door there is nothing to draw
    renderer.clear();
    renderer.toneMappingExposure = 1.05;
    renderer.render(vineyard.scene, vineyard.camera);
    if (cellar && opening) {
      if (!shadowed.has("cellar")) {
        shadowed.add("cellar");
        renderer.shadowMap.needsUpdate = true;
      }
      cellar.setPortal(true);
      cellar.enter(place, view.quaternion, view.fov, 0, width, height);
      renderer.clearDepth();
      renderer.toneMappingExposure = 1;
      renderer.render(cellar.scene, cellar.camera);
    }
  };

  /**
   * Builds the cellar and draws it once, unseen, while the visitor is still reading the hero: its shaders, textures
   * and shadows are then ready, and walking through the door costs nothing. The vineyard is redrawn in the same
   * breath, so the cellar frame never reaches the screen. (It then also shows through the lagar's door.)
   */
  const warmCellar = () => {
    if (disposed || cellar || shown.walk >= 0.9995) return;
    drawCellar(ensureCellar());
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
      // Coming in through the door starts the nave from its first bay, not from wherever it was left.
      if (walk >= 1 && target.walk < 1) shown.aisle = 0;
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

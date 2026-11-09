"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import type { Wine } from "@/lib/types";

/**
 * The homepage background: a beige tablecloth seen from above, fixed behind the page. Scrolling moves the camera
 * along the table at the speed of the page, so the cloth pans with the content.
 *
 * Bottles belong to "stages": empty elements in the page marked with `data-bottle-stage="<id>"` (and optionally
 * `data-side="left"`). Each stage's bottles rest on the cloth where that element sits, and roll down to it from the
 * top corner of its side as the element scrolls into view. The stage with `intro` rolls in on load instead.
 *
 * The models come from public/models/bottles.glb, built by assets/blender/build_bottles.py.
 */
export type BottleStage = { id: string; wines: Wine[]; intro?: boolean };

const MODEL_URL = "/models/bottles.glb";
const BOTTLE_LENGTH = 0.3; // metres, as modelled
const FOV = 32;
const TILT = 0.3; // camera lean from straight down, radians
const CLOTH_TILE = 0.36; // metres covered by one repeat of the weave texture
const ROW_GAP = 0.128; // metres between resting bottles of a stage
const ROW_SHIFT = [0.035, -0.03, 0.02]; // sideways offset per bottle, so they do not line up
const YAW = [0.24, 0.42, 0.31]; // resting angle per bottle; also sets the diagonal they roll along
const STAGGER = 0.14;
const INTRO_SECONDS = 1.9;
const LABEL_UP = -Math.PI / 2; // spin that leaves the label facing up once a bottle has come to rest
const LABEL_ARC = (160 / 180) * Math.PI; // how far the label wraps around the bottle, as modelled

const GLASS: Record<Wine["glass"], { color: string; clear: boolean }> = {
  gold: { color: "#cfa536", clear: true },
  amber: { color: "#a9641a", clear: true },
  rose: { color: "#e58f7d", clear: true },
  mahogany: { color: "#2a120a", clear: false },
  green: { color: "#152210", clear: false },
  ink: { color: "#160e12", clear: false },
};
const FOIL: Record<Wine["foil"], string> = { wine: "#8e1c3b", gold: "#b08d3c", black: "#1d1d1f" };

type Bottle = {
  stage: number;
  index: number;
  count: number;
  root: THREE.Group;
  spin: THREE.Group;
  radius: number;
  rest: THREE.Vector3;
  yaw: number;
  /** 0 = at the start of its roll, 1 = at rest. `shown` trails `target` so the motion keeps some inertia. */
  shown: number;
};

type StageBox = { top: number; height: number; centerX: number; side: 1 | -1 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Woven linen: a beige ground with a fine warp and weft and some fibre noise. Tiles seamlessly. */
function clothTexture(maxAnisotropy: number) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#e9ddc6";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += 4) {
    ctx.fillStyle = "rgba(112, 82, 38, 0.10)";
    ctx.fillRect(0, i, size, 1);
    ctx.fillStyle = "rgba(255, 255, 255, 0.20)";
    ctx.fillRect(i, 0, 1, size);
  }
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 14;
    image.data[i] += grain;
    image.data[i + 1] += grain;
    image.data[i + 2] += grain;
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/** Paints a wine's label. The label mesh's UVs cover the whole image; only the middle faces the viewer. */
function labelTexture(wine: Wine, aspect: number, maxAnisotropy: number) {
  const width = 768;
  const height = Math.round(width / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f7f0e1";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = wine.accent;
  ctx.fillRect(0, height * 0.88, width, height * 0.12);
  ctx.fillStyle = "rgba(42, 33, 26, 0.55)";
  ctx.fillRect(width * 0.3, height * 0.245, width * 0.4, 2);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#2a211a";
  const center = width / 2;

  ctx.font = `600 ${height * 0.062}px Inter, "Helvetica Neue", Arial, sans-serif`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${height * 0.03}px`;
  ctx.fillText("MALAKA", center, height * 0.15);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

  // The name reads around the bottle, so it has to fit the half of the label that faces the viewer. Long names
  // break in two at the space nearest their middle, and the type shrinks if a line is still too wide.
  let lines = [wine.name];
  if (wine.name.length > 9 && wine.name.includes(" ")) {
    const spaces = [...wine.name.matchAll(/ /g)].map((match) => match.index);
    const middle = spaces.reduce((best, at) => (Math.abs(at - wine.name.length / 2) < Math.abs(best - wine.name.length / 2) ? at : best));
    lines = [wine.name.slice(0, middle), wine.name.slice(middle + 1)];
  }
  const nameFont = (size: number) => `600 ${size}px Georgia, "Times New Roman", serif`;
  let nameSize = height * (lines.length > 1 ? 0.19 : 0.22);
  ctx.font = nameFont(nameSize);
  const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
  nameSize *= Math.min(1, (width * 0.56) / widest);
  ctx.font = nameFont(nameSize);
  lines.forEach((line, index) => {
    ctx.fillText(line, center, height * 0.5 + (index - (lines.length - 1) / 2) * nameSize * 1.12);
  });

  ctx.font = `italic ${height * 0.075}px Georgia, "Times New Roman", serif`;
  ctx.fillText(wine.origin, center, height * 0.78);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false; // glTF UVs start at the top left, like the canvas
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export default function TableclothScene({ stages }: { stages: BottleStage[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      return; // No WebGL: the page keeps its plain beige background.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    const anisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f1e2c6");
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.4;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 20);

    scene.add(new THREE.HemisphereLight("#ffffff", "#cdc5b6", 0.72));
    const sun = new THREE.DirectionalLight("#fffaf2", 1.75);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.radius = 5;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.002;
    scene.add(sun, sun.target);
    const sunOffset = new THREE.Vector3(-0.4, 1, -0.3).normalize().multiplyScalar(3);

    // The cloth is one long static plane, so its weave stays put while the camera travels over it.
    const clothMap = clothTexture(anisotropy);
    const clothSize = { width: 24, length: 80 };
    clothMap.repeat.set(clothSize.width / CLOTH_TILE, clothSize.length / CLOTH_TILE);
    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(clothSize.width, clothSize.length),
      new THREE.MeshStandardMaterial({ map: clothMap, bumpMap: clothMap, bumpScale: 0.6, roughness: 1, metalness: 0 }),
    );
    cloth.rotation.x = -Math.PI / 2;
    cloth.position.z = clothSize.length / 2 - 10;
    cloth.receiveShadow = true;
    scene.add(cloth);

    // Two woven wine-colored stripes along each edge of the cloth.
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: "#8e1c3b",
      roughness: 1,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const stripes = [0, 1, 2, 3].map(() => {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1, clothSize.length), stripeMaterial);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.0004, cloth.position.z);
      stripe.receiveShadow = true;
      scene.add(stripe);
      return stripe;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bottles: Bottle[] = [];
    const textures: THREE.Texture[] = [clothMap];
    let boxes: (StageBox | null)[] = [];
    let metresPerPx = { x: 0.001, z: 0.001 };
    let distance = 1;
    let viewport = { width: 1, height: 1 };
    let introStart: number | null = null;
    let lastFrame = 0;
    let lastScroll = -1;
    let dirty = true;
    let frame = 0;
    let disposed = false;

    /** Reads the page: viewport size, the scale between pixels and metres, and where each stage sits. */
    function layout() {
      const width = canvas!.clientWidth;
      const height = canvas!.clientHeight;
      viewport = { width, height };
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // A bottle is this many pixels long on screen, which fixes how far away the camera sits.
      const bottlePx = width < 768 ? Math.min(width * 0.62, 300) : Math.min(Math.max(width * 0.3, 280), 440);
      const x = BOTTLE_LENGTH / bottlePx;
      metresPerPx = { x, z: x / Math.cos(TILT) };
      distance = (x * height) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));

      const reach = Math.max(width * x, height * metresPerPx.z) * 0.9;
      const shadowCamera = sun.shadow.camera;
      shadowCamera.left = shadowCamera.bottom = -reach;
      shadowCamera.right = shadowCamera.top = reach;
      shadowCamera.near = 0.5;
      shadowCamera.far = 6;
      shadowCamera.updateProjectionMatrix();

      const inset = width < 768 ? 12 : 30;
      [inset, inset + 11, width - inset, width - inset - 11].forEach((px, index) => {
        stripes[index].position.x = (px - width / 2) * x;
        stripes[index].scale.x = (index % 2 === 0 ? 6 : 2) * x;
        stripes[index].visible = width >= 768; // on a phone they would run under the text
      });

      boxes = stages.map((stage) => {
        const element = document.querySelector<HTMLElement>(`[data-bottle-stage="${stage.id}"]`);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.scrollY,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          side: element.dataset.side === "left" ? -1 : 1,
        };
      });

      for (const bottle of bottles) {
        const box = boxes[bottle.stage];
        bottle.root.visible = Boolean(box);
        if (!box) continue;
        const row = bottle.index - (bottle.count - 1) / 2;
        bottle.rest.set(
          (box.centerX - width / 2) * x + ROW_SHIFT[bottle.index % ROW_SHIFT.length] * box.side,
          bottle.radius,
          (box.top + box.height / 2) * metresPerPx.z + row * ROW_GAP,
        );
        // Bottles on the right come down from the top right, and the other way round.
        bottle.yaw = -box.side * YAW[bottle.index % YAW.length];
        bottle.root.rotation.y = bottle.yaw;
      }
      dirty = true;
    }

    function render(now: number) {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      const scroll = window.scrollY;
      if (scroll !== lastScroll) dirty = true;
      if (!dirty) return;
      lastScroll = scroll;

      const targetZ = (scroll + viewport.height / 2) * metresPerPx.z;
      camera.position.set(0, distance * Math.cos(TILT), targetZ + distance * Math.sin(TILT));
      camera.lookAt(0, 0, targetZ);
      sun.target.position.set(0, 0, targetZ);
      sun.position.copy(sun.target.position).add(sunOffset);

      let moving = false;
      const travel = viewport.height * 1.5 * metresPerPx.z;
      for (const bottle of bottles) {
        const box = boxes[bottle.stage];
        if (!box) continue;

        let stageProgress: number;
        if (reducedMotion.matches) {
          stageProgress = 1;
        } else if (stages[bottle.stage].intro) {
          stageProgress = introStart === null ? 0 : clamp01((now - introStart) / 1000 / INTRO_SECONDS);
          if (stageProgress < 1) moving = true;
        } else {
          // 0 when the stage's top edge reaches the bottom of the window, 1 when the stage is centred in it.
          stageProgress = clamp01((scroll + viewport.height - box.top) / ((viewport.height + box.height) / 2));
        }
        // The bottle that rests lowest sets off first, so none has to roll through one that has already stopped.
        const span = 1 - STAGGER * (bottle.count - 1);
        const order = bottle.count - 1 - bottle.index;
        const target = easeOut(clamp01((stageProgress - STAGGER * order) / span));

        if (reducedMotion.matches || stages[bottle.stage].intro) {
          bottle.shown = target;
        } else {
          bottle.shown += (target - bottle.shown) * (1 - Math.exp(-delta * 9));
          if (Math.abs(target - bottle.shown) > 0.0005) moving = true;
          else bottle.shown = target;
        }

        // Rolling without slipping: a bottle lying along `axis` rolls towards axis x up, turning distance / radius.
        const remaining = (1 - bottle.shown) * travel;
        bottle.root.position.set(
          bottle.rest.x - Math.sin(bottle.yaw) * remaining,
          bottle.rest.y,
          bottle.rest.z - Math.cos(bottle.yaw) * remaining,
        );
        bottle.spin.rotation.y = LABEL_UP - remaining / bottle.radius;
        bottle.root.visible = bottle.shown > 0.001;
      }

      renderer.render(scene, camera);
      dirty = moving;
    }

    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return;
      stages.forEach((stage, stageIndex) => {
        stage.wines.forEach((wine, index) => {
          const source = gltf.scene.getObjectByName(wine.shape);
          if (!source) return;
          const model = source.clone(true);
          model.position.set(0, 0, 0);

          const glass = GLASS[wine.glass];
          let radius = 0.038;
          model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            child.castShadow = true;
            const kind = (child.material as THREE.Material).name;
            if (kind === "Glass") {
              child.geometry.computeBoundingBox();
              radius = child.geometry.boundingBox!.max.x;
              // Clear glass lets the cloth show through the wine; dark glass only reflects.
              child.material = new THREE.MeshPhysicalMaterial({
                color: glass.color,
                roughness: 0.06,
                metalness: 0,
                clearcoat: 1,
                clearcoatRoughness: 0.04,
                envMapIntensity: glass.clear ? 2.4 : 3.2,
                ...(glass.clear && {
                  transmission: 0.7,
                  thickness: 0.07,
                  ior: 1.45,
                  attenuationColor: new THREE.Color(glass.color),
                  attenuationDistance: 0.06,
                }),
              });
            } else if (kind === "Foil") {
              child.material = new THREE.MeshStandardMaterial({ color: FOIL[wine.foil], metalness: 0.65, roughness: 0.38 });
            } else if (kind === "Label") {
              child.geometry.computeBoundingBox();
              const box = child.geometry.boundingBox!;
              // The label's bounding box gives its chord; its true width is the arc around the glass.
              const arc = (box.max.x / Math.sin(LABEL_ARC / 2)) * LABEL_ARC;
              const map = labelTexture(wine, arc / (box.max.y - box.min.y), anisotropy);
              textures.push(map);
              child.material = new THREE.MeshStandardMaterial({ map, roughness: 0.82, metalness: 0 });
            }
          });

          // root: place on the cloth and yaw · lay: tip the bottle on its side, neck to +X · spin: roll on its axis
          const root = new THREE.Group();
          const lay = new THREE.Group();
          const spin = new THREE.Group();
          lay.rotation.z = -Math.PI / 2;
          spin.add(model);
          lay.add(spin);
          root.add(lay);
          root.visible = false;
          scene.add(root);
          bottles.push({
            stage: stageIndex,
            index,
            count: stage.wines.length,
            root,
            spin,
            radius,
            rest: new THREE.Vector3(),
            yaw: 0,
            shown: 0,
          });
        });
      });
      layout();
      introStart = performance.now();
      setReady(true);
    });

    layout();
    frame = requestAnimationFrame(render);

    // Fonts loading, the FAQ opening or the window resizing all move the stages.
    const observer = new ResizeObserver(layout);
    observer.observe(document.body);
    window.addEventListener("resize", layout);
    reducedMotion.addEventListener("change", layout);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", layout);
      reducedMotion.removeEventListener("change", layout);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      });
      textures.forEach((texture) => texture.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [stages]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 h-lvh w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}

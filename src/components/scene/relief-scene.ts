import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import meta from "./data/province.json";
import { createRenderer, disposeScene, loadPack, unpredict, type Tier } from "./kit";

/**
 * The province of Málaga as a museum relief table, for the wine guide.
 *
 * The terrain is real elevation (see `scripts/3d/bake.mjs`), exaggerated and softened so it reads as a carved model,
 * with contour lines drawn in the shader, the sea as dark glass and a glowing needle on each wine area. `focus`
 * turns and zooms the table to one area; dragging turns it by hand. It only draws while something is moving.
 */
export type PlaceKey = keyof typeof meta.places;
export type ScreenPoint = { x: number; y: number };

export type Relief = {
  /** Turns the table to one place, or back to the whole province with `null`. */
  focus(place: PlaceKey | null): void;
  resize(): void;
  dispose(): void;
};

type Options = {
  tier: Tier;
  signal: AbortSignal;
  focus: PlaceKey | null;
  /** Called after every frame with where each needle's head is on the canvas, as fractions of its size. */
  onFrame(points: Record<PlaceKey, ScreenPoint>): void;
  onFirstFrame(): void;
  onContextLost(): void;
};

const TURN = -0.2; // the table is turned so the coast runs across the frame
const NEEDLE = 7.2;
const TINTS: Partial<Record<PlaceKey, string>> = {
  axarquia: "#e2735a",
  "montes-de-malaga": "#c2476a",
  "serrania-de-ronda": "#6f8fd0",
  "norte-de-malaga": "#d09a58",
};
const PLACES = Object.keys(meta.places) as PlaceKey[];
const landY = (metres: number) => (metres > 0 ? 0.03 + metres * meta.heightScale : -0.35);

type View = { x: number; z: number; azimuth: number; polar: number; distance: number };

export async function createRelief(canvas: HTMLCanvasElement, options: Options): Promise<Relief> {
  const { tier, signal, onFrame, onFirstFrame, onContextLost } = options;
  const pack = await loadPack("/3d/province.bin", meta.sections, signal);
  const heights = unpredict(pack.heights as Int16Array, meta.nx + 1);
  const { renderer, fit } = createRenderer(canvas, tier);
  const { nx, nz, width, depth } = meta;
  const unit = width / nx;

  const scene = new THREE.Scene();
  const background = new THREE.Color("#0a0914");
  scene.background = background;
  scene.fog = new THREE.FogExp2(background, 0.0024);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.1;
  pmrem.dispose();

  const table = new THREE.Group();
  table.rotation.y = TURN;
  scene.add(table);

  // Terrain.
  const count = (nx + 1) * (nz + 1);
  const position = new Float32Array(count * 3), elevation = new Float32Array(count), colors = new Float32Array(count * 3);
  const low = new THREE.Color("#4b3c50"), mid = new THREE.Color("#8b6c5a"), high = new THREE.Color("#dccdb4"), c = new THREE.Color();
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const v = j * (nx + 1) + i, h = heights[v];
    position[v * 3] = i * unit - width / 2;
    position[v * 3 + 1] = landY(h);
    position[v * 3 + 2] = j * unit - depth / 2;
    elevation[v] = h > 0 ? h : -1;
    const t = Math.min(1, h / 1700);
    if (t < 0.4) c.copy(low).lerp(mid, t / 0.4);
    else c.copy(mid).lerp(high, (t - 0.4) / 0.6);
    colors[v * 3] = c.r; colors[v * 3 + 1] = c.g; colors[v * 3 + 2] = c.b;
  }
  const index = new Uint32Array(nx * nz * 6);
  let n = 0;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, d = a + nx + 1, e = d + 1;
    if (heights[a] <= 0 && heights[b] <= 0 && heights[d] <= 0 && heights[e] <= 0) continue; // open sea: the glass covers it
    index[n++] = a; index[n++] = d; index[n++] = b;
    index[n++] = b; index[n++] = d; index[n++] = e;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("elev", new THREE.BufferAttribute(elevation, 1));
  geometry.setIndex(new THREE.BufferAttribute(index.subarray(0, n), 1));

  const tinted = PLACES.filter((key) => TINTS[key]);
  const stone = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93, metalness: 0.04, flatShading: true, envMapIntensity: 0.4 });
  stone.onBeforeCompile = (shader) => {
    // Contour lines every 100 m (stronger every 500 m) and a soft wash of color around each wine area.
    shader.uniforms.tintPos = { value: tinted.map((key) => new THREE.Vector3(meta.places[key][0], meta.places[key][1], 7.5)) };
    shader.uniforms.tintCol = { value: tinted.map((key) => new THREE.Color(TINTS[key])) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float elev; varying float vElev; varying vec2 vMap;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvElev = elev; vMap = position.xz;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vElev; varying vec2 vMap; uniform vec3 tintPos[4]; uniform vec3 tintCol[4]; float gLine; vec3 gTint;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        {
          float c = vElev / 100.0;
          float w = fwidth(c);
          float fine = 1.0 - smoothstep(0.0, 1.1, abs(fract(c - 0.5) - 0.5) / max(w, 1e-5));
          fine *= 1.0 - smoothstep(0.22, 0.6, w);
          float c5 = vElev / 500.0;
          float w5 = fwidth(c5);
          float major = 1.0 - smoothstep(0.0, 1.4, abs(fract(c5 - 0.5) - 0.5) / max(w5, 1e-5));
          major *= 1.0 - smoothstep(0.3, 0.8, w5);
          gLine = max(fine * 0.4, major) * step(4.0, vElev);
          gTint = vec3(0.0);
          float weight = 0.0;
          for (int i = 0; i < 4; i++) {
            float f = (1.0 - smoothstep(0.25, 1.0, distance(vMap, tintPos[i].xy) / tintPos[i].z)) * step(1.0, vElev);
            gTint += tintCol[i] * f; weight += f;
          }
          weight = min(weight, 1.0);
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.45 + gTint * 0.55, weight * 0.75);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.87, 0.76), gLine * 0.3);
        }`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.93, 0.87, 0.76) * gLine * 0.05 + gTint * 0.075 + gTint * gLine * 0.16;",
      );
  };
  const terrain = new THREE.Mesh(geometry, stone);
  terrain.castShadow = terrain.receiveShadow = true;
  table.add(terrain);

  // A skirt closes the cut edges of the land down to the slab.
  const edge: [number, number][] = [];
  for (let i = 0; i <= nx; i++) edge.push([i, 0]);
  for (let j = 1; j <= nz; j++) edge.push([nx, j]);
  for (let i = nx - 1; i >= 0; i--) edge.push([i, nz]);
  for (let j = nz - 1; j >= 0; j--) edge.push([0, j]);
  const skirtPosition: number[] = [], skirtIndex: number[] = [];
  edge.forEach(([i, j], k) => {
    const x = i * unit - width / 2, z = j * unit - depth / 2, y = Math.max(0, landY(heights[j * (nx + 1) + i]));
    skirtPosition.push(x, y, z, x, -0.02, z);
    const a = k * 2, b = ((k + 1) % edge.length) * 2;
    skirtIndex.push(a, b, a + 1, b, b + 1, a + 1);
  });
  const skirt = new THREE.BufferGeometry();
  skirt.setAttribute("position", new THREE.Float32BufferAttribute(skirtPosition, 3));
  skirt.setIndex(skirtIndex);
  skirt.computeVertexNormals();
  table.add(new THREE.Mesh(skirt, new THREE.MeshStandardMaterial({ color: "#2a2029", roughness: 0.85, metalness: 0.1, flatShading: true, side: THREE.DoubleSide })));

  // The sea is flat dark glass; the slab sits on a bronze plinth.
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth).rotateX(-Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: "#04060f", roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.7 }),
  );
  sea.position.y = 0.012;
  sea.receiveShadow = true;
  const slab = new THREE.Mesh(new THREE.BoxGeometry(width, 2.6, depth), new THREE.MeshStandardMaterial({ color: "#1d1820", roughness: 0.6, metalness: 0.25 }));
  slab.position.y = -1.3;
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(width + 5, 0.9, depth + 5), new THREE.MeshStandardMaterial({ color: "#3a2a22", roughness: 0.45, metalness: 0.7 }));
  plinth.position.y = -3.05;
  table.add(sea, slab, plinth);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#15121d", roughness: 0.9, metalness: 0, envMapIntensity: 0 }));
  floor.position.y = -3.5;
  scene.add(floor);
  // A soft contact shadow under the table instead of hard cast shadows on the floor.
  const blur = document.createElement("canvas");
  blur.width = blur.height = 256;
  const ctx = blur.getContext("2d")!;
  const shade = ctx.createRadialGradient(128, 128, 40, 128, 128, 128);
  shade.addColorStop(0, "rgba(0,0,0,0.9)");
  shade.addColorStop(0.55, "rgba(0,0,0,0.7)");
  shade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 256, 256);
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry((width + 5) * 1.7, (depth + 5) * 1.7).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(blur), transparent: true, depthWrite: false }),
  );
  contact.position.y = -3.47;
  table.add(contact);

  // Needles with glowing amber heads.
  const needleMaterial = new THREE.MeshStandardMaterial({ color: "#e9dfcc", roughness: 0.4, metalness: 0.5, emissive: "#e9dfcc", emissiveIntensity: 0.25 });
  const headMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffb24d").multiplyScalar(3.4) });
  const ringMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffb24d").multiplyScalar(1.5), side: THREE.DoubleSide });
  const heads = {} as Record<PlaceKey, THREE.Vector3>;
  const grounds = {} as Record<PlaceKey, THREE.Vector3>;
  table.updateMatrixWorld(true);
  for (const key of PLACES) {
    const [x, z, metres] = meta.places[key];
    const ground = Math.max(0.03, landY(metres));
    const top = TINTS[key] ? NEEDLE : 5.4; // the wine areas stand taller than the city and Manilva's coast
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, top - ground, 8), needleMaterial);
    needle.position.set(x, (top + ground) / 2, z);
    needle.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), headMaterial);
    head.position.set(x, top, z);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.68, 40).rotateX(-Math.PI / 2), ringMaterial);
    ring.position.set(x, ground + 0.12, z);
    const lamp = new THREE.PointLight("#ffa850", 5, 14, 1.8);
    lamp.position.set(x, top, z);
    table.add(needle, head, ring, lamp);
    heads[key] = new THREE.Vector3(x, top, z).applyMatrix4(table.matrixWorld);
    grounds[key] = new THREE.Vector3(x, ground, z).applyMatrix4(table.matrixWorld);
  }

  // Light: a warm rake from the west, a cool fill from the sky and the east.
  scene.add(new THREE.HemisphereLight("#6470c8", "#241a26", 1.15));
  const sun = new THREE.DirectionalLight("#ffcba6", 4.0);
  sun.position.set(-150, 46, -22);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(tier === "high" ? 4096 : 2048);
  Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 70, bottom: -70, near: 20, far: 320 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.08;
  const fill = new THREE.DirectionalLight("#6f7fe0", 0.55);
  fill.position.set(90, 70, 60);
  table.add(sun, sun.target, fill, fill.target);

  const camera = new THREE.PerspectiveCamera(31, 1.6, 1, 2000);
  let size = fit();

  // The camera orbits a point on the table. Each view is that point plus an angle round it, a tilt and a distance.
  const overview = (): View => {
    const aspect = size.width / size.height;
    // Centred on the land rather than the slab (its southern half is open sea), and far enough back for the whole
    // province to fit whatever the shape of the canvas.
    return { x: 4, z: -13, azimuth: 0, polar: 0.85, distance: Math.max(112, 182 / aspect) };
  };
  const viewOf = (place: PlaceKey | null): View => {
    if (!place) return overview();
    const ground = grounds[place], aspect = size.width / size.height;
    // The table turns towards the chosen area: those in the east are seen from the south-east, and so on.
    return { x: ground.x, z: ground.z + 3, azimuth: (ground.x / 50) * 0.5, polar: 0.86, distance: Math.max(58, 76 / aspect) };
  };
  let focused = options.focus;
  let goal = viewOf(focused);
  const view = { ...goal };
  let frame = 0, last = 0, first = true, disposed = false;
  const points = {} as Record<PlaceKey, ScreenPoint>;
  const projected = new THREE.Vector3();

  const draw = (now: number) => {
    frame = 0;
    if (disposed) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
    const ease = 1 - Math.exp(-dt * 4.2);
    let moving = false;
    for (const key of ["x", "z", "azimuth", "polar", "distance"] as const) {
      const gap = goal[key] - view[key];
      if (Math.abs(gap) > (key === "azimuth" || key === "polar" ? 0.0006 : 0.02)) {
        view[key] += gap * ease;
        moving = true;
      } else view[key] = goal[key];
    }
    const flat = Math.sin(view.polar) * view.distance;
    camera.position.set(view.x + Math.sin(view.azimuth) * flat, Math.cos(view.polar) * view.distance, view.z + Math.cos(view.azimuth) * flat);
    camera.lookAt(view.x, 0, view.z);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    for (const key of PLACES) {
      projected.copy(heads[key]).project(camera);
      points[key] = { x: projected.x * 0.5 + 0.5, y: -projected.y * 0.5 + 0.5 };
    }
    onFrame(points);
    if (first) {
      first = false;
      onFirstFrame();
    }
    last = moving ? now : 0;
    if (moving) frame = requestAnimationFrame(draw);
  };
  const invalidate = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  };

  // Dragging turns and tilts the table. Vertical swipes on a touch screen still scroll the page.
  let drag: { id: number; x: number; y: number } | null = null;
  const down = (event: PointerEvent) => {
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const base = viewOf(focused);
    goal.azimuth = Math.min(base.azimuth + 0.9, Math.max(base.azimuth - 0.9, goal.azimuth - (event.clientX - drag.x) * 0.006));
    if (event.pointerType === "mouse") goal.polar = Math.min(1.15, Math.max(0.55, goal.polar - (event.clientY - drag.y) * 0.004));
    drag.x = event.clientX;
    drag.y = event.clientY;
    invalidate();
  };
  const up = (event: PointerEvent) => {
    if (drag?.id === event.pointerId) drag = null;
  };
  const lost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("webglcontextlost", lost);

  renderer.shadowMap.needsUpdate = true;
  invalidate();

  return {
    focus(place) {
      focused = place;
      goal = viewOf(place);
      invalidate();
    },
    resize() {
      size = fit();
      const azimuth = goal.azimuth, polar = goal.polar;
      goal = { ...viewOf(focused), azimuth, polar };
      invalidate();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("webglcontextlost", lost);
      disposeScene(scene);
      room.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}

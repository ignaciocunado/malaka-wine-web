import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import { halo, instances, lit, rng, type Instance } from "./kit";

/**
 * The lagar at the end of the vineyard track: a whitewashed press-house with a clay-tile roof, its stone arch open
 * on the cellar. Everything is modelled in metres with the door facing +Z; `vineyard.ts` scales and places it.
 *
 * The arch is a real passage through a 1.1 m wall, lined in dressed stone, with a pair of studded doors hung in it that
 * swing in against its walls as the visitor arrives (`setDoor`). Its inner mouth (`PORTAL_AT`) holds an
 * invisible "portal": the cellar is drawn through it (see `home-scene.ts`), so the visitor sees the lamplit nave
 * from the track and walks into it without a cut. Without the cellar, a glowing plane behind the portal stands in.
 *
 * Surfaces are painted on canvases at start-up (plaster, tiles, stone, timber), each with a height map for bump.
 */
export const SCALE = 0.62; // scene units per metre
export const PORTAL_AT = 1.1; // z of the passage's inner mouth, in metres

const W = 7.2; // width of the main house
const H = 3.0; // height of its walls
const D = 4.4; // depth
const FRONT = D / 2;
const WALL = 1.1; // thickness of the front wall, which is the length of the passage
const ARCH = { half: 0.975, spring: 1.575 }; // the door: a semicircle on straight jambs
const WINDOW_X = 3.0;
const PITCH = (26 * Math.PI) / 180;

/* ------------------------------------------------------------------------------------------------ textures */

type Field = Float32Array;

/** Tileable value noise in 0..1. Each layer is a grid of [columns, rows] random cells, half the weight of the one before. */
function noise(size: number, rand: () => number, layers: [number, number][]): Field {
  const out = new Float32Array(size * size);
  let weight = 1, total = 0;
  for (const [nx, ny] of layers) {
    const cells = Float32Array.from({ length: nx * ny }, rand);
    for (let y = 0; y < size; y++) {
      const fy = (y / size) * ny, y0 = Math.floor(fy), ty = fy - y0, sy = ty * ty * (3 - 2 * ty);
      const row0 = (y0 % ny) * nx, row1 = ((y0 + 1) % ny) * nx;
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * nx, x0 = Math.floor(fx), tx = fx - x0, sx = tx * tx * (3 - 2 * tx), x1 = (x0 + 1) % nx;
        const a = cells[row0 + x0], b = cells[row0 + x1], c = cells[row1 + x0], d = cells[row1 + x1];
        out[y * size + x] += weight * (a + (b - a) * sx + (c - a + (a - b - c + d) * sx) * sy);
      }
    }
    total += weight;
    weight *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/** A square canvas filled pixel by pixel: `pixel` writes red, green and blue (0 to 255) at `data[o]`. */
function paint(size: number, pixel: (data: Uint8ClampedArray, o: number, i: number, x: number, y: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0, i = 0; y < size; y++) {
    for (let x = 0; x < size; x++, i++) {
      const o = i * 4;
      pixel(image.data, o, i, x, y);
      image.data[o + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

const grey = (field: Field, size: number, gain = 1, bias = 0) =>
  paint(size, (d, o, i) => {
    d[o] = d[o + 1] = d[o + 2] = (field[i] * gain + bias) * 255;
  });

const surface = (canvas: HTMLCanvasElement, color: boolean) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.anisotropy = 8;
  return texture;
};

/** Lime wash over rendered stone: mottled, with rain streaks, damp patches and the odd chip showing the stone under it. */
function plasterMaps(rand: () => number) {
  const size = 1024;
  const blotch = noise(size, rand, [[3, 3], [7, 7], [18, 18]]);
  const grain = noise(size, rand, [[90, 90], [180, 180]]);
  const runs = noise(size, rand, [[26, 3], [60, 6]]);
  const color = paint(size, (d, o, i) => {
    const t = 0.9 + blotch[i] * 0.2 + (grain[i] - 0.5) * 0.12;
    const stain = Math.max(0, runs[i] - 0.6) * 1.5;
    const damp = Math.max(0, 0.38 - blotch[i]) * 2.4;
    d[o] = 236 * t - stain * 64 - damp * 14;
    d[o + 1] = 226 * t - stain * 72 - damp * 26;
    d[o + 2] = 206 * t - stain * 88 - damp * 52;
  });
  const ctx = color.getContext("2d")!;
  for (let n = 0; n < 4; n++) {
    const cx = 80 + rand() * (size - 160), cy = 80 + rand() * (size - 160), r = 14 + rand() * 26;
    ctx.beginPath();
    for (let a = 0; a <= 24; a++) {
      const wobble = r * (0.65 + rand() * 0.55);
      ctx[a ? "lineTo" : "moveTo"](cx + Math.cos((a / 24) * 6.283) * wobble * 1.4, cy + Math.sin((a / 24) * 6.283) * wobble);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(168, 138, 112, 0.7)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(120, 98, 80, 0.4)";
    ctx.stroke();
  }
  const bump = grey(noise(512, rand, [[40, 40], [90, 90], [180, 180]]), 512, 0.8, 0.1);
  return { map: surface(color, true), bump: surface(bump, false) };
}

/** Spanish roof tiles: columns of convex covers over concave pans, each course lapping over the one below. */
function roofMaps(rand: () => number) {
  const cols = 16, rows = 8;
  const tone = Float32Array.from({ length: cols * rows }, rand);
  const draw = (size: number, color: boolean) => {
    const cw = size / cols, rh = size / rows;
    const weather = noise(size, rand, [[6, 6], [24, 24]]);
    return paint(size, (d, o, i, x, y) => {
      const c = Math.floor(x / cw), r = Math.floor(y / rh);
      const fx = (x % cw) / cw, fy = (y % rh) / rh;
      const cover = c % 2 === 0;
      const hump = Math.sin(Math.PI * fx);
      const lean = Math.cos(Math.PI * fx) * (cover ? 1 : -1);
      const height = cover ? 0.55 + 0.45 * hump : 0.1 + 0.25 * (1 - hump);
      // The lower end of every tile stands proud of the one below; its upper end sinks under the course above.
      const lap = fy < 0.1 ? fy / 0.1 : 1;
      if (!color) {
        d[o] = d[o + 1] = d[o + 2] = (height * (0.5 + 0.5 * lap) + (fy > 0.92 ? 0.15 : 0)) * 255;
        return;
      }
      const t = 0.82 + tone[r * cols + c] * 0.36;
      const shade = (0.8 + 0.28 * lean * 0.7) * (cover ? 0.95 + 0.2 * hump : 0.62 + 0.3 * hump) * (0.5 + 0.5 * lap) * (fy > 0.9 ? 1.12 : 1);
      const w = Math.min(1, weather[i] * 1.3) * 0.5;
      const lichen = weather[i] > 0.7 ? (weather[i] - 0.7) * 3 : 0;
      d[o] = (178 * t * (1 - w) + 158 * w) * shade * (1 - lichen * 0.35) + lichen * 20;
      d[o + 1] = (94 * t * (1 - w) + 124 * w) * shade + lichen * 26;
      d[o + 2] = (60 * t * (1 - w) + 98 * w) * shade * (1 - lichen * 0.2);
    });
  };
  return { map: surface(draw(1024, true), true), bump: surface(draw(512, false), false) };
}

/** Warm sandstone, pitted and mottled. */
function stoneMaps(rand: () => number) {
  const size = 512;
  const n = noise(size, rand, [[4, 4], [10, 10], [30, 30], [80, 80]]);
  const pits = noise(size, rand, [[100, 100], [200, 200]]);
  const color = paint(size, (d, o, i) => {
    const t = 0.78 + n[i] * 0.42 - (pits[i] > 0.78 ? 0.16 : 0);
    d[o] = 208 * t;
    d[o + 1] = 186 * t;
    d[o + 2] = 150 * t;
  });
  const bump = grey(n.map((v, i) => v * 0.7 + pits[i] * 0.3), size);
  return { map: surface(color, true), bump: surface(bump, false) };
}

/** Vertical planks, tinted by the material's color: grain, gaps between boards, a few knots. */
function timberMaps(rand: () => number) {
  const size = 512, plank = size / 8;
  const grain = noise(size, rand, [[40, 3], [90, 6]]);
  const tone = Float32Array.from({ length: 8 }, () => 0.82 + rand() * 0.26);
  const knots = Array.from({ length: 5 }, () => [rand() * size, rand() * size, 5 + rand() * 6]);
  const heights = new Float32Array(size * size);
  const color = paint(size, (d, o, i, x, y) => {
    const seam = x % plank;
    let t = tone[Math.floor(x / plank)] * (0.75 + grain[i] * 0.5);
    let height = 1;
    if (seam < 2.5 || seam > plank - 1.5) { t *= 0.3; height = 0; }
    for (const [kx, ky, kr] of knots) {
      const dist = Math.hypot(x - kx, (y - ky) * 0.6);
      if (dist < kr) { t *= 0.55 + 0.45 * (dist / kr); height *= 0.8; }
    }
    heights[i] = height * (0.6 + grain[i] * 0.4);
    d[o] = 190 * t;
    d[o + 1] = 152 * t;
    d[o + 2] = 112 * t;
  });
  return { map: surface(color, true), bump: surface(grey(heights, size), false) };
}

/** Flagstones for the floor of the passage. */
function flagMaps(rand: () => number) {
  const size = 512, rows = 4;
  const speckle = noise(size, rand, [[30, 30], [90, 90]]);
  const tones: number[][] = [];
  const heights = new Float32Array(size * size);
  const color = paint(size, (d, o, i, x, y) => {
    const row = Math.floor((y / size) * rows), rh = size / rows;
    const shift = row % 2 ? size / 4 : 0;
    const cols = 2, cw = size / cols, cx = Math.floor((x + shift) / cw);
    tones[row] ??= [];
    tones[row][cx % 4] ??= 0.82 + rand() * 0.3;
    const joint = y % rh < 3 || (x + shift) % cw < 3;
    const t = tones[row][cx % 4] * (0.85 + speckle[i] * 0.3) * (joint ? 0.35 : 1);
    heights[i] = joint ? 0 : 0.6 + speckle[i] * 0.4;
    d[o] = 150 * t;
    d[o + 1] = 132 * t;
    d[o + 2] = 112 * t;
  });
  return { map: surface(color, true), bump: surface(grey(heights, size), false) };
}

/* ------------------------------------------------------------------------------------------------ geometry */

/** Multiplies a geometry's UVs, so a texture repeats every `tile` metres on a surface sized in metres. */
const scaleUV = (geometry: THREE.BufferGeometry, scale: number, offset = 0) => {
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * scale + offset, uv.getY(i) * scale + offset * 0.7);
  return geometry;
};

/** A box whose texture repeats every `tile` metres on every face, from a different starting point on each mesh. */
function box(w: number, h: number, d: number, tile: number, rand: () => number) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const faces = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  const uv = geometry.attributes.uv;
  const [ou, ov] = [rand(), rand()];
  faces.forEach(([a, b], face) => {
    for (let k = 0; k < 4; k++) {
      const i = face * 4 + k;
      uv.setXY(i, (uv.getX(i) * a) / tile + ou, (uv.getY(i) * b) / tile + ov);
    }
  });
  return geometry;
}

const rectShape = (x0: number, y0: number, x1: number, y1: number) => {
  const shape = new THREE.Shape();
  shape.moveTo(x0, y0);
  shape.lineTo(x1, y0);
  shape.lineTo(x1, y1);
  shape.lineTo(x0, y1);
  shape.closePath();
  return shape;
};

const archShape = (half: number, spring: number, bottom = 0) => {
  const shape = new THREE.Shape();
  shape.moveTo(-half, bottom);
  shape.lineTo(half, bottom);
  shape.lineTo(half, spring);
  shape.absarc(0, spring, half, 0, Math.PI, false);
  shape.closePath();
  return shape;
};

/** The front wall: 75 cm thick, with the door and two windows cut through it. UVs are in metres. */
function facade(tile: number) {
  const shape = rectShape(-W / 2, 0, W / 2, H);
  shape.holes.push(archShape(ARCH.half, ARCH.spring));
  for (const side of [-1, 1]) shape.holes.push(rectShape(side * WINDOW_X - 0.3, 1.2, side * WINDOW_X + 0.3, 2.15));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: WALL, bevelEnabled: false, curveSegments: 28 });
  geometry.translate(0, 0, FRONT - WALL);
  return scaleUV(geometry, 1 / tile);
}

/**
 * The stone lining of the door: thirteen voussoirs round the arch with a longer keystone, and four courses of
 * jamb stones with alternating quoins. Each stone is its own bevelled block, with its own tone, so the joints read.
 */
function doorStone(rand: () => number) {
  const parts: THREE.BufferGeometry[] = [];
  const depth = WALL + 0.12;
  const bevel = 0.012;
  const add = (shape: THREE.Shape) => {
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1, curveSegments: 1 });
    geometry.translate(0, 0, FRONT - WALL + bevel);
    const tint = 0.84 + rand() * 0.24, count = geometry.attributes.position.count, colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colors.set([tint, tint * 0.97, tint * 0.93], i * 3);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    scaleUV(geometry, 1.1, rand());
    parts.push(geometry);
  };
  const inner = ARCH.half - 0.015, outer = ARCH.half + 0.305, key = 6, wedges = 13, gap = 0.016;
  const at = (radius: number, angle: number): [number, number] => [Math.cos(angle) * radius, ARCH.spring + Math.sin(angle) * radius];
  for (let k = 0; k < wedges; k++) {
    const a0 = (Math.PI * k) / wedges + gap, a1 = (Math.PI * (k + 1)) / wedges - gap;
    const reach = k === key ? outer + 0.13 : outer;
    const shape = new THREE.Shape();
    shape.moveTo(...at(inner, a0));
    shape.lineTo(...at(reach, a0));
    shape.lineTo(...at(reach, a1));
    shape.lineTo(...at(inner, a1));
    shape.closePath();
    add(shape);
  }
  const courses = [0.43, 0.37, 0.41, 0.365];
  for (const side of [-1, 1]) {
    let y = 0;
    courses.forEach((height, index) => {
      const reach = ARCH.half + (index % 2 ? 0.305 : 0.56);
      const [x0, x1] = side < 0 ? [-reach, -inner] : [inner, reach];
      add(rectShape(x0, y + gap / 2, x1, y + height - gap / 2));
      y += height;
    });
  }
  return mergeGeometries(parts);
}

/** A wrought-iron lantern hanging from a bracket. Returns the group and the point its flame sits at. */
function lantern(glow: THREE.Texture) {
  const group = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: "#121016", roughness: 0.55, metalness: 0.4 });
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.5), iron);
  arm.position.set(0, 0, 0.25);
  const brace = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.4), iron);
  brace.position.set(0, -0.19, 0.17);
  brace.rotation.x = -0.6;
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.009, 6, 12, Math.PI), iron);
  hook.position.set(0, -0.06, 0.5);
  hook.rotation.z = Math.PI;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.27, 6, 1), lit("#ffcf8a", 3.2));
  body.position.set(0, -0.26, 0.5);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.1, 6), iron);
  cap.position.set(0, -0.08, 0.5);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.085, 0.03, 6), iron);
  foot.position.set(0, -0.41, 0.5);
  group.add(arm, brace, hook, body, cap, foot);
  for (let k = 0; k < 6; k++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.28, 0.012), iron);
    const angle = (k / 6) * Math.PI * 2, r = 0.09;
    bar.position.set(Math.cos(angle) * r, -0.26, 0.5 + Math.sin(angle) * r);
    group.add(bar);
  }
  const shine = halo(glow, "#ffb060", 1.1, 0.7);
  shine.position.set(0, -0.26, 0.5);
  group.add(shine);
  return { group, flame: new THREE.Vector3(0, -0.26, 0.5) };
}

/** A standing cask: bulging staves with iron hoops. */
function barrel(timber: THREE.Material, iron: THREE.Material, height = 0.92, radius = 0.32) {
  const group = new THREE.Group();
  const profile = [[0.001, 0], [0.78, 0], [0.9, 0.2], [1, 0.5], [0.9, 0.8], [0.78, 1], [0.001, 1]].map(([r, y]) => new THREE.Vector2(r * radius, y * height));
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 24), timber);
  body.castShadow = body.receiveShadow = true;
  group.add(body);
  const swell = (y: number) => {
    const d = Math.min(y, 1 - y); // the staves' radius against height, as in the profile above
    return d < 0.2 ? 0.78 + 0.6 * d : 0.9 + 0.333 * (d - 0.2);
  };
  for (const y of [0.1, 0.27, 0.73, 0.9]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(radius * swell(y) * 1.01, 0.011, 6, 28), iron);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = y * height;
    group.add(hoop);
  }
  return group;
}

/* ------------------------------------------------------------------------------------------------ the house */

export type Lagar = {
  group: THREE.Group;
  /** The mouth of the passage: draws nothing, but marks where the cellar shows through. */
  portal: THREE.Mesh;
  /** Swings the doors: 0 is shut, 1 is wide open. The light of the cellar spills out as they open. */
  setDoor(open: number): void;
};

export function buildLagar(glow: THREE.Texture): Lagar {
  const rand = rng(11);
  const group = new THREE.Group();
  const maps = { plaster: plasterMaps(rand), roof: roofMaps(rand), stone: stoneMaps(rand), timber: timberMaps(rand), flags: flagMaps(rand) };

  const plaster = new THREE.MeshStandardMaterial({ map: maps.plaster.map, bumpMap: maps.plaster.bump, bumpScale: 2, roughness: 0.96 });
  const tiles = new THREE.MeshStandardMaterial({ map: maps.roof.map, bumpMap: maps.roof.bump, bumpScale: 5, roughness: 0.85 });
  const stone = new THREE.MeshStandardMaterial({ map: maps.stone.map, bumpMap: maps.stone.bump, bumpScale: 3, roughness: 0.92 });
  const dressed = new THREE.MeshStandardMaterial({ map: maps.stone.map, bumpMap: maps.stone.bump, bumpScale: 3, roughness: 0.9, vertexColors: true });
  const flags = new THREE.MeshStandardMaterial({ map: maps.flags.map, bumpMap: maps.flags.bump, bumpScale: 3, roughness: 0.8 });
  const oak = new THREE.MeshStandardMaterial({ map: maps.timber.map, bumpMap: maps.timber.bump, bumpScale: 2.5, roughness: 0.85, color: "#8d6a4a" });
  const painted = new THREE.MeshStandardMaterial({ map: maps.timber.map, bumpMap: maps.timber.bump, bumpScale: 2, roughness: 0.7, color: "#3a6a60" });
  const iron = new THREE.MeshStandardMaterial({ color: "#16131a", roughness: 0.55, metalness: 0.35 });

  const place = (geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // The walls: the front slab with its door and windows, and the rest of the house behind it, open at the front so
  // the passage leads into it.
  place(facade(2.4), plaster);
  for (const s of [-1, 1]) place(box(0.4, H, D - WALL, 2.4, rand), plaster, s * (W / 2 - 0.2), H / 2, -WALL / 2);
  place(box(W, H, 0.4, 2.4, rand), plaster, 0, H / 2, -FRONT + 0.2);

  // A stone plinth round the foot of the walls.
  const plinthH = 0.42;
  for (const s of [-1, 1]) {
    place(box(W / 2 - ARCH.half - 0.58, plinthH, 0.1, 0.9, rand), stone, s * ((W / 2 + ARCH.half + 0.58) / 2), plinthH / 2, FRONT + 0.05);
    place(box(0.1, plinthH, D, 0.9, rand), stone, s * (W / 2 + 0.05), plinthH / 2, 0);
  }

  // The door: dressed stone, the passage floor and a worn step.
  place(doorStone(rand), dressed);
  place(box(ARCH.half * 2 - 0.03, 0.2, WALL + 0.12, 0.8, rand), flags, 0, -0.08, FRONT - WALL / 2 + 0.06);
  place(box(2.5, 0.12, 0.62, 0.9, rand), stone, 0, 0.06, FRONT + 0.12 + 0.31);
  place(box(2.1, 0.06, 0.4, 0.9, rand), stone, 0, 0.03, FRONT + 0.12 + 0.62 + 0.2);

  // The doors: two arch-topped leaves of studded, strapped oak, hung just inside the lining. They are drawn shut;
  // `setDoor` swings them in, to lie against the passage walls.
  const hinge = ARCH.half - 0.025, leafW = hinge - 0.005;
  const leaves = [-1, 1].map((s) => {
    const shape = new THREE.Shape();
    // The hinge is the origin and the leaf reaches towards the middle, so turning the group swings it.
    const toward = -s;
    shape.moveTo(0, 0);
    shape.lineTo(toward * leafW, 0);
    shape.lineTo(toward * leafW, ARCH.spring + leafW);
    shape.absarc(toward * leafW, ARCH.spring, leafW, Math.PI / 2, s > 0 ? 0 : Math.PI, s > 0);
    shape.closePath();
    const pivot = new THREE.Group();
    pivot.add(new THREE.Mesh(scaleUV(new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false, curveSegments: 18 }), 1, rand()), oak));
    for (const y of [0.55, 1.6]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(leafW * 0.92, 0.07, 0.014), iron);
      strap.position.set(toward * leafW * 0.46, y, 0.066);
      pivot.add(strap);
    }
    const studs: Instance[] = [];
    for (let row = 0; row < 8; row++) for (let col = 0; col < 3; col++) studs.push({ p: [toward * (0.2 + col * 0.25), 0.28 + row * 0.27, 0.064], s: 0.016 });
    pivot.add(instances(new THREE.SphereGeometry(1, 6, 4), iron, studs, { cast: false }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 14), iron);
    ring.position.set(toward * (leafW - 0.09), 1.05, 0.07);
    pivot.add(ring);
    pivot.position.set(s * hinge, 0, FRONT - 0.1);
    pivot.traverse((child) => { if ((child as THREE.Mesh).isMesh) child.castShadow = child.receiveShadow = true; });
    group.add(pivot);
    return { pivot, s };
  });

  // Windows: stone sill and lintel, an iron grille, open shutters, and lamplight inside.
  const grilleBar = new THREE.CylinderGeometry(0.009, 0.009, 0.95, 5);
  const crossBar = new THREE.CylinderGeometry(0.009, 0.009, 0.6, 5).rotateZ(Math.PI / 2);
  for (const s of [-1, 1]) {
    const x = s * WINDOW_X;
    place(box(0.86, 0.07, 0.3, 0.7, rand), stone, x, 1.165, FRONT + 0.1);
    place(box(0.86, 0.15, 0.22, 0.7, rand), stone, x, 2.22, FRONT + 0.06);
    for (let k = -2; k <= 2; k++) place(grilleBar, iron, x + k * 0.12, 1.675, FRONT - 0.1);
    for (const y of [1.5, 1.9]) place(crossBar, iron, x, y, FRONT - 0.1);
    for (const e of [-1, 1]) place(box(0.29, 0.98, 0.045, 1, rand), painted, x + e * 0.47, 1.68, FRONT + 0.03);
    const inside = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.95), lit("#ff9f48", 1.55));
    inside.position.set(x, 1.675, FRONT - WALL + 0.3);
    group.add(inside);
    const shine = halo(glow, "#ffa040", 1.5, 0.3);
    shine.position.set(x, 1.675, FRONT + 0.25);
    group.add(shine);
  }

  // The roof: two slopes of clay tile with a ridge, rafter ends under the eaves, a chimney.
  const eave = H - 0.02, eaveZ = FRONT + 0.52, rise = eaveZ * Math.tan(PITCH), ridge = eave + rise;
  const slope = Math.hypot(eaveZ, rise), roofW = W + 0.7;
  for (const s of [-1, 1]) {
    const slab = box(roofW, 0.13, slope, 1.5, rand);
    const edge = new THREE.MeshStandardMaterial({ color: "#6e3d2b", roughness: 0.9 });
    place(slab, [edge, edge, tiles, edge, edge, edge], 0, (ridge + eave) / 2 + 0.07, (s * eaveZ) / 2, s * PITCH);
  }
  const cap = new THREE.CylinderGeometry(0.15, 0.15, roofW + 0.12, 10, 1, true, 0, Math.PI).rotateZ(Math.PI / 2);
  const ridgeTile = new THREE.MeshStandardMaterial({ map: maps.roof.map, bumpMap: maps.roof.bump, bumpScale: 3, roughness: 0.8, side: THREE.DoubleSide, color: "#e0c0a8" });
  place(cap, ridgeTile, 0, ridge + 0.1, 0);
  for (const s of [-1, 1]) {
    const gable = new THREE.Shape();
    gable.moveTo(-FRONT, 0);
    gable.lineTo(FRONT, 0);
    gable.lineTo(0, ridge - H - 0.04);
    gable.closePath();
    const wall = new THREE.ExtrudeGeometry(gable, { depth: 0.4, bevelEnabled: false }).rotateY(Math.PI / 2);
    place(scaleUV(wall, 1 / 2.4), plaster, s < 0 ? -W / 2 : W / 2 - 0.4, H, 0);
  }
  const rafters: Instance[] = [];
  for (let x = -W / 2 - 0.2; x <= W / 2 + 0.2; x += 0.46) rafters.push({ p: [x, eave - 0.05, FRONT + 0.3], s: [0.075, 0.1, 0.62] });
  group.add(instances(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "#3a271c", roughness: 0.9 }), rafters));
  const chimney = box(0.6, 2.3, 0.6, 2.4, rand);
  place(chimney, plaster, -2.3, 3.9, -0.7);
  place(box(0.76, 0.1, 0.76, 1, rand), stone, -2.3, 5.1, -0.7);
  for (const dx of [-0.13, 0.13]) place(new THREE.CylinderGeometry(0.085, 0.1, 0.3, 10), tiles, -2.3 + dx, 5.3, -0.7);

  // The wing on the right: lower, with a lean-to roof and a plank door.
  const wingW = 3.4, wingH = 2.2, wingD = 3.2, wingX = W / 2 + 1.5, wingZ = -0.4;
  place(box(wingW, wingH, wingD, 2.4, rand), plaster, wingX, wingH / 2, wingZ);
  const wingFront = wingZ + wingD / 2;
  place(box(wingW + 0.1, 0.4, 0.1, 0.9, rand), stone, wingX, 0.2, wingFront + 0.05);
  const lean = box(wingW + 0.7, 0.12, wingD + 0.8, 1.5, rand);
  const leanMaterial = new THREE.MeshStandardMaterial({ color: "#6e3d2b", roughness: 0.9 });
  place(lean, [leanMaterial, leanMaterial, tiles, leanMaterial, leanMaterial, leanMaterial], wingX + 0.1, wingH + 0.3, wingZ, 0, 0, -0.2);
  place(box(1.0, 1.85, 0.06, 1, rand), oak, wingX, 0.97, wingFront + 0.01);
  place(box(1.3, 0.15, 0.24, 0.8, rand), stone, wingX, 1.95, wingFront + 0.08);
  for (const y of [0.45, 1.5]) place(box(0.9, 0.06, 0.02, 1, rand), iron, wingX, y, wingFront + 0.05);

  // The lantern beside the door, with its own light, and the stand-in glow behind the portal.
  const lamp = lantern(glow);
  lamp.group.position.set(ARCH.half + 0.88, 2.55, FRONT);
  group.add(lamp.group);
  const light = new THREE.PointLight("#ffb060", 1.8, 3.4, 1.6);
  light.position.copy(lamp.group.position).add(lamp.flame).add(new THREE.Vector3(0, -0.05, 0.12));
  const passageLight = new THREE.PointLight("#ffa850", 1.2, 2.6, 1.6);
  passageLight.position.set(0, 1.9, FRONT - WALL / 2);
  group.add(light, passageLight);

  const backing = new THREE.Mesh(new THREE.ShapeGeometry(archShape(1.1, ARCH.spring - 0.1, 0), 20), lit("#ffa238", 1.7));
  backing.position.z = PORTAL_AT - 0.08;
  const doorGlow = halo(glow, "#ff9a40", 3.2, 0.22);
  const glowColor = doorGlow.material.color.clone();
  doorGlow.position.set(0, 1.2, FRONT + 0.5);
  group.add(backing, doorGlow);

  // Casks by the door, pots of geraniums, and bougainvillea climbing the left of the wall.
  const staves = new THREE.MeshStandardMaterial({ map: maps.timber.map, bumpMap: maps.timber.bump, bumpScale: 2, roughness: 0.85, color: "#7a5436" });
  for (const [x, z, h, r] of [[3.85, FRONT + 0.55, 0.95, 0.33], [3.5, FRONT + 0.15, 0.8, 0.29], [-2.0, FRONT + 0.6, 0.92, 0.32]]) {
    const cask = barrel(staves, iron, h, r);
    cask.position.set(x, 0, z);
    group.add(cask);
  }
  const potProfile = [[0.001, 0], [0.12, 0], [0.19, 0.14], [0.21, 0.3], [0.17, 0.34], [0.19, 0.37]].map(([r, y]) => new THREE.Vector2(r, y));
  const potGeometry = new THREE.LatheGeometry(potProfile, 14);
  const clay = new THREE.MeshStandardMaterial({ color: "#a8603c", roughness: 0.85, side: THREE.DoubleSide });
  const foliage: Instance[] = [], blooms: Instance[] = [];
  for (const [x, z] of [[1.0, FRONT + 0.55], [-1.05, FRONT + 0.6], [2.55, FRONT + 0.5]]) {
    place(potGeometry, clay, x, 0, z);
    for (let k = 0; k < 7; k++) {
      const a = rand() * 6.28, d = rand() * 0.12;
      foliage.push({ p: [x + Math.cos(a) * d, 0.43 + rand() * 0.12, z + Math.sin(a) * d], s: [0.1, 0.07, 0.1], r: rand() * 3, c: ["#4d7a3a", "#5c8a44", "#3f6a33"][k % 3] });
      if (k % 2) blooms.push({ p: [x + Math.cos(a) * d * 1.3, 0.54 + rand() * 0.1, z + Math.sin(a) * d * 1.3], s: 0.04, c: ["#d23a52", "#e8566c"][k % 2 ? 0 : 1] });
    }
  }
  // Bougainvillea climbs from behind the open leaf, up the wall and along under the eaves: leaves in small clumps,
  // and bracts of magenta.
  const strands: [number, number, number][] = [[-1.85, 0.5, 1], [-1.5, 0.5, 1], [-2.3, 0.5, -1], [-3.48, 0.45, -1], [3.46, 0.45, 1]];
  for (const [x0, y0, along] of strands) {
    let x = x0, y = y0;
    for (let step = 0; step < 30; step++) {
      if (y < 2.78) y += 0.1 + rand() * 0.07;
      else x += along * (0.09 + rand() * 0.07);
      x += (rand() - 0.5) * 0.1;
      y += (rand() - 0.5) * (y < 2.78 ? 0.04 : 0.16);
      const z = FRONT + 0.03 + rand() * 0.08;
      for (let k = 0; k < 3; k++) {
        const size = 0.05 + rand() * 0.035;
        foliage.push({ p: [x + (rand() - 0.5) * 0.2, y + (rand() - 0.5) * 0.16, z + rand() * 0.04], s: [size, size * 0.7, size * 0.35], r: rand() * 3, rz: rand() * 3, c: ["#486f34", "#5a8340", "#3d6130", "#6a944a"][(step + k) % 4] });
      }
      if (rand() < 0.6) {
        for (let k = 0; k < 3; k++) blooms.push({ p: [x + (rand() - 0.5) * 0.16, y + (rand() - 0.5) * 0.14, z + 0.05 + rand() * 0.04], s: [0.026 + rand() * 0.014, 0.034 + rand() * 0.014, 0.012], r: rand() * 3, rz: rand() * 3, c: ["#c2185b", "#d81b72", "#a3124c", "#e2478d"][(step + k) % 4] });
      }
    }
  }
  const leafMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, flatShading: true });
  group.add(
    instances(new THREE.IcosahedronGeometry(1, 0), leafMaterial, foliage, { cast: false }),
    instances(new THREE.OctahedronGeometry(1, 0), leafMaterial, blooms, { cast: false }),
  );

  // The portal itself: the shape of the passage's inner mouth, writing to the stencil buffer only.
  const portal = new THREE.Mesh(
    new THREE.ShapeGeometry(archShape(ARCH.half - 0.02, ARCH.spring, 0.02), 24),
    new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilZPass: THREE.ReplaceStencilOp,
    }),
  );
  portal.position.z = PORTAL_AT;
  portal.renderOrder = 10;
  group.add(portal);

  const setDoor = (open: number) => {
    for (const { pivot, s } of leaves) pivot.rotation.y = -s * open * 1.5; // in, to just short of flat against the wall
    // Behind a shut door the cellar's light stays in; it spills out as the door opens.
    passageLight.intensity = 1.2 * open;
    doorGlow.material.color.copy(glowColor).multiplyScalar(open);
    doorGlow.visible = open > 0.002;
  };
  setDoor(0);

  return { group, portal, setDoor };
}

import * as THREE from "three";

import type { Tier } from "./device";

/**
 * Shared pieces of the site's three.js scenes (the bay and cellar on the homepage, the relief table in the wine
 * guide): loading the baked data, a renderer that only draws when something changed, and a few scene helpers.
 */

type Section = { type: string; offset: number; length: number };
export type { Tier };
export type Pack = Record<string, Int16Array | Uint16Array | Uint8Array>;

/**
 * Downloads one of the files written by `scripts/3d/bake.mjs` and returns its arrays by name. The files are gzipped
 * by the bake script, because hosts don't compress binary files on their own.
 */
export async function loadPack(url: string, sections: Record<string, Section>, signal?: AbortSignal): Promise<Pack> {
  const response = await fetch(url, { signal });
  if (!response.ok || !response.body) throw new Error(`Could not load ${url}`);
  const buffer = await new Response(response.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  const pack: Pack = {};
  for (const [name, { type, offset, length }] of Object.entries(sections)) {
    pack[name] = type === "Uint8Array" ? new Uint8Array(buffer, offset, length) : type === "Uint16Array" ? new Uint16Array(buffer, offset, length) : new Int16Array(buffer, offset, length);
  }
  return pack;
}

/**
 * Undoes the bake script's `predict`, in place: each stored value is the height's difference from what its
 * neighbours (left + above - above-left) predict.
 */
export function unpredict(values: Int16Array, width: number) {
  for (let i = 0; i < values.length; i++) {
    const left = i % width ? values[i - 1] : 0, up = i >= width ? values[i - width] : 0, corner = i % width && i >= width ? values[i - width - 1] : 0;
    values[i] += left + up - corner;
  }
  return values;
}

/**
 * A repeatable random number in [0, 1) for a pair of integers: the same function as `chance` in
 * `scripts/3d/bake.mjs`. The bake script scatters vines, pines and lights with it and stores only a yes/no per
 * position; the scenes scatter them again from that. Keep the two identical.
 */
export function chance(a: number, b: number, salt: number) {
  let h = Math.imul(a, 0x27d4eb2d) ^ Math.imul(b, 0x165667b1) ^ Math.imul(salt, 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * A renderer set up the way every scene here wants it. Shadows are static, so they are drawn once and reused
 * (`shadowMap.needsUpdate = true` redraws them). The pixel ratio is capped so a 4K or retina screen never pushes
 * more pixels than it can show a difference for (a 1440 by 900 window at 2x is 5.2 million, drawn in full on the
 * "high" tier). With `stencil`, the canvas keeps a stencil buffer, which the homepage uses to draw the cellar through
 * the lagar's door.
 */
export function createRenderer(canvas: HTMLCanvasElement, tier: Tier, { stencil = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", stencil });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const maxPixels = tier === "high" ? 5_400_000 : 1_600_000;
  const fit = () => {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    const ratio = Math.min(window.devicePixelRatio || 1, tier === "high" ? 2 : 1.5, Math.sqrt(maxPixels / (width * height)));
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    return { width, height };
  };
  return { renderer, fit };
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const matte = (color: THREE.ColorRepresentation, options: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, flatShading: true, ...options });

/** A color brighter than white: it reads as a light source after tone mapping. */
export const lit = (color: THREE.ColorRepresentation, intensity: number) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) });

export type Instance = {
  p: [number, number, number];
  s?: number | [number, number, number];
  /** Rotation about Y, then X, then Z. */
  r?: number;
  rx?: number;
  rz?: number;
  c?: THREE.ColorRepresentation;
};

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

/** One draw call for many copies of a mesh. */
export function instances(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  items: Instance[],
  { cast = true, receive = true }: { cast?: boolean; receive?: boolean } = {},
) {
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  items.forEach((item, index) => {
    dummy.position.set(...item.p);
    dummy.rotation.set(item.rx ?? 0, item.r ?? 0, item.rz ?? 0);
    if (typeof item.s === "number") dummy.scale.setScalar(item.s);
    else if (item.s) dummy.scale.set(...item.s);
    else dummy.scale.setScalar(1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    if (item.c !== undefined) mesh.setColorAt(index, tint.set(item.c));
  });
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  // Instances are spread over the whole scene, so the mesh's own bounds would cull them wrongly.
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * A soft round glow, drawn additively wherever something should look like it gives off light.
 *
 * It is white fading to opaque black, not white fading to transparent, and is read by its brightness. A canvas
 * stores colors multiplied by their opacity in 8 bits, so nearly transparent pixels lose their color; some browsers
 * (Safari) hand them back as random hues, which showed as colored squares in the faint outer part of each glow.
 */
export function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Brightness goes through the sRGB curve when the texture is read, so these are the curve's values for
  // 1, 0.75, 0.18 and 0 of the light.
  gradient.addColorStop(0, "rgb(255,255,255)");
  gradient.addColorStop(0.18, "rgb(225,225,225)");
  gradient.addColorStop(0.45, "rgb(118,118,118)");
  gradient.addColorStop(1, "rgb(0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A glow that always faces the camera. `size` is in scene units. */
export function halo(texture: THREE.Texture, color: THREE.ColorRepresentation, size: number, intensity = 1) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(color).multiplyScalar(intensity),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    }),
  );
  sprite.scale.setScalar(size);
  return sprite;
}

/** Frees everything a scene holds on the GPU. */
export function disposeScene(scene: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const material of materials) {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      material.dispose();
    }
    (object as THREE.Light & { shadow?: { map?: { dispose(): void } | null } }).shadow?.map?.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import meta from "./data/bay.json";
import { chance, glowTexture, halo, instances, lerp, lit, matte, rng, smoothstep, unpredict, type Instance, type Pack, type Tier } from "./kit";

/**
 * Málaga bay at blue hour, seen from a vineyard in the Montes: the homepage's opening scene.
 *
 * The terrain is real (see `scripts/3d/bake.mjs`, which also places the city, the lights, the vines and the pines
 * and writes them to `public/3d/bay.bin`). 1 unit = 10 m; X is east, Z is south and the cathedral is the origin.
 * Nothing here moves except the camera, which walks down the track to the lagar's door as `pose` goes from 0 to 1.
 */
export type Vineyard = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Places the camera for a point of the walk (0 = in the vineyard, 1 = in the lagar's doorway). */
  pose(t: number, aspect: number): void;
  /** Tells the city lights how tall the picture is, so they keep their size in pixels. */
  setViewport(height: number): void;
};

type Grid = { nx: number; nz: number; x0: number; dx: number; zs: number[]; hole?: number[] };

const EX = meta.exaggeration;
const [CX, , CZ] = meta.camera;
const FWD = new THREE.Vector2(meta.forward[0], meta.forward[1]);
const [LX, LY, LZ, LROT] = meta.lagar;
/** The lagar is 27 units down the track; its front wall is 1.36 nearer. */
const LAGAR_AT = 27;
const DOOR_AT = LAGAR_AT - 1.364;
const FOG = 0.00042;

function terrain(heights: Int16Array, colors: Uint16Array, grid: Grid, drop: number, seabed: number) {
  const { nx, nz, x0, dx, zs, hole } = grid;
  unpredict(heights, nx + 1);
  const count = (nx + 1) * (nz + 1);
  const position = new Float32Array(count * 3), color = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let b = 0; b <= nz; b++) for (let a = 0; a <= nx; a++) {
    const v = b * (nx + 1) + a, h = heights[v], packed = colors[v];
    position[v * 3] = x0 + a * dx;
    position[v * 3 + 1] = h > 0 ? (h * EX) / 100 - drop : seabed;
    position[v * 3 + 2] = zs[b];
    c.setRGB(((packed >> 11) << 3) / 255, (((packed >> 5) & 63) << 2) / 255, ((packed & 31) << 3) / 255, THREE.SRGBColorSpace);
    color[v * 3] = c.r; color[v * 3 + 1] = c.g; color[v * 3 + 2] = c.b;
  }
  const index = new Uint32Array(nx * nz * 6);
  let n = 0;
  for (let b = 0; b < nz; b++) for (let a = 0; a < nx; a++) {
    const p = b * (nx + 1) + a;
    // Open sea is drawn by the sea plane, and the fine grid covers its own patch of the coarse one.
    if (heights[p] <= 0 && heights[p + 1] <= 0 && heights[p + nx + 1] <= 0 && heights[p + nx + 2] <= 0) continue;
    if (hole && a >= hole[0] && a < hole[1] && b >= hole[2] && b < hole[3]) continue;
    index[n++] = p; index[n++] = p + nx + 1; index[n++] = p + 1;
    index[n++] = p + 1; index[n++] = p + nx + 1; index[n++] = p + nx + 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(color, 3));
  geometry.setIndex(new THREE.BufferAttribute(index.subarray(0, n), 1));
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * The height of a grid's surface at a point, read off the same two triangles per cell that `terrain` draws, so that
 * whatever is planted there sits exactly on it. Returns null outside the grid (less `inset` cells round its edge).
 */
function heightOn(heights: Int16Array, grid: Grid, x: number, z: number, inset: number) {
  const { nx, nz, x0, dx, zs } = grid;
  const a = (x - x0) / dx;
  if (a < inset || a > nx - inset || z < zs[inset] || z > zs[nz - inset]) return null;
  // Rows are almost evenly spaced, so a first guess lands within a row or two of the right one.
  let ib = Math.min(nz - 1, Math.max(0, Math.floor(((z - zs[0]) / (zs[nz] - zs[0])) * nz)));
  while (ib > 0 && zs[ib] > z) ib--;
  while (ib < nz - 1 && zs[ib + 1] <= z) ib++;
  const ia = Math.min(nx - 1, Math.floor(a)), u = a - ia, v = (z - zs[ib]) / (zs[ib + 1] - zs[ib]);
  const h = (p: number, q: number) => (Math.max(0, heights[q * (nx + 1) + p]) * EX) / 100;
  const h00 = h(ia, ib), h10 = h(ia + 1, ib), h01 = h(ia, ib + 1), h11 = h(ia + 1, ib + 1);
  return u + v <= 1 ? h00 + u * (h10 - h00) + v * (h01 - h00) : h11 + (1 - u) * (h01 - h11) + (1 - v) * (h10 - h11);
}

/** The sky: indigo overhead, plum lower down and the last orange where the sun went under, plus a few stars. */
function sky(sunDir: THREE.Vector3) {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color("#05060e") }, mid: { value: new THREE.Color("#17173a") }, low: { value: new THREE.Color("#5d3052") },
      horizon: { value: new THREE.Color("#e8935a") }, sunGlow: { value: new THREE.Color("#ff9d5c") }, sunDir: { value: sunDir },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec3 vDir; uniform vec3 top, mid, low, horizon, sunDir, sunGlow;
      float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      void main(){
        vec3 d = normalize(vDir);
        float y = clamp(d.y, -0.2, 1.0);
        float az = max(0.0, dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(sunDir.x, 0.0, sunDir.z))));
        float warm = pow(az, 7.0);
        vec3 lowC = mix(mix(mid, low, 0.35), low, warm);
        vec3 horC = mix(mix(low, mid, 0.45), horizon, warm);
        vec3 c = mix(horC, lowC, smoothstep(0.0, 0.07 + 0.05 * warm, y));
        c = mix(c, mid, smoothstep(0.05, 0.26, y));
        c = mix(c, top, smoothstep(0.2, 0.62, y));
        c += sunGlow * pow(max(0.0, dot(d, sunDir)), 40.0) * 0.4;
        c += sunGlow * pow(max(0.0, dot(d, sunDir)), 220.0) * 0.6;
        vec2 sp = vec2(atan(d.z, d.x), asin(d.y)) * 240.0;
        float star = step(0.9965, h21(floor(sp))) * smoothstep(0.16, 0.5, y) * (1.0 - smoothstep(0.05, 0.3, length(fract(sp) - 0.5)));
        c += vec3(0.9, 0.9, 1.0) * star * (0.35 + 0.65 * h21(floor(sp) + 3.1));
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(15000, 48, 24), material);
  mesh.frustumCulled = false;
  return mesh;
}

/** The sea: dark near the shore, picking up the afterglow towards the horizon, with a broken streak under the sun. */
function sea(sunDir: THREE.Vector3) {
  const material = new THREE.ShaderMaterial({
    uniforms: { sunDir: { value: sunDir }, eye: { value: new THREE.Vector3() } }, fog: false,
    vertexShader: `varying vec3 wp; void main(){ wp = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`,
    fragmentShader: `
      varying vec3 wp; uniform vec3 sunDir, eye;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        vec3 v = wp - eye; float dist = length(v.xz); vec2 dir = normalize(v.xz);
        float t = smoothstep(300.0, 9000.0, dist);
        float az = max(0.0, dot(dir, normalize(sunDir.xz)));
        vec3 c = mix(vec3(0.012, 0.016, 0.04), mix(vec3(0.035, 0.03, 0.08), vec3(0.5, 0.2, 0.16), pow(az, 6.0)), pow(t, 0.8));
        vec2 q = vec2(dot(wp.xz, vec2(dir.y, -dir.x)), dot(wp.xz, dir));
        float ripple = n(vec2(q.x * 0.02, q.y * 0.16)) * n(vec2(q.x * 0.07 + 4.0, q.y * 0.5));
        c += vec3(1.0, 0.52, 0.25) * pow(az, 90.0) * (0.25 + 2.4 * ripple) * (0.35 + t);
        c += vec3(0.5, 0.24, 0.2) * pow(az, 12.0) * ripple * 0.5 * t;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(60000, 60000).rotateX(-Math.PI / 2), material);
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * The city's lit windows and street lamps: one draw call of soft additive points. Each keeps a minimum size on
 * screen, fading instead of shrinking below it, so distant lights don't flicker as the camera moves.
 */
function cityLights(data: number[], texture: THREE.Texture) {
  const count = data.length / 5;
  const position = new Float32Array(count * 3), size = new Float32Array(count), color = new Float32Array(count * 3);
  const palette = ["#ffb568", "#ffa552", "#ffc98a", "#ff9a4a", "#ffe0b0"].map((hex) => new THREE.Color(hex));
  for (let i = 0; i < count; i++) {
    position[i * 3] = data[i * 5]; position[i * 3 + 1] = data[i * 5 + 1]; position[i * 3 + 2] = data[i * 5 + 2];
    size[i] = data[i * 5 + 3];
    const c = palette[data[i * 5 + 4] % palette.length];
    color[i * 3] = c.r; color[i * 3 + 1] = c.g; color[i * 3 + 2] = c.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(color, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: { map: { value: texture }, pixels: { value: 1 }, fogDensity: { value: FOG } },
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
    vertexShader: `
      attribute float size; attribute vec3 color; uniform float pixels, fogDensity; varying vec4 vColor;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float px = min(size * 3.6 * pixels / -mv.z, 0.022 * pixels);
        float fade = min(1.0, px / 3.2);
        float fog = exp(-fogDensity * fogDensity * mv.z * mv.z);
        vColor = vec4(color, fade * fade * fog);
        gl_PointSize = max(px, 3.2);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D map; varying vec4 vColor;
      void main(){
        float glow = texture2D(map, gl_PointCoord).r;
        gl_FragColor = vec4(vColor.rgb * glow * vColor.a * 1.7, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

/**
 * A bush vine: a short trunk, a canopy of leaves and bunches of Moscatel, as one mesh with a color per face. The
 * `light` version has fewer leaves and one bunch, for vines too far away for the difference to show.
 */
function vineGeometry(detail: "full" | "light") {
  const parts: THREE.BufferGeometry[] = [];
  const add = (geometry: THREE.BufferGeometry, color: string, matrix: THREE.Matrix4) => {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    g.applyMatrix4(matrix);
    const c = new THREE.Color(color), n = g.attributes.position.count, colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) colors.set([c.r, c.g, c.b], i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.deleteAttribute("uv");
    parts.push(g);
  };
  const at = (p: [number, number, number], s: [number, number, number], rz = 0, ry = 0) =>
    new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, rz)), new THREE.Vector3(...s));
  const r = rng(5);
  const leaves = detail === "full" ? 7 : 5, bunches = detail === "full" ? 2 : 1;
  add(new THREE.CylinderGeometry(0.03, 0.05, 0.24, 5, 1, true), "#3a2a22", at([0, 0.12, 0], [1, 1, 1]));
  for (let a = 0; a < 3; a++) add(new THREE.CylinderGeometry(0.018, 0.028, 0.2, 4, 1, true), "#3a2a22", at([Math.cos(a * 2.1) * 0.07, 0.28, Math.sin(a * 2.1) * 0.07], [1, 1, 1], 0.7, a * 2.1));
  for (let a = 0; a < leaves; a++) {
    const t = a * 0.9 + r(), d = 0.08 + r() * 0.16;
    add(new THREE.IcosahedronGeometry(0.105 + r() * 0.06, 0), ["#7fa650", "#6c9448", "#93b658", "#5c8444"][a % 4], at([Math.cos(t) * d, 0.36 + r() * 0.16, Math.sin(t) * d], [1, 0.62, 1], r(), r() * 3));
  }
  for (let b = 0; b < bunches; b++) {
    const t = b * 2.6 + 0.4, bx = Math.cos(t) * 0.17, bz = Math.sin(t) * 0.17;
    for (let q = 0; q < 6; q++) add(new THREE.OctahedronGeometry(0.034, 0), q % 2 ? "#f0c95a" : "#dcae42", at([bx + (r() - 0.5) * 0.05, 0.27 - q * 0.02 + (r() - 0.5) * 0.02, bz + (r() - 0.5) * 0.05], [1, 1, 1]));
  }
  return mergeGeometries(parts);
}

/** The lagar at the end of the track: whitewashed, tiled, its arched door open on the lamplit cellar. */
function lagar(glow: THREE.Texture) {
  const group = new THREE.Group();
  const wall = matte("#d9d2c8"), tile = matte("#8a4a32");
  const W = 7.2, H = 2.9, D = 4.4;
  const roofOn = (w: number, d: number, rise: number, x: number, y: number, z: number) => {
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 1, 1, 4, 1), tile);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(w * 0.78, rise, d * 0.78);
    roof.position.set(x, y, z);
    return roof;
  };
  const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), wall);
  body.position.y = H / 2;
  const wing = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 3.2), wall);
  wing.position.set(W / 2 + 1.5, 1.05, -0.4);
  group.add(body, roofOn(W, D, 1.25, 0, H + 0.62, 0), wing, roofOn(3.4, 3.2, 0.9, W / 2 + 1.5, 2.55, -0.4));

  const arch = (w: number, h: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, h - w / 2);
    shape.absarc(0, h - w / 2, w / 2, 0, Math.PI, false);
    shape.lineTo(-w / 2, 0);
    return new THREE.ShapeGeometry(shape, 16);
  };
  const front = D / 2;
  const layer = (geometry: THREE.BufferGeometry, material: THREE.Material, y: number, z: number, x = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, front + z);
    group.add(mesh);
  };
  layer(arch(1.95, 2.55), matte("#8c6f58"), 0, 0.01);
  layer(arch(1.6, 2.35), lit("#ff8a2c", 0.5), 0, 0.02);
  layer(arch(0.95, 1.75), lit("#ffb060", 0.9), 0.12, 0.03);
  layer(new THREE.PlaneGeometry(1.6, 0.14), lit("#2a140a", 1), 0.07, 0.04);
  for (const [x, y] of [[-0.58, 0.36], [0.58, 0.36], [-0.58, 0.98], [0.58, 0.98]]) {
    layer(new THREE.CircleGeometry(0.3, 16), lit("#3a1c0c", 1), y, 0.05, x);
    layer(new THREE.RingGeometry(0.2, 0.225, 16), lit("#6b3a18", 1), y, 0.06, x);
  }
  for (const x of [-2.5, 2.5]) {
    layer(new THREE.PlaneGeometry(0.5, 0.75), lit("#ffb35c", 2.4), 1.75, 0.01, x);
    const shine = halo(glow, "#ffa040", 2.6, 0.5);
    shine.position.set(x, 1.75, front + 0.2);
    group.add(shine);
  }
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), lit("#ffd9a0", 5));
  lantern.position.set(1.05, 2.15, front + 0.25);
  const lanternGlow = halo(glow, "#ffb060", 2.2, 0.8);
  lanternGlow.position.copy(lantern.position);
  const doorGlow = halo(glow, "#ff9a40", 5, 0.35);
  doorGlow.position.set(0, 1.1, front + 0.3);
  group.add(lantern, lanternGlow, doorGlow);

  group.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && (mesh.material as THREE.Material).type === "MeshStandardMaterial") mesh.castShadow = mesh.receiveShadow = true;
  });
  group.scale.setScalar(0.62);
  group.position.set(LX, LY + 0.2, LZ);
  group.rotation.y = LROT;
  return group;
}

export function buildVineyard(pack: Pack, tier: Tier): Vineyard {
  const scene = new THREE.Scene();
  const sunDir = new THREE.Vector3(meta.sun[0], 0.03, meta.sun[1]).normalize();
  const glow = glowTexture();
  scene.fog = new THREE.FogExp2("#2a2140", FOG);
  const water = sea(sunDir);
  scene.add(sky(sunDir), water);

  const nearHeights = pack.nearHeights as Int16Array, farHeights = pack.farHeights as Int16Array;
  const near = terrain(nearHeights, pack.nearColors as Uint16Array, meta.grids.near, 0, -1.6);
  const far = terrain(farHeights, pack.farColors as Uint16Array, meta.grids.far, meta.farDrop, -8);
  near.castShadow = true;
  scene.add(near, far);
  /** The ground under a point: the fine grid where it reaches, the coarse one beyond. */
  const groundAt = (x: number, z: number) => heightOn(nearHeights, meta.grids.near, x, z, 5) ?? (heightOn(farHeights, meta.grids.far, x, z, 0) ?? 0) - meta.farDrop;

  // The city: the blocks come baked; each one's color, which way it is turned and its lit windows are worked out
  // here from its number, so they need not be downloaded.
  const blockColors = ["#6e6a78", "#7f7882", "#5f5c6c", "#8a8086", "#555468"];
  const blocks: Instance[] = [], lights: number[] = [];
  for (let i = 0, n = 0; i < pack.blocks.length; i += 6, n++) {
    const x = pack.blocks[i] / 16, z = pack.blocks[i + 1] / 16, w = pack.blocks[i + 2] / 64, h = pack.blocks[i + 3] / 64, d = pack.blocks[i + 4] / 64;
    const y = groundAt(x, z);
    blocks.push({ p: [x, y + h / 2, z], s: [w, h, d], r: (chance(n, 0, 21) < 0.5 ? 0 : Math.PI / 2) + 0.35, c: blockColors[Math.floor(chance(n, 0, 22) * 5)] });
    for (let k = 0; k < pack.blocks[i + 5]; k++) {
      lights.push(x + (chance(n, k, 31) - 0.5) * w * 1.2, y + 0.4 + chance(n, k, 32) * h, z + (chance(n, k, 33) - 0.5) * d * 1.2, 0.38 + chance(n, k, 34) * 0.3, Math.floor(chance(n, k, 35) * 5));
    }
  }
  // Street lamps: along the seafront (at sea level), and along the avenues and the far coast (on the ground).
  for (let i = 0; i < pack.lamps.length; i += 4) {
    const x = pack.lamps[i] / 8, z = pack.lamps[i + 1] / 8, kind = pack.lamps[i + 3] >> 3;
    lights.push(x, kind === 0 ? 0.9 : groundAt(x, z) + 0.7, z, pack.lamps[i + 2] / 64, pack.lamps[i + 3] & 7);
  }
  scene.add(instances(new THREE.BoxGeometry(1, 1, 1), matte("#ffffff", { roughness: 0.8 }), blocks, { cast: false }));
  const cityPoints = cityLights(lights, glow);
  scene.add(cityPoints);

  // The vineyard and the pines. The bake script stores one bit per planting position; walking the same grid with
  // the same `chance` puts every plant back where the script found room for it.
  const taken = (mask: Uint8Array | Int16Array | Uint16Array, index: number) => (mask[index >> 3] >> (index & 7)) & 1;
  const RIGHT = new THREE.Vector2(-FWD.y, FWD.x);
  const vinesClose: Instance[] = [], vinesNear: Instance[] = [], vinesFar: Instance[] = [], vinesFarthest: Instance[] = [], pines: Instance[] = [];
  // Full models only where the camera passes close by; slower devices get the lighter model throughout.
  const closeRange = tier === "high" ? 22 : 0;
  const V = meta.vines;
  for (let iv = 0; iv < V.nv; iv++) for (let iu = 0; iu < V.nu; iu++) {
    if (!taken(pack.vines, iv * V.nu + iu)) continue;
    const u = V.u0 + iu * V.du + (chance(iu, iv, 1) - 0.5) * 0.12, v = V.v0 + iv * V.dv + (chance(iu, iv, 2) - 0.5) * 0.2;
    const x = CX + RIGHT.x * u + FWD.x * v, z = CZ + RIGHT.y * u + FWD.y * v, distance = Math.hypot(u, v);
    // Close to the camera each vine is a small model; further off, a low-poly bush, thinned out with distance
    // (and thinned again on slower devices), and simpler still where it is only a dot.
    if (distance < 46) (distance < closeRange ? vinesClose : vinesNear).push({ p: [x, groundAt(x, z), z], s: 0.78 + chance(iu, iv, 3) * 0.26, r: chance(iu, iv, 4) * 6.3 });
    else if (chance(iu, iv, 5) < (distance < 110 ? 1 : 0.6) * (tier === "high" ? 1 : 0.5)) {
      const size = 0.3 + chance(iu, iv, 3) * 0.1;
      (distance < 110 ? vinesFar : vinesFarthest).push({ p: [x, groundAt(x, z) + 0.2, z], s: [size, size * 0.78, size], r: chance(iu, iv, 4) * 3, c: chance(iu, iv, 6) > 0.5 ? "#5c7d3f" : "#4b6b38" });
    }
  }
  const pineColors = ["#2f4a36", "#38523a", "#43593c", "#4f5f40"];
  const P = meta.pines;
  for (let iz = 0; iz < P.nz; iz++) for (let ix = 0; ix < P.nx; ix++) {
    if (!taken(pack.pines, iz * P.nx + ix)) continue;
    const x = P.x0 + (ix + chance(ix, iz, 11)) * P.cell, z = P.z0 + (iz + chance(ix, iz, 12)) * P.cell;
    const size = 0.55 + chance(ix, iz, 15) * 0.55, pick = chance(ix, iz, 16);
    pines.push({ p: [x, groundAt(x, z) + size * 0.95, z], s: [size, size * (0.9 + pick * 0.4), size], r: pick * 3, c: pineColors[Math.floor(pick * 4)] });
  }
  const vineMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true }), bush = matte("#ffffff");
  if (vinesClose.length) scene.add(instances(vineGeometry("full"), vineMaterial, vinesClose));
  scene.add(
    instances(vineGeometry("light"), vineMaterial, vinesNear),
    instances(new THREE.IcosahedronGeometry(1, 0), bush, vinesFar, { cast: false }),
    instances(new THREE.OctahedronGeometry(1, 0), bush, vinesFarthest, { cast: false }),
    instances(new THREE.ConeGeometry(0.75, 2.2, 5, 1, true), matte("#ffffff"), pines, { cast: false }),
  );

  // The track between the rows, a paler strip of trodden earth.
  const track = meta.track.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const earth = matte("#9c8468");
  for (let i = 0; i < track.length - 4; i += 2) {
    const a = track[i], b = track[i + 2];
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.3).rotateX(-Math.PI / 2), earth);
    strip.position.copy(a).lerp(b, 0.5).setY((a.y + b.y) / 2 + 0.03);
    strip.lookAt(b.x, b.y + 0.03, b.z);
    strip.receiveShadow = true;
    scene.add(strip);
  }

  // Landmarks: the one-towered cathedral, Gibralfaro and the Alcazaba, the bullring, the port and its lighthouse.
  const stone = matte("#c9a57a", { emissive: "#c9853f", emissiveIntensity: 0.6 });
  const cathedral = new THREE.Group();
  const part = (w: number, h: number, d: number, x: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stone);
    mesh.position.set(x, h / 2, z);
    cathedral.add(mesh);
  };
  part(14, 7, 8.5, 0, 0);
  part(2.6, 15, 2.6, -7.2, -3); // the finished tower
  part(2.6, 8.4, 2.6, -7.2, 3); // and the stub of the other: "La Manquita"
  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3, 8), stone);
  spire.position.set(-7.2, 16.5, -3);
  cathedral.add(spire);
  cathedral.position.set(meta.cathedral[0], meta.cathedral[1], meta.cathedral[2]);
  cathedral.rotation.y = 0.12;
  scene.add(cathedral);
  scene.add(instances(new THREE.BoxGeometry(1, 1, 1), stone, meta.walls.map(([x, y, z, w, h, r]): Instance => ({ p: [x, y + h / 2, z], s: [w, h, 0.9], r })), { cast: false }));
  const [bx, by, bz] = meta.bullring;
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 2, 16, 1, true), matte("#b98f6a", { side: THREE.DoubleSide, emissive: "#b06a30", emissiveIntensity: 0.35 }));
  ring.position.set(bx, by + 1, bz);
  const sand = new THREE.Mesh(new THREE.CircleGeometry(3.2, 16).rotateX(-Math.PI / 2), matte("#c8a25e", { emissive: "#c8a25e", emissiveIntensity: 0.25 }));
  sand.position.set(bx, by + 0.4, bz);
  scene.add(ring, sand);
  scene.add(instances(new THREE.BoxGeometry(1, 1, 1), matte("#3d3944"), meta.moles.map(([x, z, length, width, r]): Instance => ({ p: [x, 0.2, z], s: [length, 1.1, width], r })), { cast: false }));
  const [fx, fz] = meta.lighthouse;
  const lighthouse = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 6.5, 10), matte("#efe9e0", { emissive: "#806050", emissiveIntensity: 0.4 }));
  lighthouse.position.set(fx, 3.6, fz);
  const beam = halo(glow, "#fff0c8", 14, 1.4);
  beam.position.set(fx, 7.3, fz);
  const pompidou = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), lit("#7fd0ff", 1.6));
  pompidou.position.set(meta.pompidou[0], 1.3, meta.pompidou[1]);
  scene.add(lighthouse, beam, pompidou);
  // The city's own glow in the haze above the centre.
  for (const [dx, dz, size, strength] of [[0, 0, 300, 0.1], [60, -30, 220, 0.08], [-90, 40, 260, 0.07]]) {
    const haze = halo(glow, "#ff9a55", size, strength);
    haze.position.set(meta.cityGlow[0] + dx, 14, meta.cityGlow[1] + dz);
    scene.add(haze);
  }

  // The lagar, on a level pad cut into the slope, with its cypresses.
  scene.add(lagar(glow));
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 6.4, 3, 12), matte("#8a7150"));
  pad.position.set(LX, LY - 1.32, LZ);
  pad.receiveShadow = true;
  scene.add(pad);
  for (const [x, y, z, h] of meta.cypresses) {
    const cypress = new THREE.Mesh(new THREE.ConeGeometry(h * 0.13, h, 6), matte("#17231b"));
    cypress.position.set(x, y + h / 2 - 0.1, z);
    cypress.castShadow = true;
    scene.add(cypress);
  }

  // Light: the sun is just under the horizon, so a low warm rake from the west-south-west plus a cool sky fill.
  scene.add(new THREE.HemisphereLight("#6a6fd0", "#3a2a3a", 2.0));
  const sun = new THREE.DirectionalLight("#ff8f58", 1.25);
  const focus = new THREE.Vector3(CX + FWD.x * 70, 0, CZ + FWD.y * 70);
  sun.position.copy(new THREE.Vector3(sunDir.x, 0.19, sunDir.z).normalize().multiplyScalar(1500)).add(focus);
  sun.target.position.copy(focus);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(tier === "high" ? 4096 : 2048);
  Object.assign(sun.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 10, far: 4000 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.12;
  const cityGlow = new THREE.PointLight("#ff9a55", 9000, 520, 1.5);
  cityGlow.position.set(meta.cityGlow[0], 70, meta.cityGlow[1]);
  const porch = new THREE.PointLight("#ffac5a", 3.5, 22, 1.8);
  porch.position.set(LX - FWD.x * 2.6, LY + 1.5, LZ - FWD.y * 2.6);
  scene.add(sun, sun.target, cityGlow, porch);

  const camera = new THREE.PerspectiveCamera(44, 1.6, 0.2, 30000);
  const eye = new THREE.Vector3(), target = new THREE.Vector3(), doorTarget = new THREE.Vector3(LX, LY + 1.05, LZ);
  const ground = (v: number) => {
    const f = Math.min(track.length - 1.001, Math.max(0, v + 14)), i = Math.floor(f);
    return eye.copy(track[i]).lerp(track[i + 1], f - i);
  };
  const STOP = DOOR_AT - 0.38; // just short of the doorway, when its light fills the frame
  let viewportHeight = 1;

  return {
    scene,
    camera,
    setViewport(height) {
      viewportHeight = height;
    },
    pose(t, aspect) {
      // Three quarters of the walk covers the track; the rest pushes slowly into the doorway.
      const v = t < 0.72 ? smoothstep(0, 1, t / 0.72) * 21.6 : lerp(21.6, STOP, (t - 0.72) / 0.28);
      const nearing = smoothstep(6, 21, v);
      ground(v);
      // A slight rise mid-walk carries the camera over the lip of the ridge, then it settles at door height.
      eye.y = lerp(eye.y + 1.05 + 1.2 * Math.sin(Math.PI * smoothstep(3, 21, v)), LY + 1.2, smoothstep(13, 22.5, v));
      const portrait = aspect < 1;
      // Tall screens see a narrow slice, so they get a wider lens and turn a little towards the cathedral.
      const turn = portrait ? -0.1 : 0;
      target.set(eye.x + (FWD.x - FWD.y * turn) * 200, eye.y - 12, eye.z + (FWD.y + FWD.x * turn) * 200).lerp(doorTarget, nearing);
      camera.fov = portrait ? 60 : 44;
      camera.aspect = aspect;
      camera.position.copy(eye);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      water.material.uniforms.eye.value.copy(eye);
      // How many pixels one scene unit covers at a distance of one unit: it sizes the city's lights.
      cityPoints.material.uniforms.pixels.value = viewportHeight / (2 * Math.tan((camera.fov * Math.PI) / 360));
    },
  };
}

/** Where the bay's data file lives and how to read it. */
export const BAY_PACK = { url: "/3d/bay.bin", sections: meta.sections };

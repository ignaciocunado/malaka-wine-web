/**
 * Bakes the data behind the site's 3D scenes from open elevation tiles, so the browser never has to work any of it
 * out:
 *
 *   node scripts/3d/bake.mjs
 *
 * It writes, for each scene, a gzipped binary in `public/3d/` (what the browser downloads) and a small JSON index in
 * `src/components/scene/data/` (imported by the scene code, so it ships inside the JavaScript):
 *
 * - `bay`: Málaga bay seen from a vineyard in the Montes, for the homepage. Real terrain, with the city blocks, the
 *   lights, the vines and the pines already placed on it and culled to what the camera can see.
 * - `province`: the whole province as a relief table, for the wine guide.
 *
 * Elevation comes from the Terrarium tiles (Mapzen / AWS Open Data; see the attribution in the README). Tiles are
 * cached in `scripts/3d/.cache/`, so only the first run needs the network. The output is deterministic: running the
 * script again without changing it rewrites the same bytes.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

import { PNG } from "pngjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CACHE = path.join(ROOT, "scripts/3d/.cache");
const PUBLIC = path.join(ROOT, "public/3d");
const DATA = path.join(ROOT, "src/components/scene/data");
for (const dir of [CACHE, PUBLIC, DATA]) fs.mkdirSync(dir, { recursive: true });

// ---------------------------------------------------------------------------------------------------------------
// Elevation tiles
// ---------------------------------------------------------------------------------------------------------------

/** Downloads (once) and stitches the Terrarium tiles that cover a box. Heights are metres; the sea is <= 0. */
function loadDem(zoom, lonW, lonE, latS, latN) {
  const n = 2 ** zoom;
  const tileX = (lon) => Math.floor(((lon + 180) / 360) * n);
  const tileY = (lat) => {
    const r = (lat * Math.PI) / 180;
    return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n);
  };
  const x0 = tileX(lonW), x1 = tileX(lonE), y0 = tileY(latN), y1 = tileY(latS);
  const W = (x1 - x0 + 1) * 256, H = (y1 - y0 + 1) * 256;
  const data = new Float32Array(W * H);
  const missing = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const file = path.join(CACHE, `${zoom}_${x}_${y}.png`);
    if (!fs.existsSync(file)) missing.push("-o", file, `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${x}/${y}.png`);
  }
  if (missing.length) execFileSync("curl", ["-sS", "--fail", "--retry", "3", "-Z", "--parallel-max", "8", ...missing], { stdio: "inherit" });
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const png = PNG.sync.read(fs.readFileSync(path.join(CACHE, `${zoom}_${x}_${y}.png`)));
    for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
      const o = (j * 256 + i) * 4;
      data[((y - y0) * 256 + j) * W + (x - x0) * 256 + i] = png.data[o] * 256 + png.data[o + 1] + png.data[o + 2] / 256 - 32768;
    }
  }
  return {
    W, H, data,
    colLon: (i) => ((x0 + i / 256) / n) * 360 - 180,
    rowLat: (j) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y0 + j / 256)) / n))) * 180) / Math.PI,
    lonCol: (lon) => (((lon + 180) / 360) * n - x0) * 256,
    latRow: (lat) => {
      const r = (lat * Math.PI) / 180;
      return (((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n - y0) * 256;
    },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Small maths
// ---------------------------------------------------------------------------------------------------------------

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
/**
 * A repeatable random number in [0, 1) for a pair of integers. The scene code has the same function
 * (`chance` in `src/components/scene/kit.ts`): whatever is scattered with it here can be scattered again in the
 * browser from a yes/no mask, instead of being downloaded position by position. Keep the two identical.
 */
function chance(a, b, salt) {
  let h = Math.imul(a, 0x27d4eb2d) ^ Math.imul(b, 0x165667b1) ^ Math.imul(salt, 0x9e3779b1);
  h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct = 5) {
  let amp = 0.5, f = 1, sum = 0;
  for (let i = 0; i < oct; i++) { sum += amp * noise(x * f, y * f); amp *= 0.5; f *= 2.03; }
  return sum;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rgb565 = ([r, g, b]) => ((Math.round(r) >> 3) << 11) | ((Math.round(g) >> 2) << 5) | (Math.round(b) >> 3);
const round = (v, d = 3) => +v.toFixed(d);

/** Collects typed arrays into one gzipped file plus the index the scene code needs to find them again. */
class Pack {
  parts = [];
  sections = {};
  size = 0;
  add(name, array) {
    const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
    const pad = (4 - (this.size % 4)) % 4;
    if (pad) { this.parts.push(Buffer.alloc(pad)); this.size += pad; }
    this.sections[name] = { type: array.constructor.name, offset: this.size, length: array.length };
    this.parts.push(bytes);
    this.size += bytes.length;
  }
  write(name, meta) {
    const raw = Buffer.concat(this.parts);
    const gz = zlib.gzipSync(raw, { level: 9 });
    fs.writeFileSync(path.join(PUBLIC, `${name}.bin`), gz);
    fs.writeFileSync(path.join(DATA, `${name}.json`), JSON.stringify({ ...meta, bytes: raw.length, sections: this.sections }) + "\n");
    console.log(`${name}: ${(raw.length / 1024).toFixed(0)} KB raw, ${(gz.length / 1024).toFixed(0)} KB gzipped`);
  }
}

/**
 * Stores each height as its difference from what its neighbours predict (left + above - above-left). Terrain is
 * smooth, so the differences are tiny and compress far better than the heights. `unpredict` in the scene code
 * undoes it.
 */
function predict(values, width) {
  const out = new Int16Array(values.length);
  for (let i = 0; i < values.length; i++) {
    const left = i % width ? values[i - 1] : 0, up = i >= width ? values[i - width] : 0, corner = i % width && i >= width ? values[i - width - 1] : 0;
    out[i] = values[i] - (left + up - corner);
  }
  return out;
}

/** A grid of yes/no answers, one bit each. */
class Mask {
  constructor(width, height) {
    this.width = width;
    this.bits = new Uint8Array(Math.ceil((width * height) / 8));
  }
  set(x, y) {
    const i = y * this.width + x;
    this.bits[i >> 3] |= 1 << (i & 7);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// The bay, for the homepage
// ---------------------------------------------------------------------------------------------------------------

function bakeBay() {
  // 1 scene unit = 10 m. X = east, Z = south, Y = up, heights exaggerated by EX. The origin is the cathedral.
  const LAT0 = 36.7202, LON0 = -4.4194, EX = 1.6;
  const MX = Math.cos((LAT0 * Math.PI) / 180) * 111320, MZ = 110574;
  const toX = (lon) => ((lon - LON0) * MX) / 10, toZ = (lat) => (-(lat - LAT0) * MZ) / 10;
  const toLon = (x) => LON0 + (x * 10) / MX, toLat = (z) => LAT0 - (z * 10) / MZ;

  const dem = loadDem(12, -4.8, -4.22, 36.53, 36.86);
  const { W, H, colLon, rowLat, lonCol, latRow } = dem;
  const raw = (i, j) => dem.data[Math.min(H - 1, Math.max(0, j)) * W + Math.min(W - 1, Math.max(0, i))];
  const elevLL = (lon, lat) => {
    const fi = lonCol(lon), fj = latRow(lat), i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j;
    return lerp(lerp(raw(i, j), raw(i + 1, j), u), lerp(raw(i, j + 1), raw(i + 1, j + 1), u), v);
  };
  const elev = (x, z) => elevLL(toLon(x), toLat(z)); // metres
  const slope = (x, z) => Math.hypot(elev(x + 4, z) - elev(x - 4, z), elev(x, z + 4) - elev(x, z - 4)) / 80;

  // Two grids: every sample around the vineyard and the old town, every fifth one for the rest of the bay.
  const near = { i0: Math.round(lonCol(-4.455)), i1: Math.round(lonCol(-4.39)), j0: Math.round(latRow(36.772)), j1: Math.round(latRow(36.7)), step: 1 };
  const far = { i0: 0, j0: Math.max(0, Math.round(latRow(36.8))), step: 5 };
  far.i1 = far.i0 + Math.floor((Math.round(lonCol(-4.25)) - far.i0) / far.step) * far.step;
  far.j1 = far.j0 + Math.floor((H - 1 - far.j0) / far.step) * far.step;
  const FAR_DROP = 0.15; // the coarse grid sits a touch lower so it never pokes through the fine one
  const quant = (i, j) => Math.round(Math.max(raw(i, j), 0) * 10); // decimetres; 0 is the sea
  const gridY = (g, fi, fj) => {
    const a = (fi - g.i0) / g.step, b = (fj - g.j0) / g.step, ia = Math.floor(a), ib = Math.floor(b), u = a - ia, v = b - ib;
    const h = (p, q) => (quant(g.i0 + p * g.step, g.j0 + q * g.step) * EX) / 100;
    const h00 = h(ia, ib), h10 = h(ia + 1, ib), h01 = h(ia, ib + 1), h11 = h(ia + 1, ib + 1);
    // The same two triangles per cell that the scene draws, so anything planted here sits exactly on the surface.
    return u + v <= 1 ? h00 + u * (h10 - h00) + v * (h01 - h00) : h11 + (1 - u) * (h01 - h11) + (1 - v) * (h10 - h11);
  };
  const Y = (x, z) => {
    const fi = lonCol(toLon(x)), fj = latRow(toLat(z));
    const inNear = fi >= near.i0 + 5 && fi <= near.i1 - 5 && fj >= near.j0 + 5 && fj <= near.j1 - 5;
    return inNear ? gridY(near, fi, fj) : gridY(far, fi, fj) - FAR_DROP;
  };

  // The viewpoint: a ridge in the Montes about 4.7 km north of the cathedral, picked for its clear line of sight to
  // the cathedral, Gibralfaro and the port. The camera looks south-south-west along a track between the vines.
  // (Rounded to what the index file stores, so the scene code places things from exactly the same numbers.)
  const cx = round(toX(-4.4159)), cz = round(toZ(36.763));
  const aimX = toX(-4.42357), aimZ = toZ(36.746);
  const fl = Math.hypot(aimX - cx, aimZ - cz), fwd = [round((aimX - cx) / fl, 5), round((aimZ - cz) / fl, 5)], right = [-fwd[1], fwd[0]];
  const local = (u, v) => [cx + right[0] * u + fwd[0] * v, cz + right[1] * u + fwd[1] * v]; // u to the right, v ahead
  const LAGAR_V = 27;
  const [lgx, lgz] = local(0, LAGAR_V);
  const lgy = Y(lgx, lgz);
  const dist = (x, z) => Math.hypot(x - cx, z - cz);
  // Everything is culled to a wedge a little wider than the widest view, opening from just behind the camera.
  const ax = cx - fwd[0] * 14, az = cz - fwd[1] * 14, cosWedge = Math.cos((54 * Math.PI) / 180);
  const inView = (x, z) => { const dx = x - ax, dz = z - az, d = Math.hypot(dx, dz); return d < 1 || (dx * fwd[0] + dz * fwd[1]) / d > cosWedge; };

  const urban = (x, z) => {
    const lon = toLon(x), lat = toLat(z), e = elev(x, z);
    if (e < 1.5 || e > 85 || slope(x, z) > 0.16) return 0;
    if (lon < -4.475 && lat < 36.695) return 0; // the Guadalhorce mouth and the airport
    if (lat > 36.752 || lon > -4.33 || lon < -4.52 || lat < 36.655) return 0;
    return Math.max(0.2, 1 - Math.hypot((lon + 4.43) * 0.8, lat - 36.716) / 0.07);
  };
  const vineMask = (x, z) => dist(x, z) < 210 && elev(x, z) > 40 && slope(x, z) < 0.85 && urban(x, z) === 0 && (dist(x, z) < 120 || fbm(x * 0.02 + 11, z * 0.02 + 5, 3) > 0.44);

  // Terrain: heights and a color per vertex.
  const C = { sea: hex("#0a0c18"), cityA: hex("#45414f"), cityB: hex("#575060"), hillA: hex("#55603f"), hillB: hex("#84704f"), rock: hex("#9a8a70"), soil: hex("#a07a52") };
  const tint = (x, z, e) => {
    if (e <= 0) return C.sea;
    if (urban(x, z) > 0) return mix(C.cityA, C.cityB, noise(x * 0.3, z * 0.3));
    let c = mix(C.hillA, C.hillB, fbm(x * 0.03, z * 0.03, 3));
    c = mix(c, C.rock, smooth(0.45, 0.9, slope(x, z)) * 0.7);
    return vineMask(x, z) ? mix(c, C.soil, 0.75) : c;
  };
  const pack = new Pack();
  const gridMeta = {};
  for (const [name, g] of [["near", near], ["far", far]]) {
    const nx = (g.i1 - g.i0) / g.step, nz = (g.j1 - g.j0) / g.step;
    const heights = new Uint16Array((nx + 1) * (nz + 1)), colors = new Uint16Array((nx + 1) * (nz + 1));
    for (let b = 0; b <= nz; b++) for (let a = 0; a <= nx; a++) {
      const i = g.i0 + a * g.step, j = g.j0 + b * g.step;
      heights[b * (nx + 1) + a] = quant(i, j);
      colors[b * (nx + 1) + a] = rgb565(tint(toX(colLon(i)), toZ(rowLat(j)), raw(i, j)));
    }
    pack.add(`${name}Heights`, predict(heights, nx + 1));
    pack.add(`${name}Colors`, colors);
    const zs = [];
    for (let b = 0; b <= nz; b++) zs.push(round(toZ(rowLat(g.j0 + b * g.step))));
    gridMeta[name] = { nx, nz, x0: round(toX(colLon(g.i0)), 4), dx: round(toX(colLon(g.i0 + g.step)) - toX(colLon(g.i0)), 5), zs };
  }
  // Where the coarse grid is covered by the fine one, in coarse cells (the scene skips those).
  gridMeta.far.hole = [Math.ceil((near.i0 - far.i0) / far.step) + 1, Math.floor((near.i1 - far.i0) / far.step) - 1, Math.ceil((near.j0 - far.j0) / far.step) + 1, Math.floor((near.j1 - far.j0) / far.step) - 1];

  // The city: blocks wherever the real ground is low and flat inside the urban area. Each block's lit windows, its
  // color and which way it is turned are worked out again in the browser from its number.
  const rand = rng(11);
  const blocks = [], lamps = [];
  const beach = (x, z) => elev(x, z + 9) <= 0 || elev(x + 6, z + 7) <= 0; // sea within ~100 m to the south
  for (let n = 0; n < 60000; n++) {
    const x = toX(-4.52 + rand() * 0.19), z = toZ(36.655 + rand() * 0.097);
    const u = urban(x, z);
    if (u === 0 || rand() > u * 0.55) continue;
    const tall = (beach(x, z) && rand() > 0.5) || rand() > 0.97;
    const w = 1.8 + rand() * 2.6, d = 1.8 + rand() * 2.6, h = (1.2 + rand() * (1.6 + 3.2 * u)) * (tall ? 2.1 : 1);
    const windows = 1 + Math.floor(rand() * 2 + u * 2.4);
    if (inView(x, z)) blocks.push(x, z, w, h, d, windows);
  }
  // Street lamps, each [x, z, size, kind * 8 + color]. Kind 0 stands at sea level, kind 1 on the ground.
  const lamp = (x, z, size, kind, color) => { if (inView(x, z)) lamps.push(x, z, size, kind * 8 + color); };
  // Along the real coastline, and the lights of Torremolinos and the coast beyond.
  for (let lon = -4.72; lon < -4.33; lon += 0.00035) for (let lat = 36.56; lat < 36.725; lat += 0.0003) {
    const e = elevLL(lon, lat);
    if (e < 0.6 || e > 60) continue;
    const coast = elevLL(lon, lat - 0.0006) <= 0 || elevLL(lon + 0.0006, lat) <= 0 || elevLL(lon + 0.0005, lat - 0.0005) <= 0;
    const x = toX(lon), z = toZ(lat);
    if (coast && rand() > 0.35) lamp(x, z, 0.55, 0, 2);
    else if (lon < -4.475 && e > 3 && rand() > 0.94 - 0.2 * smooth(-4.6, -4.48, lon) && elevLL(lon + 0.012, lat - 0.012) <= 2) lamp(x, z, 0.8 + rand() * 0.6, 1, Math.floor(rand() * 5));
  }
  // Along the Guadalmedina and the Alameda.
  const street = (points, steps, color) => {
    for (let k = 0; k < points.length - 1; k++) for (let t = 0; t < 1; t += 1 / steps) lamp(toX(lerp(points[k][1], points[k + 1][1], t)), toZ(lerp(points[k][0], points[k + 1][0], t)), 0.5, 1, color);
  };
  street([[36.7455, -4.4262], [36.73, -4.4255], [36.7195, -4.4268], [36.712, -4.4292]], 46, 4);
  street([[36.7178, -4.4262], [36.718, -4.4205], [36.7195, -4.415], [36.72, -4.4095]], 26, 2);

  // The vineyard: rows run straight ahead with a track between two of them. Only a yes/no per planting position is
  // stored; the scene code walks the same grid and plants where the mask says so.
  const VINES = { u0: -210, du: 1.5, nu: 280, v0: -14, dv: 0.92, nv: 244 };
  const vines = new Mask(VINES.nu, VINES.nv);
  let vineCount = 0;
  for (let iv = 0; iv < VINES.nv; iv++) for (let iu = 0; iu < VINES.nu; iu++) {
    const u = VINES.u0 + iu * VINES.du, v = VINES.v0 + iv * VINES.dv;
    if (Math.abs(u) < 0.8) continue; // the track
    const [x, z] = local(u + (chance(iu, iv, 1) - 0.5) * 0.12, v + (chance(iu, iv, 2) - 0.5) * 0.2);
    if (!inView(x, z) || !vineMask(x, z) || Math.hypot(x - lgx, z - lgz) < 6.5) continue;
    vines.set(iu, iv);
    vineCount++;
  }
  // Pines, the same way: the Montes de Málaga and Gibralfaro are pine-covered.
  const PINES = { x0: round(cx - 550), z0: round(cz - 315), cell: 2.4, nx: 458, nz: 375 };
  const pines = new Mask(PINES.nx, PINES.nz);
  let pineCount = 0;
  for (let iz = 0; iz < PINES.nz; iz++) for (let ix = 0; ix < PINES.nx; ix++) {
    const x = PINES.x0 + (ix + chance(ix, iz, 11)) * PINES.cell, z = PINES.z0 + (iz + chance(ix, iz, 12)) * PINES.cell;
    if (chance(ix, iz, 14) > 0.52 || !inView(x, z)) continue;
    const e = elev(x, z);
    if (e < 28 || urban(x, z) > 0 || vineMask(x, z) || Math.hypot(x - lgx, z - lgz) < 8) continue;
    const gibralfaro = Math.hypot(x - toX(-4.4115), z - toZ(36.7228)) < 34;
    if (!gibralfaro && fbm(x * 0.012 + 40, z * 0.012, 3) < 0.4 + chance(ix, iz, 13) * 0.22) continue;
    pines.set(ix, iz);
    pineCount++;
  }

  const q = (values, stride, scales) => {
    const out = new Int16Array(values.length);
    for (let i = 0; i < values.length; i++) out[i] = Math.round(values[i] * scales[i % stride]);
    return out;
  };
  pack.add("blocks", q(blocks, 6, [16, 16, 64, 64, 64, 1]));
  pack.add("lamps", q(lamps, 4, [8, 8, 64, 1]));
  pack.add("vines", vines.bits);
  pack.add("pines", pines.bits);

  // Landmarks at their real coordinates, each with the height of the ground under it.
  const at = (lat, lon) => { const x = toX(lon), z = toZ(lat); return [round(x), round(Y(x, z)), round(z)]; };
  const ring = (lat, lon, rx, rz, segments, height) => {
    const out = [];
    for (let k = 0; k < segments; k++) {
      const a = (k / segments) * Math.PI * 2, x = toX(lon) + Math.cos(a) * rx, z = toZ(lat) + Math.sin(a) * rz;
      out.push([round(x), round(Y(x, z)), round(z), round((Math.PI * 2 * Math.max(rx, rz)) / segments + 0.4), height + (Math.round(a * 4) % 3 === 0 ? 1 : 0), round(-Math.atan2(Math.cos(a) * rz, -Math.sin(a) * rx))]);
    }
    return out;
  };
  const mole = (a, b, width) => {
    const x1 = toX(a[1]), z1 = toZ(a[0]), x2 = toX(b[1]), z2 = toZ(b[0]);
    return [round((x1 + x2) / 2), round((z1 + z2) / 2), round(Math.hypot(x2 - x1, z2 - z1)), width, round(-Math.atan2(z2 - z1, x2 - x1))];
  };
  const track = [];
  for (let v = -14; v <= LAGAR_V + 2; v += 1) { const [x, z] = local(0, v); track.push([round(x), round(Y(x, z)), round(z)]); }
  const lagarRot = Math.atan2(-fwd[0], -fwd[1]); // its door faces back up the track
  const cypresses = [[-3.6, 0.6, 4.6], [-4.4, -0.6, 3.6], [5.2, 0.9, 4.0], [5.9, -0.3, 3.1]].map(([dx, dz, h]) => {
    const x = lgx + dx * Math.cos(lagarRot) + dz * Math.sin(lagarRot), z = lgz - dx * Math.sin(lagarRot) + dz * Math.cos(lagarRot);
    return [round(x), round(Y(x, z)), round(z), h];
  });

  const sunAzimuth = (250 * Math.PI) / 180; // just set, west-south-west, as on a winter evening over the bay
  pack.write("bay", {
    exaggeration: EX,
    camera: [round(cx), round(Y(cx, cz)), round(cz)],
    forward: [round(fwd[0], 5), round(fwd[1], 5)],
    sun: [round(Math.sin(sunAzimuth), 5), round(-Math.cos(sunAzimuth), 5)],
    track,
    lagar: [round(lgx), round(lgy), round(lgz), round(lagarRot, 5)],
    cypresses,
    cathedral: at(36.7202, -4.4194),
    bullring: at(36.719, -4.4107),
    lighthouse: [round(toX(-4.4148)), round(toZ(36.7137))],
    pompidou: [round(toX(-4.4132)), round(toZ(36.7187))],
    cityGlow: [round(toX(-4.425)), round(toZ(36.715))],
    walls: [...ring(36.7236, -4.4107, 11, 6.5, 16, 1.7), ...ring(36.7213, -4.4159, 7.5, 4.5, 12, 1.5), ...ring(36.7216, -4.415, 4.2, 2.6, 8, 2.2)],
    moles: [
      mole([36.718, -4.415], [36.714, -4.4148], 8), mole([36.714, -4.4148], [36.704, -4.4168], 7), mole([36.704, -4.4168], [36.6985, -4.4215], 6),
      mole([36.7172, -4.4225], [36.7105, -4.4222], 9), mole([36.711, -4.4275], [36.703, -4.4262], 12),
    ],
    grids: gridMeta,
    farDrop: FAR_DROP,
    vines: VINES,
    pines: PINES,
    counts: { blocks: blocks.length / 6, lamps: lamps.length / 4, vines: vineCount, pines: pineCount },
  });
}

// ---------------------------------------------------------------------------------------------------------------
// The province, for the wine guide
// ---------------------------------------------------------------------------------------------------------------

function bakeProvince() {
  const CROP = { lonW: -5.318, lonE: -3.7, latS: 36.035, latN: 37.32 };
  const SLAB_W = 100; // the slab's width in scene units, east to west
  const EXAGGERATION = 3;
  const STEP = 3; // keep every third elevation sample
  const dem = loadDem(10, -5.65, -3.72, 36.28, 37.32);
  const { W, H, data, lonCol, latRow } = dem;

  // Soften the terrain a little so it reads as a carved model, keeping the coastline where it really is.
  const kernel = [1, 4, 6, 4, 1], tmp = new Float32Array(data.length);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let a = 0;
      for (let d = -2; d <= 2; d++) a += kernel[d + 2] * data[y * W + Math.min(W - 1, Math.max(0, x + d))];
      tmp[y * W + x] = a / 16;
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let a = 0;
      for (let d = -2; d <= 2; d++) a += kernel[d + 2] * tmp[Math.min(H - 1, Math.max(0, y + d)) * W + x];
      const before = data[y * W + x];
      data[y * W + x] = before <= 0 ? before : Math.max(1, a / 16);
    }
  }
  // The sliver of Gibraltar that the crop clips lies outside the province: leave it as sea.
  for (let y = Math.floor(latRow(36.19)); y < H; y++) for (let x = 0; x < Math.ceil(lonCol(-5.25)); x++) if (data[y * W + x] > 0) data[y * W + x] = -1;

  const c0 = Math.round(lonCol(CROP.lonW)), r0 = Math.round(latRow(CROP.latN));
  const nx = Math.floor((Math.round(lonCol(CROP.lonE)) - c0) / STEP), nz = Math.floor((Math.min(H - 1, Math.round(latRow(CROP.latS))) - r0) / STEP);
  const unit = SLAB_W / nx, depth = nz * unit;
  const metresPerUnit = ((CROP.lonE - CROP.lonW) * 111320 * Math.cos((36.7 * Math.PI) / 180)) / SLAB_W;
  const at = (c, r) => data[Math.min(H - 1, Math.max(0, r)) * W + Math.min(W - 1, Math.max(0, c))];
  const heights = new Uint16Array((nx + 1) * (nz + 1));
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) heights[j * (nx + 1) + i] = Math.max(0, Math.round(at(c0 + i * STEP, r0 + j * STEP)));

  const pack = new Pack();
  pack.add("heights", predict(heights, nx + 1));
  const place = (lat, lon) => {
    const x = ((lonCol(lon) - c0) / STEP) * unit - SLAB_W / 2, z = ((latRow(lat) - r0) / STEP) * unit - depth / 2;
    return [round(x), round(z), Math.max(0, Math.round(at(Math.round(lonCol(lon)), Math.round(latRow(lat)))))];
  };
  pack.write("province", {
    nx, nz, width: SLAB_W, depth: round(depth), heightScale: round(EXAGGERATION / metresPerUnit, 6),
    // [x, z, ground height in metres] on the slab. The keys of the wine areas are the slugs of their guide pages.
    places: {
      malaga: place(36.7213, -4.4214),
      axarquia: place(36.834, -3.974),
      "montes-de-malaga": place(36.82, -4.36),
      "serrania-de-ronda": place(36.742, -5.167),
      "norte-de-malaga": place(37.125, -4.657),
      manilva: place(36.376, -5.25),
    },
  });
}

bakeBay();
bakeProvince();

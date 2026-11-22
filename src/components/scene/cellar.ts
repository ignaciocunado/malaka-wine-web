import * as THREE from "three";

import { glowTexture, halo, instances, lerp, matte, rng, smoothstep, type Instance, type Tier } from "./kit";
import { buildWineBox } from "./wine-box";

/**
 * Inside the lagar: a traditional Málaga solera cellar, the scene behind "how it works" on the homepage.
 *
 * A long nave of whitewashed arches with botas (barrels on their sides, heads to the aisle) stacked three high on
 * both sides, lanterns every other bay and a high window at the far end. Everything is built in code; nothing is
 * downloaded. Units are metres and the nave runs down -Z. The camera drifts along the aisle as `pose` goes 0 to 1.
 */
export type Cellar = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Walks the camera down the aisle: `t` runs 0 to 1 from the first bay to the third. */
  pose(t: number, width: number, height: number): void;
  /**
   * Puts the camera at the lagar's door and beyond, in the cellar's own coordinates (metres, nave down -Z), and
   * gives it the vineyard camera's lens (`fov`) turning into the cellar's own as `blend` goes 0 to 1.
   */
  enter(position: THREE.Vector3, quaternion: THREE.Quaternion, fov: number, blend: number, width: number, height: number): void;
  /** While true the scene only draws where the lagar's portal has marked the stencil buffer. */
  setPortal(on: boolean): void;
};

/** The doorway's plane in the cellar's coordinates. The nave opens beyond it and nothing stands on the near side. */
export const CELLAR_DOOR = 4.6;
/** Where the camera starts in the nave once it has come through the door. */
export const CELLAR_START = new THREE.Vector3(0.4, 1.55, 1.1);

const BAY = 6.3; // pillar to pillar
const BAYS = 12;
const ARCADE_X = 2.0; // centre line of the pillars
const PILLAR = 0.56;
const SPRING = 3.4; // where the arches spring from
const CEILING = 6.0;
const R = 0.56; // barrel bilge radius
const HALF = 0.85; // barrel half length
const HEAD_X = ARCADE_X + 0.12; // barrel heads sit just behind the arcade line
const FOG = 0.03;

/** A bota lying along X, with raised iron hoops; colors are baked per face. */
function botaGeometry(segments: number) {
  const radius = (a: number) => 0.455 + 0.105 * Math.cos((a / HALF) * (Math.PI / 2));
  const bands = [[0.74, 0.85], [0.42, 0.5], [0.1, 0.16]];
  const isHoop = (a: number) => bands.some(([lo, hi]) => Math.abs(a) >= lo - 1e-4 && Math.abs(a) <= hi + 1e-4);
  const stops = new Set([0]);
  for (const [lo, hi] of bands) for (const s of [lo, hi]) { stops.add(s); stops.add(-s); }
  for (const s of [0.3, 0.62]) { stops.add(s); stops.add(-s); }
  const axial = [...stops].sort((p, q) => p - q);
  const points = [new THREE.Vector2(0.405, -HALF + 0.045), new THREE.Vector2(0.405, -HALF)];
  for (let i = 0; i < axial.length; i++) {
    const a = axial[i];
    const mid = i < axial.length - 1 ? (a + axial[i + 1]) / 2 : a;
    const before = i > 0 ? (a + axial[i - 1]) / 2 : a;
    // Step the profile out at each hoop edge so the hoop stands proud of the staves.
    if (i > 0) points.push(new THREE.Vector2(radius(a) + (isHoop(before) ? 0.012 : 0), a));
    if (i === 0 || (i < axial.length - 1 && isHoop(mid) !== isHoop(before))) points.push(new THREE.Vector2(radius(a) + (isHoop(mid) ? 0.012 : 0), a));
  }
  points.push(new THREE.Vector2(0.405, HALF), new THREE.Vector2(0.405, HALF - 0.045));
  const geometry = new THREE.LatheGeometry(points, segments).rotateZ(-Math.PI / 2).toNonIndexed();
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const stave = new THREE.Color(), hoop = new THREE.Color("#15131a");
  for (let i = 0; i < position.count; i += 3) {
    const cx = (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
    const cy = (position.getY(i) + position.getY(i + 1) + position.getY(i + 2)) / 3;
    const cz = (position.getZ(i) + position.getZ(i + 1) + position.getZ(i + 2)) / 3;
    const board = Math.floor(((Math.atan2(cz, cy) + Math.PI) / (Math.PI * 2)) * segments);
    stave.set("#4a3022").multiplyScalar(0.82 + 0.3 * (Math.sin(board * 12.9898) * 0.5 + 0.5));
    const c = isHoop(cx) && Math.hypot(cy, cz) > 0.44 ? hoop : stave;
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.deleteAttribute("uv");
  geometry.computeVertexNormals();
  return geometry;
}

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  draw(canvas.getContext("2d")!, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Oak barrel head: vertical boards, a darker rim, some grain. */
const headTexture = (rand: () => number) =>
  canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = "#8a6444";
    ctx.fillRect(0, 0, s, s);
    const edges = [0, 30, 70, 112, 150, 192, 228, 256];
    for (let i = 0; i < edges.length - 1; i++) {
      const l = 0.82 + rand() * 0.3;
      ctx.fillStyle = `rgb(${138 * l},${100 * l},${68 * l})`;
      ctx.fillRect(edges[i], 0, edges[i + 1] - edges[i], s);
      ctx.fillStyle = "rgba(30,16,10,0.75)";
      ctx.fillRect(edges[i] - 1, 0, 2, s);
    }
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(40,22,12,${0.05 + rand() * 0.1})`;
      ctx.fillRect(rand() * s, rand() * s, 1, 10 + rand() * 50);
    }
    const rim = ctx.createRadialGradient(s / 2, s / 2, s * 0.3, s / 2, s / 2, s * 0.52);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(1, "rgba(10,5,8,0.6)");
    ctx.fillStyle = rim;
    ctx.fillRect(0, 0, s, s);
  });

/** Chalk on a transparent ground: the cellar-master's marks. */
const chalkTexture = (rand: () => number, lines: [string, number, number][], cross: number) =>
  canvasTexture(512, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    ctx.translate(s / 2, s / 2);
    ctx.rotate((rand() - 0.5) * 0.16);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineCap = "round";
    // Several faint, slightly shifted passes read as a soft chalk edge.
    const stroke = (pass: () => void) => {
      for (let k = 0; k < 4; k++) {
        ctx.save();
        ctx.translate((rand() - 0.5) * 5, (rand() - 0.5) * 5);
        ctx.globalAlpha = 0.34;
        pass();
        ctx.restore();
      }
    };
    ctx.fillStyle = ctx.strokeStyle = "#f1eadc";
    for (const [text, size, y] of lines) {
      ctx.font = `italic ${size}px Georgia, "Times New Roman", serif`;
      stroke(() => ctx.fillText(text, 0, y));
    }
    if (cross) {
      ctx.lineWidth = 15;
      stroke(() => {
        ctx.beginPath();
        ctx.moveTo(-74, cross - 60); ctx.lineTo(70, cross + 62);
        ctx.moveTo(72, cross - 64); ctx.lineTo(-70, cross + 58);
        ctx.stroke();
      });
    }
    // Rub some of it away so it reads as chalk dragged over rough oak.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 5200; i++) {
      ctx.globalAlpha = 0.25 + rand() * 0.6;
      ctx.fillRect(rand() * s, rand() * s, 1 + rand() * 3, 1 + rand() * 9);
    }
  });

/** Worn stone flags along the nave. */
const floorTexture = (rand: () => number) =>
  canvasTexture(1024, (ctx, s) => {
    ctx.fillStyle = "#8d7c69";
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const h = s / rows;
      let x = r % 2 ? -90 : 0;
      while (x < s) {
        const w = 150 + rand() * 130, l = 0.78 + rand() * 0.36;
        ctx.fillStyle = `rgb(${158 * l},${140 * l},${120 * l})`;
        ctx.fillRect(x + 2, r * h + 2, w - 4, h - 4);
        x += w;
      }
    }
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = rand() > 0.5 ? `rgba(20,14,18,${rand() * 0.12})` : `rgba(230,210,180,${rand() * 0.06})`;
      const d = 1 + rand() * 5;
      ctx.fillRect(rand() * s, rand() * s, d, d);
    }
  });

/** A wall pierced by an arch: semicircular when `rise` is omitted, segmental otherwise. In XY, extruded along Z. */
function archGeometry(span: number, top: number, depth: number, rise?: number) {
  const half = span / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half - PILLAR, SPRING);
  shape.lineTo(-half - PILLAR, top);
  shape.lineTo(half + PILLAR, top);
  shape.lineTo(half + PILLAR, SPRING);
  shape.lineTo(half, SPRING);
  if (rise === undefined) shape.absarc(0, SPRING, half, 0, Math.PI, false);
  else {
    const radius = (half * half + rise * rise) / (2 * rise), a0 = Math.asin(half / radius);
    shape.absarc(0, SPRING + rise - radius, radius, Math.PI / 2 - a0, Math.PI / 2 + a0, false);
  }
  shape.lineTo(-half - PILLAR, SPRING);
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 14 }).translate(0, 0, -depth / 2);
}

export function buildCellar(tier: Tier): Cellar {
  const rand = rng(21);
  // No background: the scene is closed, and it is drawn into a window of the vineyard as well as full-screen.
  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2("#0b0914", FOG);
  scene.fog = fog;
  const END = -BAY * BAYS;
  const glow = glowTexture();

  const lime = matte("#d9d0c0", { roughness: 0.95 });
  const dado = matte("#8a5a34", { roughness: 0.95 }); // the ochre band painted round the foot of every pillar
  const oak = matte("#2a1b16");

  // Floor, ceiling, outer walls.
  const flags = floorTexture(rand);
  flags.wrapS = flags.wrapT = THREE.RepeatWrapping;
  flags.repeat.set(2.4, 22);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 94).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: flags, roughness: 0.5 }));
  floor.position.set(0, 0, END / 2 + 6);
  floor.receiveShadow = true;
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 94).rotateX(Math.PI / 2), matte("#1b1418"));
  ceiling.position.set(0, CEILING, END / 2 + 6);
  scene.add(floor, ceiling);
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(94, CEILING).rotateY((-side * Math.PI) / 2), lime);
    wall.position.set(side * 4.35, CEILING / 2, END / 2 + 6);
    wall.receiveShadow = true;
    scene.add(wall);
  }
  // The outer wall behind the two nearest left bays is bare dark stone, so nothing glows behind the text.
  const nearWall = new THREE.Mesh(new THREE.PlaneGeometry(21.7, CEILING).rotateY(Math.PI / 2), matte("#15121c"));
  nearWall.position.set(-4.33, CEILING / 2, -2 * BAY + 21.7 / 2);
  scene.add(nearWall);

  // Arcades: pillars, an arch across the aisle at every pillar pair, and an arch along each barrel bay.
  const pillars: Instance[] = [], dados: Instance[] = [], beams: Instance[] = [], across: Instance[] = [], along: Instance[] = [];
  for (let b = -1; b <= BAYS; b++) {
    const z = -b * BAY;
    for (const side of [-1, 1]) {
      pillars.push({ p: [side * ARCADE_X, SPRING / 2 + 0.55, z], s: [PILLAR, SPRING - 1.1, PILLAR] });
      dados.push({ p: [side * ARCADE_X, 0.55, z], s: [PILLAR + 0.06, 1.1, PILLAR + 0.06] });
      if (b < BAYS) along.push({ p: [side * ARCADE_X, 0, z - BAY / 2], c: side < 0 && b <= 0 ? "#2c2632" : "#ffffff" });
    }
    across.push({ p: [0, 0, z] });
    for (const dz of [BAY / 3, (2 * BAY) / 3]) beams.push({ p: [0, CEILING - 0.13, z - dz], s: [8.7, 0.26, 0.2] });
  }
  const box = new THREE.BoxGeometry(1, 1, 1);
  scene.add(
    instances(box, lime, pillars),
    instances(box, dado, dados),
    instances(archGeometry(ARCADE_X * 2 - PILLAR, CEILING, PILLAR), lime, across),
    instances(archGeometry(BAY - PILLAR, CEILING, PILLAR * 0.92, 1.25).rotateY(Math.PI / 2), lime, along),
    instances(box, oak, beams, { cast: false }),
  );

  // Botas, three tiers high on runners, heads to the aisle.
  const bodies: Instance[] = [], runners: Instance[] = [];
  const heads: { p: [number, number, number]; yaw: number; roll: number; c: string }[] = [];
  const spots: { p: [number, number, number]; side: number; tier: number; bay: number; i: number }[] = [];
  const tints = ["#ffffff", "#e9dccf", "#d2c2b4", "#f3e2cf", "#c4b3a6"];
  const headTints = ["#ffffff", "#e6d2bd", "#cdb9a2", "#f2dcc0", "#b9a48f"];
  for (let b = -1; b < BAYS; b++) {
    for (const side of [-1, 1]) {
      const z0 = -b * BAY - PILLAR / 2 - 0.12;
      for (let level = 0; level < 3; level++) {
        for (let i = 0; i < 5 - level; i++) {
          const z = z0 - R - 0.02 - (i + level / 2) * (2 * R + 0.012);
          const y = 0.3 + R + level * R * 1.74;
          const x = side * (HEAD_X + HALF) + (rand() - 0.5) * 0.05;
          bodies.push({ p: [x, y, z], rx: rand() * 6.28, c: tints[Math.floor(rand() * tints.length)] });
          const hx = side * (HEAD_X + 0.05) + (x - side * (HEAD_X + HALF));
          heads.push({ p: [hx, y, z], yaw: (-side * Math.PI) / 2, roll: (rand() - 0.5) * 0.5, c: headTints[Math.floor(rand() * headTints.length)] });
          spots.push({ p: [hx - side * 0.006, y, z], side, tier: level, bay: b, i });
        }
      }
      for (const dx of [0.35, 1.35]) runners.push({ p: [side * (HEAD_X + dx), 0.15, -b * BAY - BAY / 2], s: [0.16, 0.3, BAY - PILLAR - 0.2] });
    }
  }
  const staves = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, flatShading: true });
  const bota = botaGeometry(tier === "high" ? 20 : 14);
  scene.add(instances(bota, staves, bodies), instances(box, oak, runners));
  const headMesh = new THREE.InstancedMesh(new THREE.CircleGeometry(0.405, 20), new THREE.MeshStandardMaterial({ map: headTexture(rand), roughness: 0.85 }), heads.length);
  const dummy = new THREE.Object3D(), color = new THREE.Color();
  heads.forEach((head, index) => {
    dummy.position.set(...head.p);
    dummy.rotation.set(0, 0, 0);
    dummy.rotateY(head.yaw);
    dummy.rotateZ(head.roll); // each head's boards run at their own angle
    dummy.updateMatrix();
    headMesh.setMatrixAt(index, dummy.matrix);
    headMesh.setColorAt(index, color.set(head.c));
  });
  headMesh.receiveShadow = true;
  headMesh.frustumCulled = false;
  scene.add(headMesh);

  // Chalk marks on a handful of heads the lanterns reach.
  const marks = (
    [
      [[["PX", 190, -10]], 0], [[["1998", 132, 0]], 0], [[["Moscatel", 96, -40], ["2011", 96, 70]], 0], [[["", 10, 0]], 6],
      [[["PX", 150, -70], ["1987", 104, 70]], 0], [[["2004", 132, 0]], 0], [[["", 10, 0]], -4], [[["Moscatel", 100, 0]], 0], [[["Solera", 110, -40], ["1962", 104, 72]], 0],
    ] as [[string, number, number][], number][]
  ).map(([lines, cross]) => chalkTexture(rand, lines, cross));
  const chalked = [
    [1, 1, 1, 1, 0], [1, 1, 0, 3, 3], [-1, 1, 1, 2, 2], [-1, 1, 0, 0, 1], [-1, 1, 2, 1, 6], [1, 2, 1, 2, 5], [1, 1, 2, 1, 7], [-1, 2, 0, 3, 0],
    [-1, 0, 1, 1, 4], [-1, 0, 0, 3, 8], [1, 3, 0, 1, 2], [-1, 3, 1, 2, 1], [1, 0, 1, 3, 1], [1, 2, 0, 0, 4], [-1, 2, 1, 1, 7],
  ];
  const chalkPlane = new THREE.PlaneGeometry(0.66, 0.66);
  for (const [side, bay, level, i, mark] of chalked) {
    const spot = spots.find((s) => s.side === side && s.bay === bay && s.tier === level && s.i === i);
    if (!spot) continue;
    const chalk = new THREE.Mesh(chalkPlane, new THREE.MeshStandardMaterial({ map: marks[mark], transparent: true, roughness: 1, depthWrite: false, opacity: 0.9 }));
    chalk.position.set(...spot.p);
    chalk.rotation.y = (-side * Math.PI) / 2;
    scene.add(chalk);
  }

  // Lanterns hung mid-bay in every other bay: pools of light with shadow between.
  const iron = matte("#121016", { roughness: 0.6 });
  const flame = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffa750").multiplyScalar(1.7) });
  [1, 3, 5, 7, 9].forEach((bay, n) => {
    const z = -bay * BAY - BAY / 2, y = 3.55;
    const light = new THREE.PointLight("#ffb068", 30 * (1 + Math.max(0, n - 2) * 0.05), 0, 2);
    light.position.set(0, y - 0.1, z);
    // The nearest lanterns throw real shadows (drawn once, since nothing moves).
    if (n <= (tier === "high" ? 2 : 0)) {
      light.castShadow = true;
      light.shadow.mapSize.setScalar(tier === "high" ? 1024 : 512);
      light.shadow.bias = -0.004;
      light.shadow.normalBias = 0.03;
      light.shadow.camera.near = 0.3;
      light.shadow.camera.far = 30;
    }
    const cage = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.2), iron), cap = cage.clone();
    cage.position.set(0, y - 0.15, z);
    cap.position.set(0, y + 0.14, z);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.13), flame);
    glass.position.set(0, y, z);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, CEILING - y - 0.14, 5), iron);
    chain.position.set(0, (CEILING + y + 0.14) / 2, z);
    const shine = halo(glow, "#ff9a48", 2.4, 0.55);
    shine.position.set(0, y, z);
    scene.add(light, cage, cap, glass, chain, shine);
  });

  // The far wall and its high window: the last of the daylight, cool against the lamps.
  const end = new THREE.Mesh(new THREE.PlaneGeometry(9.4, CEILING), lime);
  end.position.set(0, CEILING / 2, END - 0.3);
  const pane = new THREE.Shape();
  pane.moveTo(-0.8, 0); pane.lineTo(0.8, 0); pane.lineTo(0.8, 1.3);
  pane.absarc(0, 1.3, 0.8, 0, Math.PI, false);
  pane.lineTo(-0.8, 0);
  const windowPane = new THREE.Mesh(new THREE.ShapeGeometry(pane, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5f86e0").multiplyScalar(1.5), fog: false }));
  windowPane.position.set(0, 2.55, END - 0.28);
  const windowGlow = halo(glow, "#5f86e0", 9, 0.35);
  windowGlow.position.set(0, 3.5, END - 0.2);
  scene.add(end, windowPane, windowGlow);
  for (const [w, h, x, y] of [[0.07, 2.1, 0, 3.6], [1.6, 0.07, 0, 3.3], [1.6, 0.07, 0, 3.95]]) {
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: "#0a0914", fog: false }));
    bar.position.set(x, y, END - 0.26);
    scene.add(bar);
  }
  const dusk = new THREE.PointLight("#5b7fe0", 240, 0, 2);
  dusk.position.set(0, 3.6, END + 2.2);
  scene.add(dusk);

  // A tasting set on an upended cask where the first lantern falls.
  const caskZ = -BAY * 1.5 - 1.9, caskX = 1.12;
  const cask = new THREE.Mesh(botaGeometry(16).rotateZ(Math.PI / 2).scale(0.62, 0.56, 0.62), staves);
  cask.position.set(caskX, 0.476, caskZ);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16), matte("#8a6444"));
  lid.position.set(caskX, 0.94, caskZ);
  const profile = (points: number[][]) => points.map(([r, y]) => new THREE.Vector2(r, y));
  const bottle = new THREE.Mesh(
    new THREE.LatheGeometry(profile([[0, 0], [0.038, 0], [0.038, 0.17], [0.03, 0.2], [0.014, 0.235], [0.013, 0.29], [0.016, 0.3], [0, 0.3]]), 16),
    new THREE.MeshStandardMaterial({ color: "#1b0f0c", roughness: 0.22, metalness: 0.1 }),
  );
  bottle.position.set(caskX + 0.06, 0.95, caskZ - 0.05);
  const copita = new THREE.MeshStandardMaterial({ color: "#e9c27a", roughness: 0.15, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  for (const [dx, dz] of [[-0.13, 0.08], [-0.02, 0.17]]) {
    const glass = new THREE.Mesh(new THREE.LatheGeometry(profile([[0.03, 0], [0.004, 0.006], [0.004, 0.07], [0.03, 0.1], [0.027, 0.16]]), 12), copita);
    glass.position.set(caskX + dx, 0.95, caskZ + dz);
    scene.add(glass);
  }
  for (const mesh of [cask, lid, bottle]) {
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // Where the walk ends: a subscriber's box, opened, on another upended cask, in a pool of lamplight of its own.
  const boxX = 0.78, boxZ = -19;
  const stand = new THREE.Mesh(botaGeometry(16).rotateZ(Math.PI / 2).scale(0.62, 0.56, 0.62), staves);
  stand.position.set(boxX, 0.476, boxZ);
  const standLid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 16), matte("#8a6444"));
  standLid.position.set(boxX, 0.94, boxZ);
  for (const mesh of [stand, standLid]) mesh.castShadow = mesh.receiveShadow = true;
  const wineBox = buildWineBox();
  wineBox.position.set(boxX, 0.95, boxZ);
  wineBox.rotation.y = -0.18;
  const boxLight = new THREE.PointLight("#ffb068", 4.5, 0, 2);
  boxLight.position.set(boxX - 0.2, 2.4, boxZ + 0.9);
  scene.add(stand, standLid, wineBox, boxLight);

  // Fill: indigo from above, plum from the floor, so the shadows stay colored rather than black.
  scene.add(new THREE.HemisphereLight("#5557b4", "#34203a", 0.75));
  const entrance = new THREE.PointLight("#ffb068", 5, 0, 2);
  entrance.position.set(0.9, 1.5, 4.6);
  scene.add(entrance);

  const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 200);
  const level = new THREE.Quaternion();
  const materials = new Set<THREE.Material>();
  scene.traverse((object) => {
    const material = (object as THREE.Mesh).material;
    for (const each of Array.isArray(material) ? material : material ? [material] : []) materials.add(each);
  });
  let portal = false;

  /** The lens: the vineyard's at `blend` 0, the cellar's at 1. Wide screens shift the picture like a view camera. */
  const lens = (from: number, blend: number, width: number, height: number) => {
    camera.aspect = width / height;
    if (width > height * 1.15) {
      // On wide screens the view is shifted so the vanishing point sits in the right third and the left, where the
      // text is, stays on the dark near barrels.
      const F = lerp(1, 1.4, blend);
      camera.fov = lerp(from, 60, blend);
      camera.setViewOffset(width * F, height * F, width * (F / 2 - lerp(0.5, 0.69, blend)), height * (F / 2 - lerp(0.5, 0.53, blend)), width, height);
    } else {
      camera.fov = lerp(from, 78, blend);
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  };

  return {
    scene,
    camera,
    pose(t, width, height) {
      // One-point perspective down the aisle, drifting two and a half bays as the page scrolls.
      camera.position.set(CELLAR_START.x, CELLAR_START.y, lerp(CELLAR_START.z, CELLAR_START.z - BAY * 2.5, t));
      camera.quaternion.copy(level);
      fog.density = FOG;
      lens(0, 1, width, height);
    },
    enter(position, quaternion, fov, blend, width, height) {
      camera.position.copy(position);
      camera.quaternion.copy(quaternion);
      // Seen from outside, the nave is far off; its haze should not swallow it before the doorway is reached.
      fog.density = FOG * lerp(1, 0.12, smoothstep(0, 14, position.z - CELLAR_DOOR));
      lens(fov, blend, width, height);
    },
    setPortal(on) {
      if (on === portal) return;
      portal = on;
      for (const material of materials) {
        material.stencilWrite = on;
        material.stencilRef = 1;
        material.stencilFunc = THREE.EqualStencilFunc;
        material.stencilFail = material.stencilZFail = material.stencilZPass = THREE.KeepStencilOp;
      }
    },
  };
}

import * as THREE from "three";

import { matte, rng } from "./kit";

/**
 * The box a subscriber receives, shown at the end of the cellar walk: a pine gift box with its hinged lid propped
 * open, the brand burnt into the inside of the lid, and three bottles bedded in wood wool, their maroon capsules
 * towards the aisle. Surfaces are painted on canvases at start-up, like the rest of the cellar.
 */

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Pale pine boards with grain and the odd knot; `brand` burns the Malaka mark into the middle. */
function pineTexture(rand: () => number, width: number, height: number, brand: boolean) {
  return canvasTexture(width, height, (ctx) => {
    const tone = new THREE.Color("#c08d58");
    const rows = Math.max(1, Math.round(height / 170));
    for (let r = 0; r < rows; r++) {
      const y0 = (r * height) / rows, y1 = ((r + 1) * height) / rows;
      ctx.fillStyle = `#${tone.clone().multiplyScalar(0.88 + rand() * 0.22).getHexString()}`;
      ctx.fillRect(0, y0, width, y1 - y0);
      for (let i = 0; i < 70; i++) {
        ctx.strokeStyle = `rgba(90,50,20,${0.06 + rand() * 0.14})`;
        ctx.lineWidth = 0.6 + rand() * 1.6;
        const y = y0 + rand() * (y1 - y0), phase = rand() * 4, wave = 0.004 + rand() * 0.01, swing = 2 + rand() * 1.5;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) ctx.lineTo(x, y + Math.sin(x * wave + phase) * swing);
        ctx.stroke();
      }
      if (rand() > 0.55) {
        const kx = rand() * width, ky = y0 + (0.3 + rand() * 0.4) * (y1 - y0);
        for (let k = 5; k > 0; k--) {
          ctx.strokeStyle = `rgba(80,40,15,${0.12 + k * 0.03})`;
          ctx.beginPath();
          ctx.ellipse(kx, ky, k * 4, k * 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // the joint between two boards
      ctx.fillStyle = "rgba(40,20,8,0.75)";
      ctx.fillRect(0, y1 - 2, width, 3);
    }
    if (!brand) return;
    // Burnt in: dark brown with a scorched halo.
    const cx = width / 2, cy = height / 2;
    ctx.shadowColor = "rgba(70,28,6,0.8)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = ctx.fillStyle = "rgba(48,20,8,0.92)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, width * 0.34, height * 0.33, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${Math.round(height * 0.2)}px Georgia, serif`;
    ctx.fillText("MALAKA", cx, cy - height * 0.03);
    ctx.font = `500 ${Math.round(height * 0.065)}px Georgia, serif`;
    ctx.fillText("V I N O S   D E   M Á L A G A", cx, cy + height * 0.17);
  });
}

/** A bottle label: cream paper with a maroon rule, the grape and the area it comes from. */
function labelTexture(rand: () => number, grape: string, area: string) {
  return canvasTexture(256, 128, (ctx) => {
    ctx.fillStyle = "#ece3d0";
    ctx.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(120,100,70,${rand() * 0.06})`;
      ctx.fillRect(rand() * 256, rand() * 128, 2, 2);
    }
    ctx.fillStyle = "#8e1c3b";
    ctx.fillRect(0, 14, 256, 6);
    ctx.fillStyle = "#2a1a14";
    ctx.textAlign = "center";
    ctx.font = "italic 30px Georgia, serif";
    ctx.fillText(grape, 128, 64);
    ctx.font = "16px Georgia, serif";
    ctx.fillText(area.toUpperCase(), 128, 98);
  });
}

/** What the three bottles are: glass color, grape, area. */
const WINES: [glass: string, grape: string, area: string][] = [
  ["#3a2410", "Moscatel", "Axarquía"],
  ["#14231a", "Romé", "Montes de Málaga"],
  ["#1a1416", "Tinto", "Serranía de Ronda"],
];

/** A Bordeaux bottle, 0.30 m tall, standing on its base at the origin, with a maroon capsule and a label. */
function bottle(rand: () => number, [glassColor, grape, area]: (typeof WINES)[number]) {
  const group = new THREE.Group();
  const profile = [[0, 0], [0.036, 0], [0.037, 0.006], [0.037, 0.2], [0.033, 0.222], [0.016, 0.255], [0.0145, 0.3], [0, 0.3]];
  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 24),
    new THREE.MeshStandardMaterial({ color: glassColor, roughness: 0.12, metalness: 0.15 }),
  );
  const capsule = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0158, 0.0162, 0.055, 18),
    new THREE.MeshStandardMaterial({ color: "#8e1c3b", roughness: 0.35, metalness: 0.4 }),
  );
  capsule.position.y = 0.3 - 0.0255;
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0375, 0.0375, 0.085, 24, 1, true, Math.PI * 0.15, Math.PI * 0.7),
    new THREE.MeshStandardMaterial({ map: labelTexture(rand, grape, area), roughness: 0.9, side: THREE.DoubleSide }),
  );
  label.position.y = 0.1;
  label.rotation.y = -Math.PI / 2;
  group.add(glass, capsule, label);
  for (const mesh of [glass, capsule, label]) mesh.castShadow = mesh.receiveShadow = true;
  return group;
}

/** Wood wool: short straw-colored strands strewn over a `width` × `depth` patch, `y` up. */
function woodWool(rand: () => number, width: number, depth: number, y: number, count: number) {
  const strand = new THREE.CylinderGeometry(0.0016, 0.0016, 1, 3).rotateZ(Math.PI / 2);
  const mesh = new THREE.InstancedMesh(strand, matte("#d8b06c", { roughness: 1 }), count);
  const dummy = new THREE.Object3D(), color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    dummy.position.set((rand() - 0.5) * width, y + rand() * 0.03, (rand() - 0.5) * depth);
    dummy.rotation.set(rand() * 0.8 - 0.4, rand() * Math.PI, rand() * 0.8 - 0.4);
    dummy.scale.set(0.03 + rand() * 0.07, 1, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, color.set("#e2bd7c").multiplyScalar(0.7 + rand() * 0.45));
  }
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * The gift box, standing on the origin with its open side up and its front towards +Z: 0.36 m wide, 0.27 m deep and
 * 0.11 m tall, hinged at the back.
 */
export function buildWineBox() {
  const rand = rng(7);
  const W = 0.36, D = 0.27, H = 0.11, T = 0.012; // outside size, and the thickness of the boards
  const pine = new THREE.MeshStandardMaterial({ map: pineTexture(rand, 512, 256, false), roughness: 0.8 });
  const branded = new THREE.MeshStandardMaterial({ map: pineTexture(rand, 1024, 768, true), roughness: 0.75 });
  const box = new THREE.Group();

  const board = (sx: number, sy: number, sz: number, x: number, y: number, z: number, material: THREE.Material | THREE.Material[], parent: THREE.Object3D = box) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  board(W, T, D, 0, T / 2, 0, pine);
  for (const s of [-1, 1]) {
    board(W, H, T, 0, H / 2, s * (D / 2 - T / 2), pine);
    board(T, H, D - 2 * T, s * (W / 2 - T / 2), H / 2, 0, pine);
  }

  // Three bottles lying side by side, capsules to the right, just proud of the rim in their bed of wood wool.
  box.add(woodWool(rand, W - 0.03, D - 0.03, H - 0.04, 420));
  WINES.forEach((wine, i) => {
    const lying = bottle(rand, wine);
    lying.rotation.z = -Math.PI / 2;
    lying.position.set(-0.155, H - 0.012, (i - 1) * 0.08);
    box.add(lying);
  });

  // The lid, swung up a little past upright on its back edge. The brand is on its inside face (-Y as it lay shut),
  // which now faces the aisle.
  const hinge = new THREE.Group();
  hinge.position.set(0, H, -D / 2);
  hinge.rotation.x = (-100 * Math.PI) / 180;
  box.add(hinge);
  board(W, T, D, 0, T / 2, D / 2, [pine, pine, pine, branded, pine, pine], hinge);

  // The maroon ribbon that tied it, still round the open lid, its loose end trailing over the front.
  const ribbon = matte("#8e1c3b", { roughness: 0.5, flatShading: false });
  board(0.028, T + 0.004, D + 0.004, 0.13, -0.003, D / 2, ribbon, hinge);
  const tail = board(0.028, 0.004, 0.16, 0.12, H - 0.048, D / 2 + 0.03, ribbon);
  tail.rotation.x = 1.2;

  return box;
}

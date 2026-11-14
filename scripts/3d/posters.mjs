/**
 * Renders the still images of the site's 3D scenes from the scenes themselves, so a still and the live picture that
 * replaces it are the same frame:
 *
 *   npm run build && node scripts/3d/posters.mjs
 *
 * It serves the built site from `out/`, opens it in headless Chromium and saves, into `public/3d/posters/`:
 *
 * - `vineyard-*` and `cellar-*`: the homepage's two scenes, each in three shapes (see `ScenePoster`);
 * - `relief-overview` and `relief-<area>`: the wine guide's table, whole and turned to each area;
 * - and, in `public/`, `og-es.jpg` and `og-en.jpg`: the social cards, which are the homepage's first screen.
 *
 * Run it again whenever a scene changes (and rebuild afterwards, so `out/` picks up the new images). It needs
 * Playwright with Chromium, which is not one of the site's dependencies: `npm i -D playwright` if it is missing.
 */
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "out");
const POSTERS = path.join(ROOT, "public/3d/posters");
fs.mkdirSync(POSTERS, { recursive: true });
if (!fs.existsSync(path.join(OUT, "index.html"))) throw new Error("Build the site first: npm run build");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((request, response) => {
  const url = decodeURIComponent(request.url.split("?")[0]).replace(/\/$/, "");
  const file = [url, `${url}.html`, `${url}/index.html`].map((candidate) => path.join(OUT, candidate)).find((candidate) => candidate.startsWith(OUT) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Software rendering, so the script also runs on machines and CI runners without a GPU.
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });

async function open(url, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    localStorage.setItem("malaka-age-confirmed", "1");
    // Always the full-detail scene, whatever machine this runs on.
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 16 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 16 });
  });
  page.on("pageerror", (error) => console.error("[page]", error.message));
  await page.goto(origin + url);
  return page;
}
const settle = (page, ms = 1800) => page.waitForTimeout(ms);
// The scenes fill the window by the time they are captured, so a picture of the window is a picture of the scene.
const shot = (page) => page.screenshot({ type: "png", timeout: 180000 });
async function save(buffer, name) {
  await sharp(buffer).webp({ quality: 82 }).toFile(path.join(POSTERS, `${name}.webp`));
  await sharp(buffer).avif({ quality: 58 }).toFile(path.join(POSTERS, `${name}.avif`));
  console.log("wrote", name);
}

// The homepage's two scenes.
for (const [shape, width, height] of [["wide", 2400, 1000], ["square", 1600, 1600], ["tall", 1080, 1800]]) {
  const page = await open("/", width, height);
  await page.waitForSelector(".home-stage[data-live]", { timeout: 120000 });
  // Only the scene: no text, no shading, no navigation bar.
  await page.addStyleTag({ content: ".home-stage > div:last-child, .home-stage [aria-hidden]:not(canvas), body > header, footer { visibility: hidden !important }" });
  await settle(page);
  await save(await shot(page), `vineyard-${shape}`);
  // Scroll to where the lamplight has just cleared inside the cellar.
  await page.evaluate(() => {
    const cellar = document.querySelector("[data-stage-cellar]");
    window.scrollTo({ top: cellar.offsetTop - innerHeight * 0.75 + innerHeight * 0.34, behavior: "instant" });
  });
  await settle(page, 2600);
  await save(await shot(page), `cellar-${shape}`);
  await page.close();
}

// The wine guide's table: the whole province, then turned to each area.
{
  const page = await open("/vinos-de-malaga", 1440, 900);
  await page.waitForSelector(".relief[data-live]", { timeout: 120000 });
  await page.addStyleTag({ content: ".relief { position: fixed !important; inset: 0 !important; z-index: 1000; aspect-ratio: auto !important; border-radius: 0 !important } .relief > :not(canvas) { visibility: hidden !important }" });
  await settle(page);
  await save(await shot(page), "relief-overview");
  const areas = await page.evaluate(() => [...document.querySelectorAll(".relief [data-place]")].map((tag) => tag.dataset.place).filter((key) => key !== "malaga"));
  for (const area of areas) {
    await page.evaluate((key) => document.querySelector(`.relief button[data-place="${key}"]`).click(), area);
    await settle(page, 4200);
    await save(await shot(page), `relief-${area}`);
  }
  await page.close();
}

// The social cards: the homepage's first screen, in each language.
for (const [lang, url] of [["es", "/"], ["en", "/en"]]) {
  const page = await open(url, 1200, 630);
  await page.waitForSelector(".home-stage[data-live]", { timeout: 120000 });
  await page.addStyleTag({ content: "body > header { visibility: hidden !important }" });
  await settle(page);
  await sharp(await shot(page)).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(ROOT, `public/og-${lang}.jpg`));
  console.log("wrote", `og-${lang}`);
  await page.close();
}

await browser.close();
server.close();

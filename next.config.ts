import type { NextConfig } from "next";

// Static export: `next build` writes the whole site as plain HTML, CSS and JS to `out/`, which Cloudflare Pages
// serves from its CDN. Nothing here needs a server; keep it that way (no route handlers, cookies or server actions)
// or the build will fail.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;

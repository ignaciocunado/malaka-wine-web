import type { NextConfig } from "next";

// Static export: `next build` writes the whole site as plain HTML, CSS and JS to `out/`, which Cloudflare serves
// as static assets (see wrangler.jsonc). Nothing here needs a server; keep it that way (no route handlers, cookies or server actions)
// or the build will fail.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;

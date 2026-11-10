import type { NextConfig } from "next";

// Static export: `next build` writes the whole site as plain HTML, CSS and JS to `out/`, which Cloudflare serves
// as static assets (see wrangler.jsonc). Nothing here needs a server; keep it that way (no route handlers that read
// the request, cookies or server actions) or the build will fail.
const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    // Spanish and English each have their own root layout (`app/(es)` and `app/en`), so the 404 page can't be built
    // from a shared layout; `app/global-not-found.tsx` is a standalone document instead.
    globalNotFound: true,
  },
};

export default nextConfig;

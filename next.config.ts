import type { NextConfig } from "next";

// No custom config: every page is prerendered at build time, so on Vercel the whole site is served from the CDN.
const nextConfig: NextConfig = {};

export default nextConfig;

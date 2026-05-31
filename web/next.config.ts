import type { NextConfig } from "next";

// Static export for GitHub Pages. The site lives at
// lollob2007.github.io/kwell/, so every internal URL needs the
// `/kwell` prefix. We hardcode the prefix on CI (GITHUB_ACTIONS=true)
// so `npm run dev` keeps working at `/` locally.
const onPages = process.env.GITHUB_ACTIONS === "true";
const basePath = onPages ? "/kwell" : "";

const config: NextConfig = {
  output: "export",
  // Emits `out/foo/index.html` instead of `out/foo.html` — what Pages
  // expects for clean URLs.
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    // GitHub Pages has no image optimizer.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "storage.trybloom.ai" },
      { protocol: "https", hostname: "www.trybloom.ai" },
      { protocol: "https", hostname: "kwell.it" },
      { protocol: "https", hostname: "**.kwell.it" },
    ],
  },
  experimental: { optimizePackageImports: ["gsap", "lenis"] },
};

export default config;

import type { NextConfig } from "next";

// The site ships as a fully static export so it can be served from
// GitHub Pages. Pages project-sites live at `<user>.github.io/<repo>/`,
// so basePath/assetPrefix prefix every internal URL with `/kwell`.
// GitHub Actions builds with NEXT_PUBLIC_BASE_PATH set; locally we
// default to no prefix so `npm run dev` keeps working at `/`.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  // Tells Next to emit `out/foo/index.html` instead of `out/foo.html`,
  // which is what Pages expects for clean URLs.
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

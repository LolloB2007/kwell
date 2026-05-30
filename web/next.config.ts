import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
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

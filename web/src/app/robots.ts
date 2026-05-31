import type { MetadataRoute } from "next";

// Required by `output: "export"` — tells Next this route resolves
// purely at build time so it can be emitted as a static file.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account/", "/cart", "/checkout", "/api/"] },
    ],
    sitemap: "https://kwell.it/sitemap.xml",
    host: "https://kwell.it",
  };
}

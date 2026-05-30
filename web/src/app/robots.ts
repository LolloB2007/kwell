import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account/", "/cart", "/checkout", "/api/"] },
    ],
    sitemap: "https://kwell.it/sitemap.xml",
    host: "https://kwell.it",
  };
}

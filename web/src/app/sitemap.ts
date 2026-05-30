import type { MetadataRoute } from "next";
import { getCategories, getFeaturedProducts } from "@/lib/api";

const BASE = "https://kwell.it";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, priority: 1.0 },
    { url: `${BASE}/categories`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/b2b`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: now, priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, priority: 0.3 },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const categories = await getCategories();
    categoryRoutes = categories.map((c) => ({
      url: `${BASE}/categories/${c.slug}`,
      lastModified: now,
      priority: 0.8,
    }));

    const products = await getFeaturedProducts(100);
    productRoutes = products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    }));
  } catch {
    // API unavailable at build time — return static routes only.
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

import type { Metadata } from "next";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import { CatalogView } from "@/components/CatalogView";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Sfoglia il catalogo completo Kwell: functional, cardio, forza, yoga, boxe, riabilitazione, pavimentazioni.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    // pull a wider list so the search has something to match
    getFeaturedProducts(50).catch(() => []),
  ]);
  return <CatalogView categories={categories} products={products} />;
}

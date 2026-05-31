import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/api";
import { CategoryDetailView } from "@/components/CategoryDetailView";

export const revalidate = 300;

// See products/[slug]/page.tsx for the rationale: no API at build time,
// so no slugs prerender and Next skips this route in the static export.
export const dynamicParams = false;
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) return { title: "Categoria non trovata" };

  const title = data.category.name_it || data.category.name;
  const description = data.category.description_it || data.category.description || `${title} — Kwell`;
  return {
    title,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: { title, description },
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) notFound();
  return <CategoryDetailView category={data.category} products={data.products} />;
}

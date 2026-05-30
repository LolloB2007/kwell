import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getCategories, getRelatedProducts } from "@/lib/api";
import { ProductDetailView } from "@/components/ProductDetailView";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Prodotto non trovato" };

  // Use the Italian name by default (matches the site's primary locale).
  const title = product.name_it || product.name;
  const description = product.short_description_it || product.short_description || `${title} — Kwell`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.image_url ? [{ url: product.image_url }] : [{ url: "/brand/categories-splash.jpg" }],
    },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([
    getCategories().catch(() => []),
    getRelatedProducts(product, 4).catch(() => []),
  ]);

  const category = product.category_ids[0]
    ? categories.find((c) => c.id === product.category_ids[0]) ?? null
    : null;

  // Inline JSON-LD for SEO rich results.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_it || product.name,
    description: product.short_description_it || product.short_description,
    sku: `KW-${product.id}`,
    image: product.image_url ? [product.image_url] : ["https://kwell.it/brand/categories-splash.jpg"],
    brand: { "@type": "Brand", name: "Kwell" },
    offers: {
      "@type": "Offer",
      url: `https://kwell.it/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductDetailView product={product} category={category} related={related} />
    </>
  );
}

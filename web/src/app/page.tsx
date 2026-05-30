import { ParallaxHero } from "@/components/ParallaxHero";
import { BrandTicker } from "@/components/BrandTicker";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { B2BSection } from "@/components/B2BSection";
import { Stats } from "@/components/Stats";
import { Manifesto } from "@/components/Manifesto";
import { AtelierBand } from "@/components/AtelierBand";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import { BRAND_IMAGES } from "@/lib/brand";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getFeaturedProducts(4).catch(() => []),
  ]);

  return (
    <>
      <ParallaxHero imageUrl={BRAND_IMAGES.hero} />
      <BrandTicker />
      <Stats />
      <CategoryGrid categories={categories} splashImageUrl={BRAND_IMAGES.categoriesSplash} />
      <Manifesto />
      <AtelierBand />
      <FeaturedProducts products={products} />
      <B2BSection imageUrl={BRAND_IMAGES.b2b} />
    </>
  );
}

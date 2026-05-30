"use client";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const { t } = useT();
  return (
    <section className="kwell-section bg-ink-900 border-t border-fg/[0.05]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="kwell-eyebrow flex items-center gap-3">
                <span className="block h-px w-6 bg-accent" />
                {t("featured.eyebrow")}
              </div>
              <h2 className="kwell-h2 mt-4">{t("featured.title")}</h2>
            </div>
            <a href="/categories" className="kwell-btn-ghost group">
              {t("common.viewAll")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

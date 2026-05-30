"use client";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";
import { categoryName, categoryDescription } from "@/lib/localize";

export function CategoryDetailView({ category, products }: { category: Category; products: Product[] }) {
  const { t, locale } = useT();
  const name = categoryName(category, locale);
  const desc = categoryDescription(category, locale);
  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Link href="/categories" className="kwell-eyebrow inline-flex items-center gap-2 opacity-60 hover:opacity-100">
            <span>←</span> {t("catalog.allCategories")}
          </Link>
          <div className="mt-6 flex items-end justify-between gap-6 flex-wrap">
            <h1 className="kwell-h1">{name}</h1>
            <div className="hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">
              CAT · N°{String(category.id).padStart(2, "0")}
            </div>
          </div>
          {desc && <p className="mt-4 max-w-2xl text-smoke-mid leading-relaxed">{desc}</p>}
        </Reveal>

        {products.length === 0 ? (
          <div className="mt-16 border border-fg/10 bg-ink-800 p-12 text-center">
            <div className="font-display text-2xl uppercase tracking-display-tight">{t("catalog.noResults")}</div>
            <p className="mt-2 text-sm text-fg/50">{t("catalog.noResultsHint")}</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";
import { categoryName } from "@/lib/localize";

export function CategoryGrid({ categories, splashImageUrl }: { categories: Category[]; splashImageUrl: string | null }) {
  const { t, locale } = useT();
  return (
    <section className="kwell-section bg-ink-900">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="kwell-eyebrow flex items-center gap-3">
                <span className="block h-px w-6 bg-accent" />
                {t("categories.eyebrow")}
              </div>
              <h2 className="kwell-h2 mt-4 max-w-3xl">
                {t("categories.titleA")}<br />
                <span className="text-accent">{t("categories.titleAccent")}</span>
              </h2>
            </div>
            <div className="hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">N°02 / CATALOGO</div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-3 md:grid-cols-12 md:grid-rows-2">
          <Reveal className="relative overflow-hidden md:col-span-5 md:row-span-2 aspect-square md:aspect-auto group">
            {splashImageUrl ? (
              <Image src={splashImageUrl} alt="" fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-kwell group-hover:scale-[1.04]" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute left-6 top-6 font-display text-[10px] tracking-[0.3em] text-fg/50">SELECTION · 24/A</div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="kwell-eyebrow">{t("categories.pickEyebrow")}</div>
              <div className="mt-2 font-display text-3xl uppercase tracking-display-tight">{t("categories.pickTitle")}</div>
            </div>
          </Reveal>

          {categories.slice(0, 7).map((c, i) => (
            <Reveal key={c.id} delay={i * 50} className="md:col-span-7 md:[&:nth-child(n+3)]:col-span-4 md:[&:nth-child(2)]:col-span-7">
              <Link
                href={`/categories/${c.slug}`}
                className="group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden border border-fg/[0.07] bg-ink-800 p-6 transition-colors duration-500 hover:border-accent"
              >
                <span className="absolute right-0 top-0 h-full w-0 bg-accent/[0.04] transition-all duration-500 group-hover:w-full" />
                <div className="relative flex items-start justify-between">
                  <span className="kwell-eyebrow opacity-50 group-hover:opacity-100">N°{String(c.id).padStart(2, "0")}</span>
                  <span className="font-display text-sm text-fg/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent">→</span>
                </div>
                <div className="relative">
                  <div className="font-display text-2xl uppercase tracking-display-tight md:text-3xl transition-transform duration-500 group-hover:-translate-y-0.5">{categoryName(c, locale)}</div>
                  {c.product_count != null && (
                    <div className="mt-1 text-[11px] tracking-[0.2em] text-fg/40">{c.product_count} {t("common.products")}</div>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

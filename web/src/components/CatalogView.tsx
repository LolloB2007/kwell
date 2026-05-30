"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { useT } from "@/lib/i18n/LanguageProvider";
import { didYouMean, fuzzyScore, normalize, tokenize } from "@/lib/search";
import { categoryName, categoryDescription } from "@/lib/localize";

type Props = { categories: Category[]; products: Product[] };

type Indexed = {
  product: Product;
  rawHay: string;
  hayTokens: string[];
};

export function CatalogView({ categories, products }: Props) {
  const { t, locale } = useT();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Build a search index once per product list. The hay includes BOTH
  // Italian and English names + descriptions + the full exercise / keyword
  // vocabulary, so a search like "kettlebell swing" or "panca piana" or
  // "trazioni" finds the matching equipment regardless of UI language.
  const { index, vocabulary, categoryById } = useMemo(() => {
    const byCat = new Map(categories.map((c) => [c.id, c]));
    const vocab = new Set<string>();
    const idx: Indexed[] = products.map((p) => {
      const catNames = p.category_ids.map((id) => {
        const c = byCat.get(id);
        if (!c) return "";
        return `${c.name_it ?? c.name} ${c.name_en ?? c.name}`;
      }).join(" ");
      const haySource = [
        p.name,
        p.name_it,
        p.name_en,
        p.short_description ?? "",
        p.short_description_it ?? "",
        p.short_description_en ?? "",
        ...(p.exercises ?? []),
        p.slug,
        catNames,
      ].join(" ");
      const raw = normalize(haySource);
      const toks = tokenize(raw);
      toks.forEach((t) => vocab.add(t));
      return { product: p, rawHay: raw, hayTokens: toks };
    });
    return { index: idx, vocabulary: vocab, categoryById: byCat };
  }, [products, categories]);

  const query = q.trim();
  const queryTokens = useMemo(() => tokenize(query), [query]);

  const results = useMemo(() => {
    if (queryTokens.length === 0) return [] as { product: Product; score: number }[];
    const scored: { product: Product; score: number }[] = [];
    for (const item of index) {
      const { score } = fuzzyScore(item.hayTokens, item.rawHay, queryTokens);
      if (score > 0) scored.push({ product: item.product, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [index, queryTokens]);

  const suggestion = useMemo(() => {
    if (queryTokens.length === 0 || results.length > 0) return null;
    return didYouMean(queryTokens, vocabulary);
  }, [queryTokens, results.length, vocabulary]);

  // Keyboard shortcuts: "/" focuses the input, ESC clears
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement | null)?.isContentEditable;
      if (e.key === "/" && !inField) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQ("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="kwell-eyebrow flex items-center gap-3">
                <span className="block h-px w-6 bg-accent" />
                {t("catalog.eyebrow")}
              </div>
              <h1 className="kwell-h1 mt-4">
                {t("catalog.titleA")} <span className="text-accent">{t("catalog.titleAccent")}</span>
              </h1>
            </div>
            <div className="hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">
              {categories.length.toString().padStart(2, "0")} CAT · {products.length} SKU
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <div className="relative flex items-stretch border border-fg/15 bg-ink-800 transition-colors duration-300 focus-within:border-accent">
            <span className="grid w-12 place-items-center text-fg/50">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full bg-transparent py-4 pr-4 font-body text-base text-fg placeholder-fg/30 outline-none"
              aria-label={t("catalog.searchAria")}
              autoComplete="off"
              spellCheck={false}
            />
            <div className="hidden items-center pr-3 md:flex">
              {!q ? (
                <kbd className="rounded border border-fg/15 px-1.5 py-0.5 font-display text-[10px] tracking-[0.15em] text-fg/40">/</kbd>
              ) : (
                <button
                  onClick={() => { setQ(""); inputRef.current?.focus(); }}
                  className="font-display text-xs uppercase tracking-wider text-fg/50 hover:text-accent"
                  aria-label={t("catalog.clear")}
                >
                  {t("catalog.clear")} ×
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-[11px] tracking-[0.18em] text-fg/40">
            <div>
              {query ? (
                <>
                  {results.length} {t("catalog.resultsLabel")} · &ldquo;{query}&rdquo;
                </>
              ) : (
                <span>{t("catalog.shortcutHint")}</span>
              )}
            </div>
            {query && suggestion && (
              <button
                onClick={() => setQ(suggestion)}
                className="font-display text-[11px] uppercase tracking-[0.22em] text-accent hover:underline"
              >
                {t("catalog.didYouMean")} &ldquo;{suggestion}&rdquo; ?
              </button>
            )}
          </div>
        </Reveal>

        {/* Browse mode — show category grid when there's no query */}
        {!query && (
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 50}>
                <CategoryCard category={c} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Search mode — products only */}
        {query && results.length === 0 && (
          <div className="mt-16 border border-fg/10 bg-ink-800 p-12 text-center">
            <div className="font-display text-3xl uppercase tracking-display-tight">{t("catalog.noResults")}</div>
            <p className="mt-3 text-sm text-fg/50">{t("catalog.noResultsHint")}</p>
            {suggestion && (
              <button onClick={() => setQ(suggestion)} className="kwell-btn-primary mt-8 inline-flex">
                {t("catalog.didYouMean")} &ldquo;{suggestion}&rdquo;
              </button>
            )}
            {!suggestion && (
              <button onClick={() => setQ("")} className="kwell-btn-ghost mt-8">
                {t("catalog.clear")}
              </button>
            )}
          </div>
        )}

        {query && results.length > 0 && (
          <div className="mt-14">
            <div className="flex items-baseline justify-between border-b border-fg/10 pb-3">
              <div className="font-display text-sm uppercase tracking-[0.22em]">{t("catalog.products")}</div>
              <div className="font-display text-[10px] tracking-[0.3em] text-fg/40">{String(results.length).padStart(2, "0")}</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map(({ product }) => {
                const primary = categoryById.get(product.category_ids[0]);
                return (
                  <div key={product.id} className="space-y-1">
                    <ProductCard product={product} />
                    {primary && (
                      <div className="px-1 font-display text-[10px] tracking-[0.22em] text-fg/40">
                        {t("catalog.searching")} <Link href={`/categories/${primary.slug}`} className="text-fg/70 hover:text-accent">{categoryName(primary, locale)}</Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const { t, locale } = useT();
  const name = categoryName(category, locale);
  const desc = categoryDescription(category, locale);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex h-64 flex-col justify-between overflow-hidden border border-fg/[0.07] bg-ink-800 p-8 transition-colors duration-500 hover:border-accent"
    >
      <span className="absolute right-0 top-0 h-full w-0 bg-accent/[0.04] transition-all duration-500 group-hover:w-full" />
      <div className="relative flex items-center justify-between">
        <span className="kwell-eyebrow opacity-60">N°{String(category.id).padStart(2, "0")}</span>
        <span className="text-fg/40 group-hover:text-accent transition-all duration-500 group-hover:translate-x-1">→</span>
      </div>
      <div className="relative">
        <div className="font-display text-3xl uppercase tracking-display-tight transition-transform duration-500 group-hover:-translate-y-0.5">{name}</div>
        {desc && <p className="mt-2 text-sm text-fg/50 leading-relaxed">{desc}</p>}
        {category.product_count != null && (
          <div className="mt-4 text-[11px] tracking-[0.2em] text-fg/40">{category.product_count} {t("common.products")}</div>
        )}
      </div>
    </Link>
  );
}

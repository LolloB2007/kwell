"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useShop } from "@/lib/shop/ShopProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { Reveal } from "./Reveal";
import { ProductCard } from "./ProductCard";
import { deriveSpecs } from "@/lib/productSpecs";
import { productName, productDescription, categoryName } from "@/lib/localize";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
  category: Category | null;
  related: Product[];
};

export function ProductDetailView({ product, category, related }: Props) {
  const { t, locale } = useT();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const { push } = useToast();
  const [qty, setQty] = useState(1);

  const name = productName(product, locale);
  const desc = productDescription(product, locale);
  const specs = deriveSpecs(product);
  const saved = inWishlist(product.id);
  const onSale = product.price_compare && product.price_compare > product.price;

  function handleAddToCart() {
    addToCart(product, qty);
    push({ message: `${t("product.addedToast")} · ${name}`, action: { label: t("product.viewCartCta"), href: "/cart" } });
  }

  function handleToggleWishlist() {
    const wasNotSaved = !saved;
    toggleWishlist(product.id);
    if (wasNotSaved) push({ message: `${t("product.savedToast")} · ${name}` });
  }

  return (
    <>
      <section className="kwell-section pt-32 bg-ink-900 md:pt-40">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-display text-[10px] uppercase tracking-[0.22em] text-fg/40">
              <Link href="/" className="hover:text-accent">{t("breadcrumb.home")}</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-accent">{t("nav.catalog")}</Link>
              {category && (
                <>
                  <span>/</span>
                  <Link href={`/categories/${category.slug}`} className="hover:text-accent">
                    {categoryName(category, locale)}
                  </Link>
                </>
              )}
            </nav>
          </Reveal>

          {/* Top section: gallery + buy column */}
          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <div className="relative aspect-square w-full overflow-hidden border border-fg/[0.07] bg-ink-800">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <BlueprintEmptyState id={product.id} />
                )}
                <span className="absolute left-4 top-4 font-display text-[10px] tracking-[0.3em] text-fg/40">
                  N°{String(product.id).padStart(3, "0")} / {t("product.gallery")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={120} className="md:col-span-5">
              <div className="flex flex-col gap-6">
                {category && (
                  <Link href={`/categories/${category.slug}`} className="kwell-eyebrow inline-flex w-fit items-center gap-3 hover:text-fg">
                    <span className="block h-px w-6 bg-accent" />
                    {categoryName(category, locale)}
                  </Link>
                )}

                <h1 className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] tracking-display-tight">
                  {name}
                </h1>

                {desc && <p className="text-base leading-relaxed text-smoke-mid">{desc}</p>}

                <div className="flex items-center gap-3 border-y border-fg/[0.07] py-5">
                  <span className="font-display text-3xl text-accent">{formatPrice(product.price)}</span>
                  {onSale && product.price_compare && (
                    <span className="text-sm text-fg/40 line-through">{formatPrice(product.price_compare)}</span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-2 font-display text-[10px] tracking-[0.25em]">
                    <span className={`h-1.5 w-1.5 rounded-full ${product.in_stock ? "bg-accent" : "bg-fg/40"}`} />
                    {product.in_stock ? t("product.inStock") : t("product.outOfStock")}
                  </span>
                </div>

                {/* Qty + actions */}
                <div className="flex flex-wrap items-stretch gap-3">
                  <div className="inline-flex items-center border border-fg/15">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-fg/70 hover:text-accent">−</button>
                    <span className="grid h-12 w-12 place-items-center font-display tabular-nums">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-fg/70 hover:text-accent">+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className="kwell-btn-primary group flex-1 disabled:opacity-40"
                  >
                    {t("common.addToCart")}
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={t("common.addToWishlist")}
                    className={`grid h-12 w-12 place-items-center border transition-all ${saved ? "border-accent bg-accent/10 text-accent" : "border-fg/15 text-fg/70 hover:border-accent hover:text-accent"}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
                    </svg>
                  </button>
                </div>

                {/* Specs strip */}
                <div className="mt-2 grid grid-cols-3 gap-px bg-fg/10">
                  <SpecCell label={t("common.steelGrade")} value={specs.steel} />
                  <SpecCell label={t("common.weight")} value={`${specs.weightKg} kg`} />
                  <SpecCell label={t("common.warranty")} value={`${specs.warrantyYears} ${t("common.years")}`} />
                </div>

                <div className="flex items-center gap-3 border-t border-fg/10 pt-4 font-display text-[10px] tracking-[0.3em] text-fg/40">
                  <span>{t("product.sku")}</span>
                  <span className="text-fg/60">KW—{String(product.id).padStart(4, "0")}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Recommended exercises */}
          {product.exercises && product.exercises.length > 0 && (
            <Reveal delay={120} className="mt-20 border-t border-fg/10 pt-12">
              <div className="kwell-eyebrow mb-6 flex items-center gap-3">
                <span className="block h-px w-6 bg-accent" />
                {t("product.exercises")}
              </div>
              <ul className="flex flex-wrap gap-2">
                {product.exercises.slice(0, 18).map((ex) => (
                  <li
                    key={ex}
                    className="border border-fg/15 px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.18em] text-fg/75"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="kwell-section border-t border-fg/10 bg-ink-900">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="kwell-eyebrow flex items-center gap-3">
                    <span className="block h-px w-6 bg-accent" />
                    {t("product.related")}
                  </div>
                  <h2 className="kwell-h2 mt-4">{t("product.related")}</h2>
                </div>
                {category && (
                  <Link href={`/categories/${category.slug}`} className="kwell-btn-ghost group">
                    {t("product.backToCategory")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                )}
              </div>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-800 p-4">
      <div className="font-display text-[10px] tracking-[0.22em] text-fg/40">{label}</div>
      <div className="mt-1 font-display text-sm tracking-wider text-fg">{value}</div>
    </div>
  );
}

function BlueprintEmptyState({ id }: { id: number }) {
  const serial = String(id).padStart(4, "0");
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-ink-800">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={`hatch-${id}`} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#hatch-${id})`} className="text-fg/[0.05]" />
      </svg>
      <div className="relative flex flex-col items-center gap-4">
        <div className="font-display text-[8rem] uppercase tracking-display-tight text-fg/[0.08] leading-none">K</div>
        <div className="h-px w-14 bg-accent/60" />
        <div className="font-display text-xs tracking-[0.3em] text-fg/40">KW—{serial}</div>
      </div>
    </div>
  );
}

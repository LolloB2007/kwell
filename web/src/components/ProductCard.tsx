"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useShop } from "@/lib/shop/ShopProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { deriveSpecs } from "@/lib/productSpecs";

const fmt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const { t, locale } = useT();
  const { push } = useToast();
  const onSale = product.price_compare && product.price_compare > product.price;
  const saved = inWishlist(product.id);
  const specs = deriveSpecs(product);

  const displayName =
    (locale === "en" ? product.name_en : product.name_it) || product.name;
  const displayDesc =
    (locale === "en" ? product.short_description_en : product.short_description_it) ||
    product.short_description;

  return (
    <article className="group relative flex flex-col border border-fg/[0.07] bg-ink-800 transition-colors duration-500 hover:border-accent">
      <a href={`/products/${product.slug}`} aria-label={displayName} className="relative block aspect-square overflow-hidden bg-ink-900">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={displayName}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-kwell group-hover:scale-[1.08]"
          />
        ) : (
          <BrandedEmptyState id={product.id} />
        )}

        {/* Badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <div className="flex gap-1.5">
            {onSale && <span className="bg-accent px-2 py-1 font-display text-[10px] uppercase tracking-wider text-white">Sale</span>}
            {product.badges?.includes("new") && (
              <span className="border border-fg/40 bg-black/40 px-2 py-1 font-display text-[10px] uppercase tracking-wider text-fg backdrop-blur-sm">
                New
              </span>
            )}
          </div>
          <span className="font-display text-[9px] tracking-[0.25em] text-fg/30">KW—{String(product.id).slice(-3)}</span>
        </div>

        {/* Hover spec overlay — slides up over the bottom of the image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-500 ease-kwell group-hover:translate-y-0 group-hover:opacity-100"
        >
          <div className="bg-gradient-to-t from-ink-deepest/95 via-ink-deepest/80 to-transparent px-4 pb-4 pt-12">
            <dl className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.2em]">
              <SpecCell label={t("common.steelGrade")} value={specs.steel} />
              <SpecCell label={t("common.weight")} value={`${specs.weightKg} kg`} />
              <SpecCell label={t("common.warranty")} value={`${specs.warrantyYears} ${t("common.years")}`} />
            </dl>
          </div>
        </div>
      </a>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <a href={`/products/${product.slug}`} className="font-display text-base uppercase tracking-wider hover:text-accent">{displayName}</a>
          {displayDesc && <p className="mt-1 text-xs text-fg/50 leading-relaxed">{displayDesc}</p>}
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-lg text-accent">{fmt.format(product.price)}</div>
            {onSale && product.price_compare && <div className="text-[11px] text-fg/40 line-through">{fmt.format(product.price_compare)}</div>}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                const wasNotSaved = !saved;
                toggleWishlist(product.id);
                if (wasNotSaved) push({ message: `${t("product.savedToast")} · ${displayName}` });
              }}
              aria-label={t("common.addToWishlist")}
              title={t("common.addToWishlist")}
              className={`grid h-9 w-9 place-items-center border transition-all ${saved ? "border-accent bg-accent/10 text-accent" : "border-fg/15 text-fg/70 hover:border-accent hover:text-accent"}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, 1);
                push({ message: `${t("product.addedToast")} · ${displayName}`, action: { label: t("product.viewCartCta"), href: "/cart" } });
              }}
              aria-label={t("common.addToCart")}
              title={t("common.addToCart")}
              className="grid h-9 w-9 place-items-center border border-fg/15 text-fg/70 transition-all hover:border-accent hover:bg-accent hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.5L21 8H6" />
                <circle cx="9" cy="20" r="1.2" />
                <circle cx="17" cy="20" r="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-accent/50 pl-2">
      <dt className="text-fg/40">{label}</dt>
      <dd className="mt-0.5 font-display text-[11px] tracking-[0.15em] text-fg">{value}</dd>
    </div>
  );
}

/**
 * Refined branded empty state: monogram K with diagonal hatching and a
 * subtle KW—xxx serial, evoking a technical drawing. Replaces the
 * oversized faded K we had before.
 */
function BrandedEmptyState({ id }: { id: number }) {
  const serial = String(id).padStart(4, "0");
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#hatch)" className="text-fg/[0.04]" />
      </svg>
      <div className="relative flex flex-col items-center gap-3">
        <div className="font-display text-5xl uppercase tracking-display-tight text-fg/15">K</div>
        <div className="h-px w-10 bg-accent/40" />
        <div className="font-display text-[10px] tracking-[0.3em] text-fg/30">KW—{serial}</div>
      </div>
    </div>
  );
}

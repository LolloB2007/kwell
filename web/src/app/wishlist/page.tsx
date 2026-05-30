"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { useShop } from "@/lib/shop/ShopProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getFeaturedProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { t } = useT();
  const { wishlist, removeWishlist, clearWishlist, addToCart } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFeaturedProducts(50)
      .then((all) => { if (mounted) setProducts(all); })
      .catch(() => { if (mounted) setProducts([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <PageHeader eyebrow={t("nav.wishlist")} title={t("wishlist.title")} code={`N°W / ${String(wishlist.length).padStart(2, "0")}`}>
        <div className="text-xs tracking-[0.18em] text-fg/40">{wishlist.length} {wishlist.length === 1 ? t("common.product") : t("common.products")}</div>
      </PageHeader>

      <section className="kwell-section pt-12 bg-ink-900">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center text-fg/40">…</div>
          ) : items.length === 0 ? (
            <Reveal>
              <EmptyState title={t("wishlist.empty")} ctaLabel={t("wishlist.emptyCta")} ctaHref="/categories" />
            </Reveal>
          ) : (
            <>
              <Reveal>
                <div className="mb-6 flex justify-end">
                  <button onClick={clearWishlist} className="font-display text-[11px] uppercase tracking-[0.22em] text-fg/50 hover:text-accent">
                    {t("wishlist.removeAll")} ×
                  </button>
                </div>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <Reveal key={p.id} delay={i * 50}>
                    <article className="group flex border border-fg/[0.07] bg-ink-800">
                      <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-ink-900">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill sizes="128px" className="object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center font-display text-4xl text-fg/[0.04]">K</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <Link href={`/products/${p.slug}`} className="font-display text-sm uppercase tracking-wider hover:text-accent">{p.name}</Link>
                          <div className="mt-2 font-display text-base text-accent">{formatPrice(p.price)}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => { addToCart(p, 1); removeWishlist(p.id); }} className="flex-1 border border-accent bg-accent px-3 py-2 font-display text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-accent-alt">
                            {t("wishlist.moveToCart")}
                          </button>
                          <button onClick={() => removeWishlist(p.id)} aria-label={t("cart.remove")} className="border border-fg/15 px-3 py-2 text-fg/60 hover:border-accent hover:text-accent">×</button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState({ title, ctaLabel, ctaHref }: { title: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div className="relative border border-fg/10 bg-ink-800 p-16 text-center">
      <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-fg/15 text-fg/50">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
        </svg>
      </div>
      <div className="font-display text-2xl uppercase tracking-display-tight">{title}</div>
      <Link href={ctaHref} className="kwell-btn-primary mt-8 inline-flex">{ctaLabel} →</Link>
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { useShop } from "@/lib/shop/ShopProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { t } = useT();
  const { cart, removeFromCart, setQty, subtotal } = useShop();

  return (
    <>
      <PageHeader eyebrow={t("nav.cart")} title={t("cart.title")} code={`N°C / ${String(cart.reduce((s, l) => s + l.qty, 0)).padStart(2, "0")}`} />
      <section className="kwell-section pt-12 bg-ink-900">
        <div className="mx-auto max-w-7xl">
          {cart.length === 0 ? (
            <Reveal>
              <div className="border border-fg/10 bg-ink-800 p-16 text-center">
                <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-fg/15 text-fg/50">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.5L21 8H6" />
                  </svg>
                </div>
                <div className="font-display text-2xl uppercase tracking-display-tight">{t("cart.empty")}</div>
                <Link href="/categories" className="kwell-btn-primary mt-8 inline-flex">{t("cart.emptyCta")} →</Link>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-8 md:grid-cols-12">
              <Reveal className="md:col-span-8">
                <div className="border border-fg/10 bg-ink-800">
                  <div className="hidden border-b border-fg/10 px-6 py-3 font-display text-[10px] tracking-[0.3em] text-fg/40 md:grid md:grid-cols-12">
                    <div className="md:col-span-6">Articolo</div>
                    <div className="md:col-span-2 text-center">{t("cart.qty")}</div>
                    <div className="md:col-span-3 text-right">Subtotale</div>
                    <div className="md:col-span-1" />
                  </div>
                  <ul className="divide-y divide-fg/10">
                    {cart.map((l) => (
                      <li key={l.id} className="grid grid-cols-12 items-center gap-4 px-4 py-5 md:px-6">
                        <div className="col-span-12 flex items-center gap-4 md:col-span-6">
                          <div className="relative aspect-square w-20 shrink-0 overflow-hidden bg-ink-900">
                            {l.image_url ? <Image src={l.image_url} alt={l.name} fill sizes="80px" className="object-cover" /> : <div className="grid h-full place-items-center font-display text-3xl text-fg/[0.04]">K</div>}
                          </div>
                          <div>
                            <div className="font-display text-sm uppercase tracking-wider">{l.name}</div>
                            <div className="mt-1 text-[11px] text-fg/40">KW—{String(l.id).slice(-3)}</div>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <div className="inline-flex items-center border border-fg/15">
                            <button onClick={() => setQty(l.id, l.qty - 1)} className="grid h-9 w-9 place-items-center text-fg/70 hover:text-accent">−</button>
                            <span className="grid h-9 w-10 place-items-center font-display text-sm">{l.qty}</span>
                            <button onClick={() => setQty(l.id, l.qty + 1)} className="grid h-9 w-9 place-items-center text-fg/70 hover:text-accent">+</button>
                          </div>
                        </div>
                        <div className="col-span-4 text-right md:col-span-3">
                          <div className="font-display text-base text-accent">{formatPrice(l.price * l.qty)}</div>
                          <div className="text-[11px] text-fg/40">{formatPrice(l.price)} / cad.</div>
                        </div>
                        <div className="col-span-2 text-right md:col-span-1">
                          <button onClick={() => removeFromCart(l.id)} aria-label={t("cart.remove")} className="grid h-9 w-9 place-items-center border border-fg/15 text-fg/60 hover:border-accent hover:text-accent">×</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/categories" className="mt-6 inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.22em] text-fg/60 hover:text-accent">
                  ← {t("cart.continue")}
                </Link>
              </Reveal>

              <Reveal delay={120} className="md:col-span-4">
                <div className="relative border border-fg/10 bg-ink-800 p-6">
                  <span className="absolute -top-3 left-6 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">RIEPILOGO</span>
                  <SummaryLine label={t("cart.subtotal")} value={formatPrice(subtotal)} />
                  <SummaryLine label={t("cart.shipping")} value={t("cart.shippingNote")} muted />
                  <div className="my-4 h-px bg-fg/10" />
                  <SummaryLine label={t("cart.total")} value={formatPrice(subtotal)} big />
                  <div className="mt-1 text-right text-[11px] text-fg/40">{t("cart.vat")}</div>
                  <Link href="/checkout" className="kwell-btn-primary group mt-6 w-full">
                    {t("cart.checkout")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SummaryLine({ label, value, muted, big }: { label: string; value: string; muted?: boolean; big?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <span className="font-display text-[11px] uppercase tracking-[0.22em] text-fg/50">{label}</span>
      <span className={`font-display ${big ? "text-xl text-accent" : muted ? "text-xs text-fg/40" : "text-sm text-fg"}`}>{value}</span>
    </div>
  );
}

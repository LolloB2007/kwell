"use client";
import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/lib/shop/ShopProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/Reveal";

type Method = "card" | "paypal" | "bank";

export default function CheckoutPage() {
  const { t } = useT();
  const { cart, subtotal, clearCart } = useShop();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<Method>("card");
  const [placed, setPlaced] = useState(false);

  function placeOrder() {
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <section className="kwell-section pt-40 bg-ink-900">
        <div className="mx-auto max-w-3xl border border-fg/10 bg-ink-800 p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent text-accent">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-3xl uppercase tracking-display-tight">{t("checkout.orderPlaced")}</h1>
          <p className="mt-3 text-sm text-fg/60">{t("checkout.orderPlacedSub")}</p>
          <div className="mt-4 font-display text-[10px] tracking-[0.3em] text-fg/40">KW-ORD/{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
          <Link href="/categories" className="kwell-btn-primary mt-8 inline-flex">{t("checkout.backToShop")} →</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="kwell-eyebrow flex items-center gap-3"><span className="block h-px w-6 bg-accent" />{t("nav.cart")}</div>
              <h1 className="kwell-h1 mt-4">{t("checkout.title")}</h1>
            </div>
            <div className="hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">KW—CHK / 24/A</div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 border border-accent/30 bg-accent/[0.06] px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("checkout.paymentMockNotice")}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Stepper step={step} labels={[t("checkout.stepContact"), t("checkout.stepShipping"), t("checkout.stepPayment")]} />

            <div className="mt-8 space-y-4">
              <Step number={1} active={step === 1} done={step > 1} title={t("checkout.stepContact")} onEdit={() => setStep(1)}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("checkout.fields.firstName")} name="firstName" required />
                  <Field label={t("checkout.fields.lastName")} name="lastName" required />
                  <Field label={t("checkout.fields.email")} name="email" type="email" required />
                  <Field label={t("checkout.fields.phone")} name="phone" />
                </div>
                <button onClick={() => setStep(2)} className="kwell-btn-primary mt-6 group">
                  {t("checkout.stepShipping")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
              </Step>

              <Step number={2} active={step === 2} done={step > 2} title={t("checkout.stepShipping")} onEdit={() => setStep(2)}>
                <div className="grid gap-5">
                  <Field label={t("checkout.fields.address")} name="address" required />
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label={t("checkout.fields.city")} name="city" required />
                    <Field label={t("checkout.fields.zip")} name="zip" required />
                    <Field label={t("checkout.fields.country")} name="country" defaultValue="Italia" required />
                  </div>
                </div>
                <button onClick={() => setStep(3)} className="kwell-btn-primary mt-6 group">
                  {t("checkout.stepPayment")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
              </Step>

              <Step number={3} active={step === 3} done={false} title={t("checkout.stepPayment")} onEdit={() => setStep(3)}>
                <div className="grid grid-cols-3 gap-2">
                  {(["card", "paypal", "bank"] as Method[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`border px-3 py-3 text-center font-display text-[11px] uppercase tracking-wider transition-colors ${
                        method === m ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/60 hover:border-fg/30"
                      }`}
                    >
                      {t(`checkout.methods.${m}`)}
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="mt-6 grid gap-5">
                    <Field label={t("checkout.fields.cardNumber")} name="cardNumber" placeholder="•••• •••• •••• ••••" />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={t("checkout.fields.expiry")} name="expiry" placeholder="MM / AA" />
                      <Field label={t("checkout.fields.cvc")} name="cvc" placeholder="•••" />
                    </div>
                    <Field label={t("checkout.fields.nameOnCard")} name="nameOnCard" />
                  </div>
                )}
                {method === "paypal" && (
                  <p className="mt-6 text-sm text-fg/60">Verrai reindirizzato a PayPal per completare il pagamento. (Demo)</p>
                )}
                {method === "bank" && (
                  <p className="mt-6 text-sm text-fg/60">Riceverai le coordinate per il bonifico via email. (Demo)</p>
                )}

                <button onClick={placeOrder} disabled={cart.length === 0} className="kwell-btn-primary mt-8 group disabled:opacity-40">
                  {t("checkout.placeOrder")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
              </Step>
            </div>
          </div>

          <Reveal delay={120} className="md:col-span-4">
            <div className="relative border border-fg/10 bg-ink-800 p-6">
              <span className="absolute -top-3 left-6 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">{t("checkout.summary")}</span>
              {cart.length === 0 ? (
                <p className="text-sm text-fg/50">{t("cart.empty")}</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex-1">
                        <div className="font-display text-xs uppercase tracking-wider">{l.name}</div>
                        <div className="text-[11px] text-fg/40">× {l.qty}</div>
                      </div>
                      <div className="font-display text-sm text-accent">{formatPrice(l.price * l.qty)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="my-5 h-px bg-fg/10" />
              <SummaryLine label={t("cart.subtotal")} value={formatPrice(subtotal)} />
              <SummaryLine label={t("cart.shipping")} value={t("cart.shippingNote")} muted />
              <div className="mt-3 h-px bg-fg/10" />
              <SummaryLine label={t("cart.total")} value={formatPrice(subtotal)} big />
              <div className="mt-1 text-right text-[11px] text-fg/40">{t("cart.vat")}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stepper({ step, labels }: { step: 1 | 2 | 3; labels: string[] }) {
  return (
    <ol className="flex gap-2">
      {labels.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = step === n;
        const done = step > n;
        return (
          <li key={l} className={`flex flex-1 items-center gap-3 border px-4 py-3 ${active ? "border-accent bg-accent/[0.06]" : done ? "border-fg/30" : "border-fg/10"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-display ${active ? "bg-accent text-white" : done ? "bg-fg/30 text-ink-900" : "bg-fg/10 text-fg/60"}`}>{n}</span>
            <span className="font-display text-[11px] uppercase tracking-[0.22em]">{l}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Step({ number, active, done, title, onEdit, children }: { number: number; active: boolean; done: boolean; title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className={`border p-6 transition-colors md:p-8 ${active ? "border-accent bg-ink-800" : done ? "border-fg/15 bg-ink-800/60" : "border-fg/10 bg-ink-800/40"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl text-accent">0{number}</span>
          <div className="font-display text-base uppercase tracking-wider">{title}</div>
        </div>
        {done && (
          <button onClick={onEdit} className="font-display text-[11px] uppercase tracking-wider text-fg/50 hover:text-accent">Modifica</button>
        )}
      </div>
      {active && <div className="mt-6">{children}</div>}
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder, defaultValue }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="kwell-eyebrow opacity-70">{label}{required ? " *" : ""}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent placeholder-fg/20" />
    </label>
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

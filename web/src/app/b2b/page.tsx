"use client";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { submitLead } from "@/lib/api";
import { BRAND_IMAGES } from "@/lib/brand";
import { useT } from "@/lib/i18n/LanguageProvider";

const SERVICES_KEY = ["b2bPricing", "b2bDesign", "b2bLogistics", "b2bAftersales"] as const;

const SERVICES_COPY = {
  it: [
    { t: "Prezzo B2B", d: "Sconti volume, pagamento dilazionato, account manager dedicato." },
    { t: "Layout 3D & design", d: "Progettazione spaziale, selezione attrezzi, segnaletica e branding." },
    { t: "Logistica & installazione", d: "Spedizione diretta dal magazzino e montaggio in cantiere." },
    { t: "After-sales", d: "Contratti di manutenzione, ricambi, formazione tecnica." },
  ],
  en: [
    { t: "B2B pricing", d: "Volume discounts, deferred billing, dedicated account manager." },
    { t: "3D layout & design", d: "Spatial planning, equipment selection, signage and branding." },
    { t: "Logistics & install", d: "Direct-from-warehouse shipping and on-site installation." },
    { t: "After-sales", d: "Maintenance contracts, spare parts, and athlete training." },
  ],
} as const;

export default function B2BPage() {
  const { t, locale } = useT();
  const [type, setType] = useState<"personal_trainer" | "gym">("gym");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const services = SERVICES_COPY[locale];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const ok = await submitLead({
      type,
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    });
    setStatus(ok ? "ok" : "error");
    if (ok) e.currentTarget.reset();
  }

  return (
    // pt-20/md:pt-24 = nav height. Prevents the hero photo + title from
    // sitting under the fixed transparent nav at the top of the page.
    <div className="pt-20 md:pt-24">
      {/*
        Hero uses NO fixed height. The inner flex container holds the
        min-h-[80svh] so the section feels like a hero on tall screens,
        but grows naturally (no clipping) when the multi-line Italian
        title would overflow ("Progettiamo, forniamo e installiamo il
        tuo spazio." wraps to 4–5 lines at hero font size).
      */}
      <section className="dark relative overflow-hidden grain bg-ink-900 text-fg">
        <Image src={BRAND_IMAGES.b2b} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="pointer-events-none absolute left-6 top-6 font-display text-[10px] tracking-[0.3em] text-fg/40 md:left-12 md:top-10">N°05 / B2B</div>
        <div className="relative mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-end px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-20">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-8 bg-accent" />
            {t("b2b.eyebrow")}
          </div>
          <h1 className="kwell-h1 mt-4 max-w-4xl">
            {t("b2b.titleA")} {t("b2b.titleB")} <span className="text-accent">{t("b2b.titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-smoke-mid leading-relaxed">{t("b2b.sub")}</p>
        </div>
      </section>

      <section className="kwell-section bg-ink-900">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2">
          <Reveal>
            <div className="kwell-eyebrow flex items-center gap-3">
              <span className="block h-px w-6 bg-accent" />
              {locale === "it" ? "Cosa includiamo" : "What we include"}
            </div>
            <div className="mt-10 divide-y divide-fg/10 border-y border-fg/10">
              {services.map((s, i) => (
                <div key={SERVICES_KEY[i]} className="group flex items-start gap-6 py-8 transition-colors hover:bg-fg/[0.02]">
                  <span className="font-display text-3xl text-accent">0{i + 1}</span>
                  <div>
                    <div className="font-display text-xl uppercase tracking-display-tight">{s.t}</div>
                    <p className="mt-2 text-sm text-smoke-mid leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={onSubmit} className="relative border border-fg/10 bg-ink-800 p-8 md:p-10">
              <span className="absolute -top-3 left-8 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">MODULO · B2B</span>
              <div className="kwell-eyebrow">{t("b2bForm.eyebrow")}</div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {(["gym", "personal_trainer"] as const).map((tt) => (
                  <button
                    key={tt}
                    type="button"
                    onClick={() => setType(tt)}
                    className={`border px-4 py-3 font-display text-xs uppercase tracking-wider transition-colors ${
                      type === tt ? "border-accent bg-accent text-white" : "border-fg/10 text-fg/60 hover:border-fg/30"
                    }`}
                  >
                    {tt === "gym" ? t("b2bForm.gym") : t("b2bForm.pt")}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-4">
                <Field label={t("b2bForm.fields.name")} name="name" required />
                <Field label={t("b2bForm.fields.email")} name="email" type="email" required />
                <Field label={t("b2bForm.fields.company")} name="company" />
                <Field label={t("b2bForm.fields.phone")} name="phone" />
                <Field label={t("b2bForm.fields.message")} name="message" textarea />
                <button type="submit" disabled={status === "sending"} className="kwell-btn-primary group">
                  {status === "sending" ? t("common.sending") : status === "ok" ? t("common.sent") : t("common.requestQuote")}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
                {status === "error" && <p className="text-sm text-accent">{t("common.error")}</p>}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", textarea, required }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="kwell-eyebrow opacity-70">{label}{required ? " *" : ""}</span>
      {textarea ? (
        <textarea name={name} rows={4} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent" />
      ) : (
        <input name={name} type={type} required={required} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent" />
      )}
    </label>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";

type Step = { t: string; d: string };

export function B2BSection({ imageUrl }: { imageUrl: string | null }) {
  const { t, raw } = useT();
  const steps = raw<Step[]>("b2b.steps") ?? [];

  return (
    <section className="dark relative kwell-section overflow-hidden bg-ink-deepest text-fg">
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="100vw" className="object-cover opacity-45" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
      </div>
      <div className="pointer-events-none absolute left-6 top-12 hidden font-display text-[10px] tracking-[0.3em] text-fg/40 md:block">N°05 / B2B</div>
      <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
        <Reveal>
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("b2b.eyebrow")}
          </div>
          <h2 className="kwell-h2 mt-4 max-w-xl">
            {t("b2b.titleA")}<br />{t("b2b.titleB")}<br /><span className="text-accent">{t("b2b.titleAccent")}</span>
          </h2>
          <p className="mt-6 max-w-md text-smoke-mid leading-relaxed">{t("b2b.sub")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/b2b" className="kwell-btn-primary group">
              {t("b2b.ctaQuote")} <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/about" className="kwell-btn-ghost">{t("b2b.ctaHow")}</Link>
          </div>
        </Reveal>
        <Reveal delay={120} className="md:pt-16">
          <ul className="space-y-6 border-l border-fg/15 pl-6">
            {steps.map((s, i) => (
              <li key={s.t} className="group flex gap-6">
                <span className="font-display text-3xl text-accent transition-transform duration-500 group-hover:-translate-y-0.5">0{i + 1}</span>
                <div>
                  <div className="font-display text-base uppercase tracking-wider">{s.t}</div>
                  <p className="mt-1 text-sm text-fg/65 leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

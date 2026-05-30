"use client";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function TermsPage() {
  const { t, raw } = useT();
  const body = raw<string[]>("legal.terms.body") ?? [];

  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("legal.terms.eyebrow")}
          </div>
          <h1 className="kwell-h1 mt-4">{t("legal.terms.title")}</h1>
          <div className="mt-10 inline-flex items-center gap-2 border border-accent/30 bg-accent/[0.06] px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            DEMO PLACEHOLDER
          </div>
        </Reveal>

        <Reveal delay={120} className="md:col-span-8 space-y-5 text-sm leading-relaxed text-fg/75">
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? "text-base text-fg/85" : ""}>
              {p}
            </p>
          ))}
          <div className="mt-12 border-t border-fg/10 pt-6 font-display text-[10px] tracking-[0.3em] text-fg/40">
            Rev. 2026-05 · KW—TOS/A
          </div>
        </Reveal>
      </div>
    </section>
  );
}

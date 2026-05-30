"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useT();
  return (
    <section className="kwell-section relative grid min-h-[100svh] place-items-center bg-ink-900 pt-40 text-center">
      <div className="pointer-events-none absolute left-6 top-28 font-display text-[10px] tracking-[0.3em] text-fg/30 md:left-12">
        {t("notFound.serial")}
      </div>
      <div className="pointer-events-none absolute right-6 top-28 font-display text-[10px] tracking-[0.3em] text-fg/30 md:right-12">
        KW—404/A
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="kwell-eyebrow flex items-center justify-center gap-3">
          <span className="block h-px w-8 bg-accent" />
          {t("notFound.eyebrow")}
          <span className="block h-px w-8 bg-accent" />
        </div>
        <div className="mt-8 font-display text-[clamp(5rem,18vw,14rem)] uppercase leading-[0.85] tracking-display-tight">
          4<span className="text-accent">0</span>4
        </div>
        <h1 className="kwell-h2 mt-6">{t("notFound.title")}</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-smoke-mid">{t("notFound.sub")}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/" className="kwell-btn-primary group">
            {t("notFound.ctaHome")}
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/categories" className="kwell-btn-ghost">{t("notFound.ctaCatalog")}</Link>
        </div>
      </div>
    </section>
  );
}

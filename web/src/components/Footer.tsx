"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";

export const PHONE_DISPLAY = "+39 0547 313 288";
export const PHONE_HREF = "tel:+390547313288";

// Short category labels for the footer. Kept here (instead of fetched at
// runtime) so the footer stays a fast static client component.
const FOOTER_CATEGORIES: { slug: string; it: string; en: string }[] = [
  { slug: "functional", it: "Functional", en: "Functional" },
  { slug: "cardio", it: "Cardio", en: "Cardio" },
  { slug: "strength", it: "Forza", en: "Strength" },
  { slug: "yoga-pilates", it: "Yoga & Pilates", en: "Yoga & Pilates" },
  { slug: "boxing", it: "Boxe", en: "Boxing" },
  { slug: "rehab", it: "Riabilitazione", en: "Rehab" },
  { slug: "flooring", it: "Pavimentazioni", en: "Flooring" },
];

export function Footer() {
  const { t, locale } = useT();
  return (
    <footer className="relative overflow-hidden border-t border-fg/10 bg-ink-900 px-6 pt-20 pb-10 md:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Newsletter row */}
      <div className="mx-auto mb-16 max-w-7xl border-b border-fg/10 pb-16">
        <NewsletterSignup />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="lg" caption="FC·IT" />
          <span className="sr-only">Kwell</span>
          <p className="mt-5 max-w-sm text-sm text-smoke-mid">{t("footer.tagline")}</p>
          <div className="mt-8 space-y-2 text-sm">
            <div>
              <span className="kwell-eyebrow opacity-60">{t("contact.phone")}</span>
              <a href={PHONE_HREF} className="ml-2 text-fg hover:text-accent">{PHONE_DISPLAY}</a>
            </div>
            <div>
              <span className="kwell-eyebrow opacity-60">{t("contact.email")}</span>
              <a href="mailto:info@kwell.it" className="ml-2 text-fg hover:text-accent">info@kwell.it</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="kwell-eyebrow mb-5">{t("footer.catalogTitle")}</div>
          <ul className="space-y-2.5 text-sm text-fg/70">
            {FOOTER_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-accent">
                  {locale === "en" ? c.en : c.it}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="kwell-eyebrow mb-5">{t("footer.companyTitle")}</div>
          <ul className="space-y-2.5 text-sm text-fg/70">
            <li><Link href="/about" className="hover:text-accent">{t("nav.about")}</Link></li>
            <li><Link href="/b2b" className="hover:text-accent">B2B · {t("b2b.eyebrow")}</Link></li>
            <li><Link href="/contact" className="hover:text-accent">{t("nav.contact")}</Link></li>
            <li><Link href="/account" className="hover:text-accent">{t("nav.account")}</Link></li>
            <li><Link href="/privacy" className="hover:text-accent">{t("legal.privacy.title")}</Link></li>
            <li><Link href="/terms" className="hover:text-accent">{t("legal.terms.title")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col-reverse items-start justify-between gap-4 border-t border-fg/10 pt-6 text-xs text-fg/40 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Kwell S.r.l. · P.IVA 0XXXXXXXX0X · {t("footer.rights")}</span>
        <div className="flex items-center gap-4">
          <span className="font-display tracking-[0.2em] text-fg/30">{t("footer.serial")}</span>
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span>{t("footer.madeIn")}</span>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { useT } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { locale, toggle } = useT();
  return (
    <button
      onClick={toggle}
      aria-label={locale === "it" ? "Switch to English" : "Passa all'italiano"}
      title={locale === "it" ? "English" : "Italiano"}
      className="group fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full border border-fg/15 bg-ink-900/80 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.45)] transition-all duration-500 ease-kwell hover:border-accent hover:bg-ink-800 hover:shadow-[0_10px_32px_rgba(240,45,50,0.35)] md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 rounded-full border border-accent/0 transition-colors duration-500 group-hover:border-accent/30" />
      <span className="font-display text-xs uppercase tracking-[0.18em] text-fg">
        {locale === "it" ? "IT" : "EN"}
      </span>
      <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </button>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";

const STORAGE_KEY = "kwell.cookies.v1";

type Choice = "all" | "essential";

export function CookieConsent() {
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function choose(c: Choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: c, at: Date.now() }));
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl border border-fg/15 bg-ink-900/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:inset-x-auto md:bottom-6 md:left-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="font-display text-[10px] uppercase tracking-[0.25em] text-accent">
            <span className="mr-2 inline-block h-px w-4 align-middle bg-accent" />
            COOKIES
          </div>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-fg/75">
            {t("cookies.message")}{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
              {t("cookies.learnMore")} →
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="border border-fg/15 px-4 py-2.5 font-display text-[11px] uppercase tracking-[0.2em] text-fg/70 transition-colors hover:border-accent hover:text-fg"
          >
            {t("cookies.decline")}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="bg-accent px-4 py-2.5 font-display text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-alt"
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

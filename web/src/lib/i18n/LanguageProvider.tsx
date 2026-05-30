"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, DICT, get, type Locale } from "./dictionary";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (path: string) => string;
  raw: <T = unknown>(path: string) => T;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "kwell.locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null) as Locale | null;
    if (saved === "it" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { window.localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const toggle = useCallback(() => setLocale(locale === "it" ? "en" : "it"), [locale, setLocale]);

  const value = useMemo<Ctx>(() => {
    const dict = DICT[locale];
    return {
      locale,
      setLocale,
      toggle,
      t: (path: string) => get(dict as Record<string, unknown>, path),
      raw: <T,>(path: string) => {
        const parts = path.split(".");
        let cur: unknown = dict;
        for (const p of parts) {
          if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
            cur = (cur as Record<string, unknown>)[p];
          } else return undefined as unknown as T;
        }
        return cur as T;
      },
    };
  }, [locale, setLocale, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be inside <LanguageProvider>");
  return ctx;
}

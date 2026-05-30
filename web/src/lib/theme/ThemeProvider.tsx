"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);
export const THEME_STORAGE_KEY = "kwell.theme";
export const DEFAULT_THEME: Theme = "dark";

function readInitial(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  // Read state from html class that the pre-hydration script already applied
  useEffect(() => {
    setThemeState(readInitial());
  }, []);

  const apply = useCallback((t: Theme) => {
    if (typeof document !== "undefined") {
      if (t === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
    try { window.localStorage.setItem(THEME_STORAGE_KEY, t); } catch {}
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => apply(theme === "dark" ? "light" : "dark"), [apply, theme]);

  const value = useMemo<ThemeCtx>(() => ({ theme, setTheme: apply, toggle }), [theme, apply, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside <ThemeProvider>");
  return ctx;
}

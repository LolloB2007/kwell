"use client";
import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. SSR-safe: returns `false` on the server
 * and updates after hydration. Use for view-tier gating (desktop vs. mobile).
 *
 * Defaults to the tailwind `md` breakpoint (768px) so callers can ask
 * `useMediaQuery()` and get "is desktop-ish" without re-typing the query.
 */
export function useMediaQuery(query: string = "(min-width: 768px)"): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setMatches(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener?.("change", handler as (e: MediaQueryListEvent) => void);
  }, [query]);

  return matches;
}

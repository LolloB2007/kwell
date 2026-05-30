"use client";
import { useEffect, useState } from "react";

/**
 * Subscribes to (prefers-reduced-motion: reduce). Defaults to `false` on the
 * server so animations are scheduled by default; updates after hydration.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setReduced(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener?.("change", handler as (e: MediaQueryListEvent) => void);
  }, []);

  return reduced;
}

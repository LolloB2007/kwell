"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Lenis-driven smooth scroll. Desktop only — on touch/small screens it
 * interferes with native momentum scrolling (especially iOS Safari) and
 * makes pinned/sticky sections feel broken. The desktop experience is
 * unchanged; mobile gets the browser's native scroller.
 */
export function SmoothScroll() {
  const desktop = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!desktop) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [desktop]);
  return null;
}

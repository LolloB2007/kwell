"use client";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Infinite marquee strip under the hero. The phrase is duplicated so the
 * loop is seamless; one copy is offset by -50% on the X axis to fill the
 * gap during the second half of the cycle. Pure CSS — no JS frame loop.
 *
 * Respects prefers-reduced-motion by freezing the animation.
 */
export function BrandTicker({ phrase = "Made in Italy · Since 2003 · Cesena · " }: { phrase?: string }) {
  const reduced = useReducedMotion();
  const cells = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden border-y border-fg/[0.06] bg-ink-900 py-3"
    >
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{
          animation: reduced ? "none" : "kwell-marquee 38s linear infinite",
        }}
      >
        {cells.map((i) => (
          <span
            key={i}
            className="mx-6 font-display text-[11px] uppercase tracking-[0.4em] text-fg/35"
          >
            {phrase}
          </span>
        ))}
      </div>

      {/* Edge fade so the loop join is invisible */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
    </div>
  );
}

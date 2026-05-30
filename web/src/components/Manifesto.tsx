"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The manifesto stays in view while the scroll progresses, with words
 * swapping in place. We avoid GSAP's `pin: true` (which wraps the element
 * in a "pin-spacer" div and breaks React's reconciliation on navigation —
 * the source of the NotFoundError on every subpage click) and use a plain
 * CSS `position: sticky` container instead. ScrollTrigger only scrubs the
 * word transitions; it doesn't mutate the DOM tree.
 */
export function Manifesto() {
  const { t, raw } = useT();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement | null>(null);
  const slot = useRef<HTMLDivElement | null>(null);
  const words = raw<string[]>("manifesto.words") ?? [];

  useEffect(() => {
    if (reduced || !root.current || !slot.current || words.length === 0) return;
    const items = Array.from(slot.current.querySelectorAll<HTMLElement>("[data-word]"));
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { yPercent: -50, opacity: 0 });
      gsap.set(items[0], { yPercent: 0, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      for (let i = 0; i < items.length - 1; i++) {
        tl.to(items[i], { yPercent: 50, opacity: 0, ease: "power2.in" }, i)
          .to(items[i + 1], { yPercent: 0, opacity: 1, ease: "power2.out" }, i);
      }

      // Last word ignites red
      const last = items[items.length - 1];
      tl.to(last, {
        color: "#F02D32",
        scale: 1.04,
        textShadow: "0 0 28px rgba(240,45,50,0.45)",
        ease: "expo.out",
        duration: 0.6,
      }, items.length - 1);
    }, root);

    return () => ctx.revert();
  }, [reduced, words.length]);

  return (
    <section
      ref={root}
      className="dark relative bg-ink-deepest text-fg overflow-clip"
      aria-label="Kwell manifesto"
      // Extra height (one viewport per word transition) gives the scrub
      // something to scrub through while the sticky inner stays visible.
      style={{ minHeight: reduced ? undefined : `${Math.max(1, words.length) * 100}svh` }}
    >
      <div
        ref={slot}
        className="sticky top-0 flex h-[100svh] w-full flex-col justify-center px-6 md:px-12"
      >
        <div className="pointer-events-none absolute left-6 top-12 hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">
          N°03 / MANIFESTO
        </div>
        <div className="pointer-events-none absolute right-6 top-12 hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">
          — —
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("manifesto.eyebrow")}
          </div>

          <div
            className="relative mt-12 font-display text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[1] tracking-display-tight"
            style={{ height: "1.05em" }}
            aria-live="off"
          >
            {reduced ? (
              <p>
                {words.map((w, i) => (
                  <span key={i} className={i === words.length - 1 ? "text-accent" : ""}>
                    {w}{" "}
                  </span>
                ))}
              </p>
            ) : (
              words.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="absolute inset-x-0 top-0 block text-fg will-change-transform"
                >
                  {w}
                </span>
              ))
            )}
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-12">
            <p className="md:col-span-7 text-lg text-smoke-mid leading-relaxed">{t("manifesto.body")}</p>
            <div className="md:col-span-4 md:col-start-9 self-end border-l border-fg/10 pl-6 font-display text-xs tracking-[0.25em] text-fg/40">
              <div>FIRMATO</div>
              <div className="mt-2 text-fg">Luca Bettini</div>
              <div className="text-fg/40">Officina Kwell · Cesena</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

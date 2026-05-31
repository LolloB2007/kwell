"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const NF = new Intl.NumberFormat("it-IT");

type Stat = { target: number; suffix: string; label: string };

/**
 * Desktop: cinematic, scroll-pinned reveal. The outer section is taller
 * than the viewport so a sticky inner stays in view while a scrubbed
 * GSAP timeline draws each stat in sequence (divider down, index in,
 * number counts up, caption in, final accent sweep at the bottom).
 *
 * Mobile (< md): static grid with a simple intersection-triggered
 * count-up — no pinned sticky, no 260svh outer. The pinned reveal
 * fights with native iOS scrolling and turns a small section into a
 * giant dead-scroll area; the static grid keeps the same information
 * legible without breaking the page on phones.
 *
 * Uses CSS `position: sticky` (not GSAP `pin`) for the same reason as
 * the Manifesto: GSAP's pin-spacer breaks React reconciliation on
 * route changes.
 */
export function Stats() {
  const { t } = useT();
  const reduced = useReducedMotion();
  const desktop = useMediaQuery();
  const STATS: Stat[] = [
    { target: 21, suffix: "+", label: t("stats.years") },
    { target: 412, suffix: "", label: t("stats.skus") },
    { target: 1240, suffix: "", label: t("stats.spaces") },
    { target: 100, suffix: "%", label: t("stats.italian") },
  ];

  // Cinematic version only mounts on desktop with motion enabled.
  if (desktop && !reduced) return <StatsCinematic stats={STATS} />;
  return <StatsStatic stats={STATS} animate={!reduced} />;
}

function StatsCinematic({ stats }: { stats: Stat[] }) {
  const root = useRef<HTMLElement | null>(null);
  const topTick = useRef<HTMLDivElement | null>(null);
  const bottomSweep = useRef<HTMLDivElement | null>(null);
  const dividerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const indexRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(topTick.current, { scaleX: 0, transformOrigin: "center top" });
      gsap.set(bottomSweep.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dividerRefs.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(indexRefs.current, { opacity: 0, y: -6 });
      gsap.set(numberRefs.current, { opacity: 0, y: 28 });
      gsap.set(labelRefs.current, { opacity: 0, y: 10 });

      digitRefs.current.forEach((node) => {
        if (node) node.textContent = "0";
      });

      const counts = stats.map(() => ({ n: 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.to(topTick.current, { scaleX: 1, ease: "power2.out", duration: 0.4 }, 0);

      stats.forEach((s, i) => {
        const base = 0.15 + i * 0.55;
        tl.to(dividerRefs.current[i], { scaleY: 1, ease: "power3.inOut", duration: 0.45 }, base);
        tl.to(indexRefs.current[i], { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, base + 0.05);
        tl.to(numberRefs.current[i], { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, base + 0.1);
        tl.to(
          counts[i],
          {
            n: s.target,
            ease: "power3.out",
            duration: 0.55,
            onUpdate: () => {
              const node = digitRefs.current[i];
              if (node) node.textContent = NF.format(Math.round(counts[i].n));
            },
          },
          base + 0.1,
        );
        tl.to(labelRefs.current[i], { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, base + 0.35);
      });

      tl.to(bottomSweep.current, { scaleX: 1, ease: "power3.inOut", duration: 0.6 }, "+=0.1");
    }, root);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={root}
      className="relative bg-ink-900/60"
      style={{ minHeight: "260svh" }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center border-y border-fg/15">
        <div
          ref={topTick}
          className="pointer-events-none absolute left-1/2 top-0 hidden h-4 w-[2px] -translate-x-1/2 bg-accent md:block"
        />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                "group relative px-6 py-12 md:px-10 md:py-16 " +
                "after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 " +
                "after:bg-accent after:transition-[width] after:duration-500 after:ease-kwell hover:after:w-12"
              }
            >
              {i > 0 && (
                <span
                  ref={(el) => {
                    dividerRefs.current[i] = el;
                  }}
                  aria-hidden
                  className={
                    "pointer-events-none absolute inset-y-6 left-0 w-px " +
                    "bg-gradient-to-b from-transparent via-fg/25 to-transparent md:block " +
                    (i % 2 === 1 ? "block" : "hidden")
                  }
                />
              )}

              <span
                ref={(el) => {
                  indexRefs.current[i] = el;
                }}
                className="absolute left-6 top-4 flex items-center gap-2 font-display text-[10px] tracking-[0.3em] text-fg/45 md:left-10"
              >
                <span className="h-px w-3 bg-fg/30" />
                N°{String(i + 1).padStart(2, "0")}
              </span>

              <div
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="font-display text-5xl uppercase leading-none tracking-display-tight text-fg md:text-7xl tabular-nums"
              >
                <span
                  ref={(el) => {
                    digitRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                <span className="text-accent">{s.suffix}</span>
              </div>

              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="mt-3 text-[11px] uppercase tracking-[0.25em] text-fg/60"
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div
          ref={bottomSweep}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-accent"
        />
      </div>
    </section>
  );
}

function StatsStatic({ stats, animate }: { stats: Stat[]; animate: boolean }) {
  return (
    <section className="relative border-y border-fg/15 bg-ink-900/60">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="relative px-6 py-10"
          >
            {i > 0 && i % 2 === 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-fg/25 to-transparent"
              />
            )}
            <span className="absolute left-6 top-4 flex items-center gap-2 font-display text-[10px] tracking-[0.3em] text-fg/45">
              <span className="h-px w-3 bg-fg/30" />
              N°{String(i + 1).padStart(2, "0")}
            </span>
            <div className="font-display text-5xl uppercase leading-none tracking-display-tight text-fg tabular-nums">
              <CountUp target={s.target} animate={animate} />
              <span className="text-accent">{s.suffix}</span>
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-fg/60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ target, animate }: { target: number; animate: boolean }) {
  const [n, setN] = useState<number>(animate ? 0 : target);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!animate || !ref.current) {
      setN(target);
      return;
    }
    const node = ref.current;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            const tween = { n: 0 };
            gsap.to(tween, {
              n: target,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => setN(Math.round(tween.n)),
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [animate, target]);

  return <span ref={ref}>{NF.format(n)}</span>;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

const NF = new Intl.NumberFormat("it-IT");

function CountUp({ target, suffix = "", duration = 1.8 }: { target: number; suffix?: string; duration?: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<string>(reduced ? NF.format(target) : "0");
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) { setDisplay(NF.format(target)); return; }
    if (!ref.current) return;

    const tween = { n: 0 };
    const node = ref.current;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            gsap.to(tween, {
              n: target,
              duration,
              ease: "power3.out",
              onUpdate: () => setDisplay(NF.format(Math.round(tween.n))),
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduced, target, duration]);

  return (
    <span ref={ref}>
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

type Stat = { target: number; suffix: string; label: string };

export function Stats() {
  const { t } = useT();
  const STATS: Stat[] = [
    { target: 21, suffix: "+", label: t("stats.years") },
    { target: 412, suffix: "", label: t("stats.skus") },
    { target: 1240, suffix: "", label: t("stats.spaces") },
    { target: 100, suffix: "%", label: t("stats.italian") },
  ];

  return (
    <section className="relative border-y border-fg/[0.06] bg-ink-900/60">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-3 w-px -translate-x-1/2 bg-accent md:block" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-fg/[0.06] md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="relative px-6 py-12 md:px-10 md:py-16">
            <span className="absolute left-6 top-4 font-display text-[10px] tracking-[0.3em] text-fg/30 md:left-10">N°{String(i + 1).padStart(2, "0")}</span>
            <div className="font-display text-5xl uppercase leading-none tracking-display-tight text-fg md:text-7xl tabular-nums">
              <CountUp target={s.target} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-fg/50">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = { imageUrl: string | null };

export function ParallaxHero({ imageUrl }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLDivElement | null>(null);
  const titleBlock = useRef<HTMLDivElement | null>(null);
  const dot = useRef<HTMLSpanElement | null>(null);

  // Scroll parallax — runs in both modes (scrub-based, not autoplay)
  useEffect(() => {
    if (!wrap.current || !img.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { scale: 1.15, yPercent: 0 },
        {
          yPercent: 20, scale: 1.25, ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom top", scrub: true },
        }
      );
      gsap.fromTo(
        titleBlock.current,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -40, opacity: 0, ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom top", scrub: true },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  // Ignition sequence — clip-path line reveal + red dot pulse
  useEffect(() => {
    if (!titleBlock.current) return;
    const lines = titleBlock.current.querySelectorAll<HTMLElement>(".hero-line__inner");
    const eyebrow = titleBlock.current.querySelector<HTMLElement>(".hero-eyebrow");
    const sub = titleBlock.current.querySelector<HTMLElement>(".hero-sub");
    const ctas = titleBlock.current.querySelector<HTMLElement>(".hero-ctas");

    // Session-gated: full 3s ignition only on the first hero visit per
    // browser session. After that, content lands instantly (no drama tax
    // on repeat visits).
    let alreadyPlayed = false;
    try {
      alreadyPlayed = window.sessionStorage.getItem("kwell.heroPlayed") === "1";
    } catch { /* private mode, etc. — fall back to playing it */ }

    if (reduced || alreadyPlayed) {
      gsap.set(lines, { clipPath: "inset(0 0 0 0)" });
      gsap.set([eyebrow, sub, ctas, dot.current], { opacity: 1, scale: 1 });
      return;
    }

    try { window.sessionStorage.setItem("kwell.heroPlayed", "1"); } catch {}

    // Initial closed state
    gsap.set(lines, { clipPath: "inset(0 100% 0 0)" });
    gsap.set([eyebrow, sub, ctas], { opacity: 0, y: 18 });
    gsap.set(dot.current, { scale: 0, opacity: 0 });

    // Total runtime ≈ 3.0s (was ~2.2s). All durations stretched proportionally
    // so the red-dot ignition feels more deliberate and the title reveal
    // breathes longer.
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl
      // Black hold — longer, more cinematic
      .to({}, { duration: 0.95 })
      // Red dot ignites
      .to(dot.current, { scale: 1.35, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "ignite")
      .to(dot.current, { scale: 1, duration: 0.4, ease: "power2.out" }, "+=0.05")
      // Eyebrow lifts in
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.75, ease: "expo.out" }, "ignite+=0.2")
      // Title lines wipe — clip-path, NOT opacity fade
      .to(lines, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        stagger: 0.16,
        ease: "expo.out",
      }, "ignite+=0.3")
      // Sub + CTAs
      .to([sub, ctas], { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "expo.out" }, "-=0.5");

    return () => { tl.kill(); };
  }, [reduced]);

  // Mouse parallax — ±10px on the title block
  useEffect(() => {
    if (reduced || !titleBlock.current || !wrap.current) return;
    const xTo = gsap.quickTo(titleBlock.current, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(titleBlock.current, "y", { duration: 0.9, ease: "power3.out" });
    const root = wrap.current;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      xTo(cx * 10);
      yTo(cy * 10);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  const titleAccent = t("hero.titleAccent");

  return (
    <section ref={wrap} className="dark relative h-[100svh] w-full overflow-hidden grain bg-ink-900 text-fg">
      <div ref={img} className="absolute inset-0 will-change-transform">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-900 via-ink-700 to-ink-deepest" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-transparent" />
      </div>

      {/* corner serials */}
      <div className="pointer-events-none absolute left-6 top-28 z-10 hidden font-display text-[10px] tracking-[0.3em] text-fg/40 md:block">
        N°01 / HERO
      </div>
      <div className="pointer-events-none absolute right-6 top-28 z-10 hidden font-display text-[10px] tracking-[0.3em] text-fg/40 md:block">
        KW—24/A
      </div>

      <div ref={titleBlock} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-32 will-change-transform">
        <div className="hero-eyebrow kwell-eyebrow mb-6 flex items-center gap-3">
          <span className="block h-px w-8 bg-accent" />
          {t("hero.eyebrow")}
        </div>

        <h1 className="kwell-h1 max-w-5xl">
          <span className="hero-line">
            <span className="hero-line__inner">
              {t("hero.titleA")}{" "}
              <span className="relative inline-block">
                <span
                  ref={dot}
                  aria-hidden
                  className="inline-block align-middle rounded-full bg-accent will-change-transform"
                  style={{ width: "0.6em", height: "0.6em", marginRight: "0.1em" }}
                />
                <span className="text-accent">{titleAccent}</span>
                <span className="absolute -bottom-2 left-0 h-[3px] w-2/3 bg-accent/40" />
              </span>
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line__inner">{t("hero.titleB")}</span>
          </span>
        </h1>

        <p className="hero-sub mt-7 max-w-xl text-smoke-mid leading-relaxed">{t("hero.sub")}</p>

        <div className="hero-ctas mt-10 flex flex-wrap gap-4">
          <Link href="/categories" className="kwell-btn-primary group">
            {t("hero.ctaShop")}
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/b2b" className="kwell-btn-ghost">{t("hero.ctaB2B")}</Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-fg/40">
        <span className="inline-block animate-pulse">↓</span>
        <span className="ml-2">{t("hero.scroll")}</span>
      </div>
    </section>
  );
}

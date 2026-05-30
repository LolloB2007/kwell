"use client";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";

type Spec = { label: string; value: string; sub: string };

/**
 * Light tonal band. Forces #F4F2F2 surface + anthracite text regardless of
 * the global theme — its job is to break the dark rhythm of the page.
 *
 * Lives between <Manifesto/> (pinned, deepest dark) and <FeaturedProducts/>
 * so the dark cards land on a high-contrast pause.
 */
export function AtelierBand() {
  const { t, raw } = useT();
  const specs = raw<Spec[]>("atelier.specs") ?? [];

  return (
    <section
      aria-label="Kwell workshop"
      className="kwell-section relative overflow-hidden"
      style={{ background: "#F4F2F2", color: "#1A191D" }}
    >
      {/* technical hatching corners, like a print plate */}
      <div className="pointer-events-none absolute left-6 top-6 font-display text-[10px] tracking-[0.3em] text-[#1A191D]/40 md:left-12 md:top-10">
        N°04 / OFFICINA
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-display text-[10px] tracking-[0.3em] text-[#1A191D]/40 md:right-12 md:top-10">
        44°N · 12°E
      </div>

      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="font-display text-xs uppercase tracking-[0.25em] text-accent">
                <span className="mr-3 inline-block h-px w-6 align-middle bg-accent" />
                {t("atelier.eyebrow")}
              </div>
              <h2 className="kwell-h2 mt-4 leading-[0.95]" style={{ color: "#1A191D" }}>
                {t("atelier.titleA")}<br />
                <span className="text-accent">{t("atelier.titleB")}</span>
              </h2>
            </div>
            <div className="hidden md:block font-display text-[10px] tracking-[0.3em] text-[#1A191D]/40">
              {t("atelier.meta")}
            </div>
          </div>
        </Reveal>

        {/* Spec rail */}
        <div className="mt-16 grid gap-px bg-[#1A191D]/[0.08] md:grid-cols-3">
          {specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group relative flex h-full flex-col bg-[#F4F2F2] p-8 transition-colors duration-500 hover:bg-white md:p-10">
                <span className="font-display text-[10px] tracking-[0.3em] text-[#1A191D]/40">
                  0{i + 1} — {s.label}
                </span>
                <div className="mt-6 font-display text-5xl uppercase leading-[0.95] tracking-display-tight md:text-6xl">
                  {s.value}
                </div>
                <p className="mt-4 max-w-[20ch] text-sm leading-relaxed text-[#1A191D]/65">
                  {s.sub}
                </p>
                <span
                  aria-hidden
                  className="absolute bottom-8 right-8 h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 ease-kwell group-hover:scale-150"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14">
          <a
            href="/about"
            className="group inline-flex items-center gap-3 border-b border-[#1A191D]/30 pb-1 font-display text-xs uppercase tracking-[0.25em] text-[#1A191D] transition-colors hover:border-accent hover:text-accent"
          >
            {t("atelier.ctaLabel")}
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

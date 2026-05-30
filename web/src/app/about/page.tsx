"use client";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Manifesto } from "@/components/Manifesto";
import { Stats } from "@/components/Stats";
import { BRAND_IMAGES } from "@/lib/brand";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function AboutPage() {
  const { t, raw } = useT();
  const story = raw<string[]>("about.story") ?? [];

  return (
    <>
      <section className="dark relative h-[75svh] overflow-hidden grain bg-ink-900 text-fg">
        <Image src={BRAND_IMAGES.b2b} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        <div className="pointer-events-none absolute left-6 top-28 font-display text-[10px] tracking-[0.3em] text-fg/40 md:left-12">N°00 / ATELIER</div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 md:px-12">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-8 bg-accent" />
            {t("about.sinceYear")}
          </div>
          <h1 className="kwell-h1 mt-4 max-w-4xl">
            {t("about.titleA")} <span className="text-accent">{t("about.titleAccent")}</span>
          </h1>
        </div>
      </section>

      <section className="kwell-section bg-ink-900">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="kwell-eyebrow flex items-center gap-3">
              <span className="block h-px w-6 bg-accent" />
              {t("about.storyEyebrow")}
            </div>
            <h2 className="kwell-h2 mt-4">{t("about.storyTitle")}</h2>
            <div className="mt-10 font-display text-xs tracking-[0.3em] text-fg/40">
              44°N · 12°E<br />
              <span className="text-fg/60">Cesena, Italia</span>
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-7 space-y-6 text-smoke-mid leading-relaxed">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>
      <Stats />
      <Manifesto />
    </>
  );
}

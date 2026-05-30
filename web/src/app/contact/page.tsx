"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { submitLead } from "@/lib/api";
import { useT } from "@/lib/i18n/LanguageProvider";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/Footer";

export default function ContactPage() {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const ok = await submitLead({
      type: "individual",
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    });
    setStatus(ok ? "ok" : "error");
    if (ok) e.currentTarget.reset();
  }

  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("contact.eyebrow")}
          </div>
          <h1 className="kwell-h1 mt-4">
            <span className="text-accent">{t("contact.titleA")}</span>
          </h1>
          <div className="mt-12 space-y-7 text-sm text-fg/75">
            <ContactLine label={t("contact.email")} value="info@kwell.it" href="mailto:info@kwell.it" />
            <ContactLine label={t("contact.phone")} value={PHONE_DISPLAY} href={PHONE_HREF} />
            <div className="border-t border-fg/10 pt-7">
              <div className="kwell-eyebrow">{t("contact.hq")}</div>
              <p className="mt-2 text-base text-fg">{t("contact.hqCity")}</p>
              <p className="mt-1 text-xs tracking-[0.2em] text-fg/40">44°N · 12°E</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="md:col-span-7">
          <form onSubmit={onSubmit} className="relative border border-fg/10 bg-ink-800 p-8 md:p-10">
            <span className="absolute -top-3 left-8 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">MODULO · 01</span>
            <div className="grid gap-5">
              <Field label={t("contact.fields.name")} name="name" required />
              <Field label={t("contact.fields.email")} name="email" type="email" required />
              <Field label={t("contact.fields.phone")} name="phone" />
              <Field label={t("contact.fields.message")} name="message" textarea />
              <button type="submit" disabled={status === "sending"} className="kwell-btn-primary mt-2 group">
                {status === "sending" ? t("common.sending") : status === "ok" ? t("common.sent") : t("common.send")}
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </button>
              {status === "error" && <p className="text-sm text-accent">{t("common.error")}</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div className="kwell-eyebrow opacity-70">{label}</div>
      <a href={href} className="mt-1 block text-base text-fg hover:text-accent transition-colors">{value}</a>
    </div>
  );
}

function Field({ label, name, type = "text", textarea, required }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="kwell-eyebrow opacity-70">{label}{required ? " *" : ""}</span>
      {textarea ? (
        <textarea name={name} rows={4} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent" />
      ) : (
        <input name={name} type={type} required={required} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent" />
      )}
    </label>
  );
}

"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";

/**
 * Footer newsletter signup. Mock submit — fakes a 700ms request then shows
 * "Subscribed ✓". No real email service wired.
 */
export function NewsletterSignup() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("done");
    setEmail("");
    window.setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div>
      <div className="kwell-eyebrow mb-3">{t("newsletter.eyebrow")}</div>
      <div className="font-display text-2xl uppercase tracking-display-tight text-fg md:text-3xl">
        {t("newsletter.title")}
      </div>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-fg/55">{t("newsletter.sub")}</p>

      <form onSubmit={onSubmit} className="mt-5 flex w-full max-w-md items-stretch border border-fg/15 focus-within:border-accent">
        <input
          type="email"
          required
          aria-label={t("newsletter.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-fg placeholder-fg/30 outline-none"
        />
        <button
          type="submit"
          disabled={status !== "idle"}
          className="bg-accent px-5 font-display text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent-alt disabled:opacity-60"
        >
          {status === "sending" ? t("newsletter.sending") : status === "done" ? t("newsletter.done") : t("newsletter.cta")}
        </button>
      </form>
      <p className="mt-2 text-[10px] tracking-[0.18em] text-fg/35">{t("newsletter.mockNotice")}</p>
    </div>
  );
}

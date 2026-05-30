"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const { t } = useT();
  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("nav.account")}
          </div>
          <h1 className="kwell-h1 mt-4">{t("account.loginTitle")}</h1>
          <p className="mt-6 max-w-sm text-smoke-mid leading-relaxed">{t("account.loginSub")}</p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-7">
          <Suspense fallback={<FormSkeleton />}>
            <LoginForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}

function FormSkeleton() {
  return <div className="h-80 animate-pulse border border-fg/10 bg-ink-800" />;
}

function LoginForm() {
  const { t } = useT();
  const router = useRouter();
  const search = useSearchParams();
  const { login, user, hydrated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = search.get("redirect") || "/account";

  useEffect(() => {
    if (hydrated && user) router.replace(redirectTo);
  }, [hydrated, user, router, redirectTo]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    await new Promise((r) => setTimeout(r, 350));
    const res = login(email, password);
    setLoading(false);

    if (!res.ok) {
      const key = res.error === "not_found" ? "notFound" : "wrongPassword";
      setError(t(`account.errors.${key}`));
      return;
    }
    router.push(redirectTo);
  }

  return (
    <form onSubmit={onSubmit} className="relative border border-fg/10 bg-ink-800 p-8 md:p-10">
      <span className="absolute -top-3 left-8 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">ACCESSO · 01</span>
      <div className="grid gap-5">
        <Field label={t("account.fields.email")} name="email" type="email" required />
        <Field label={t("account.fields.password")} name="password" type="password" required />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-fg/60">
            <input type="checkbox" className="h-3.5 w-3.5 accent-accent" />
            {t("account.remember")}
          </label>
          <a href="#" className="text-accent hover:underline">{t("account.forgot")}</a>
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <button type="submit" disabled={loading} className="kwell-btn-primary group mt-2">
          {loading ? t("common.sending") : t("account.goLogin")}
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-2 text-center text-xs text-fg/50">
          {t("account.noAccount")}{" "}
          <Link href="/account/register" className="text-accent hover:underline">{t("account.goRegister")}</Link>
        </p>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="kwell-eyebrow opacity-70">{label}{required ? " *" : ""}</span>
      <input name={name} type={type} required={required} className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent" />
    </label>
  );
}

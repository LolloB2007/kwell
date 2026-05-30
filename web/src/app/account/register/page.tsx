"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { useAuth, type StoredUser } from "@/lib/auth/AuthProvider";

type Step = "form" | "verify";
type FormState = { firstName: string; lastName: string; email: string; password: string; confirmPassword: string };

const EMPTY: FormState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

function generateDemoCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function RegisterPage() {
  const { t } = useT();
  const router = useRouter();
  const { register, signIn, user, hydrated } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pendingUser = useRef<StoredUser | null>(null);
  const [demoCode, setDemoCode] = useState<string>("");
  const [code, setCode] = useState("");
  const [resentFlash, setResentFlash] = useState(false);

  // already-signed-in? bounce to dashboard
  useEffect(() => {
    if (hydrated && user) router.replace("/account");
  }, [hydrated, user, router]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!data.firstName || !data.email || !data.password) {
      setError(t("account.errors.invalid"));
      return;
    }
    if (data.password.length < 6) {
      setError(t("account.errors.weakPassword"));
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError(t("account.errors.passwordMismatch"));
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const res = register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    setLoading(false);

    if (!res.ok) {
      const key = res.error === "email_taken" ? "emailTaken" : res.error === "weak_password" ? "weakPassword" : "invalid";
      setError(t(`account.errors.${key}`));
      return;
    }

    pendingUser.current = res.user;
    setDemoCode(generateDemoCode());
    setCode("");
    setStep("verify");
  }

  async function submitCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (code.trim() !== demoCode) {
      setError(t("account.twoFa.invalidCode"));
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (pendingUser.current) signIn(pendingUser.current);
    router.push("/account");
  }

  function resend() {
    setDemoCode(generateDemoCode());
    setCode("");
    setResentFlash(true);
    setTimeout(() => setResentFlash(false), 1800);
  }

  if (step === "verify") {
    const subTpl = t("account.twoFa.sub").replace("{email}", data.email);
    return (
      <section className="kwell-section pt-40 bg-ink-900">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="kwell-eyebrow flex items-center gap-3">
              <span className="block h-px w-6 bg-accent" />
              {t("nav.account")} · 2-STEP
            </div>
            <h1 className="kwell-h1 mt-4">{t("account.twoFa.title")}</h1>
            <p className="mt-6 max-w-sm text-smoke-mid leading-relaxed">{subTpl}</p>
            <button onClick={() => { setStep("form"); setError(null); }} className="mt-8 font-display text-[11px] uppercase tracking-[0.22em] text-fg/60 hover:text-accent">
              {t("account.twoFa.backToForm")}
            </button>
          </Reveal>

          <Reveal delay={120} className="md:col-span-7">
            <form onSubmit={submitCode} className="relative border border-fg/10 bg-ink-800 p-8 md:p-10">
              <span className="absolute -top-3 left-8 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">2FA · 02</span>

              <div className="mb-6 inline-flex items-center gap-2 border border-accent/30 bg-accent/[0.06] px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t("account.twoFa.demoHint")} · {demoCode}
              </div>

              <label className="block">
                <span className="kwell-eyebrow opacity-70">{t("account.twoFa.codeLabel")}</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="••••••"
                  className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-4 text-center font-display text-3xl tracking-[0.6em] text-fg outline-none transition-colors focus:border-accent placeholder-fg/15"
                  required
                  aria-label={t("account.twoFa.codeLabel")}
                />
              </label>

              {error && <p className="mt-3 text-sm text-accent">{error}</p>}

              <button type="submit" disabled={loading || code.length !== 6} className="kwell-btn-primary mt-6 w-full group disabled:opacity-40">
                {loading ? t("account.twoFa.verifying") : t("account.twoFa.verify")}
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </button>

              <div className="mt-5 flex items-center justify-between text-xs">
                <button type="button" onClick={resend} className="text-fg/60 hover:text-accent">
                  {resentFlash ? t("account.twoFa.resent") : t("account.twoFa.resend")}
                </button>
                <Link href="/account/login" className="text-fg/40 hover:text-accent">{t("account.goLogin")} →</Link>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="kwell-section pt-40 bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="kwell-eyebrow flex items-center gap-3">
            <span className="block h-px w-6 bg-accent" />
            {t("nav.account")}
          </div>
          <h1 className="kwell-h1 mt-4">{t("account.registerTitle")}</h1>
          <p className="mt-6 max-w-sm text-smoke-mid leading-relaxed">{t("account.registerSub")}</p>
          <ul className="mt-10 space-y-3 text-sm text-fg/60">
            {["Ordini, spedizioni e fatture in un unico posto", "Wishlist sincronizzata su tutti i dispositivi", "Accesso prioritario alle nuove uscite"].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-2 text-[10px] tracking-[0.25em] text-fg/40">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-accent text-accent">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1 3 5v6c0 5 4 9 9 11 5-2 9-6 9-11V5l-9-4Z" /></svg>
            </span>
            VERIFICA IN 2 PASSAGGI
          </div>
        </Reveal>

        <Reveal delay={120} className="md:col-span-7">
          <form onSubmit={submitForm} className="relative border border-fg/10 bg-ink-800 p-8 md:p-10">
            <span className="absolute -top-3 left-8 bg-ink-900 px-3 font-display text-[10px] tracking-[0.3em] text-fg/40">REGISTRAZIONE · 01</span>
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("account.fields.firstName")} value={data.firstName} onChange={(v) => set("firstName", v)} required />
                <Field label={t("account.fields.lastName")} value={data.lastName} onChange={(v) => set("lastName", v)} />
              </div>
              <Field label={t("account.fields.email")} value={data.email} onChange={(v) => set("email", v)} type="email" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("account.fields.password")} value={data.password} onChange={(v) => set("password", v)} type="password" required hint="min 6" />
                <Field label={t("account.fields.confirmPassword")} value={data.confirmPassword} onChange={(v) => set("confirmPassword", v)} type="password" required />
              </div>
              {error && <p className="text-sm text-accent">{error}</p>}
              <button type="submit" disabled={loading} className="kwell-btn-primary group mt-2">
                {loading ? t("common.sending") : t("account.goRegister")}
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </button>
              <p className="mt-2 text-center text-xs text-fg/50">
                {t("account.hasAccount")}{" "}
                <Link href="/account/login" className="text-accent hover:underline">{t("account.goLogin")}</Link>
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required, hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="kwell-eyebrow opacity-70 flex items-center gap-2">
        {label}{required ? " *" : ""}
        {hint && <span className="font-body text-[9px] tracking-normal text-fg/30 normal-case">· {hint}</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        className="mt-2 w-full border border-fg/10 bg-transparent px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

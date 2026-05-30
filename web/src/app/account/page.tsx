"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { useShop } from "@/lib/shop/ShopProvider";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function AccountPage() {
  const { t } = useT();
  const router = useRouter();
  const { wishlist, cart } = useShop();
  const { user, hydrated, logout } = useAuth();

  useEffect(() => {
    if (hydrated && !user) router.replace("/account/login?redirect=/account");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <section className="kwell-section pt-40 bg-ink-900">
        <div className="mx-auto max-w-7xl text-fg/40">…</div>
      </section>
    );
  }

  const fullName = `${user.firstName}${user.lastName ? " " + user.lastName.charAt(0) + "." : ""}`;
  const memberSince = new Date(user.createdAt).toLocaleDateString("it-IT", { year: "numeric", month: "long" });

  return (
    <>
      <PageHeader eyebrow={t("nav.account")} title={t("account.dashboardTitle")} code="N°00 / ACCOUNT" />
      <section className="kwell-section pt-12 bg-ink-900">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 border border-accent/30 bg-accent/[0.06] px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("account.mockNotice")}
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <aside className="border border-fg/10 bg-ink-800 p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-lg text-white">
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-display text-lg uppercase tracking-display-tight leading-tight">{fullName}</div>
                    <div className="text-[11px] text-fg/40">{user.email}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.22em] text-fg/40">
                  <span>{user.customerCode}</span>
                  <span className="text-fg/20">·</span>
                  <span>{t("account.member")} · {memberSince}</span>
                </div>
                <nav className="mt-8 space-y-1">
                  {[
                    { k: t("account.orders"), href: "#orders" },
                    { k: t("account.addresses"), href: "#addresses" },
                    { k: t("account.profile"), href: "#profile" },
                    { k: t("nav.wishlist"), href: "/wishlist", badge: wishlist.length },
                    { k: t("nav.cart"), href: "/cart", badge: cart.reduce((s, l) => s + l.qty, 0) },
                  ].map((it) => (
                    <Link key={it.k} href={it.href} className="group flex items-center justify-between border border-transparent px-4 py-3 text-sm text-fg/70 transition-colors hover:border-fg/10 hover:bg-fg/[0.02] hover:text-fg">
                      <span className="font-display uppercase tracking-wider">{it.k}</span>
                      <span className="flex items-center gap-2 text-fg/40 group-hover:text-accent">
                        {it.badge != null && it.badge > 0 && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">{it.badge}</span>
                        )}
                        →
                      </span>
                    </Link>
                  ))}
                </nav>
                <button onClick={() => { logout(); router.push("/"); }} className="mt-8 w-full border border-fg/10 px-4 py-3 font-display text-xs uppercase tracking-wider text-fg/60 hover:border-accent hover:text-accent">
                  {t("account.logout")}
                </button>
              </aside>
            </Reveal>

            <Reveal delay={120} className="md:col-span-8">
              <div id="orders" className="border border-fg/10 bg-ink-800">
                <div className="flex items-center justify-between border-b border-fg/10 px-6 py-4">
                  <span className="font-display text-sm uppercase tracking-[0.22em]">{t("account.orders")}</span>
                  <span className="font-display text-[10px] tracking-[0.3em] text-fg/30">02 ATTIVI</span>
                </div>
                <ul className="divide-y divide-fg/10">
                  {MOCK_ORDERS.map((o) => (
                    <li key={o.id} className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-fg/[0.02]">
                      <div>
                        <div className="font-display text-sm uppercase tracking-wider">{o.id}</div>
                        <div className="mt-1 text-xs text-fg/40">{o.date} · {o.items} {o.items === 1 ? "articolo" : "articoli"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-base text-accent">€ {o.total}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-fg/50">{o.status}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="addresses" className="mt-4 grid gap-4 sm:grid-cols-2">
                <AddressCard kind="Spedizione" name={fullName} line1="Via dei Tessitori 14" line2="47521 Cesena, Italia" />
                <AddressCard kind="Fatturazione" name={fullName} line1="Via dei Tessitori 14" line2="47521 Cesena, Italia" />
              </div>

              <div id="profile" className="mt-4 border border-fg/10 bg-ink-800 p-6">
                <div className="kwell-eyebrow">{t("account.profile")}</div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Row label={t("account.fields.firstName")} value={user.firstName} />
                  <Row label={t("account.fields.lastName")} value={user.lastName || "—"} />
                  <Row label={t("account.fields.email")} value={user.email} />
                  <Row label="ID cliente" value={user.customerCode} mono />
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

const MOCK_ORDERS = [
  { id: "KW-2401-0142", date: "12 mag 2025", items: 3, total: "2.480", status: "In transito" },
  { id: "KW-2312-0098", date: "04 dic 2024", items: 1, total: "1.190", status: "Consegnato" },
  { id: "KW-2310-0061", date: "21 ott 2024", items: 5, total: "3.870", status: "Consegnato" },
];

function AddressCard({ kind, name, line1, line2 }: { kind: string; name: string; line1: string; line2: string }) {
  return (
    <div className="relative border border-fg/10 bg-ink-800 p-6">
      <span className="absolute -top-3 left-6 bg-ink-900 px-2 font-display text-[10px] tracking-[0.3em] text-fg/40">{kind}</span>
      <div className="font-display text-base uppercase tracking-wider">{name}</div>
      <div className="mt-2 text-sm text-fg/60">{line1}<br />{line2}</div>
      <button className="mt-4 font-display text-[11px] uppercase tracking-[0.22em] text-accent hover:underline">Modifica →</button>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="kwell-eyebrow opacity-60">{label}</dt>
      <dd className={`mt-1 ${mono ? "font-display tracking-[0.2em]" : ""} text-fg`}>{value}</dd>
    </div>
  );
}

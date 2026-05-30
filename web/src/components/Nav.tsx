"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useShop } from "@/lib/shop/ShopProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { Logo } from "./Logo";

export function Nav() {
  const { t } = useT();
  const { cart, wishlist } = useShop();
  const { user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const wishCount = wishlist.length;

  const LINKS = [
    { href: "/categories", label: t("nav.catalog") },
    { href: "/b2b", label: t("nav.b2b") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-kwell ${
        scrolled ? "bg-ink-900/85 backdrop-blur-md border-b border-fg/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-12">
        <Link href="/" aria-label="Kwell — home" className="inline-flex items-center">
          <Logo size="sm" caption="FC·IT" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative font-display text-xs uppercase tracking-[0.22em] text-fg/70 transition-colors hover:text-fg"
            >
              <span className="mr-2 text-[9px] text-accent/70">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="group relative grid h-10 w-10 place-items-center rounded-full border border-fg/10 text-fg/70 transition-all hover:border-accent hover:text-fg"
          >
            <svg
              viewBox="0 0 24 24"
              className={`absolute h-4 w-4 transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="3.6" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              className={`absolute h-4 w-4 transition-all duration-500 ${!isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20.5 14.5A8 8 0 1 1 9.5 3.5a6.5 6.5 0 0 0 11 11Z" />
            </svg>
          </button>
          <IconLink href="/wishlist" label={t("nav.wishlist")} count={wishCount}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
            </svg>
          </IconLink>
          <IconLink href="/cart" label={t("nav.cart")} count={cartCount}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="9" cy="20" r="1.2" />
              <circle cx="17" cy="20" r="1.2" />
            </svg>
          </IconLink>
          <IconLink href="/account" label={user ? `${t("account.signedInAs")} ${user.firstName}` : t("nav.account")}>
            {user ? (
              <span className="font-display text-[11px] tracking-wider">{user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}</span>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.5" />
                <path strokeLinecap="round" d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
            )}
          </IconLink>
        </div>

        <button onClick={() => setOpen(!open)} className="relative h-9 w-9 md:hidden" aria-label="Menu">
          <span className={`absolute left-1 top-3 h-px w-7 bg-fg transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`absolute left-1 top-5 h-px w-7 bg-fg transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-fg/10 bg-ink-900 md:hidden">
          <nav className="flex flex-col px-6 py-6">
            {LINKS.map((l, i) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-3 font-display uppercase tracking-wider text-fg/80">
                <span className="text-[10px] text-accent/70">N°{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-fg/10 pt-4">
              <Link href="/account" onClick={() => setOpen(false)} className="text-xs uppercase tracking-wider text-fg/60">{t("nav.account")}</Link>
              <Link href="/wishlist" onClick={() => setOpen(false)} className="text-xs uppercase tracking-wider text-fg/60">{t("nav.wishlist")} {wishCount > 0 && `(${wishCount})`}</Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="text-xs uppercase tracking-wider text-fg/60">{t("nav.cart")} {cartCount > 0 && `(${cartCount})`}</Link>
              <button onClick={() => { toggleTheme(); }} className="ml-auto text-xs uppercase tracking-wider text-fg/60">
                {isDark ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function IconLink({ href, label, children, count }: { href: string; label: string; children: React.ReactNode; count?: number }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="group relative grid h-10 w-10 place-items-center rounded-full border border-fg/10 text-fg/70 transition-all hover:border-accent hover:text-fg"
    >
      {children}
      {count != null && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 font-display text-[10px] leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

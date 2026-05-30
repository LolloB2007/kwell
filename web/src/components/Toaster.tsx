"use client";
import Link from "next/link";
import { useToast } from "@/lib/toast/ToastProvider";

/**
 * Floating bottom-left toast stack. Stays out of the bottom-right
 * language toggle's airspace. Pure Tailwind — no animation lib.
 */
export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-6 z-[80] flex w-full max-w-sm flex-col gap-2 md:bottom-8 md:left-8"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 border border-fg/15 bg-ink-900/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="flex-1 font-display text-[11px] uppercase tracking-[0.18em] text-fg">
            {t.message}
          </span>
          {t.action && (
            <Link
              href={t.action.href}
              onClick={() => dismiss(t.id)}
              className="font-display text-[11px] uppercase tracking-[0.18em] text-accent hover:underline"
            >
              {t.action.label} →
            </Link>
          )}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="text-fg/40 hover:text-fg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

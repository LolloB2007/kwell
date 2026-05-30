"use client";
import { Reveal } from "./Reveal";

export function PageHeader({ eyebrow, title, accent, code, children }: { eyebrow: string; title: string; accent?: string; code?: string; children?: React.ReactNode }) {
  return (
    <header className="kwell-section pt-40 pb-12 bg-ink-900 border-b border-fg/[0.05]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="kwell-eyebrow flex items-center gap-3">
                <span className="block h-px w-6 bg-accent" />
                {eyebrow}
              </div>
              <h1 className="kwell-h1 mt-4">
                {title}{accent ? <> <span className="text-accent">{accent}</span></> : null}
              </h1>
            </div>
            {code && <div className="hidden font-display text-[10px] tracking-[0.3em] text-fg/30 md:block">{code}</div>}
          </div>
          {children && <div className="mt-6">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}

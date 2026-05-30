export default function Loading() {
  return (
    <div className="grid min-h-[60svh] place-items-center bg-ink-900 pt-40">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border border-fg/15" />
          <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-accent" />
        </div>
        <div className="font-display text-[10px] tracking-[0.3em] text-fg/40">KWELL · LOADING</div>
      </div>
    </div>
  );
}

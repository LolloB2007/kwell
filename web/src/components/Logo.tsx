import type { CSSProperties } from "react";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { fontSize: string; dot: string; gap: string; caption: string }> = {
  sm: { fontSize: "1.5rem", dot: "0.34rem", gap: "0.32rem", caption: "0.625rem" }, // ~24px
  md: { fontSize: "2.25rem", dot: "0.5rem", gap: "0.45rem", caption: "0.6875rem" }, // ~36px
  lg: { fontSize: "3rem", dot: "0.65rem", gap: "0.55rem", caption: "0.6875rem" },  // ~48px
};

type Props = {
  /** Visual size variant. */
  size?: Size;
  /** Optional caption rendered to the right (e.g. "FC·IT"). */
  caption?: string;
  /** Accessible name override. Defaults to "Kwell". */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Unified K•WELL wordmark.
 *
 * Anatomy: bold condensed grotesque "K", an accent-red filled circle as the
 * dot, then "WELL". Renders as inline-flex text (not SVG) so it inherits
 * the font-display family and stays crisp at any device pixel ratio.
 * The dot is a real `<span>` with `border-radius: 9999px` (i.e. a perfect
 * circle), not the middle-dot character.
 */
export function Logo({ size = "md", caption, label = "Kwell", className = "", style }: Props) {
  const s = SIZES[size];
  return (
    <span
      role="img"
      aria-label={label}
      className={`group inline-flex items-center font-display uppercase tracking-display-tight leading-none text-fg ${className}`}
      style={{ fontSize: s.fontSize, gap: s.gap, ...style }}
    >
      <span aria-hidden>K</span>
      <span
        aria-hidden
        className="inline-block rounded-full bg-accent transition-transform duration-500 ease-kwell group-hover:scale-110"
        style={{ width: s.dot, height: s.dot }}
      />
      <span aria-hidden>WELL</span>
      {caption && (
        <span
          aria-hidden
          className="ml-3 font-body normal-case tracking-[0.3em] text-fg/30"
          style={{ fontSize: s.caption }}
        >
          {caption}
        </span>
      )}
    </span>
  );
}

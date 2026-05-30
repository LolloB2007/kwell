import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // .dark on any ancestor activates dark utilities — and our CSS variables
  // also flip via the same .dark selector so the whole site re-themes.
  darkMode: ["variant", "&:where(.dark, .dark *)"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--c-ink-700) / <alpha-value>)",
          black: "#000000",
          deepest: "rgb(var(--c-ink-deepest) / <alpha-value>)",
          900: "rgb(var(--c-ink-900) / <alpha-value>)",
          800: "rgb(var(--c-ink-800) / <alpha-value>)",
          700: "rgb(var(--c-ink-700) / <alpha-value>)",
          600: "rgb(var(--c-ink-600) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "#F02D32",
          alt: "#EB212D",
          pure: "#FF0000",
        },
        smoke: {
          DEFAULT: "#474646",
          mid: "rgb(var(--c-smoke-mid) / <alpha-value>)",
          light: "#F4F2F2",
        },
        // Semantic foreground that flips with theme. Use instead of text-white
        // when the element should adapt to the current theme.
        fg: "rgb(var(--c-fg) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "Arial Black", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "display-tight": "-0.02em",
      },
      transitionTimingFunction: {
        kwell: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

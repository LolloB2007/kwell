"use client";
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  className?: string;
};

export function Reveal({ children, as: Tag = "div", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => el.classList.add("is-in"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const Component = Tag as unknown as React.ElementType;
  return (
    <Component ref={ref as React.Ref<HTMLElement>} className={`reveal ${className}`}>
      {children}
    </Component>
  );
}

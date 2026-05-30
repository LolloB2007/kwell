"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * App Router template — re-mounts on every navigation. Plays a red-dot
 * wipe in: a fullscreen accent disc covers the new page, then collapses to
 * a point at the center via expo.inOut, revealing the route.
 *
 * The overlay is React-managed (no imperative `style.display = none`, no
 * document.documentElement mutation). React fully owns the DOM lifecycle,
 * which avoids "removeChild not a child of this node" reconciliation
 * errors on subsequent navigation.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(!reduced);
  const overlay = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) { setVisible(false); return; }
    if (!overlay.current) return;
    const el = overlay.current;
    const dot = el.querySelector<HTMLElement>(".wipe-dot");
    if (!dot) { setVisible(false); return; }

    gsap.set(el, { autoAlpha: 1 });
    gsap.set(dot, { scale: 1, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });
    tl
      .to({}, { duration: 0.12 })
      .to(dot, { scale: 0, duration: 0.7, ease: "expo.inOut" })
      .to(el, { autoAlpha: 0, duration: 0.15, ease: "power2.out" }, "-=0.08");

    return () => { tl.kill(); };
  }, [reduced]);

  return (
    <>
      {visible && !reduced && (
        <div
          ref={overlay}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] grid place-items-center"
          style={{ visibility: "hidden", opacity: 0 }}
        >
          <div
            className="wipe-dot rounded-full bg-accent will-change-transform"
            style={{ width: "180vmax", height: "180vmax" }}
          />
        </div>
      )}
      {children}
    </>
  );
}

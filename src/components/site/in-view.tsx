"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Plays a CSS reveal once when the block enters view, then holds.
 * Sets data-reveal="armed" before first paint and "play" on entry.
 * Without JS the content is simply shown; with reduced motion the CSS keeps
 * only a soft fade.
 */
export function InView({ className, threshold = 0.25, children }: { className?: string; threshold?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "play";
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

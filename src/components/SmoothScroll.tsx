"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __techBasketLenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    window.__techBasketLenis = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      if (window.__techBasketLenis === lenis) {
        delete window.__techBasketLenis;
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
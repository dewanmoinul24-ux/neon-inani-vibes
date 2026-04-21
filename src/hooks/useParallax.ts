import { useEffect, useRef } from "react";

/**
 * Subtle scroll-driven parallax. Returns a ref to attach to the element you
 * want to translate (typically a banner <img>). Animation is throttled with
 * requestAnimationFrame and disabled when prefers-reduced-motion is set.
 *
 * @param intensity translate ratio of scrollY (0.15 = subtle, 0.3 = strong)
 * @param maxScale  max additional zoom while scrolling (e.g. 0.04 = +4%)
 */
export function useParallax<T extends HTMLElement>(
  intensity: number = 0.18,
  maxScale: number = 0.04,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Only animate while element is roughly in/near the viewport
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const y = window.scrollY;
      const translate = y * intensity;
      const scale = 1 + Math.min(y / vh, 1) * maxScale;
      el.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [intensity, maxScale]);

  return ref;
}

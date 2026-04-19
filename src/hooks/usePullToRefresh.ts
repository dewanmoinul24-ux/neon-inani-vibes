import { useEffect, useRef, useState } from "react";

interface Options {
  onRefresh: () => Promise<unknown> | unknown;
  /** Distance (px) the user must pull past the threshold to trigger refresh. */
  threshold?: number;
  /** Max visual pull distance. */
  maxPull?: number;
  /** Disable on non-touch / desktop. */
  enabled?: boolean;
}

/**
 * Lightweight pull-to-refresh for mobile.
 * Activates only when the page is scrolled to the very top and the user pulls down with touch.
 */
export const usePullToRefresh = ({
  onRefresh,
  threshold = 70,
  maxPull = 120,
  enabled = true,
}: Options) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    // Skip on devices without touch (desktop)
    if (!("ontouchstart" in window)) return;

    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      if (getScrollTop() > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling.current || startY.current === null || isRefreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }
      // Apply resistance for a natural feel
      const eased = Math.min(maxPull, delta * 0.5);
      setPullDistance(eased);
      if (delta > 10 && e.cancelable) e.preventDefault();
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      const shouldRefresh = pullDistance >= threshold;
      if (shouldRefresh) {
        setIsRefreshing(true);
        setPullDistance(threshold);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
      startY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [enabled, isRefreshing, maxPull, onRefresh, pullDistance, threshold]);

  return {
    pullDistance,
    isRefreshing,
    progress: Math.min(1, pullDistance / threshold),
  };
};

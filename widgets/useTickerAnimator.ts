import { useEffect, useRef } from "react";

export function useTickerAnimator({ enabled = true, speedPxPerSec = 80 }:{
  enabled?: boolean; speedPxPerSec?: number;
}) {
  const req = useRef<number | null>(null);
  const x = useRef(0);
  const el = useRef<HTMLDivElement | null>(null);
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  useEffect(() => {
    const step = (tPrev: number) => (tNow: number) => {
      if (!el.current) return;
      const dt = Math.min(32, tNow - tPrev);
      x.current -= (speedPxPerSec * dt) / 1000;
      el.current.style.transform = `translate3d(${x.current}px,0,0)`;
      req.current = requestAnimationFrame(step(tNow));
    };

    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      if (!visible || !enabled || reduced) {
        if (req.current) cancelAnimationFrame(req.current);
        req.current = null;
        return;
      }
      if (!req.current) req.current = requestAnimationFrame(step(performance.now()));
    };

    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (req.current) cancelAnimationFrame(req.current);
    };
  }, [enabled, speedPxPerSec, reduced]);

  return { trackRef: el };
}

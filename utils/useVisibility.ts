import { useEffect, useRef, useState } from "react";

export function useVisibility<T extends HTMLElement>(rootMargin = "64px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => setVisible(e.isIntersecting)),
      { root: null, rootMargin, threshold: [0, 0.01, 0.25] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}

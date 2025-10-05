import { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboard";

export function AccentProvider({ children }: {children: React.ReactNode}) {
  const { accentH, accentS, accentL } = useDashboardStore(s => ({
    accentH: s.accentH, accentS: s.accentS, accentL: s.accentL
  }));
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent-h", String(accentH));
    r.style.setProperty("--accent-s", `${accentS}%`);
    r.style.setProperty("--accent-l", `${accentL}%`);
    r.style.setProperty("--accent", `hsl(var(--accent-h) var(--accent-s) var(--accent-l))`);
  }, [accentH, accentS, accentL]);
  return children as any;
}

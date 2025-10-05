import { useEffect, type ReactNode } from 'react';
import { useDashboardStore } from '@/store/useDashboard';

interface AccentProviderProps {
  children: ReactNode;
}

export function AccentProvider({ children }: AccentProviderProps) {
  const { accentH, accentS, accentL } = useDashboardStore(state => ({
    accentH: state.accentH,
    accentS: state.accentS,
    accentL: state.accentL,
  }));

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-h', String(accentH));
    root.style.setProperty('--accent-s', `${accentS}%`);
    root.style.setProperty('--accent-l', `${accentL}%`);
    root.style.setProperty('--accent', `hsl(var(--accent-h) var(--accent-s) var(--accent-l))`);
  }, [accentH, accentS, accentL]);

  return <>{children}</>;
}

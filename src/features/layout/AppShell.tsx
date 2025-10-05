import { NavLink, Outlet } from 'react-router-dom';
import { useDashboardStore } from '@/store/useDashboard';
import styles from './AppShell.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/overlay', label: 'Overlay' },
  { to: '/status', label: 'Status' },
];

export function AppShell() {
  const { activeDashboardName, safeMode, highContrast, screenReaderMode } = useDashboardStore(state => ({
    activeDashboardName: state.getActiveDashboard()?.name ?? 'Default',
    safeMode: state.safeMode,
    highContrast: state.highContrast,
    screenReaderMode: state.screenReaderMode,
  }));

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandAccent} aria-hidden="true" />
          <span>M0 Broadcast</span>
        </div>
        <nav className={styles.nav} aria-label="Main">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : undefined].filter(Boolean).join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.statusGroup}>
            <span className={styles.statusItem}>
              <span className={styles.accentSwatch} aria-hidden="true" />
              Accent
            </span>
            <span className={styles.statusItem}>
              Layout: {activeDashboardName}
            </span>
          </div>
          <div className={styles.statusGroup}>
            <span className={styles.statusItem}>Safe mode {safeMode ? 'On' : 'Off'}</span>
            <span className={styles.statusItem}>High contrast {highContrast ? 'On' : 'Off'}</span>
            <span className={styles.statusItem}>Screen reader {screenReaderMode ? 'On' : 'Off'}</span>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React from "react";
import styles from "./StatusPage.module.css";

type Stat = { label: string; value: string; hint?: string };
const stats: Stat[] = [
  { label: "Environment", value: import.meta.env.MODE },
  { label: "Version", value: import.meta.env.VITE_APP_VERSION ?? "dev" },
  { label: "Build", value: import.meta.env.VITE_GIT_SHA?.slice(0,7) ?? "—" },
  { label: "Overlay", value: "/overlay", hint: "Open in OBS Browser Source" },
];

export default function StatusPage() {
  return (
    <main className={styles.wrap} aria-labelledby="status-title">
      <header className={styles.header}>
        <h1 id="status-title" className={styles.title}>System Status</h1>
        <p className={styles.subtitle}>
          Runtime diagnostics and environment configuration.
        </p>
      </header>

      <section className={styles.grid} aria-label="System stats">
        {stats.map((s) => (
          <article key={s.label} className={styles.card}>
            <div className={styles.label}>{s.label}</div>
            <div className={styles.value} title={s.value}>{s.value}</div>
            {s.hint && <div className={styles.hint}>{s.hint}</div>}
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <a className={styles.link} href="/dashboard">Open Dashboard</a>
        <a className={styles.link} href="/overlay" target="_blank" rel="noreferrer">Open Overlay</a>
        <a className={styles.link} href="/status">Refresh</a>
      </footer>
    </main>
  );
}

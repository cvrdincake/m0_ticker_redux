import { useEffect, useState } from 'react';
import '@/styles/status.css';

export default function StatusPage() {
  const [env, setEnv] = useState({ url: '', status: 'loading' });

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    // Optional: fetch('/health').then(...) to set status
    setEnv({ url, status: 'ready' });
  }, []);

  return (
    <section className="page page--status">
      <h1>Overlay Dashboard</h1>
      <ul className="meta">
        <li><span>Server</span><strong>{env.status}</strong></li>
        <li><span>Environment</span><strong>Codespaces</strong></li>
        {env.url && <li><span>Access via</span><strong>{env.url}</strong></li>}
      </ul>
    </section>
  );
}
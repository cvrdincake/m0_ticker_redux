import { useEffect, useState } from 'react';
import './status.css';

export default function StatusPage() {
  const [env, setEnv] = useState({ url: '', status: 'loading' });

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    const url = isBrowser ? window.location.href : '';
    
    // Health check with 2s timeout
    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch('/health', {
          signal: controller.signal,
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        const status = response.ok ? 'ready' : 'degraded';
        setEnv({ url, status });
      } catch (error) {
        // Timeout, network error, or /health doesn't exist
        const status = error.name === 'AbortError' ? 'degraded' : 'error';
        setEnv({ url, status });
      }
    };
    
    checkHealth();
  }, []);

  return (
    <section className="page page--status">
      <header className="page__header">
        <h1 className="page__title">Overlay Dashboard</h1>
        <p className="page__subtitle">Environment status & quick links</p>
      </header>

      <ul className="meta">
        <li><span>✅ Server status</span><strong>{env.status}</strong></li>
        <li><span>🌐 Environment</span><strong>Codespaces</strong></li>
        {env.url && <li><span>🔗 Access via</span><strong>{env.url}</strong></li>}
      </ul>
    </section>
  );
}
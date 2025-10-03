import { useState } from 'react';
import { PopupAlert } from '@/design-system/patterns/BroadcastOverlay';
import { usePopupQueue } from '@/design-system/patterns/BroadcastOverlay/usePopupQueue.js';

/**
 * OverlayDemo - Example usage page for PopupAlert broadcast overlay pattern
 * Demonstrates portal mounting, queue management, and interactive controls
 */
export const OverlayDemo = () => {
  const [singleAlert, setSingleAlert] = useState({
    active: false,
    title: '',
    message: '',
    icon: null,
  });

  const { push, clear, current, queueLength } = usePopupQueue(3);

  // Predefined alerts for demo
  const demoAlerts = [
    {
      title: 'Market Alert',
      message: 'NASDAQ has opened for trading. Current volume is above average.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      duration: 4000,
    },
    {
      title: 'System Update',
      message: 'A new version of the trading platform is available. Update will install automatically during maintenance window.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      ),
      duration: 6000,
    },
    {
      title: 'Price Target Hit',
      message: 'AAPL has reached your price target of $150.00. Consider reviewing your position.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      duration: 5000,
    },
    {
      title: 'Connection Warning',
      message: 'Network latency detected. Your orders may experience delays.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      duration: 7000,
    },
  ];

  // Show single alert
  const showSingleAlert = (alertData) => {
    setSingleAlert({
      active: true,
      ...alertData,
    });
  };

  // Hide single alert
  const hideSingleAlert = () => {
    setSingleAlert(prev => ({ ...prev, active: false }));
  };

  // Add alert to queue
  const addToQueue = (alertData) => {
    push(alertData);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--surface)',
      color: 'var(--ink)',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            font: 'var(--display-lg) var(--font-display)',
            marginBottom: '1rem' 
          }}>
            PopupAlert Demo
          </h1>
          <p style={{ 
            font: 'var(--body-lg) var(--font-body)',
            color: 'var(--ink-muted)',
            lineHeight: 1.6 
          }}>
            Demonstrates the broadcast overlay pattern with portal rendering, 
            accessibility features, and queue management. Try different alerts 
            and interactions below.
          </p>
        </header>

        {/* Single Alert Controls */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            font: 'var(--display-md) var(--font-display)',
            marginBottom: '1rem' 
          }}>
            Single Alert
          </h2>
          <p style={{ 
            font: 'var(--body-md) var(--font-body)',
            color: 'var(--ink-muted)',
            marginBottom: '1.5rem' 
          }}>
            Show individual alerts with portal rendering. Hover to pause auto-dismiss, 
            press Esc to dismiss manually.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {demoAlerts.map((alert, index) => (
              <button
                key={index}
                onClick={() => showSingleAlert(alert)}
                style={{
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  background: 'var(--ink)',
                  color: 'var(--surface)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  font: 'var(--body-sm) var(--font-body)',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--ink-muted)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--ink)';
                }}
              >
                {alert.title}
              </button>
            ))}
          </div>
        </section>

        {/* Queue Management */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            font: 'var(--display-md) var(--font-display)',
            marginBottom: '1rem' 
          }}>
            Queue Management
          </h2>
          <p style={{ 
            font: 'var(--body-md) var(--font-body)',
            color: 'var(--ink-muted)',
            marginBottom: '1rem' 
          }}>
            Add multiple alerts to queue. They&apos;ll show one at a time with serialised timing. 
            Maximum 3 alerts in queue with drop-oldest policy.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap' 
          }}>
            {demoAlerts.map((alert, index) => (
              <button
                key={`queue-${index}`}
                onClick={() => addToQueue(alert)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'var(--surface-lift)',
                  color: 'var(--ink)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  font: 'var(--body-xs) var(--font-body)',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--border-strong)';
                  e.target.style.background = 'var(--surface)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'var(--surface-lift)';
                }}
              >
                Queue {alert.title}
              </button>
            ))}
            
            <button
              onClick={clear}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'transparent',
                color: 'var(--ink-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                font: 'var(--body-xs) var(--font-body)',
                transition: 'all var(--duration-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--border-strong)';
                e.target.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.color = 'var(--ink-muted)';
              }}
            >
              Clear Queue
            </button>
          </div>
          
          <div style={{ 
            font: 'var(--body-sm) var(--font-body)',
            color: 'var(--ink-subtle)',
            background: 'var(--surface-lift)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            Queue Status: {queueLength} alert{queueLength !== 1 ? 's' : ''} pending
            {current && ' • Currently showing: ' + current.title}
          </div>
        </section>

        {/* Features & Testing */}
        <section>
          <h2 style={{ 
            font: 'var(--display-md) var(--font-display)',
            marginBottom: '1rem' 
          }}>
            Features & Testing
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--surface-lift)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ 
                font: 'var(--body-lg) var(--font-body)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-sm)' 
              }}>
                Accessibility
              </h3>
              <ul style={{ 
                font: 'var(--body-sm) var(--font-body)',
                color: 'var(--ink-muted)',
                listStyle: 'none',
                padding: 0,
                margin: 0 
              }}>
                <li>• role=&quot;alert&quot; with aria-live=&quot;assertive&quot;</li>
                <li>• No focus trap (broadcast-safe)</li>
                <li>• Screen reader announcements</li>
                <li>• Keyboard navigation (Esc to dismiss)</li>
              </ul>
            </div>
            
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--surface-lift)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ 
                font: 'var(--body-lg) var(--font-body)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-sm)' 
              }}>
                Motion Policy
              </h3>
              <ul style={{ 
                font: 'var(--body-sm) var(--font-body)',
                color: 'var(--ink-muted)',
                listStyle: 'none',
                padding: 0,
                margin: 0 
              }}>
                <li>• ≤240ms animations (transform/opacity)</li>
                <li>• Tokenised durations (--duration-base)</li>
                <li>• Respects prefers-reduced-motion</li>
                <li>• Smooth enter/exit transitions</li>
              </ul>
            </div>
            
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--surface-lift)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ 
                font: 'var(--body-lg) var(--font-body)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-sm)' 
              }}>
                Interaction
              </h3>
              <ul style={{ 
                font: 'var(--body-sm) var(--font-body)',
                color: 'var(--ink-muted)',
                listStyle: 'none',
                padding: 0,
                margin: 0 
              }}>
                <li>• Hover to pause auto-dismiss timer</li>
                <li>• Click dismiss button or press Esc</li>
                <li>• Portal rendering to document.body</li>
                <li>• z-index layering (110) above content</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Single Alert Portal */}
      <PopupAlert
        title={singleAlert.title}
        message={singleAlert.message}
        icon={singleAlert.icon}
        active={singleAlert.active}
        duration={singleAlert.duration || 5000}
        onDismiss={hideSingleAlert}
      />

      {/* Queue Alert Portal */}
      {current && (
        <PopupAlert
          title={current.title}
          message={current.message}
          icon={current.icon}
          active={current.active}
          duration={current.duration}
          onDismiss={current.onDismiss}
        />
      )}
    </div>
  );
};
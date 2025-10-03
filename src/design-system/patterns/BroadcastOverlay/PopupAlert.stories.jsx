import { useState } from 'react';
import { PopupAlert } from './PopupAlert.jsx';
import { usePopupQueue } from './usePopupQueue.js';

const meta = {
  title: 'Patterns/BroadcastOverlay/PopupAlert',
  component: PopupAlert,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
PopupAlert is a broadcast overlay pattern for non-intrusive notifications.
It renders via portal to document.body with proper accessibility and motion policies.

Features:
- Portal rendering with z-index layering
- Screen reader accessible (role="alert", aria-live="assertive")
- Hover to pause auto-dismiss timer
- Escape key to dismiss
- Respects reduced motion preferences
- Queue management for multiple alerts
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Alert title (required)',
    },
    message: {
      control: 'text', 
      description: 'Alert message content (required)',
    },
    icon: {
      control: false,
      description: 'Optional icon element',
    },
    active: {
      control: 'boolean',
      description: 'Controls visibility',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in ms',
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback fired on dismiss/timeout',
    },
  },
};

export default meta;

// Basic alert
export const Default = {
  args: {
    title: 'Success',
    message: 'Your changes have been saved successfully.',
    active: true,
    duration: 5000,
  },
};

// Alert with icon
export const WithIcon = {
  args: {
    title: 'New Message',
    message: 'You have received a new message from the trading desk.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    active: true,
    duration: 5000,
  },
};

// Long message to test wrapping
export const LongMessage = {
  args: {
    title: 'System Update Required',
    message: 'A critical system update is available and must be installed before the market opens tomorrow. This update includes important security patches and performance improvements that will enhance your trading experience. Please save any open work and restart the application when convenient.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    active: true,
    duration: 8000,
  },
};

// Reduced motion demo (needs decorator to set media query)
export const ReducedMotion = {
  args: {
    title: 'Reduced Motion',
    message: 'This alert respects prefers-reduced-motion settings and shows instantly.',
    active: true,
    duration: 5000,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'When prefers-reduced-motion is enabled, the alert appears instantly without animation.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Simulate reduced motion preference
      const style = document.createElement('style');
      style.textContent = `
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      
      return (
        <div>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem' }}>
            ℹ️ Reduced motion simulation active
          </p>
          <Story />
        </div>
      );
    },
  ],
};

// Interactive demo with toggle control
export const Interactive = {
  render: function InteractiveStory(args) {
    const [active, setActive] = useState(false);
    
    return (
      <div style={{ padding: '2rem' }}>
        <button
          onClick={() => setActive(true)}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--ink)',
            color: 'var(--surface)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Show Alert
        </button>
        
        <PopupAlert
          {...args}
          active={active}
          onDismiss={() => setActive(false)}
        />
      </div>
    );
  },
  args: {
    title: 'Interactive Alert',
    message: 'Click the button to show this alert. Hover to pause auto-dismiss, press Esc to dismiss.',
    duration: 5000,
  },
};

// Queue demo using usePopupQueue hook
export const QueueDemo = {
  render: function QueueStory() {
    const { push, clear, current } = usePopupQueue(3);
    
    const alerts = [
      {
        title: 'Market Open',
        message: 'Trading session has begun.',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        title: 'Price Alert',
        message: 'AAPL has reached your target price of $150.',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin in 5 minutes.',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
      },
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          {alerts.map((alert, index) => (
            <button
              key={index}
              onClick={() => push({ ...alert, duration: 3000 })}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--ink)',
                color: 'var(--surface)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {alert.title}
            </button>
          ))}
          <button
            onClick={clear}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--border)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Clear All
          </button>
        </div>
        
        <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
          Click buttons to add alerts to queue. They&apos;ll show one at a time. Maximum 3 in queue.
        </p>
        
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates queue management with usePopupQueue hook. Alerts are serialised and show one at a time.',
      },
    },
  },
};
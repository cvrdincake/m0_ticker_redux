import { useState } from 'react';
import { ToastProvider, useToast } from './ToastManager';

export default {
  title: 'Patterns/Toast/ToastManager',
  component: ToastProvider,
  parameters: {
    docs: {
      description: {
        component: 'Toast notification system with broadcast-safe A11Y, hover/focus pause, and reduced-motion support.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '400px', padding: '2rem', background: 'var(--surface-canvas)' }}>
        <Story />
      </div>
    )
  ]
};

function ToastDemo() {
  const { addToast } = useToast();
  const [counter, setCounter] = useState(1);
  
  const showToast = () => {
    addToast(`Toast notification ${counter}`, 4000);
    setCounter(prev => prev + 1);
  };
  
  const showLongToast = () => {
    addToast(`This is a longer toast message with more content to show how the toast handles longer text content gracefully`, 6000);
    setCounter(prev => prev + 1);
  };
  
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button onClick={showToast}>Show Toast</button>
      <button onClick={showLongToast}>Show Long Toast</button>
    </div>
  );
}

export const Default = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
      <p style={{ marginTop: '2rem', color: 'var(--ink-subtle)' }}>
        Click buttons to show toasts. Hover or focus toasts to pause auto-dismiss.
      </p>
    </ToastProvider>
  )
};

function ManyToastsDemo() {
  const { addToast } = useToast();
  let counter = 1;
  
  const showManyToasts = () => {
    // Show 6 toasts rapidly to test queue cap
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        addToast(`Rapid toast ${counter++}`, 3000);
      }, i * 100);
    }
  };
  
  return (
    <div>
      <button onClick={showManyToasts}>Show Many Toasts (Tests Queue Cap)</button>
      <p style={{ marginTop: '1rem', color: 'var(--ink-subtle)', fontSize: '0.875rem' }}>
        Maximum 4 toasts shown at once. Oldest are dropped when limit exceeded.
      </p>
    </div>
  );
}

export const ManyToasts = {
  render: () => (
    <ToastProvider>
      <ManyToastsDemo />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests the queue cap behavior - only 4 toasts are shown at once.'
      }
    }
  }
};

function ReducedMotionDemo() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast('Reduced motion toast', 4000)}>
        Show Toast (Reduced Motion)
      </button>
      <p style={{ marginTop: '1rem', color: 'var(--ink-subtle)', fontSize: '0.875rem' }}>
        ⚡ Reduced motion: Toasts fade in/out without sliding animation
      </p>
    </div>
  );
}

export const ReducedMotion = {
  render: () => (
    <ToastProvider>
      <ReducedMotionDemo />
    </ToastProvider>
  ),
  decorators: [
    (Story) => {
      // Mock reduced motion preference
      window.matchMedia = (query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
      });
      
      // Add reduce-motion class
      document.documentElement.classList.add('reduce-motion');
      
      return (
        <div style={{ minHeight: '400px', padding: '2rem', background: 'var(--surface-canvas)' }}>
          <Story />
        </div>
      );
    }
  ]
};

function KeyboardDemo() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast('Press Enter or Space on toast to dismiss', 8000)}>
        Show Keyboard-Dismissible Toast
      </button>
      <p style={{ marginTop: '1rem', color: 'var(--ink-subtle)', fontSize: '0.875rem' }}>
        Toast can be focused and dismissed with Enter or Space keys.
      </p>
    </div>
  );
}

export const KeyboardNavigation = {
  render: () => (
    <ToastProvider>
      <KeyboardDemo />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests keyboard accessibility - toasts can be focused and dismissed with keyboard.'
      }
    }
  }
};
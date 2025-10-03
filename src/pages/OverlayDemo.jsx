import { useState } from 'react';
import { AnimatedList } from '@/design-system/components/List';
import { ToastProvider, useToast } from '@/design-system/patterns/Toast';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/**
 * OverlayDemo - Demo page showcasing AnimatedList and ToastProvider integration
 * Demonstrates staggered animations, toast notifications, and focus management
 */
export const OverlayDemo = () => {
  const [listItems, setListItems] = useState([
    { id: 1, content: 'Market data feed active' },
    { id: 2, content: 'Portfolio synchronised' },
    { id: 3, content: 'Real-time quotes enabled' },
    { id: 4, content: 'Risk monitoring active' },
    { id: 5, content: 'Order management ready' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const modalRef = useFocusTrap(showModal, {
    onEscape: () => setShowModal(false),
    restoreFocus: true
  });

  const addItem = () => {
    const newId = Math.max(...listItems.map(item => item.id), 0) + 1;
    const newItem = {
      id: newId,
      content: `New item ${newId} - ${Date.now()}`
    };
    setListItems(prev => [...prev, newItem]);
  };

  const generateLongList = () => {
    const longList = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      content: `Long list item ${i + 1} - ${i < 5 ? 'Animated' : 'Instant'}`
    }));
    setListItems(longList);
  };

  const resetList = () => {
    setListItems([
      { id: 1, content: 'Market data feed active' },
      { id: 2, content: 'Portfolio synchronised' },
      { id: 3, content: 'Real-time quotes enabled' },
      { id: 4, content: 'Risk monitoring active' },
      { id: 5, content: 'Order management ready' }
    ]);
  };

  return (
    <ToastProvider>
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--surface-canvas)',
        color: 'var(--ink)',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem' }}>
            <h1 style={{ 
              font: 'var(--text-2xl)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem',
              color: 'var(--ink)'
            }}>
              Motion & Toast Demo
            </h1>
            <p style={{ 
              font: 'var(--text-base)',
              color: 'var(--ink-subtle)',
              lineHeight: 1.6 
            }}>
              Demonstrates AnimatedList stagger animations, toast notifications, and focus trap integration 
              with reduced-motion support and broadcast-safe patterns.
            </p>
          </header>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* AnimatedList Demo */}
            <section>
              <h2 style={{ 
                font: 'var(--text-xl)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '1rem' 
              }}>
                Animated List
              </h2>
              <p style={{ 
                font: 'var(--text-sm)',
                color: 'var(--ink-subtle)',
                marginBottom: '1.5rem' 
              }}>
                First 5 items animate with stagger, remaining appear instantly. 
                Large lists (200+ items) render instantly for performance.
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1.5rem',
                flexWrap: 'wrap' 
              }}>
                <button
                  onClick={addItem}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--surface-e1)',
                    color: 'var(--ink)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    font: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                  }}
                >
                  Add Item
                </button>
                
                <button
                  onClick={generateLongList}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--surface-e1)',
                    color: 'var(--ink)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    font: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                  }}
                >
                  Long List (50)
                </button>
                
                <button
                  onClick={resetList}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    color: 'var(--ink-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    font: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                  }}
                >
                  Reset
                </button>
              </div>
              
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                padding: 'var(--space-2)'
              }}>
                <AnimatedList 
                  items={listItems} 
                  staggerDelay={0.04}
                  aria-label="Demo list items"
                />
              </div>
              
              <div style={{ 
                font: 'var(--text-xs)',
                color: 'var(--ink-subtle)',
                marginTop: '1rem',
                padding: 'var(--space-2)',
                background: 'var(--surface-e1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
              }}>
                Items: {listItems.length} • 
                Animated: {Math.min(listItems.length, 5)} • 
                Instant: {Math.max(0, listItems.length - 5)}
              </div>
            </section>

            {/* Toast Demo */}
            <ToastDemoSection />
          </div>

          {/* Modal Demo */}
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ 
              font: 'var(--text-xl)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem' 
            }}>
              Focus Trap Demo
            </h2>
            
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--ink)',
                color: 'var(--surface-canvas)',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                font: 'var(--text-base)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Open Modal with Focus Trap
            </button>
          </section>

          {/* Features Overview */}
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ 
              font: 'var(--text-xl)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem' 
            }}>
              Features Demonstrated
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <FeatureCard 
                title="Reduced Motion"
                description="Respects prefers-reduced-motion and .reduce-motion class. Animations become instant or fade-only."
              />
              <FeatureCard 
                title="Performance Guards"
                description="AnimatedList caps at 5 animated items. Large lists (200+) render instantly."
              />
              <FeatureCard 
                title="Toast Queue Management"
                description="Maximum 4 toasts shown. Hover/focus pauses auto-dismiss. Visibility pause support."
              />
              <FeatureCard 
                title="SSR Safety"
                description="All components handle server-side rendering gracefully with proper guards."
              />
            </div>
          </section>
        </div>

        {/* Modal */}
        {showModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              ref={modalRef.ref}
              style={{
                background: 'var(--surface-e2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                padding: 'var(--space-6)',
                maxWidth: '400px',
                width: '90%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ 
                font: 'var(--text-lg)',
                fontFamily: 'var(--font-mono)',
                marginBottom: 'var(--space-3)' 
              }}>
                Focus Trap Modal
              </h3>
              <p style={{ 
                font: 'var(--text-sm)',
                color: 'var(--ink-subtle)',
                marginBottom: 'var(--space-4)' 
              }}>
                Tab navigation is trapped within this modal. Try Tab/Shift+Tab to cycle through focusable elements. 
                Press Escape to close.
              </p>
              
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--ink)',
                    color: 'var(--surface-canvas)',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    font: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Action
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    color: 'var(--ink)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    font: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  );
};

// Toast demo section component
function ToastDemoSection() {
  const { addToast } = useToast();
  
  const showToast = (message, duration = 4000) => {
    addToast(message, duration);
  };

  return (
    <section>
      <h2 style={{ 
        font: 'var(--text-xl)',
        fontFamily: 'var(--font-mono)',
        marginBottom: '1rem' 
      }}>
        Toast Notifications
      </h2>
      <p style={{ 
        font: 'var(--text-sm)',
        color: 'var(--ink-subtle)',
        marginBottom: '1.5rem' 
      }}>
        Broadcast-safe notifications with hover/focus pause, visibility pause, 
        and queue management (max 4 toasts).
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <button
          onClick={() => showToast('Market update: NASDAQ opened +0.5%')}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--surface-e1)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            font: 'var(--text-sm)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left'
          }}
        >
          Market Toast
        </button>
        
        <button
          onClick={() => showToast('Order executed: 100 shares AAPL @ $150.00', 6000)}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--surface-e1)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            font: 'var(--text-sm)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left'
          }}
        >
          Order Toast
        </button>
        
        <button
          onClick={() => showToast('This is a longer toast message that demonstrates how the toast component handles extended content gracefully without breaking the layout or accessibility features', 8000)}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--surface-e1)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            font: 'var(--text-sm)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left'
          }}
        >
          Long Toast
        </button>
        
        <button
          onClick={() => {
            // Show multiple toasts to test queue
            for (let i = 1; i <= 6; i++) {
              setTimeout(() => showToast(`Queue test ${i}`), i * 100);
            }
          }}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'transparent',
            color: 'var(--ink-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            font: 'var(--text-sm)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left'
          }}
        >
          Test Queue (6 toasts)
        </button>
      </div>
      
      <div style={{ 
        font: 'var(--text-xs)',
        color: 'var(--ink-subtle)',
        padding: 'var(--space-2)',
        background: 'var(--surface-e1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius)',
      }}>
        💡 Hover toasts to pause auto-dismiss • Press Enter/Space to dismiss when focused
      </div>
    </section>
  );
}

// Feature card component
function FeatureCard({ title, description }) {
  return (
    <div style={{
      padding: 'var(--space-4)',
      background: 'var(--surface-e1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--border-radius)',
    }}>
      <h3 style={{ 
        font: 'var(--text-base)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        marginBottom: 'var(--space-2)' 
      }}>
        {title}
      </h3>
      <p style={{ 
        font: 'var(--text-sm)',
        color: 'var(--ink-subtle)',
        lineHeight: 1.5,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
}
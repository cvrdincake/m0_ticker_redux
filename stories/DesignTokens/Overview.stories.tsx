import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design Tokens/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete overview of design tokens used throughout the M0 Ticker Redux design system.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

const TokensOverview = () => {
  return (
    <div style={{ 
      fontFamily: 'var(--font-family-mono)', 
      background: 'var(--surface)', 
      color: 'var(--ink)', 
      padding: 'var(--space-8)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: 'var(--text-3xl)', 
        marginBottom: 'var(--space-8)',
        fontWeight: 600,
        color: 'var(--ink)'
      }}>
        Design Tokens Overview
      </h1>

      {/* Colours */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-6)',
          color: 'var(--ink)'
        }}>
          Colours
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--space-4)'
        }}>
          {[
            { name: '--ink', value: 'var(--ink)' },
            { name: '--ink-muted', value: 'var(--ink-muted)' },
            { name: '--ink-subtle', value: 'var(--ink-subtle)' },
            { name: '--surface', value: 'var(--surface)' },
            { name: '--surface-strong', value: 'var(--surface-strong)' },
            { name: '--surface-lift', value: 'var(--surface-lift)' },
            { name: '--border', value: 'var(--border)' },
            { name: '--border-strong', value: 'var(--border-strong)' },
            { name: '--success', value: 'var(--success)' },
            { name: '--warning', value: 'var(--warning)' },
            { name: '--danger', value: 'var(--danger)' },
            { name: '--info', value: 'var(--info)' }
          ].map(token => (
            <div key={token.name} style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-base)',
              padding: 'var(--space-4)',
              background: 'var(--surface-lift)'
            }}>
              <div style={{ 
                width: '100%', 
                height: 'var(--space-16)', 
                background: token.value,
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-2)',
                border: '1px solid var(--border)'
              }} />
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                {token.name}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                {token.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-6)',
          color: 'var(--ink)'
        }}>
          Typography Scale
        </h2>
        <div style={{ 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-base)',
          padding: 'var(--space-6)',
          background: 'var(--surface-lift)'
        }}>
          {[
            { name: '--text-xs', css: 'var(--text-xs)' },
            { name: '--text-sm', css: 'var(--text-sm)' },
            { name: '--text-base', css: 'var(--text-base)' },
            { name: '--text-lg', css: 'var(--text-lg)' },
            { name: '--text-xl', css: 'var(--text-xl)' },
            { name: '--text-2xl', css: 'var(--text-2xl)' },
            { name: '--text-3xl', css: 'var(--text-3xl)' }
          ].map(token => (
            <div key={token.name} style={{ 
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-4)'
            }}>
              <div style={{ 
                fontSize: token.css, 
                color: 'var(--ink)',
                fontFamily: 'var(--font-family-base)'
              }}>
                The quick brown fox
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-family-mono)'
              }}>
                {token.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-6)',
          color: 'var(--ink)'
        }}>
          Spacing Scale
        </h2>
        <div style={{ 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-base)',
          padding: 'var(--space-6)',
          background: 'var(--surface-lift)'
        }}>
          {[
            { name: '--space-1', value: '4px' },
            { name: '--space-2', value: '8px' },
            { name: '--space-3', value: '12px' },
            { name: '--space-4', value: '16px' },
            { name: '--space-5', value: '20px' },
            { name: '--space-6', value: '24px' },
            { name: '--space-8', value: '32px' },
            { name: '--space-10', value: '40px' },
            { name: '--space-12', value: '48px' },
            { name: '--space-16', value: '64px' }
          ].map(token => (
            <div key={token.name} style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-2)'
            }}>
              <div style={{ 
                width: token.value,
                height: 'var(--space-4)',
                background: 'var(--success)',
                borderRadius: 'var(--radius-sm)'
              }} />
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--ink)',
                fontFamily: 'var(--font-family-mono)',
                minWidth: '120px'
              }}>
                {token.name}
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--ink-muted)'
              }}>
                {token.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-6)',
          color: 'var(--ink)'
        }}>
          Motion & Timing
        </h2>
        <div style={{ 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-base)',
          padding: 'var(--space-6)',
          background: 'var(--surface-lift)'
        }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--ink)'
            }}>
              Durations
            </h3>
            {[
              { name: '--duration-fast', value: '150ms' },
              { name: '--duration-normal', value: '250ms' },
              { name: '--duration-slow', value: '350ms' },
              { name: '--duration-slower', value: '500ms' }
            ].map(token => (
              <div key={token.name} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-2)'
              }}>
                <div style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-family-mono)',
                  minWidth: '160px'
                }}>
                  {token.name}
                </div>
                <div style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--ink-muted)'
                }}>
                  {token.value}
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--ink)'
            }}>
              Easing Functions
            </h3>
            {[
              { name: '--ease-linear', value: 'linear' },
              { name: '--ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)' },
              { name: '--ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
              { name: '--ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
              { name: '--ease-back', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
            ].map(token => (
              <div key={token.name} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-2)'
              }}>
                <div style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-family-mono)',
                  minWidth: '160px'
                }}>
                  {token.name}
                </div>
                <div style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--ink-muted)',
                  fontFamily: 'var(--font-family-mono)'
                }}>
                  {token.value}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-base)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-family-mono)'
            }}>
              Note: Animations respect prefers-reduced-motion preferences
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Overview: Story = {
  render: () => <TokensOverview />,
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all design tokens including colours, typography, spacing, and motion values.'
      }
    }
  }
};
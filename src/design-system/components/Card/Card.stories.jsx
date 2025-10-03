import Card from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Container component with elevation and interactive states.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
      description: 'Card style variant'
    },
    interactive: {
      control: 'boolean',
      description: 'Whether card is clickable'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with skeleton'
    }
  }
};

export const Default = {
  args: {
    children: (
      <div>
        <h3>Card Title</h3>
        <p>This is the card content. Cards are flexible containers for grouping related information.</p>
      </div>
    )
  }
};

export const Variants = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
    <Card variant="default">
      <h4>Default Card</h4>
      <p>Standard card with subtle background gradient.</p>
    </Card>
    <Card variant="elevated">
      <h4>Elevated Card</h4>
      <p>Card with shadow for more prominence.</p>
    </Card>
    <Card variant="outlined">
      <h4>Outlined Card</h4>
      <p>Transparent background with border emphasis.</p>
    </Card>
  </div>
);

export const Interactive = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
    <Card interactive onClick={() => alert('Card clicked!')}>
      <h4>Clickable Card</h4>
      <p>This card responds to clicks and keyboard interaction.</p>
    </Card>
    <Card variant="elevated" interactive onClick={() => alert('Elevated card clicked!')}>
      <h4>Interactive Elevated</h4>
      <p>Combines elevation with interactive behavior.</p>
    </Card>
  </div>
);

export const WithSubComponents = () => (
  <div style={{ maxWidth: '400px' }}>
    <Card variant="elevated">
      <Card.Header>
        <h3 style={{ margin: 0, fontSize: '18px' }}>User Profile</h3>
      </Card.Header>
      <Card.Content>
        <p style={{ margin: '0 0 16px 0', color: 'var(--ink-muted)' }}>
          Semantic card structure with header, content, and footer sections.
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--surface-lift)' 
          }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>John Doe</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>Software Engineer</div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <button style={{ 
          background: 'transparent', 
          border: '1px solid var(--border)', 
          color: 'var(--ink)', 
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          View Profile
        </button>
      </Card.Footer>
    </Card>
  </div>
);

export const Loading = {
  args: {
    loading: true
  }
};

// Dark theme variant
export const DarkTheme = {
  args: {
    children: (
      <div>
        <h3>Dark Theme Card</h3>
        <p>Card styling adapts to dark backgrounds automatically.</p>
      </div>
    )
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
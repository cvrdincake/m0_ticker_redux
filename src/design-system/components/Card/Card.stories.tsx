import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import { Card } from './Card';
import { Grid } from '@/design-system/primitives/Grid';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'Card component with elevation, interactive states, and scan-line effects.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined']
    },
    interactive: {
      control: { type: 'boolean' }
    },
    loading: {
      control: { type: 'boolean' }
    }
  }
} as Meta;

const Template: Story = (args) => (
  <Card {...args}>
    <Card.Header>
      <h3>Card Title</h3>
    </Card.Header>
    <Card.Content>
      <p>This is the card content area. It can contain any content including text, images, and other components.</p>
    </Card.Content>
    <Card.Footer>
      <button>Action</button>
    </Card.Footer>
  </Card>
);

export const Default = Template.bind({});
Default.args = {};

export const Interactive = Template.bind({});
Interactive.args = {
  interactive: true,
  onClick: () => console.log('Card clicked')
};

export const Elevated = Template.bind({});
Elevated.args = {
  variant: 'elevated'
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true
};

export const GridDemo: Story = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const cards = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    content: `This is card ${i + 1} with some sample content to demonstrate the grid layout.`
  }));

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h2>Card Grid Demo</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => {
              setReducedMotion(e.target.checked);
              if (e.target.checked) {
                document.body.classList.add('reduce-motion');
              } else {
                document.body.classList.remove('reduce-motion');
              }
            }}
          />
          Reduced Motion
        </label>
      </div>
      
      <Grid columns="responsive" gap="lg" animate={true}>
        {cards.map((card) => (
          <Card
            key={card.id}
            interactive
            onClick={() => console.log(`Clicked card ${card.id}`)}
          >
            <Card.Header>
              <h3>{card.title}</h3>
            </Card.Header>
            <Card.Content>
              <p>{card.content}</p>
            </Card.Content>
            <Card.Footer>
              <button>View Details</button>
            </Card.Footer>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

export const ScanLineEffect: Story = () => (
  <div style={{ padding: '2rem', background: 'var(--surface)' }}>
    <h3>Hover to see scan-line effect</h3>
    <Card
      interactive
      onClick={() => console.log('Card with scan-line clicked')}
      style={{ maxWidth: '400px' }}
    >
      <Card.Header>
        <h3>Interactive Card</h3>
      </Card.Header>
      <Card.Content>
        <p>Hover over this card to see the scan-line animation effect. The line travels from right to left on hover.</p>
      </Card.Content>
    </Card>
  </div>
);
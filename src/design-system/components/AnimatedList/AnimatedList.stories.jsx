import AnimatedList from './AnimatedList';

export default {
  title: 'Components/AnimatedList',
  component: AnimatedList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'List component with staggered GSAP animations and reduced motion support.'
      }
    }
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'List layout direction'
    },
    animation: {
      control: { type: 'select' },
      options: ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale', 'slide-up', 'slide-down'],
      description: 'Animation type for list items'
    },
    stagger: {
      control: { type: 'number', min: 0, max: 0.2, step: 0.01 },
      description: 'Delay between item animations'
    },
    visibleLimit: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of items to animate (rest appear instantly)'
    }
  }
};

// Sample data for stories
const sampleItems = [
  { id: 1, content: 'First item in the list' },
  { id: 2, content: 'Second item with more content' },
  { id: 3, content: 'Third item' },
  { id: 4, content: 'Fourth item with even longer content that wraps' },
  { id: 5, content: 'Fifth item' }
];

const manyItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  content: `Item ${i + 1} - ${['Short', 'Medium length content', 'Very long content that demonstrates text wrapping behavior'][i % 3]}`
}));

export const Default = {
  args: {
    items: sampleItems
  }
};

export const WithChildren = {
  render: (args) => (
    <AnimatedList {...args}>
      <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-raised)', borderRadius: '4px' }}>
        Child item 1
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-raised)', borderRadius: '4px' }}>
        Child item 2
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-raised)', borderRadius: '4px' }}>
        Child item 3
      </div>
    </AnimatedList>
  ),
  args: {}
};

export const Horizontal = {
  args: {
    items: sampleItems.slice(0, 3),
    direction: 'horizontal'
  }
};

export const AnimationVariants = () => (
  <div style={{ display: 'grid', gap: '32px', maxWidth: '600px' }}>
    {['fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale', 'slide-up', 'slide-down'].map(animation => (
      <div key={animation} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--ink-muted)' }}>
          {animation}
        </h4>
        <AnimatedList 
          items={sampleItems.slice(0, 3)} 
          animation={animation}
          stagger={0.06}
        />
      </div>
    ))}
  </div>
);

export const CustomStagger = {
  args: {
    items: sampleItems,
    stagger: 0.1,
    animation: 'fade-up'
  }
};

export const ManyItems = {
  args: {
    items: manyItems,
    visibleLimit: 5,
    animation: 'fade-up'
  }
};

export const InteractiveCards = {
  render: (args) => (
    <AnimatedList {...args}>
      {sampleItems.map((item, index) => (
        <div 
          key={item.id}
          style={{ 
            padding: '16px', 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: '8px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--surface-hovered)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--surface-raised)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
            Card {index + 1}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-muted)' }}>
            {item.content}
          </p>
        </div>
      ))}
    </AnimatedList>
  ),
  args: {
    animation: 'scale',
    stagger: 0.08
  }
};

export const HorizontalNav = {
  render: (args) => (
    <AnimatedList {...args}>
      {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map(item => (
        <a 
          key={item}
          href="#"
          style={{ 
            padding: '8px 16px', 
            backgroundColor: 'var(--surface-raised)', 
            borderRadius: '20px',
            textDecoration: 'none',
            color: 'var(--ink)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid var(--border)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--surface-hovered)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--surface-raised)';
          }}
        >
          {item}
        </a>
      ))}
    </AnimatedList>
  ),
  args: {
    direction: 'horizontal',
    animation: 'fade-down',
    stagger: 0.05
  }
};

export const TaskList = {
  render: (args) => (
    <div style={{ maxWidth: '400px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Todo List</h3>
      <AnimatedList {...args}>
        {[
          { text: 'Review design proposals', completed: true },
          { text: 'Update component documentation', completed: true },
          { text: 'Fix animation timing issues', completed: false },
          { text: 'Test accessibility features', completed: false },
          { text: 'Deploy to production', completed: false }
        ].map((task, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              backgroundColor: task.completed ? 'var(--surface-raised)' : 'var(--surface)',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              opacity: task.completed ? 0.7 : 1
            }}
          >
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => {}}
              style={{ margin: 0 }}
            />
            <span style={{ 
              fontSize: '14px',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'var(--ink-muted)' : 'var(--ink)'
            }}>
              {task.text}
            </span>
          </div>
        ))}
      </AnimatedList>
    </div>
  ),
  args: {
    animation: 'slide-up',
    stagger: 0.04
  }
};

// Performance testing story
export const PerformanceTest = {
  args: {
    items: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      content: `Performance test item ${i + 1}`
    })),
    visibleLimit: 8,
    animation: 'fade-up',
    stagger: 0.02
  }
};

// Dark theme variants
export const DarkTheme = {
  args: {
    items: sampleItems,
    animation: 'fade-up'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
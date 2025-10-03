import AnimatedPath from './AnimatedPath';

export default {
  title: 'Components/AnimatedPath',
  component: AnimatedPath,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SVG path component with animation capabilities for icons and illustrations.'
      }
    }
  },
  argTypes: {
    d: {
      control: 'text',
      description: 'SVG path data'
    },
    animated: {
      control: 'boolean',
      description: 'Enable draw animation'
    },
    interactive: {
      control: 'boolean',
      description: 'Enable hover effects'
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'Path style variant'
    },
    stroke: {
      control: 'color',
      description: 'Stroke color'
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Stroke width'
    }
  }
};

// Simple geometric shapes for demonstration
const paths = {
  circle: 'M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10',
  triangle: 'M 50 10 L 90 90 L 10 90 Z',
  star: 'M 50 10 L 60 35 L 90 35 L 70 55 L 80 85 L 50 65 L 20 85 L 30 55 L 10 35 L 40 35 Z',
  wave: 'M 10 50 Q 30 10 50 50 T 90 50',
  arrow: 'M 10 50 L 70 50 M 60 40 L 70 50 L 60 60',
  checkmark: 'M 20 50 L 40 70 L 80 30'
};

export const Default = {
  args: {
    d: paths.circle,
    width: 100,
    height: 100,
    viewBox: '0 0 100 100'
  }
};

export const Animated = {
  args: {
    d: paths.star,
    animated: true,
    width: 100,
    height: 100,
    viewBox: '0 0 100 100'
  }
};

export const Interactive = {
  args: {
    d: paths.triangle,
    interactive: true,
    width: 100,
    height: 100,
    viewBox: '0 0 100 100'
  }
};

export const Variants = () => (
  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <AnimatedPath 
        d={paths.wave} 
        variant="solid" 
        width={100} 
        height={100} 
        viewBox="0 0 100 100" 
      />
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ink-subtle)' }}>Solid</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <AnimatedPath 
        d={paths.wave} 
        variant="dashed" 
        width={100} 
        height={100} 
        viewBox="0 0 100 100" 
      />
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ink-subtle)' }}>Dashed</div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <AnimatedPath 
        d={paths.wave} 
        variant="dotted" 
        width={100} 
        height={100} 
        viewBox="0 0 100 100" 
      />
      <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ink-subtle)' }}>Dotted</div>
    </div>
  </div>
);

export const Icons = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '400px' }}>
    {Object.entries(paths).map(([name, path]) => (
      <div key={name} style={{ textAlign: 'center' }}>
        <AnimatedPath 
          d={path} 
          animated 
          interactive 
          width={60} 
          height={60} 
          viewBox="0 0 100 100" 
        />
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ink-subtle)', textTransform: 'capitalize' }}>
          {name}
        </div>
      </div>
    ))}
  </div>
);

export const CustomColors = () => (
  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
    <AnimatedPath 
      d={paths.checkmark} 
      stroke="var(--ink)" 
      strokeWidth={3} 
      animated 
      width={80} 
      height={80} 
      viewBox="0 0 100 100" 
    />
    <AnimatedPath 
      d={paths.arrow} 
      stroke="var(--ink-muted)" 
      strokeWidth={2} 
      animated 
      width={80} 
      height={80} 
      viewBox="0 0 100 100" 
    />
    <AnimatedPath 
      d={paths.star} 
      stroke="var(--ink-subtle)" 
      strokeWidth={1} 
      animated 
      width={80} 
      height={80} 
      viewBox="0 0 100 100" 
    />
  </div>
);

// Dark theme variant
export const DarkTheme = {
  args: {
    d: paths.star,
    animated: true,
    interactive: true,
    width: 100,
    height: 100,
    viewBox: '0 0 100 100'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
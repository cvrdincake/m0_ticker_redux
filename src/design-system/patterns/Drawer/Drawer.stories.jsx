import { useState } from 'react';
import Drawer from './Drawer';

export default {
  title: 'Patterns/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Drawer component for slide-in panels with focus management and accessibility features.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the drawer is open'
    },
    position: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Drawer position'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'full'],
      description: 'Drawer size'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'push', 'overlay'],
      description: 'Drawer variant'
    },
    overlay: {
      control: 'boolean',
      description: 'Show overlay backdrop'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close drawer when clicking overlay'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close drawer when pressing escape'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button in header'
    }
  }
};

// Sample content for stories
const SampleContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <p style={{ margin: 0, color: 'var(--ink)' }}>
      This is sample drawer content. You can add any components here.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button
        style={{
          padding: '8px 16px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: 'var(--surface)',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        Action Item 1
      </button>
      <button
        style={{
          padding: '8px 16px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: 'var(--surface)',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        Action Item 2
      </button>
      <button
        style={{
          padding: '8px 16px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: 'var(--surface)',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        Action Item 3
      </button>
    </div>
  </div>
);

// Story wrapper that manages drawer state
const DrawerWrapper = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          background: 'var(--ink)',
          color: 'var(--surface)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Open Drawer
      </button>
      
      <Drawer
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export const Default = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Default Drawer',
    children: <SampleContent />
  }
};

export const Positions = () => {
  const [openDrawer, setOpenDrawer] = useState(null);
  const positions = ['left', 'right', 'top', 'bottom'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px' }}>
      {positions.map(position => (
        <button
          key={position}
          onClick={() => setOpenDrawer(position)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            cursor: 'pointer',
            textTransform: 'capitalize'
          }}
        >
          {position}
        </button>
      ))}
      
      {positions.map(position => (
        <Drawer
          key={position}
          isOpen={openDrawer === position}
          onClose={() => setOpenDrawer(null)}
          position={position}
          title={`${position.charAt(0).toUpperCase() + position.slice(1)} Drawer`}
        >
          <div>
            <p>This drawer slides in from the {position}.</p>
            <SampleContent />
          </div>
        </Drawer>
      ))}
    </div>
  );
};

export const Sizes = () => {
  const [openDrawer, setOpenDrawer] = useState(null);
  const sizes = ['small', 'medium', 'large', 'full'];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => setOpenDrawer(size)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            cursor: 'pointer',
            textTransform: 'capitalize'
          }}
        >
          {size}
        </button>
      ))}
      
      {sizes.map(size => (
        <Drawer
          key={size}
          isOpen={openDrawer === size}
          onClose={() => setOpenDrawer(null)}
          size={size}
          title={`${size.charAt(0).toUpperCase() + size.slice(1)} Drawer`}
        >
          <div>
            <p>This is a {size} sized drawer.</p>
            <SampleContent />
          </div>
        </Drawer>
      ))}
    </div>
  );
};

export const Navigation = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Navigation',
    position: 'left',
    children: (
      <nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Dashboard', icon: '📊' },
            { label: 'Projects', icon: '📁' },
            { label: 'Team', icon: '👥' },
            { label: 'Settings', icon: '⚙️' },
            { label: 'Help', icon: '❓' }
          ].map(item => (
            <a
              key={item.label}
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                textDecoration: 'none',
                color: 'var(--ink)',
                borderRadius: '6px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--surface-hovered)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    )
  }
};

export const FilterPanel = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Filters',
    position: 'right',
    size: 'medium',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Category
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['All', 'Design', 'Development', 'Marketing', 'Sales'].map(category => (
              <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name="category" defaultChecked={category === 'All'} />
                <span style={{ fontSize: '14px' }}>{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Status
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Active', 'Completed', 'Pending', 'Cancelled'].map(status => (
              <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" />
                <span style={{ fontSize: '14px' }}>{status}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Date Range
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="date"
              style={{
                padding: '8px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <input
              type="date"
              style={{
                padding: '8px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            style={{
              flex: 1,
              padding: '8px 16px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              background: 'var(--surface)',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: 'var(--ink)',
              color: 'var(--surface)',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
      </div>
    )
  }
};

export const NotificationPanel = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Notifications',
    position: 'top',
    size: 'medium',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { title: 'New message received', time: '2 minutes ago', unread: true },
          { title: 'Task assigned to you', time: '15 minutes ago', unread: true },
          { title: 'Meeting reminder', time: '1 hour ago', unread: false },
          { title: 'Project deadline approaching', time: '2 hours ago', unread: false }
        ].map((notification, index) => (
          <div
            key={index}
            style={{
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: notification.unread ? 'var(--surface-raised)' : 'var(--surface)',
              borderLeft: notification.unread ? '3px solid var(--ink)' : '3px solid transparent'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              {notification.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              {notification.time}
            </div>
          </div>
        ))}
        
        <button
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Mark all as read
        </button>
      </div>
    )
  }
};

export const WithoutOverlay = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'No Overlay',
    overlay: false,
    children: (
      <div>
        <p>This drawer has no overlay backdrop.</p>
        <SampleContent />
      </div>
    )
  }
};

export const NonDismissible = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Non-dismissible Drawer',
    closeOnOverlayClick: false,
    closeOnEscape: false,
    children: (
      <div>
        <p style={{ color: 'var(--ink)', marginBottom: '16px' }}>
          This drawer can only be closed using the close button.
        </p>
        <SampleContent />
      </div>
    )
  }
};

export const PushVariant = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Push Drawer',
    variant: 'push',
    overlay: false,
    children: (
      <div>
        <p>This drawer uses the push variant with no overlay.</p>
        <SampleContent />
      </div>
    )
  }
};

export const FullSizeDrawer = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Full Size Drawer',
    size: 'full',
    children: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p>This drawer takes up the full width/height.</p>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SampleContent />
          <div style={{ padding: '16px', background: 'var(--surface-raised)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Additional Content</h4>
            <p style={{ margin: 0, color: 'var(--ink-muted)' }}>
              Full size drawers are useful for complex interfaces or detailed content.
            </p>
          </div>
        </div>
      </div>
    )
  }
};

export const NestedDrawers = () => {
  const [firstDrawer, setFirstDrawer] = useState(false);
  const [secondDrawer, setSecondDrawer] = useState(false);

  return (
    <div>
      <button
        onClick={() => setFirstDrawer(true)}
        style={{
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          background: 'var(--ink)',
          color: 'var(--surface)',
          cursor: 'pointer'
        }}
      >
        Open First Drawer
      </button>
      
      <Drawer
        isOpen={firstDrawer}
        onClose={() => setFirstDrawer(false)}
        title="First Drawer"
        position="right"
      >
        <div>
          <p>This is the first drawer.</p>
          <button
            onClick={() => setSecondDrawer(true)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: 'var(--ink)',
              color: 'var(--surface)',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Open Second Drawer
          </button>
        </div>
      </Drawer>
      
      <Drawer
        isOpen={secondDrawer}
        onClose={() => setSecondDrawer(false)}
        title="Second Drawer"
        position="left"
        size="small"
      >
        <div>
          <p>This is a nested drawer!</p>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
            Focus management and keyboard navigation still work correctly.
          </p>
        </div>
      </Drawer>
    </div>
  );
};

// Dark theme story
export const DarkTheme = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    title: 'Dark Theme Drawer',
    children: <SampleContent />
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
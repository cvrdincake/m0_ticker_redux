import { useState } from 'react';
import Modal from './Modal';

export default {
  title: 'Patterns/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal component with focus management, accessibility features, and portal rendering.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large', 'full'],
      description: 'Modal size'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'centered', 'sidebar'],
      description: 'Modal variant'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close modal when clicking overlay'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close modal when pressing escape'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button in header'
    }
  }
};

// Sample content for stories
const SampleContent = () => (
  <div>
    <p style={{ margin: '0 0 16px 0', color: 'var(--ink)' }}>
      This is a sample modal with some content. You can interact with the elements below:
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input 
        type="text" 
        placeholder="Enter your name"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      <textarea 
        placeholder="Enter a message"
        rows={3}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '14px',
          resize: 'vertical'
        }}
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            background: 'var(--ink)',
            color: 'var(--surface)',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);

// Story wrapper that manages modal state
const ModalWrapper = (args) => {
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
        Open Modal
      </button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export const Default = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Default Modal',
    children: <SampleContent />
  }
};

export const Sizes = () => {
  const [openModal, setOpenModal] = useState(null);
  const sizes = ['small', 'medium', 'large', 'extra-large'];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => setOpenModal(size)}
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
        <Modal
          key={size}
          isOpen={openModal === size}
          onClose={() => setOpenModal(null)}
          size={size}
          title={`${size.charAt(0).toUpperCase() + size.slice(1)} Modal`}
        >
          <div>
            <p>This is a {size} sized modal.</p>
            <SampleContent />
          </div>
        </Modal>
      ))}
    </div>
  );
};

export const WithoutTitle = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    children: (
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Custom Header
        </h3>
        <SampleContent />
      </div>
    )
  }
};

export const NoCloseButton = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Modal without Close Button',
    showCloseButton: false,
    children: (
      <div>
        <p>This modal doesn&apos;t have a close button in the header.</p>
        <p>You can still close it by clicking the overlay or pressing Escape.</p>
        <SampleContent />
      </div>
    )
  }
};

export const NonDismissible = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Non-dismissible Modal',
    closeOnOverlayClick: false,
    closeOnEscape: false,
    children: (
      <div>
        <p style={{ color: 'var(--ink)', marginBottom: '16px' }}>
          This modal can only be closed using the close button or by clicking Cancel below.
        </p>
        <SampleContent />
      </div>
    )
  }
};

export const SidebarVariant = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Sidebar Modal',
    variant: 'sidebar',
    children: (
      <div>
        <p>This modal appears as a sidebar from the right side.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {['Home', 'About', 'Services', 'Contact'].map(item => (
            <a
              key={item}
              href="#"
              style={{
                padding: '12px',
                textDecoration: 'none',
                color: 'var(--ink)',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                display: 'block'
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    )
  }
};

export const FullScreen = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Full Screen Modal',
    size: 'full',
    children: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <p>This modal takes up the full screen.</p>
        <div style={{ flex: 1, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SampleContent />
          <div style={{ padding: '16px', background: 'var(--surface-raised)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Additional Content</h4>
            <p style={{ margin: 0, color: 'var(--ink-muted)' }}>
              Full screen modals are useful for complex forms or detailed content.
            </p>
          </div>
        </div>
      </div>
    )
  }
};

export const FormModal = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Contact Form',
    size: 'medium',
    children: (
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                First Name
              </label>
              <input
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                Last Name
              </label>
              <input
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              Message
            </label>
            <textarea
              required
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              style={{
                padding: '10px 20px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                background: 'var(--ink)',
                color: 'var(--surface)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </form>
    )
  }
};

export const ConfirmationModal = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Confirm Delete',
    size: 'small',
    children: (
      <div>
        <p style={{ margin: '0 0 20px 0', color: 'var(--ink)' }}>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            style={{
              padding: '8px 16px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              background: 'var(--surface)',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#dc2626',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }
};

export const NestedModals = () => {
  const [firstModal, setFirstModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setFirstModal(true)}
        style={{
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          background: 'var(--ink)',
          color: 'var(--surface)',
          cursor: 'pointer'
        }}
      >
        Open First Modal
      </button>
      
      <Modal
        isOpen={firstModal}
        onClose={() => setFirstModal(false)}
        title="First Modal"
      >
        <div>
          <p>This is the first modal.</p>
          <button
            onClick={() => setSecondModal(true)}
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
            Open Second Modal
          </button>
        </div>
      </Modal>
      
      <Modal
        isOpen={secondModal}
        onClose={() => setSecondModal(false)}
        title="Second Modal"
        size="small"
      >
        <div>
          <p>This is a nested modal!</p>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
            Focus management and keyboard navigation still work correctly.
          </p>
        </div>
      </Modal>
    </div>
  );
};

// Dark theme story
export const DarkTheme = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Dark Theme Modal',
    children: <SampleContent />
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};
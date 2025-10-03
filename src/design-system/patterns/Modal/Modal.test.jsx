import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false)
}));

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    // Create modal root for portals
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up modal root
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
    
    // Reset body overflow
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Modal {...defaultProps} title="Test Modal" />);
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('renders close button by default', () => {
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      
      expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(
        <Modal 
          {...defaultProps} 
          size="large" 
          variant="centered"
          className="custom-modal"
          overlayClassName="custom-overlay"
          contentClassName="custom-content"
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('modal');
      expect(dialog.className).toContain('size-large');
      expect(dialog.className).toContain('variant-centered');
      expect(dialog).toHaveClass('custom-modal');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Modal {...defaultProps} title="Test Modal" />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('tabIndex', '-1');
    });

    it('focuses modal on open', async () => {
      render(<Modal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveFocus();
      });
    });

    it('focuses initial focus element when provided', async () => {
      render(
        <Modal {...defaultProps} initialFocus="[data-testid='focus-target']">
          <button data-testid="focus-target">Focus me</button>
          <button>Other button</button>
        </Modal>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('focus-target')).toHaveFocus();
      });
    });

    it('restores focus when closed', async () => {
      const triggerButton = document.createElement('button');
      triggerButton.textContent = 'Open Modal';
      document.body.appendChild(triggerButton);
      triggerButton.focus();
      
      const { rerender } = render(<Modal {...defaultProps} />);
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      await waitFor(() => {
        expect(triggerButton).toHaveFocus();
      });
      
      document.body.removeChild(triggerButton);
    });

    it('traps focus within modal', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal {...defaultProps}>
          <button data-testid="first-button">First</button>
          <button data-testid="second-button">Second</button>
        </Modal>
      );
      
      const firstButton = screen.getByTestId('first-button');
      const secondButton = screen.getByTestId('second-button');
      
      await waitFor(() => {
        expect(firstButton).toHaveFocus();
      });
      
      await user.tab();
      expect(secondButton).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /close modal/i })).toHaveFocus();
      
      await user.tab();
      expect(firstButton).toHaveFocus();
    });

    it('handles reverse tab navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal {...defaultProps}>
          <button data-testid="first-button">First</button>
          <button data-testid="second-button">Second</button>
        </Modal>
      );
      
      const firstButton = screen.getByTestId('first-button');
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      
      await waitFor(() => {
        expect(firstButton).toHaveFocus();
      });
      
      await user.tab({ shift: true });
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Interaction', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      await user.click(screen.getByRole('button', { name: /close modal/i }));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      const overlay = screen.getByRole('presentation');
      await user.click(overlay);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      await user.click(screen.getByRole('dialog'));
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose on overlay click when closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
      
      const overlay = screen.getByRole('presentation');
      await user.click(overlay);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} />);
      
      await user.keyboard('{Escape}');
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
      
      await user.keyboard('{Escape}');
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Management', () => {
    it('prevents body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      // Cleanup in afterEach will restore overflow
    });

    it('restores body scroll when modal is closed', () => {
      document.body.style.overflow = 'auto';
      
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  describe('Reduced Motion', () => {
    it('applies reduced motion class when preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(true);
      
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toHaveClass('reducedMotion');
    });

    it('does not apply reduced motion class when not preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(false);
      
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).not.toHaveClass('reducedMotion');
    });
  });

  describe('Props and Configuration', () => {
    it('supports different sizes', () => {
      const sizes = ['small', 'medium', 'large', 'extra-large', 'full'];
      
      sizes.forEach(size => {
        const { unmount } = render(<Modal {...defaultProps} size={size} />);
        expect(screen.getByRole('dialog').className).toContain(`size-${size}`);
        unmount();
      });
    });

    it('supports different variants', () => {
      const variants = ['centered', 'sidebar'];
      
      variants.forEach(variant => {
        const { unmount } = render(<Modal {...defaultProps} variant={variant} />);
        expect(screen.getByRole('dialog').className).toContain(`variant-${variant}`);
        unmount();
      });
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      
      render(<Modal {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'dialog');
    });

    it('spreads additional props to modal element', () => {
      render(
        <Modal 
          {...defaultProps} 
          data-testid="modal-element"
          aria-describedby="modal-description"
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('data-testid', 'modal-element');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    });
  });

  describe('Portal Rendering', () => {
    it('renders in modal-root when available', () => {
      render(<Modal {...defaultProps} />);
      
      const modalRoot = document.getElementById('modal-root');
      expect(modalRoot).toContainElement(screen.getByRole('dialog'));
    });

    it('renders in document.body when modal-root is not available', () => {
      // Remove modal-root
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
      
      render(<Modal {...defaultProps} />);
      
      expect(document.body).toContainElement(screen.getByRole('dialog'));
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onClose prop', () => {
      render(<Modal {...defaultProps} onClose={undefined} />);
      
      // Should not throw when clicking close button
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
      }).not.toThrow();
    });

    it('handles empty children', () => {
      render(<Modal {...defaultProps}>{null}</Modal>);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles complex children', () => {
      render(
        <Modal {...defaultProps}>
          <div>
            <h2>Complex Content</h2>
            <form>
              <input type="text" placeholder="Name" />
              <button type="submit">Submit</button>
            </form>
          </div>
        </Modal>
      );
      
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });
});
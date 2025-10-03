import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Drawer from './Drawer';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false)
}));

describe('Drawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Drawer content</div>
  };

  beforeEach(() => {
    // Create drawer root for portals
    const drawerRoot = document.createElement('div');
    drawerRoot.id = 'drawer-root';
    document.body.appendChild(drawerRoot);
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up drawer root
    const drawerRoot = document.getElementById('drawer-root');
    if (drawerRoot) {
      document.body.removeChild(drawerRoot);
    }
    
    // Reset body overflow
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<Drawer {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<Drawer {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(<Drawer {...defaultProps} title="Test Drawer" />);
      
      expect(screen.getByText('Test Drawer')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'drawer-title');
    });

    it('renders close button by default', () => {
      render(<Drawer {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Drawer {...defaultProps} showCloseButton={false} />);
      
      expect(screen.queryByRole('button', { name: /close drawer/i })).not.toBeInTheDocument();
    });

    it('renders overlay by default', () => {
      render(<Drawer {...defaultProps} />);
      
      expect(document.querySelector('[role="presentation"]')).toBeInTheDocument();
    });

    it('hides overlay when overlay prop is false', () => {
      const { container } = render(<Drawer {...defaultProps} overlay={false} />);
      
      expect(container.querySelector('[role="presentation"]')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(
        <Drawer 
          {...defaultProps} 
          position="left"
          size="large" 
          variant="push"
          className="custom-drawer"
          overlayClassName="custom-overlay"
          contentClassName="custom-content"
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('drawer');
      expect(dialog.className).toContain('position-left');
      expect(dialog.className).toContain('size-large');
      expect(dialog).toHaveClass('variant-push');
      expect(dialog).toHaveClass('custom-drawer');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Drawer {...defaultProps} title="Test Drawer" />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'drawer-title');
      expect(dialog).toHaveAttribute('tabIndex', '-1');
    });

    it('focuses drawer on open', async () => {
      render(<Drawer {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveFocus();
      });
    });

    it('focuses initial focus element when provided', async () => {
      render(
        <Drawer {...defaultProps} initialFocus="[data-testid='focus-target']">
          <button data-testid="focus-target">Focus me</button>
          <button>Other button</button>
        </Drawer>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('focus-target')).toHaveFocus();
      });
    });

    it('restores focus when closed', async () => {
      const triggerButton = document.createElement('button');
      triggerButton.textContent = 'Open Drawer';
      document.body.appendChild(triggerButton);
      triggerButton.focus();
      
      const { rerender } = render(<Drawer {...defaultProps} />);
      
      rerender(<Drawer {...defaultProps} isOpen={false} />);
      
      await waitFor(() => {
        expect(triggerButton).toHaveFocus();
      });
      
      document.body.removeChild(triggerButton);
    });

    it('traps focus within drawer', async () => {
      const user = userEvent.setup();
      
      render(
        <Drawer {...defaultProps}>
          <button data-testid="first-button">First</button>
          <button data-testid="second-button">Second</button>
        </Drawer>
      );
      
      const firstButton = screen.getByTestId('first-button');
      const secondButton = screen.getByTestId('second-button');
      
      await waitFor(() => {
        expect(firstButton).toHaveFocus();
      });
      
      await user.tab();
      expect(secondButton).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /close drawer/i })).toHaveFocus();
      
      await user.tab();
      expect(firstButton).toHaveFocus();
    });

    it('handles reverse tab navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Drawer {...defaultProps}>
          <button data-testid="first-button">First</button>
          <button data-testid="second-button">Second</button>
        </Drawer>
      );
      
      const firstButton = screen.getByTestId('first-button');
      const closeButton = screen.getByRole('button', { name: /close drawer/i });
      
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
      
      render(<Drawer {...defaultProps} onClose={onClose} />);
      
      await user.click(screen.getByRole('button', { name: /close drawer/i }));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Drawer {...defaultProps} onClose={onClose} />);
      
      const overlay = screen.getByRole('presentation');
      await user.click(overlay);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when drawer content is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Drawer {...defaultProps} onClose={onClose} />);
      
      await user.click(screen.getByRole('dialog'));
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose on overlay click when closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Drawer {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
      
      const overlay = screen.getByRole('presentation');
      await user.click(overlay);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Drawer {...defaultProps} onClose={onClose} />);
      
      await user.keyboard('{Escape}');
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(<Drawer {...defaultProps} onClose={onClose} closeOnEscape={false} />);
      
      await user.keyboard('{Escape}');
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Management', () => {
    it('prevents body scroll when drawer is open', () => {
      render(<Drawer {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when drawer is closed', () => {
      document.body.style.overflow = 'auto';
      
      const { rerender } = render(<Drawer {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Drawer {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  describe('Reduced Motion', () => {
    it('applies reduced motion class when preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(true);
      
      render(<Drawer {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toHaveClass('reducedMotion');
    });

    it('does not apply reduced motion class when not preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(false);
      
      render(<Drawer {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).not.toHaveClass('reducedMotion');
    });
  });

  describe('Position and Size Variants', () => {
    it('supports different positions', () => {
      const positions = ['left', 'right', 'top', 'bottom'];
      
      positions.forEach(position => {
        const { unmount } = render(<Drawer {...defaultProps} position={position} />);
        expect(screen.getByRole('dialog').className).toContain(`position-${position}`);
        unmount();
      });
    });

    it('supports different sizes', () => {
      const sizes = ['small', 'medium', 'large', 'full'];
      
      sizes.forEach(size => {
        const { unmount } = render(<Drawer {...defaultProps} size={size} />);
        expect(screen.getByRole('dialog').className).toContain(`size-${size}`);
        unmount();
      });
    });

    it('supports different variants', () => {
      const variants = ['push', 'overlay'];
      
      variants.forEach(variant => {
        const { unmount } = render(<Drawer {...defaultProps} variant={variant} />);
        expect(screen.getByRole('dialog').className).toContain(`variant-${variant}`);
        unmount();
      });
    });
  });

  describe('Props and Configuration', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      
      render(<Drawer {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'dialog');
    });

    it('spreads additional props to drawer element', () => {
      render(
        <Drawer 
          {...defaultProps} 
          data-testid="drawer-element"
          aria-describedby="drawer-description"
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('data-testid', 'drawer-element');
      expect(dialog).toHaveAttribute('aria-describedby', 'drawer-description');
    });
  });

  describe('Portal Rendering', () => {
    it('renders in drawer-root when available', () => {
      render(<Drawer {...defaultProps} />);
      
      const drawerRoot = document.getElementById('drawer-root');
      expect(drawerRoot).toContainElement(screen.getByRole('dialog'));
    });

    it('renders in document.body when drawer-root is not available', () => {
      // Remove drawer-root
      const drawerRoot = document.getElementById('drawer-root');
      if (drawerRoot) {
        document.body.removeChild(drawerRoot);
      }
      
      render(<Drawer {...defaultProps} />);
      
      expect(document.body).toContainElement(screen.getByRole('dialog'));
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onClose prop', () => {
      render(<Drawer {...defaultProps} onClose={undefined} />);
      
      // Should not throw when clicking close button
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /close drawer/i }));
      }).not.toThrow();
    });

    it('handles empty children', () => {
      render(<Drawer {...defaultProps}>{null}</Drawer>);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles complex children', () => {
      render(
        <Drawer {...defaultProps}>
          <div>
            <h2>Complex Content</h2>
            <nav>
              <a href="/home">Home</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </Drawer>
      );
      
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    });

    it('handles drawer without title', () => {
      render(<Drawer {...defaultProps} title={undefined} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
      expect(screen.queryByText('drawer-title')).not.toBeInTheDocument();
    });

    it('handles drawer with custom initial focus', async () => {
      const ref = { current: null };
      
      render(
        <Drawer {...defaultProps} initialFocus={ref}>
          <button>First button</button>
          <button ref={ref}>Second button (should be focused)</button>
        </Drawer>
      );
      
      await waitFor(() => {
        expect(ref.current).toHaveFocus();
      });
    });
  });
});
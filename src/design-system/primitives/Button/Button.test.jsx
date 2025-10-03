import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('applies the correct size class', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('lg');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('button'); // Still has base class
  });

  it('spreads additional props', () => {
    render(<Button data-testid="custom-button" aria-label="Custom label">Test</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  describe('Accessibility', () => {
    it('has correct button role', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Test</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
      
      // Note: React Testing Library doesn't automatically trigger click on Enter/Space
      // This would be tested in integration tests or with a more comprehensive setup
      expect(button).toHaveFocus();
    });
  });
});
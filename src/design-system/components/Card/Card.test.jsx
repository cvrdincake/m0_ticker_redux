import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>);
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('handles click events when interactive', () => {
    const handleClick = vi.fn();
    render(
      <Card interactive onClick={handleClick}>
        Clickable card
      </Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation when interactive', () => {
    const handleClick = vi.fn();
    render(
      <Card interactive onClick={handleClick}>
        Keyboard accessible card
      </Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('shows loading state with skeleton', () => {
    render(<Card loading>Original content</Card>);
    
    expect(screen.queryByText('Original content')).not.toBeInTheDocument();
    expect(document.querySelector('[class*="skeleton"]')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container, rerender } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass(/card--elevated/);
    
    rerender(<Card variant="outlined">Content</Card>);
    expect(container.firstChild).toHaveClass(/card--outlined/);
  });

  it('renders sub-components correctly', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
        <Card.Content>Main content</Card.Content>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    );
    
    expect(screen.getByText('Header content')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Card</Card>);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});
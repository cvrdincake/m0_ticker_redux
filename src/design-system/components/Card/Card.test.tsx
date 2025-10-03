import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  test('renders basic card', () => {
    render(
      <Card>
        <Card.Header>Test Header</Card.Header>
        <Card.Content>Test Content</Card.Content>
      </Card>
    );
    
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies interactive styles when interactive prop is true', () => {
    render(
      <Card interactive onClick={() => {}}>
        Test Card
      </Card>
    );
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('card--interactive');
  });

  test('handles keyboard navigation', () => {
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick}>
        Test Card
      </Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  test('shows loading skeleton when loading', () => {
    render(<Card loading>Content</Card>);
    
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('applies reduced motion styles', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <Card interactive>
        Reduced Motion Card
      </Card>
    );
    
    const card = screen.getByText('Reduced Motion Card').closest('.card');
    
    // Hover should add 2px border instead of transform
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle('border: 2px solid var(--border-strong)');
  });

  test('applies hover shadow and lift on non-reduced motion', () => {
    // Mock no reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <Card interactive>
        Normal Motion Card
      </Card>
    );
    
    const card = screen.getByText('Normal Motion Card').closest('.card');
    
    // Should have transform and shadow on hover
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle('transform: translateY(-2px)');
    expect(card).toHaveStyle('box-shadow: var(--shadow-md)');
  });
});
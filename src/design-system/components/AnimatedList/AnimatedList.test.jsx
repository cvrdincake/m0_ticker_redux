import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnimatedList from './AnimatedList';

// Mock GSAP and hooks
vi.mock('@/lib/motionGuard', () => ({
  gsap: {
    fromTo: vi.fn(),
    set: vi.fn()
  }
}));

vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false)
}));

describe('AnimatedList', () => {
  const mockItems = [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with items prop', () => {
      render(<AnimatedList items={mockItems} />);
      
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders with children prop', () => {
      render(
        <AnimatedList>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </AnimatedList>
      );
      
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      const { container } = render(
        <AnimatedList 
          items={mockItems} 
          direction="horizontal"
          className="custom-class"
        />
      );
      
      const list = container.querySelector('ul');
      expect(list.className).toContain('animatedList');
      expect(list.className).toContain('direction-horizontal');
      expect(list).toHaveClass('custom-class');
    });

    it('renders list items with correct classes', () => {
      const { container } = render(<AnimatedList items={mockItems} />);
      
      const listItems = container.querySelectorAll('li');
      listItems.forEach(item => {
        expect(item.className).toContain('listItem');
      });
    });
  });

  describe('Animation Behavior', () => {
    it('calls GSAP animation on mount', () => {
      const { gsap } = require('@/lib/motionGuard');
      
      render(<AnimatedList items={mockItems} />);
      
      expect(gsap.fromTo).toHaveBeenCalled();
    });

    it('respects visibleLimit parameter', () => {
      const { gsap } = require('@/lib/motionGuard');
      const manyItems = Array.from({ length: 10 }, (_, i) => ({ 
        id: i, 
        content: `Item ${i}` 
      }));
      
      render(<AnimatedList items={manyItems} visibleLimit={3} />);
      
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object),
        expect.objectContaining({
          stagger: 0.04,
          duration: 0.2,
          ease: 'power2.out'
        })
      );
      
      expect(gsap.set).toHaveBeenCalled();
    });

    it('applies different animation types', () => {
      const { gsap } = require('@/lib/motionGuard');
      
      render(<AnimatedList items={mockItems} animation="fade-right" />);
      
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({ opacity: 0, x: -8 }),
        expect.any(Object)
      );
    });

    it('uses custom stagger delay', () => {
      const { gsap } = require('@/lib/motionGuard');
      
      render(<AnimatedList items={mockItems} stagger={0.1} />);
      
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Object),
        expect.objectContaining({ stagger: 0.1 })
      );
    });
  });

  describe('Reduced Motion', () => {
    it('skips animation when reduced motion is preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      const { gsap } = require('@/lib/motionGuard');
      
      useReducedMotion.mockReturnValue(true);
      
      const { container } = render(<AnimatedList items={mockItems} />);
      
      expect(gsap.fromTo).not.toHaveBeenCalled();
      expect(container.querySelector('ul')).toHaveClass('reducedMotion');
    });

    it('applies reduced motion class when preferred', () => {
      const { useReducedMotion } = require('@/hooks');
      useReducedMotion.mockReturnValue(true);
      
      const { container } = render(<AnimatedList items={mockItems} />);
      
      expect(container.querySelector('ul')).toHaveClass('reducedMotion');
    });
  });

  describe('Props and Configuration', () => {
    it('supports different directions', () => {
      const { container } = render(
        <AnimatedList items={mockItems} direction="horizontal" />
      );
      
      expect(container.querySelector('ul').className).toContain('direction-horizontal');
    });

    it('handles empty items array', () => {
      render(<AnimatedList items={[]} />);
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });

    it('handles items without id property', () => {
      const itemsWithoutId = ['Item 1', 'Item 2', 'Item 3'];
      
      render(<AnimatedList items={itemsWithoutId} />);
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      
      render(<AnimatedList ref={ref} items={mockItems} />);
      
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });

    it('spreads additional props to list element', () => {
      const { container } = render(
        <AnimatedList 
          items={mockItems} 
          data-testid="animated-list"
          aria-label="Test list"
        />
      );
      
      const list = container.querySelector('ul');
      expect(list).toHaveAttribute('data-testid', 'animated-list');
      expect(list).toHaveAttribute('aria-label', 'Test list');
    });
  });

  describe('Animation Types', () => {
    const animationTypes = [
      'fade-up', 'fade-down', 'fade-left', 'fade-right', 
      'scale', 'slide-up', 'slide-down'
    ];

    animationTypes.forEach(animation => {
      it(`handles ${animation} animation type`, () => {
        const { gsap } = require('@/lib/motionGuard');
        
        render(<AnimatedList items={mockItems} animation={animation} />);
        
        expect(gsap.fromTo).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles single item', () => {
      const singleItem = [{ id: 1, content: 'Single Item' }];
      
      render(<AnimatedList items={singleItem} />);
      
      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });

    it('handles complex item content', () => {
      const complexItems = [
        { 
          id: 1, 
          content: (
            <div>
              <h3>Title</h3>
              <p>Description</p>
            </div>
          ) 
        }
      ];
      
      render(<AnimatedList items={complexItems} />);
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('handles items without content property', () => {
      const simpleItems = [
        { id: 1, text: 'Text 1' },
        { id: 2, text: 'Text 2' }
      ];
      
      render(<AnimatedList items={simpleItems} />);
      
      // Should render the object itself when no content property
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
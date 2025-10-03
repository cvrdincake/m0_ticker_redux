import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimatedPath from './AnimatedPath';

describe('AnimatedPath', () => {
  it('renders SVG path', () => {
    const path = 'M 10 10 L 90 90';
    render(<AnimatedPath d={path} />);
    
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();
    
    const pathElement = svgElement.querySelector('path');
    expect(pathElement).toHaveAttribute('d', path);
  });

  it('applies animation class when animated prop is true', () => {
    const path = 'M 10 10 L 90 90';
    render(<AnimatedPath d={path} animated />);
    
    const pathElement = screen.getByRole('img', { hidden: true }).querySelector('path');
    expect(pathElement).toHaveClass(/path--animated/);
  });

  it('applies interactive class when interactive prop is true', () => {
    const path = 'M 10 10 L 90 90';
    render(<AnimatedPath d={path} interactive />);
    
    const pathElement = screen.getByRole('img', { hidden: true }).querySelector('path');
    expect(pathElement).toHaveClass(/path--interactive/);
  });

  it('applies style variants', () => {
    const path = 'M 10 10 L 90 90';
    const { rerender } = render(<AnimatedPath d={path} variant="dashed" />);
    
    let pathElement = screen.getByRole('img', { hidden: true }).querySelector('path');
    expect(pathElement).toHaveClass(/path--dashed/);
    
    rerender(<AnimatedPath d={path} variant="dotted" />);
    pathElement = screen.getByRole('img', { hidden: true }).querySelector('path');
    expect(pathElement).toHaveClass(/path--dotted/);
  });

  it('sets custom viewBox and dimensions', () => {
    const path = 'M 10 10 L 90 90';
    render(
      <AnimatedPath 
        d={path} 
        width={200} 
        height={100} 
        viewBox="0 0 200 100" 
      />
    );
    
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toHaveAttribute('width', '200');
    expect(svgElement).toHaveAttribute('height', '100');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 200 100');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    const path = 'M 10 10 L 90 90';
    render(<AnimatedPath ref={ref} d={path} />);
    
    expect(ref).toHaveBeenCalledWith(expect.any(SVGSVGElement));
  });

  it('handles custom stroke properties', () => {
    const path = 'M 10 10 L 90 90';
    render(
      <AnimatedPath 
        d={path} 
        stroke="#ff0000" 
        strokeWidth={4}
      />
    );
    
    const pathElement = screen.getByRole('img', { hidden: true }).querySelector('path');
    expect(pathElement).toHaveAttribute('stroke', '#ff0000');
    expect(pathElement).toHaveAttribute('stroke-width', '4');
  });
});
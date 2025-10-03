import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with label', () => {
    render(<Input label="Username" id="username" />);
    
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  it('shows hint text', () => {
    render(<Input hint="Enter your username" id="username" />);
    
    const hint = screen.getByText('Enter your username');
    const input = screen.getByRole('textbox');
    
    expect(hint).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'username-hint');
  });

  it('shows error state', () => {
    render(<Input error="Username is required" id="username" />);
    
    const error = screen.getByRole('alert');
    const input = screen.getByRole('textbox');
    
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('Username is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'username-error');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass(/input--sm/);
    
    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass(/input--lg/);
  });

  it('disables interaction when disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});
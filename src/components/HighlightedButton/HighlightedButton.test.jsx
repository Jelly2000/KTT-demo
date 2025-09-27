import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HighlightedButton from './HighlightedButton';

describe('HighlightedButton Component', () => {
  it('renders button with children text', () => {
    render(<HighlightedButton>Click me</HighlightedButton>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies custom className to wrapper div', () => {
    const { container } = render(
      <HighlightedButton className="custom-wrapper">
        Test Button
      </HighlightedButton>
    );
    
    expect(container.firstChild).toHaveClass('custom-wrapper');
  });

  it('applies cta-button class to button element', () => {
    render(<HighlightedButton>Test</HighlightedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cta-button');
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    
    render(
      <HighlightedButton onClick={mockOnClick}>
        Clickable Button
      </HighlightedButton>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders without onClick handler', () => {
    render(<HighlightedButton>No Handler</HighlightedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Should not throw error when clicked
    fireEvent.click(button);
  });

  it('renders with complex children content', () => {
    render(
      <HighlightedButton>
        <span>Icon</span> Button Text
      </HighlightedButton>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Button Text')).toBeInTheDocument();
  });

  it('renders without className prop', () => {
    const { container } = render(<HighlightedButton>Test</HighlightedButton>);
    
    // Should render div wrapper without throwing error
    expect(container.firstChild.tagName).toBe('DIV');
  });
});
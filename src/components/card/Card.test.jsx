import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';

describe('Card Component', () => {
  const defaultProps = {
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    content: 'Test content goes here',
    uiContext: 'test'
  };

  it('renders card with all props', () => {
    const icon = <span data-testid="card-icon">📍</span>;
    
    render(
      <Card
        {...defaultProps}
        icon={icon}
      />
    );
    
    expect(screen.getByText('TEST HEADING')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    expect(screen.getByText('Test content goes here')).toBeInTheDocument();
    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
  });

  it('renders card without icon', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.getByText('TEST HEADING')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    expect(screen.getByText('Test content goes here')).toBeInTheDocument();
    expect(screen.queryByTestId('card-icon')).not.toBeInTheDocument();
  });

  it('applies correct CSS class based on uiContext', () => {
    const { container } = render(<Card {...defaultProps} uiContext="procedure" />);
    
    expect(container.firstChild).toHaveClass('procedure-card');
  });

  it('converts heading to uppercase', () => {
    render(<Card {...defaultProps} heading="lowercase heading" />);
    
    expect(screen.getByText('LOWERCASE HEADING')).toBeInTheDocument();
    expect(screen.queryByText('lowercase heading')).not.toBeInTheDocument();
  });

  it('handles empty heading gracefully', () => {
    render(<Card {...defaultProps} heading="" />);
    
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    expect(screen.getByText('Test content goes here')).toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    const { container } = render(<Card uiContext="minimal" />);
    
    expect(container.querySelector('.minimal-card')).toBeInTheDocument();
  });
});
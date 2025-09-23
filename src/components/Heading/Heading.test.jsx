import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Heading from './Heading';

describe('Heading Component', () => {
  it('renders basic heading without subtitle', () => {
    render(<Heading level={2}>Test Title</Heading>);
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('subtitle')).not.toBeInTheDocument();
  });

  it('renders heading with subtitle', () => {
    render(
      <Heading level={2} subtitle="This is a subtitle">
        Test Title
      </Heading>
    );
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
  });

  it('applies centered class when centered prop is true', () => {
    render(
      <Heading level={2} centered={true}>
        Centered Title
      </Heading>
    );
    
    const wrapper = screen.getByText('Centered Title').closest('.heading-wrapper');
    expect(wrapper).toHaveClass('heading-centered');
  });

  it('applies underline class when withUnderline prop is true', () => {
    render(
      <Heading level={2} withUnderline={true}>
        Underlined Title
      </Heading>
    );
    
    const wrapper = screen.getByText('Underlined Title').closest('.heading-wrapper');
    expect(wrapper).toHaveClass('heading-with-underline');
  });

  it('applies custom className', () => {
    render(
      <Heading level={2} className="custom-class">
        Custom Title
      </Heading>
    );
    
    const wrapper = screen.getByText('Custom Title').closest('.heading-wrapper');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders different heading levels correctly', () => {
    const { rerender } = render(<Heading level={1}>H1 Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    rerender(<Heading level={3}>H3 Title</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

    rerender(<Heading level={4}>H4 Title</Heading>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('defaults to h2 when invalid level is provided', () => {
    render(<Heading level={99}>Invalid Level</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    render(
      <Heading level={2} data-testid="custom-heading" id="heading-id">
        Props Test
      </Heading>
    );
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('data-testid', 'custom-heading');
    expect(heading).toHaveAttribute('id', 'heading-id');
  });
});
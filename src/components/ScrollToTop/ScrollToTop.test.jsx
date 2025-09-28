import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

// Create a test component that changes location
const TestComponent = ({ path }) => {
  // Mock useLocation hook
  const mockUseLocation = vi.fn(() => ({ pathname: path }));
  vi.doMock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useLocation: mockUseLocation,
    };
  });
  
  return <ScrollToTop />;
};

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without errors', () => {
    render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );
  });

  it('should call window.scrollTo when component mounts', () => {
    render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  it('should return null (no visual output)', () => {
    const { container } = render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
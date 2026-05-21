import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

const TestRoutes = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/rent"
          element={<button onClick={() => navigate('/detail')}>Open detail</button>}
        />
        <Route
          path="/detail"
          element={(
            <>
              <button onClick={() => navigate(-1)}>Browser back</button>
              <button onClick={() => navigate('/rent', { state: { restoreScrollY: 320 } })}>
                Back to list
              </button>
            </>
          )}
        />
      </Routes>
    </>
  );
};

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    window.sessionStorage.clear();
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  it('should render without errors', () => {
    render(
      <MemoryRouter initialEntries={['/rent']}>
        <ScrollToTop />
      </MemoryRouter>
    );
  });

  it('should call window.scrollTo when component mounts', () => {
    render(
      <MemoryRouter initialEntries={['/rent']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should call window.scrollTo with smooth behavior when smooth prop is true', () => {
    render(
      <MemoryRouter initialEntries={['/rent']}>
        <ScrollToTop smooth={true} />
      </MemoryRouter>
    );

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  it('should return null (no visual output)', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/rent']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('restores the saved scroll position on browser back', () => {
    render(
      <MemoryRouter initialEntries={['/rent']}>
        <TestRoutes />
      </MemoryRouter>
    );

    window.scrollY = 480;
    fireEvent.click(screen.getByRole('button', { name: 'Open detail' }));

    expect(mockScrollTo).toHaveBeenLastCalledWith(0, 0);

    fireEvent.click(screen.getByRole('button', { name: 'Browser back' }));

    expect(mockScrollTo).toHaveBeenLastCalledWith(0, 480);
  });

  it('restores an explicit scroll position from navigation state', () => {
    render(
      <MemoryRouter initialEntries={['/detail']}>
        <TestRoutes />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to list' }));

    expect(mockScrollTo).toHaveBeenLastCalledWith(0, 320);
  });
});
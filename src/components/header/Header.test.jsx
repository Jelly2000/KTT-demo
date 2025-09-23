import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Header from './Header';

// Mock the react-router-dom useLocation hook
const mockLocation = { pathname: '/' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation
  };
});

// Helper function to render Header with providers
const renderHeader = (location = '/') => {
  mockLocation.pathname = location;
  
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    // Reset localStorage and DOM attributes before each test
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Basic Rendering', () => {
    it('should render header with correct structure', () => {
      renderHeader();
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveClass('nav');
    });

    it('should render header with correct className', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');
    });

    it('should render logo with correct classes and content', () => {
      renderHeader();
      
      const logoContainer = screen.getByRole('link', { name: /ktt car logo/i });
      expect(logoContainer).toHaveClass('logo-container');
      
      const logoImage = screen.getByAltText('KTT Car Logo');
      expect(logoImage).toHaveClass('logo-image');
      expect(logoImage).toHaveAttribute('src', '/logo.webp');
      
      const logoText = screen.getByText('KTT Car');
      expect(logoText).toHaveClass('logo-text');
    });
  });

  describe('Navigation Menu', () => {
    it('should render nav-menu with correct className', () => {
      renderHeader();
      
      const navMenu = screen.getByRole('list');
      expect(navMenu).toHaveClass('nav-menu');
      expect(navMenu).not.toHaveClass('nav-menu-open');
    });

    it('should render all navigation links with correct classes', () => {
      renderHeader();
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('nav-link');
      
      const rentCarLink = screen.getByRole('link', { name: /rent car/i });
      expect(rentCarLink).toHaveClass('nav-link');
      
      const proceduresLink = screen.getByRole('link', { name: /procedures/i });
      expect(proceduresLink).toHaveClass('nav-link');
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toHaveClass('nav-link');
    });

    it('should show active className on current page', () => {
      renderHeader('/');
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('nav-link', 'active');
    });

    it('should show active className on correct page when location changes', () => {
      renderHeader('/thue-xe');
      
      const rentCarLink = screen.getByRole('link', { name: /rent car/i });
      expect(rentCarLink).toHaveClass('nav-link', 'active');
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('nav-link');
      expect(homeLink).not.toHaveClass('active');
    });
  });

  describe('Mobile Menu (Hamburger)', () => {
    it('should render hamburger button with correct className', () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      expect(hamburgerButton).toHaveClass('hamburger');
      expect(hamburgerButton).not.toHaveClass('hamburger-open');
      expect(hamburgerButton).toHaveAttribute('id', 'hamburger');
    });

    it('should toggle hamburger and menu classes when clicked', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      
      // Initially closed
      expect(hamburgerButton).not.toHaveClass('hamburger-open');
      expect(navMenu).not.toHaveClass('nav-menu-open');
      
      // Click to open
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(hamburgerButton).toHaveClass('hamburger', 'hamburger-open');
        expect(navMenu).toHaveClass('nav-menu', 'nav-menu-open');
      });
      
      // Click to close
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(hamburgerButton).toHaveClass('hamburger');
        expect(hamburgerButton).not.toHaveClass('hamburger-open');
        expect(navMenu).toHaveClass('nav-menu');
        expect(navMenu).not.toHaveClass('nav-menu-open');
      });
    });

    it('should close menu when navigation link is clicked', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      const homeLink = screen.getByRole('link', { name: /home/i });
      
      // Open menu
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(navMenu).toHaveClass('nav-menu-open');
      });
      
      // Click navigation link
      fireEvent.click(homeLink);
      
      await waitFor(() => {
        expect(navMenu).not.toHaveClass('nav-menu-open');
        expect(hamburgerButton).not.toHaveClass('hamburger-open');
      });
    });
  });

  describe('Theme Toggle', () => {
    it('should render theme toggle button with correct className', () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      expect(themeButton).toHaveClass('theme-toggle');
    });

    it('should show moon icon for light theme initially', () => {
      renderHeader();
      
      const themeIcon = screen.getByText('🌙');
      expect(themeIcon).toHaveClass('theme-icon');
    });

    it('should toggle theme and update icon when clicked', async () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      
      // Initially light theme
      expect(screen.getByText('🌙')).toBeInTheDocument();
      
      // Click to switch to dark theme
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        expect(screen.getByText('☀️')).toBeInTheDocument();
        expect(screen.queryByText('🌙')).not.toBeInTheDocument();
      });
    });

    it('should save theme preference to localStorage', async () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark');
      });
    });

    it('should load dark theme from localStorage on mount', () => {
      localStorage.setItem('theme', 'dark');
      
      renderHeader();
      
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });
  });

  describe('Language Selector', () => {
    it('should render language select with correct className', () => {
      renderHeader();
      
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toHaveClass('language-select');
      expect(languageSelect).toHaveAttribute('name', 'language');
      expect(languageSelect).toHaveAttribute('id', 'language');
    });

    it('should render language toggle container with correct className', () => {
      renderHeader();
      
      const languageToggle = screen.getByRole('combobox').parentElement;
      expect(languageToggle).toHaveClass('language-toggle');
    });

    it('should have correct default language selected', () => {
      renderHeader();
      
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toHaveValue('vi'); // Default language
    });

    it('should change language when option is selected', async () => {
      renderHeader();
      
      const languageSelect = screen.getByRole('combobox');
      
      fireEvent.change(languageSelect, { target: { value: 'en' } });
      
      await waitFor(() => {
        expect(languageSelect).toHaveValue('en');
      });
    });
  });

  describe('Responsive Classes', () => {
    it('should have nav-brand class for logo section', () => {
      renderHeader();
      
      const navBrand = screen.getByRole('link', { name: /ktt car logo/i }).parentElement;
      expect(navBrand).toHaveClass('nav-brand');
    });

    it('should have correct structure for mobile hamburger menu', () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const spans = hamburgerButton.querySelectorAll('span');
      
      expect(spans).toHaveLength(3); // Three spans for hamburger lines
      spans.forEach(span => {
        expect(span.tagName).toBe('SPAN');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels', () => {
      renderHeader();
      
      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    it('should have proper alt text for logo image', () => {
      renderHeader();
      
      const logoImage = screen.getByAltText('KTT Car Logo');
      expect(logoImage).toBeInTheDocument();
    });

    it('should have navigation links with aria-labels', () => {
      renderHeader();
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveAttribute('aria-label');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid theme toggles', async () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      
      // Rapid clicks
      fireEvent.click(themeButton);
      fireEvent.click(themeButton);
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        // Should end up in dark theme (odd number of clicks)
        expect(screen.getByText('☀️')).toBeInTheDocument();
      });
    });

    it('should handle multiple rapid menu toggles', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      
      // Rapid clicks
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        // Should end up open (odd number of clicks)
        expect(navMenu).toHaveClass('nav-menu-open');
        expect(hamburgerButton).toHaveClass('hamburger-open');
      });
    });
  });
});
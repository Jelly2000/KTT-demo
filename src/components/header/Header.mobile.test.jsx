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

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Header Component - Mobile Responsive Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Mobile Menu Functionality', () => {
    it('should render hamburger menu button with correct classes', () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      expect(hamburgerButton).toHaveClass('hamburger');
      expect(hamburgerButton).toBeInTheDocument();
      
      // Hamburger should have three spans for animation lines
      const spans = hamburgerButton.querySelectorAll('span');
      expect(spans).toHaveLength(3);
    });

    it('should toggle hamburger button classes when clicked', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      
      // Initially not open
      expect(hamburgerButton).toHaveClass('hamburger');
      expect(hamburgerButton).not.toHaveClass('hamburger-open');
      
      // Click to open
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(hamburgerButton).toHaveClass('hamburger', 'hamburger-open');
      });
    });

    it('should toggle nav-menu classes when hamburger is clicked', async () => {
      renderHeader();
      
      const navMenu = screen.getByRole('list');
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      
      // Initially closed
      expect(navMenu).toHaveClass('nav-menu');
      expect(navMenu).not.toHaveClass('nav-menu-open');
      
      // Open menu
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(navMenu).toHaveClass('nav-menu', 'nav-menu-open');
      });
      
      // Close menu
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        expect(navMenu).toHaveClass('nav-menu');
        expect(navMenu).not.toHaveClass('nav-menu-open');
      });
    });
  });

  describe('Mobile Menu Behavior', () => {
    it('should close menu when navigation link is clicked', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      const homeLink = screen.getByRole('link', { name: /home/i });
      
      // Open menu
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(navMenu).toHaveClass('nav-menu-open'));
      
      // Click navigation link should close menu
      fireEvent.click(homeLink);
      await waitFor(() => {
        expect(navMenu).not.toHaveClass('nav-menu-open');
        expect(hamburgerButton).not.toHaveClass('hamburger-open');
      });
    });

    it('should show all navigation links', () => {
      renderHeader();
      
      expect(screen.getByRole('link', { name: /home/i })).toHaveClass('nav-link');
      expect(screen.getByRole('link', { name: /rent car/i })).toHaveClass('nav-link');
      expect(screen.getByRole('link', { name: /procedures/i })).toHaveClass('nav-link');
      expect(screen.getByRole('link', { name: /contact/i })).toHaveClass('nav-link');
      expect(screen.getByRole('link', { name: /etc payment/i })).toHaveClass('nav-link');
      expect(screen.getByRole('link', { name: /pvi insurance/i })).toHaveClass('nav-link');
    });
  });

  describe('Theme and Language in Mobile Menu', () => {
    it('should render theme toggle with correct class', () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      expect(themeButton).toHaveClass('theme-toggle');
    });

    it('should render language selector with correct classes', () => {
      renderHeader();
      
      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect).toHaveClass('language-select');
      
      const languageToggle = languageSelect.parentElement;
      expect(languageToggle).toHaveClass('language-toggle');
    });

    it('should toggle theme correctly', async () => {
      renderHeader();
      
      const themeButton = screen.getByLabelText('Toggle theme');
      
      // Initially light theme
      expect(screen.getByText('🌙')).toBeInTheDocument();
      
      // Click to toggle
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        expect(screen.getByText('☀️')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid menu toggles', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      
      // Rapid toggles
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);
      fireEvent.click(hamburgerButton);
      
      await waitFor(() => {
        // Should end up open (odd number of clicks)
        expect(navMenu).toHaveClass('nav-menu-open');
        expect(hamburgerButton).toHaveClass('hamburger-open');
      });
    });

    it('should close menu when clicking multiple nav links', async () => {
      renderHeader();
      
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const navMenu = screen.getByRole('list');
      const homeLink = screen.getByRole('link', { name: /home/i });
      const rentCarLink = screen.getByRole('link', { name: /rent car/i });
      
      // Open menu and click first link
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(navMenu).toHaveClass('nav-menu-open'));
      
      fireEvent.click(homeLink);
      await waitFor(() => expect(navMenu).not.toHaveClass('nav-menu-open'));
      
      // Open menu and click second link
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(navMenu).toHaveClass('nav-menu-open'));
      
      fireEvent.click(rentCarLink);
      await waitFor(() => expect(navMenu).not.toHaveClass('nav-menu-open'));
    });
  });
});
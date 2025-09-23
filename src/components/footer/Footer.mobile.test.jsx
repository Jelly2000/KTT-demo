import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Footer from './Footer';

const renderFooter = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <Footer />
    </I18nextProvider>
  );
};

describe('Footer Component - Mobile Responsive Tests', () => {

  describe('Footer Structure', () => {
    it('should render footer with correct classes', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('footer');
      
      const container = footer.querySelector('.container');
      expect(container).toHaveClass('container');
      
      const footerContent = container.querySelector('.footer-content');
      expect(footerContent).toHaveClass('footer-content');
    });

    it('should render all footer sections with correct classes', () => {
      renderFooter();
      
      const footerSections = screen.getByRole('contentinfo').querySelectorAll('.footer-section');
      expect(footerSections).toHaveLength(3);
      
      footerSections.forEach(section => {
        expect(section).toHaveClass('footer-section');
      });
    });

    it('should render footer-bottom with correct class', () => {
      renderFooter();
      
      const footerBottom = screen.getByRole('contentinfo').querySelector('.footer-bottom');
      expect(footerBottom).toHaveClass('footer-bottom');
    });
  });

  describe('Footer Links', () => {
    it('should render all links with footer-link class', () => {
      renderFooter();
      
      const footerLinks = screen.getAllByRole('link');
      
      footerLinks.forEach(link => {
        expect(link).toHaveClass('footer-link');
        expect(link).toBeVisible();
      });
    });

    it('should have proper phone link for mobile dialing', () => {
      renderFooter();
      
      const phoneLink = screen.getByRole('link', { name: /079\.8888\.373/i });
      expect(phoneLink).toHaveClass('footer-link');
      expect(phoneLink).toHaveAttribute('href', 'tel:0798888373');
    });

    it('should have proper email link for mobile email apps', () => {
      renderFooter();
      
      const emailLink = screen.getByRole('link', { name: /jackynguyen23@gmail\.com/i });
      expect(emailLink).toHaveClass('footer-link');
      expect(emailLink).toHaveAttribute('href', 'mailto:jackynguyen23@gmail.com');
    });

    it('should have external links with security attributes', () => {
      renderFooter();
      
      const websiteLink = screen.getByRole('link', { name: /https:\/\/www\.kttcar\.com/i });
      expect(websiteLink).toHaveClass('footer-link');
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const facebookLink = screen.getByRole('link', { name: /ktt car/i });
      expect(facebookLink).toHaveClass('footer-link');
      expect(facebookLink).toHaveAttribute('target', '_blank');
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Content Sections', () => {
    it('should display company information', () => {
      renderFooter();
      
      const companyHeading = screen.getByRole('heading', { level: 3 });
      expect(companyHeading.textContent).toMatch(/KTT CAR/i);
      
      const companyDescription = screen.getByText(/KTT CAR TRANSPORT AND TOURISM TRADING SERVICES CO/i);
      expect(companyDescription).toBeInTheDocument();
    });

    it('should display address information with proper structure', () => {
      renderFooter();
      
      const addressHeading = screen.getByRole('heading', { level: 4, name: /address/i });
      expect(addressHeading).toBeInTheDocument();
      
      expect(screen.getByText(/499\/2 Hương Lộ 3/i)).toBeInTheDocument();
      expect(screen.getByText(/158 Nguyễn Hữu Tiến/i)).toBeInTheDocument();
      expect(screen.getByText(/head office/i)).toBeInTheDocument();
      expect(screen.getByText(/parking lot/i)).toBeInTheDocument();
    });

    it('should display contact information with labels', () => {
      renderFooter();
      
      const contactHeading = screen.getByRole('heading', { level: 4, name: /contact/i });
      expect(contactHeading).toBeInTheDocument();
      
      expect(screen.getByText('Website:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('Hotline:')).toBeInTheDocument();
      expect(screen.getByText('Facebook:')).toBeInTheDocument();
    });

    it('should have proper strong elements for labels', () => {
      renderFooter();
      
      const strongElements = [
        screen.getByText('Website:'),
        screen.getByText('Email:'),
        screen.getByText('Hotline:'),
        screen.getByText('Facebook:'),
        screen.getByText(/head office/i),
        screen.getByText(/parking lot/i)
      ];
      
      strongElements.forEach(element => {
        expect(element.tagName).toBe('STRONG');
      });
    });
  });

  describe('Copyright Section', () => {
    it('should display copyright text', () => {
      renderFooter();
      
      const copyrightText = screen.getByText(/© 2024.*KTT CAR.*All rights reserved/i);
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe('Mobile Layout Structure', () => {
    it('should have all sections for mobile stacking', () => {
      renderFooter();
      
      const footerSections = screen.getByRole('contentinfo').querySelectorAll('.footer-section');
      
      // Should have 3 sections for mobile layout
      expect(footerSections).toHaveLength(3);
      
      // Each section should contain content
      footerSections.forEach((section, index) => {
        expect(section.textContent.trim()).not.toBe('');
        
        // Verify section content types
        if (index === 0) {
          expect(section.textContent).toContain('KTT CAR');
        }
        if (index === 1) {
          expect(section.textContent).toContain('499/2 Hương Lộ 3');
        }
        if (index === 2) {
          expect(section.textContent).toContain('Website:');
        }
      });
    });

    it('should maintain semantic structure', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
      
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      const h4Headings = screen.getAllByRole('heading', { level: 4 });
      
      expect(h3Headings).toHaveLength(1); // Company name
      expect(h4Headings).toHaveLength(2); // Address and Contact
    });
  });

  describe('Facebook Link Styling', () => {
    it('should have custom styling on Facebook link', () => {
      renderFooter();
      
      const facebookLink = screen.getByRole('link', { name: /ktt car/i });
      expect(facebookLink).toHaveStyle('color: var(--footer-link)');
    });
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Footer from './Footer';

// Helper function to render Footer with providers
const renderFooter = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <Footer />
    </I18nextProvider>
  );
};

describe('Footer Component', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('Basic Rendering', () => {
    it('should render footer with correct structure', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('footer');
    });

    it('should render container with correct className', () => {
      renderFooter();
      
      const container = screen.getByRole('contentinfo').querySelector('.container');
      expect(container).toHaveClass('container');
    });

    it('should render footer-content with correct className', () => {
      renderFooter();
      
      const footerContent = screen.getByRole('contentinfo').querySelector('.footer-content');
      expect(footerContent).toHaveClass('footer-content');
    });
  });

  describe('Footer Sections', () => {
    it('should render all footer sections with correct className', () => {
      renderFooter();
      
      const footerSections = screen.getAllByRole('contentinfo')[0].querySelectorAll('.footer-section');
      expect(footerSections).toHaveLength(3);
      
      footerSections.forEach(section => {
        expect(section).toHaveClass('footer-section');
      });
    });

    it('should render company section with correct content and structure', () => {
      renderFooter();
      
      // Company name heading
      const companyHeading = screen.getByRole('heading', { level: 3 });
      expect(companyHeading).toBeInTheDocument();
      expect(companyHeading.textContent).toMatch(/KTT CAR/i);
      
      // Company full name
      const companyDescription = screen.getByText(/KTT CAR TRANSPORT AND TOURISM TRADING SERVICES CO/i);
      expect(companyDescription).toBeInTheDocument();
    });

    it('should render address section with correct headings and content', () => {
      renderFooter();
      
      // Address title heading
      const addressHeading = screen.getByRole('heading', { level: 4, name: /address/i });
      expect(addressHeading).toBeInTheDocument();
      
      // Head office address
      const headOfficeText = screen.getByText(/head office/i);
      expect(headOfficeText).toBeInTheDocument();
      
      const headOfficeAddress = screen.getByText(/499\/2 Hương Lộ 3/i);
      expect(headOfficeAddress).toBeInTheDocument();
      
      // Parking lot address
      const parkingLotText = screen.getByText(/parking lot/i);
      expect(parkingLotText).toBeInTheDocument();
      
      const parkingLotAddress = screen.getByText(/158 Nguyễn Hữu Tiến/i);
      expect(parkingLotAddress).toBeInTheDocument();
    });

    it('should render contact section with correct heading', () => {
      renderFooter();
      
      const contactHeading = screen.getByRole('heading', { level: 4, name: /contact/i });
      expect(contactHeading).toBeInTheDocument();
    });
  });

  describe('Footer Links', () => {
    it('should render all footer links with correct className', () => {
      renderFooter();
      
      const footerLinks = screen.getAllByRole('link');
      
      footerLinks.forEach(link => {
        expect(link).toHaveClass('footer-link');
      });
    });

    it('should render website link with correct attributes', () => {
      renderFooter();
      
      const websiteLink = screen.getByRole('link', { name: /https:\/\/www\.kttcar\.com/i });
      expect(websiteLink).toHaveClass('footer-link');
      expect(websiteLink).toHaveAttribute('href', 'https://www.kttcar.com');
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render email link with correct attributes', () => {
      renderFooter();
      
      const emailLink = screen.getByRole('link', { name: /jackynguyen23@gmail\.com/i });
      expect(emailLink).toHaveClass('footer-link');
      expect(emailLink).toHaveAttribute('href', 'mailto:jackynguyen23@gmail.com');
    });

    it('should render phone link with correct attributes', () => {
      renderFooter();
      
      const phoneLink = screen.getByRole('link', { name: /079\.8888\.373/i });
      expect(phoneLink).toHaveClass('footer-link');
      expect(phoneLink).toHaveAttribute('href', 'tel:0798888373');
    });

    it('should render Facebook link with correct attributes and styling', () => {
      renderFooter();
      
      const facebookLink = screen.getByRole('link', { name: /ktt car/i });
      expect(facebookLink).toHaveClass('footer-link');
      expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/dvtulai');
      expect(facebookLink).toHaveAttribute('target', '_blank');
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(facebookLink).toHaveStyle('color: var(--footer-link)');
    });
  });

  describe('Footer Bottom', () => {
    it('should render footer-bottom section with correct className', () => {
      renderFooter();
      
      const footerBottom = screen.getByRole('contentinfo').querySelector('.footer-bottom');
      expect(footerBottom).toHaveClass('footer-bottom');
    });

    it('should render copyright text', () => {
      renderFooter();
      
      const copyrightText = screen.getByText(/© 2024.*KTT CAR.*All rights reserved/i);
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe('Contact Information Structure', () => {
    it('should render contact information with proper strong tags', () => {
      renderFooter();
      
      // Website label
      const websiteLabel = screen.getByText('Website:');
      expect(websiteLabel.tagName).toBe('STRONG');
      
      // Email label
      const emailLabel = screen.getByText('Email:');
      expect(emailLabel.tagName).toBe('STRONG');
      
      // Hotline label
      const hotlineLabel = screen.getByText('Hotline:');
      expect(hotlineLabel.tagName).toBe('STRONG');
      
      // Facebook label
      const facebookLabel = screen.getByText('Facebook:');
      expect(facebookLabel.tagName).toBe('STRONG');
    });

    it('should have proper address labels with strong tags', () => {
      renderFooter();
      
      // Head office label
      const headOfficeLabel = screen.getByText(/head office/i);
      expect(headOfficeLabel.tagName).toBe('STRONG');
      
      // Parking lot label
      const parkingLotLabel = screen.getByText(/parking lot/i);
      expect(parkingLotLabel.tagName).toBe('STRONG');
    });
  });

  describe('Responsive Design Elements', () => {
    it('should have proper semantic structure for screen readers', () => {
      renderFooter();
      
      // Should have one main footer element
      const footers = screen.getAllByRole('contentinfo');
      expect(footers).toHaveLength(1);
      
      // Should have proper heading hierarchy
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      const h4Headings = screen.getAllByRole('heading', { level: 4 });
      
      expect(h3Headings).toHaveLength(1); // Company name
      expect(h4Headings).toHaveLength(2); // Address and Contact
    });

    it('should render all contact methods', () => {
      renderFooter();
      
      // Check that all contact methods are present
      expect(screen.getByText('Website:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('Hotline:')).toBeInTheDocument();
      expect(screen.getByText('Facebook:')).toBeInTheDocument();
    });
  });

  describe('Link Accessibility', () => {
    it('should have external links with proper security attributes', () => {
      renderFooter();
      
      // Website link security
      const websiteLink = screen.getByRole('link', { name: /https:\/\/www\.kttcar\.com/i });
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      // Facebook link security
      const facebookLink = screen.getByRole('link', { name: /ktt car/i });
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have telephone link with correct protocol', () => {
      renderFooter();
      
      const phoneLink = screen.getByRole('link', { name: /079\.8888\.373/i });
      expect(phoneLink.href).toBe('tel:0798888373');
    });

    it('should have email link with correct protocol', () => {
      renderFooter();
      
      const emailLink = screen.getByRole('link', { name: /jackynguyen23@gmail\.com/i });
      expect(emailLink.href).toBe('mailto:jackynguyen23@gmail.com');
    });
  });

  describe('Content Validation', () => {
    it('should display correct company information', () => {
      renderFooter();
      
      // Company name variations (use heading to get the specific one)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/KTT Car/i);
      expect(screen.getByText(/KTT CAR TRANSPORT AND TOURISM TRADING SERVICES CO/i)).toBeInTheDocument();
    });

    it('should display correct address information', () => {
      renderFooter();
      
      // Head office address
      expect(screen.getByText(/499\/2 Hương Lộ 3.*Bình Hưng Hòa.*Bình Tân.*HCM/i)).toBeInTheDocument();
      
      // Parking lot address
      expect(screen.getByText(/158 Nguyễn Hữu Tiến.*Tây Thạnh.*Tân Phú.*HCM/i)).toBeInTheDocument();
    });

    it('should display correct contact information', () => {
      renderFooter();
      
      // Website
      expect(screen.getByText('https://www.kttcar.com')).toBeInTheDocument();
      
      // Email
      expect(screen.getByText('jackynguyen23@gmail.com')).toBeInTheDocument();
      
      // Phone
      expect(screen.getByText('079.8888.373')).toBeInTheDocument();
    });
  });

  describe('Mobile Screen Considerations', () => {
    it('should have proper text content that works on mobile', () => {
      renderFooter();
      
      // All text should be present and readable
      const footerElement = screen.getByRole('contentinfo');
      expect(footerElement.textContent).toContain('KTT CAR');
      expect(footerElement.textContent).toContain('499/2 Hương Lộ 3');
      expect(footerElement.textContent).toContain('158 Nguyễn Hữu Tiến');
      expect(footerElement.textContent).toContain('079.8888.373');
      expect(footerElement.textContent).toContain('jackynguyen23@gmail.com');
    });

    it('should maintain proper section structure for mobile layout', () => {
      renderFooter();
      
      const footerSections = screen.getByRole('contentinfo').querySelectorAll('.footer-section');
      
      // Should have exactly 3 sections for proper mobile stacking
      expect(footerSections).toHaveLength(3);
      
      // Each section should have content
      footerSections.forEach(section => {
        expect(section.textContent.trim()).not.toBe('');
      });
    });
  });
});
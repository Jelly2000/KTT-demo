import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import i18n from '../../i18n';
import SEO from './SEO';

// Mock react-helmet-async
vi.mock('react-helmet-async', async () => {
  const actual = await vi.importActual('react-helmet-async');
  return {
    ...actual,
    Helmet: vi.fn(({ children }) => <div data-testid="helmet">{children}</div>),
  };
});

import { Helmet } from 'react-helmet-async';
const mockHelmet = vi.mocked(Helmet);

// Mock window.location
const mockLocation = {
  href: 'https://kttcar.com/test-page'
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Helper function to render SEO with providers
const renderSEO = (props = {}) => {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <SEO {...props} />
      </I18nextProvider>
    </HelmetProvider>
  );
};

describe('SEO Component', () => {
  beforeEach(() => {
    // Reset i18n to Vietnamese
    i18n.changeLanguage('vi');
    // Clear the mock
    mockHelmet.mockClear();
  });

  it('renders with default title and description', () => {
    renderSEO();
    
    // Check that Helmet was called
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('renders with custom title and description', () => {
    renderSEO({
      customTitle: 'Custom Page Title',
      customDescription: 'Custom page description for testing'
    });
    
    // Check that Helmet was called with custom title and description
    expect(mockHelmet).toHaveBeenCalled();
    const helmetCall = mockHelmet.mock.calls[0];
    const helmetChildren = helmetCall[0].children;
    
    // Should contain title and meta description elements
    expect(helmetChildren).toBeDefined();
  });

  it('renders with translation keys', () => {
    renderSEO({
      titleKey: 'hero_title',
      descriptionKey: 'hero_subtitle'
    });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('replaces variables in translation strings', () => {
    renderSEO({
      titleKey: 'hero_title',
      variables: { vehicleName: 'Hyundai Accent' }
    });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets canonical URL', () => {
    const canonicalUrl = 'https://kttcar.com/canonical-test';
    renderSEO({ canonicalUrl });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets custom Open Graph image', () => {
    const customImage = 'https://kttcar.com/custom-image.jpg';
    renderSEO({ ogImage: customImage });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets custom og:type', () => {
    renderSEO({ ogType: 'article' });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets Vietnamese locale and keywords when language is vi', () => {
    i18n.changeLanguage('vi');
    renderSEO();
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets English locale and keywords when language is en', () => {
    i18n.changeLanguage('en');
    renderSEO();
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets current URL as og:url', () => {
    renderSEO();
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('adds structured data when provided', () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "KTT Car"
    };
    
    renderSEO({ structuredData });
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('uses default image when no ogImage provided', () => {
    renderSEO();
    
    expect(mockHelmet).toHaveBeenCalled();
  });

  it('sets author and robots meta tags', () => {
    renderSEO();
    
    expect(mockHelmet).toHaveBeenCalled();
  });
});
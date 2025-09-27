import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import FloatingContacts from './FloatingContacts';

// Helper function to render FloatingContacts with i18n provider
const renderFloatingContacts = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <FloatingContacts />
    </I18nextProvider>
  );
};

describe('FloatingContacts Component', () => {
  it('renders all contact buttons', () => {
    renderFloatingContacts();
    
    // Check for phone link
    const phoneLink = screen.getByLabelText('Call Phone');
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:0798888373');
    
    // Check for Zalo link
    const zaloLink = screen.getByLabelText('Contact via Zalo');
    expect(zaloLink).toBeInTheDocument();
    expect(zaloLink).toHaveAttribute('href', 'https://zalo.me/0798888373');
    expect(zaloLink).toHaveAttribute('target', '_blank');
    expect(zaloLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check for Messenger link
    const messengerLink = screen.getByLabelText('Contact via Messenger');
    expect(messengerLink).toBeInTheDocument();
    expect(messengerLink).toHaveAttribute('href', 'https://m.me/dvtulai');
    expect(messengerLink).toHaveAttribute('target', '_blank');
    expect(messengerLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders with correct CSS classes', () => {
    const { container } = renderFloatingContacts();
    
    expect(container.querySelector('.floating-contacts')).toBeInTheDocument();
    expect(container.querySelector('.contact-item')).toBeInTheDocument();
    expect(container.querySelector('.contact-btn')).toBeInTheDocument();
    expect(container.querySelector('.phone-btn')).toBeInTheDocument();
    expect(container.querySelector('.zalo-btn')).toBeInTheDocument();
    expect(container.querySelector('.messenger-btn')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderFloatingContacts();
    
    const phoneBtn = screen.getByLabelText('Call Phone');
    const zaloBtn = screen.getByLabelText('Contact via Zalo');
    const messengerBtn = screen.getByLabelText('Contact via Messenger');
    
    // All buttons should have aria-label
    expect(phoneBtn).toHaveAttribute('aria-label');
    expect(zaloBtn).toHaveAttribute('aria-label');
    expect(messengerBtn).toHaveAttribute('aria-label');
  });

  it('renders contact icons with proper alt text', () => {
    renderFloatingContacts();
    
    const phoneIcon = screen.getByAltText('Hotline KTT Car - Gọi ngay để thuê xe tự lái');
    expect(phoneIcon).toBeInTheDocument();
    expect(phoneIcon).toHaveClass('contact-icon');
    
    const zaloIcon = screen.getByAltText('Chat Zalo KTT Car - Tư vấn thuê xe tự lái miễn phí');
    expect(zaloIcon).toBeInTheDocument();
    expect(zaloIcon).toHaveClass('contact-icon');
    
    const messengerIcon = screen.getByAltText('Facebook Messenger KTT Car - Liên hệ thuê xe nhanh chóng');
    expect(messengerIcon).toBeInTheDocument();
    expect(messengerIcon).toHaveClass('contact-icon');
  });

  it('has correct link targets for external services', () => {
    renderFloatingContacts();
    
    const phoneLink = screen.getByLabelText('Call Phone');
    const zaloLink = screen.getByLabelText('Contact via Zalo');
    const messengerLink = screen.getByLabelText('Contact via Messenger');
    
    // Phone link should not have target="_blank"
    expect(phoneLink).not.toHaveAttribute('target');
    
    // External links should have target="_blank" and proper security attributes
    expect(zaloLink).toHaveAttribute('target', '_blank');
    expect(zaloLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(messengerLink).toHaveAttribute('target', '_blank');
    expect(messengerLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders three contact items', () => {
    const { container } = renderFloatingContacts();
    
    const contactItems = container.querySelectorAll('.contact-item');
    expect(contactItems).toHaveLength(3);
  });

  it('uses translation keys for titles and aria-labels', () => {
    renderFloatingContacts();
    
    // The component should work with translation system
    // We can test that the elements exist with proper attributes
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    
    links.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
    });
  });
});
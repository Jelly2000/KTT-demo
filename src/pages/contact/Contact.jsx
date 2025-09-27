import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConsultationForm, HighlightedButton } from '../../components';
import SEO from '../../components/SEO/SEO';
import '../shared-styles.css';
import './styles.css';

const Contact = () => {
  const { t } = useTranslation();

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t('seo_contact_title'),
    "description": t('seo_contact_description'),
    "mainEntity": {
      "@type": "Organization",
      "name": "KTT Car Rental",
      "telephone": "+84-xxx-xxx-xxx",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "VN",
        "addressLocality": "Ho Chi Minh City"
      }
    }
  };

  return (
    <div className="contact-page">
      <SEO 
        titleKey="seo_contact_title"
        descriptionKey="seo_contact_description"
        structuredData={structuredData}
      />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('contact_title')}</h1>
          <p className="page-subtitle">{t('contact_subtitle')}</p>
          <HighlightedButton 
            onClick={() => document.querySelector('.contact-form-section').scrollIntoView({behavior: 'smooth'})}
          >
            {t('contact_now')}
          </HighlightedButton>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-grid">
            {/* Company Information */}
            <div className="contact-card">
              <div className="contact-icon">🏢</div>
              <h3>{t('company_info')}</h3>
              <div className="contact-details">
                <p><strong>{t('company_name')}</strong></p>
                <p>{t('company_full_name')}</p>
              </div>
            </div>

            {/* Head Office */}
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>{t('head_office')}</h3>
              <div className="contact-details">
                <p>{t('head_office_address')}</p>
                <button className="map-btn" onClick={() => window.open('https://maps.google.com/?q=10.7588585,106.6051226', '_blank')}>
                  {t('view_map')}
                </button>
              </div>
            </div>

            {/* Parking Lot */}
            <div className="contact-card">
              <div className="contact-icon">🚗</div>
              <h3>{t('parking_lot')}</h3>
              <div className="contact-details">
                <p>{t('parking_lot_address')}</p>
                <button className="map-btn" onClick={() => window.open('https://maps.google.com/?q=10.7988585,106.6351226', '_blank')}>
                  {t('view_map')}
                </button>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>{t('phone')}</h3>
              <div className="contact-details">
                <p><strong>{t('hotline')}</strong> <a href="tel:0798888373">079.8888.373</a></p>
                <p>{t('support_24_7')}</p>
              </div>
            </div>

            {/* Email Contact */}
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>{t('email')}</h3>
              <div className="contact-details">
                <p><a href="mailto:jackynguyen23@gmail.com">jackynguyen23@gmail.com</a></p>
                <p>{t('reply_within_24h')}</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <h3>{t('social_media')}</h3>
              <div className="contact-details">
                <p><strong>{t('website')}</strong> <a href="https://www.kttcar.com" target="_blank" rel="noopener noreferrer">kttcar.com</a></p>
                <p><strong>{t('facebook')}</strong> <a href="https://www.facebook.com/dvtulai" target="_blank" rel="noopener noreferrer">dvtulai</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <ConsultationForm 
            heading={t('send_message')}
            subHeading={t('send_message_subtitle')}
          />
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="business-hours-section">
        <div className="container">
          <div className="hours-grid">
            <div className="hours-card">
              <div className="hours-icon">🕐</div>
              <h3>{t('business_hours')}</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span>{t('monday_friday')}</span>
                  <span>8:00 - 18:00</span>
                </div>
                <div className="hours-item">
                  <span>{t('saturday_sunday')}</span>
                  <span>8:00 - 17:00</span>
                </div>
                <div className="hours-item special">
                  <span>{t('emergency_support')}</span>
                  <span>24/7</span>
                </div>
              </div>
            </div>

            <div className="hours-card">
              <div className="hours-icon">🚀</div>
              <h3>{t('quick_service')}</h3>
              <div className="service-list">
                <div className="service-item">
                  <span className="service-icon">⚡</span>
                  <span>{t('online_booking_24_7')}</span>
                </div>
                <div className="service-item">
                  <span className="service-icon">🚗</span>
                  <span>{t('car_delivery_service')}</span>
                </div>
                <div className="service-item">
                  <span className="service-icon">💬</span>
                  <span>{t('free_consultation')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
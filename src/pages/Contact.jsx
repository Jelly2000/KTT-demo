import React from 'react';
import { useTranslation } from 'react-i18next';
import './Pages.css';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('navigation_contact')}</h1>
          <p className="page-subtitle">
            Get in touch with us for any questions or bookings
          </p>
        </div>
      </div>
      
      <section className="content-section">
        <div className="container">
          <div className="placeholder-content">
            <h2>📞 Contact Information</h2>
            <p>This is a placeholder for the contact page. It will include:</p>
            
            <div className="contact-info-grid">
              <div className="contact-card">
                <h3>🏢 Head Office</h3>
                <p><strong>Address:</strong><br/>499/2 Hương Lộ 3, P.Bình Hưng Hòa, Q.Bình Tân, HCM</p>
              </div>
              
              <div className="contact-card">
                <h3>🚗 Parking Lot</h3>
                <p><strong>Address:</strong><br/>158 Nguyễn Hữu Tiến, P.Tây Thạnh, Q.Tân Phú, HCM</p>
              </div>
              
              <div className="contact-card">
                <h3>📱 Hotline</h3>
                <p><strong>Phone:</strong><br/>079.8888.373</p>
              </div>
              
              <div className="contact-card">
                <h3>📧 Email</h3>
                <p><strong>Email:</strong><br/>jackynguyen23@gmail.com</p>
              </div>
              
              <div className="contact-card">
                <h3>🌐 Website</h3>
                <p><strong>Website:</strong><br/>https://www.kttcar.com</p>
              </div>
              
              <div className="contact-card">
                <h3>📘 Facebook</h3>
                <p><strong>Page:</strong><br/>dvtulai</p>
              </div>
            </div>
            
            <div className="contact-form-section">
              <h3>📝 Contact Form</h3>
              <p>Contact form will be implemented here for customer inquiries.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
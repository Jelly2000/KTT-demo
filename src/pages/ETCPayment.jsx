import React from 'react';
import { useTranslation } from 'react-i18next';
import './Pages.css';

const ETCPayment = () => {
  const { t } = useTranslation();

  return (
    <div className="etc-payment-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('navigation_etcPayment')}</h1>
          <p className="page-subtitle">
            Fast and convenient ETC payment services
          </p>
        </div>
      </div>
      
      <section className="content-section">
        <div className="container">
          <div className="placeholder-content">
            <h2>💳 ETC Payment Services</h2>
            <p>This is a placeholder for the ETC payment page. Features will include:</p>
            
            <div className="service-features">
              <div className="feature-card">
                <h3>⚡ Quick Payment</h3>
                <p>Fast and secure ETC account top-up services</p>
              </div>
              
              <div className="feature-card">
                <h3>💰 Multiple Payment Methods</h3>
                <p>Support for various payment methods including bank transfer, card, and e-wallets</p>
              </div>
              
              <div className="feature-card">
                <h3>📱 Online Management</h3>
                <p>Manage your ETC account balance and transaction history online</p>
              </div>
              
              <div className="feature-card">
                <h3>🔔 Notifications</h3>
                <p>Get notified when your ETC balance is low</p>
              </div>
              
              <div className="feature-card">
                <h3>📊 Reports</h3>
                <p>Detailed transaction reports and usage statistics</p>
              </div>
              
              <div className="feature-card">
                <h3>🎯 Convenience</h3>
                <p>No need to queue at toll booths or payment centers</p>
              </div>
            </div>
            
            <div className="coming-soon">
              <h3>🚧 Coming Soon</h3>
              <p>ETC payment integration will be available soon. Stay tuned for updates!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ETCPayment;
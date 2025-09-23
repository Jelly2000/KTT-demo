import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">
            {t('hero_subtitle')}
          </p>
          <button className="cta-button">
            {t('hero_ctaButton')}
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="container">
          <h2>{t('content_welcome')}</h2>
          <p>
            {t('content_description')}
          </p>
          
          <div className="services-grid">
            <div className="service-card">
              <h3>🚗 {t('content_services_selfDrive')}</h3>
              <p>{t('content_services_selfDriveDesc')}</p>
            </div>
            
            <div className="service-card">
              <h3>👨‍✈️ {t('content_services_withDriver')}</h3>
              <p>{t('content_services_withDriverDesc')}</p>
            </div>
            
            <div className="service-card">
              <h3>🛡️ {t('content_services_insurance')}</h3>
              <p>{t('content_services_insuranceDesc')}</p>
            </div>
            
            <div className="service-card">
              <h3>💳 {t('content_services_etc')}</h3>
              <p>{t('content_services_etcDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
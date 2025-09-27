import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HighlightedButton } from '../../components';
import SEO from '../../components/SEO/SEO';
import '../shared-styles.css';
import './styles.css';

const ETCPayment = () => {
  const { t } = useTranslation();

  return (
    <div className="etc-payment-page">
      <SEO 
        titleKey="seo_etc_title"
        descriptionKey="seo_etc_description"
      />
      
      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="container" style={{ marginTop: '50px' }}>
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              💳
            </div>
            <h1>{t('etc_payment')}</h1>
            <div className="coming-soon-message">
              <h2>{t('etc_coming_soon')}</h2>
              <p>{t('etc_description')}</p>
            </div>
            <div className="coming-soon-actions">
              <Link to="/contact" className="btn btn-primary">
                {t('contact_us')}
              </Link>
              <Link to="/" className="btn btn-secondary">
                {t('back_to_home')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ETCPayment;
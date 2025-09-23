import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';

const PVIInsurance = () => {
  const { t } = useTranslation();

  return (
    <div className="pvi-insurance-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('navigation_pviInsurance')}</h1>
          <p className="page-subtitle">
            Comprehensive insurance coverage for your peace of mind
          </p>
        </div>
      </div>
      
      <section className="content-section">
        <div className="container">
          <div className="placeholder-content">
            <h2>🛡️ PVI Insurance Services</h2>
            <p>This is a placeholder for the PVI Insurance page. Services will include:</p>
            
            <div className="insurance-types">
              <div className="insurance-card">
                <h3>🚗 Vehicle Insurance</h3>
                <p>Comprehensive coverage for rental vehicles including collision, theft, and damage protection</p>
              </div>
              
              <div className="insurance-card">
                <h3>👥 Third Party Liability</h3>
                <p>Protection against claims from third parties in case of accidents</p>
              </div>
              
              <div className="insurance-card">
                <h3>👤 Personal Accident</h3>
                <p>Coverage for personal injury and medical expenses</p>
              </div>
              
              <div className="insurance-card">
                <h3>🧳 Personal Belongings</h3>
                <p>Protection for personal items and luggage in the vehicle</p>
              </div>
            </div>
            
            <div className="insurance-benefits">
              <h3>✅ Benefits</h3>
              <ul>
                <li>🏥 24/7 Emergency Assistance</li>
                <li>🔧 Roadside Assistance</li>
                <li>🚛 Towing Services</li>
                <li>🏨 Accommodation Coverage</li>
                <li>🎯 No Claim Bonus</li>
                <li>📞 Dedicated Support Hotline</li>
              </ul>
            </div>
            
            <div className="pvi-partnership">
              <h3>🤝 PVI Partnership</h3>
              <p>We partner with PVI Insurance - one of Vietnam's leading insurance companies - to provide you with reliable and comprehensive coverage.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PVIInsurance;
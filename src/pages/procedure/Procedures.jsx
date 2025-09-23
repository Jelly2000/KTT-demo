import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';

const Procedures = () => {
  const { t } = useTranslation();

  return (
    <div className="procedures-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('navigation_procedures')}</h1>
          <p className="page-subtitle">
            Simple steps to rent your perfect car
          </p>
        </div>
      </div>
      
      <section className="content-section">
        <div className="container">
          <div className="placeholder-content">
            <h2>📋 Rental Procedures</h2>
            <p>This is a placeholder for the procedures page. Information will include:</p>
            
            <div className="procedure-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>📄 Required Documents</h3>
                  <p>List of necessary documents for car rental</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>💳 Deposit Information</h3>
                  <p>Security deposit requirements and payment methods</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>⏰ Pickup & Return</h3>
                  <p>Pickup and return procedures and timing</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>📞 Support</h3>
                  <p>24/7 customer support during rental period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Procedures;
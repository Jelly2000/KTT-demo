import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';

const RentCar = () => {
  const { t } = useTranslation();

  return (
    <div className="rent-car-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('navigation_rentCar')}</h1>
          <p className="page-subtitle">
            Choose from our fleet of modern, well-maintained vehicles
          </p>
        </div>
      </div>
      
      <section className="content-section">
        <div className="container">
          <div className="placeholder-content">
            <h2>🚗 Car Rental Services</h2>
            <p>This is a placeholder for the car rental page. Here you will be able to:</p>
            
            <div className="features-list">
              <div className="feature-item">
                <h3>🔍 Browse Available Cars</h3>
                <p>View our complete fleet of vehicles with detailed specifications</p>
              </div>
              
              <div className="feature-item">
                <h3>📅 Check Availability</h3>
                <p>Real-time availability checking and booking system</p>
              </div>
              
              <div className="feature-item">
                <h3>💰 Compare Prices</h3>
                <p>Transparent pricing with no hidden fees</p>
              </div>
              
              <div className="feature-item">
                <h3>📋 Easy Booking</h3>
                <p>Simple online booking process with instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentCar;
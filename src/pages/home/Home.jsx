import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './Home.css';
import Heading from '../../components/Heading/Heading';
import Card from '../../components/card/Card';
import HighlightedButton from '../../components/HighlightedButton/HighlightedButton';
import { VehicleCard, ConsultationForm } from '../../components';
import { getVehicles } from '../../utils/vehicleUtils';

const Home = () => {
  const { t, i18n } = useTranslation();
  
  // Get first 3 vehicles for display in current language
  const featuredVehicles = getVehicles(i18n.language).slice(0, 3);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">
            {t('hero_subtitle')}
          </p>
          <HighlightedButton
            onClick={() => console.log('Button clicked')}
          >
            {t('hero_ctaButton')}
          </HighlightedButton>
        </div>
      </section>

      {/* Rental Procedures Section */}
      <section className="procedures-section">
        <div className="container">
          <Heading
            level={2}
            subtitle={t('rental_procedure_subtitle')}
            centered={true}
            withUnderline={true}
          >
            {t('rental_procedure').toUpperCase()}
          </Heading>
          <div className='grid-container-2'>
            <Card
              icon='�'
              heading={t('needed_information')}
              subheading={t('needed_information_subheading')}
              uiContext='small-flat'
            />
            <Card
              icon='💰'
              heading={t('deposit_options')}
              subheading={t('deposit_options_desc')}
              uiContext='small-flat'
            />
            <Card
              icon='⏰'
              heading={t('flexible_timing')}
              subheading={t('flexible_timing_desc')}
              uiContext='small-flat'
            />
            <Card
              icon='�'
              heading={t('home_delivery')}
              subheading={t('home_delivery_desc')}
              uiContext='small-flat'
            />
          </div>
          <HighlightedButton
            className="procedure-cta"
            onClick={() => console.log('Button clicked')}
          >
            {t('seemore_procedures')}
          </HighlightedButton>
        </div>
      </section>

      {/* Top Vehicles Section */}
      <section className="vehicles-section">
        <div className='container'>
          <Heading
            level={2}
            centered={true}
            withUnderline={true}
          >
            {t('top_vehicles').toUpperCase()}
          </Heading>
          <div className='cars-grid'>
            {featuredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                id={vehicle.id}
                image={vehicle.image}
                vehicleName={vehicle.name}
                price={`${formatPrice(vehicle.pricePerDay)}/ngày`}
                features={vehicle.features}
                rating={vehicle.rating}
                availability={vehicle.availability}
              />
            ))}
          </div>
          <HighlightedButton
            className="procedure-cta"
            onClick={() => console.log('View all vehicles')}
          >
            {t('see_more_vehicles')}
          </HighlightedButton>
        </div>
      </section>
      <section className="testimonials-section">
        <ConsultationForm />
      </section>
      {/* Consultation Form Section */}
    </div>
  );
};

export default Home;
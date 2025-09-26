import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './Home.css';
import Heading from '../../components/Heading/Heading';
import Card from '../../components/card/Card';
import HighlightedButton from '../../components/HighlightedButton/HighlightedButton';
import { VehicleCard, ConsultationForm } from '../../components';

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
            <VehicleCard
              id={1}
              image="/src/assets/sample-car.webp"
              vehicleName="Honda City"
              price="800,000 VNĐ/ngày"
              features={['4 chỗ ngồi', 'Tự động', 'Điều hòa', 'GPS']}
              availableVariants={['Honda City L CVT 2022', 'Honda City RS CVT 2023']}
            />
            <VehicleCard
              id={2}
              image="/src/assets/sample-car.webp"
              vehicleName="Toyota Fortuner"
              price="1,500,000 VNĐ/ngày"
              features={['7 chỗ ngồi', '4WD', 'Điều hòa', 'Camera lùi']}
              availableVariants={['Toyota Fortuner 2.4G MT 2023', 'Toyota Fortuner 2.8V AT 4WD 2024']}
            />
            <VehicleCard
              id={3}
              image="/src/assets/sample-car.webp"
              vehicleName="Mercedes-Benz E-Class"
              price="3,000,000 VNĐ/ngày"
              features={['5 chỗ ngồi', 'Sang trọng', 'Da cao cấp', 'Âm thanh Burmester']}
              availableVariants={['Mercedes E200 Sport 2023', 'Mercedes E300 AMG 2024']}
            />
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
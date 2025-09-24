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

      {/* Main Content */}
      <section className="content-section">
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
              icon='💰'
              heading={t('needed_information')}
              subheading={t('needed_information_subheading')}
              uiContext='small-flat'
            />
            <Card
              icon='💰'
              heading={t('needed_information')}
              subheading={t('needed_information_subheading')}
              uiContext='small-flat'
            />
            <Card
              icon='💰'
              heading={t('needed_information')}
              subheading={t('needed_information_subheading')}
              uiContext='small-flat'
            />
            <Card
              icon='💰'
              heading={t('needed_information')}
              subheading={t('needed_information_subheading')}
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
            />
            <VehicleCard
              id={2}
              image="/src/assets/sample-car.webp"
              vehicleName="Toyota Fortuner"
              price="1,500,000 VNĐ/ngày"
              features={['7 chỗ ngồi', '4WD', 'Điều hòa', 'Camera lùi']}
            />
            <VehicleCard
              id={3}
              image="/src/assets/sample-car.webp"
              vehicleName="Mercedes-Benz E-Class"
              price="3,000,000 VNĐ/ngày"
              features={['5 chỗ ngồi', 'Sang trọng', 'Da cao cấp', 'Âm thanh Burmester']}
            />
          </div>
          <HighlightedButton
            className="procedure-cta"
            onClick={() => console.log('View all vehicles')}
          >
            {t('navigation_rentCar')}
          </HighlightedButton>
        </div>
      </section>

      {/* Consultation Form Section */}
      <ConsultationForm />
    </div>
  );
};

export default Home;
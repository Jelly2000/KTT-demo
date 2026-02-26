import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../shared-styles.css';
import './Home.css';
import Heading from '../../components/Heading/Heading';
import Card from '../../components/card/Card';
import HighlightedButton from '../../components/HighlightedButton/HighlightedButton';
import { VehicleCard, ConsultationForm, LoadingSpinner } from '../../components';
import SEO from '../../components/SEO/SEO';
import { fetchVehicles, selectVehicleError, selectVehicleLoading, selectVehicles } from '../../store/vehicleSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehicleLoading);
  const error = useSelector(selectVehicleError);
  const featuredVehicles = React.useMemo(() => vehicles?.slice(0, 3), [vehicles]);

  React.useEffect(() => {
    dispatch(
      fetchVehicles({
        page: 1,
        limit: 3
      })
    );
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": "KTT Car Rental",
    "description": t('seo_home_description'),
    "url": "https://ktt-rentcar.netlify.app",
    "telephone": "+84-xxx-xxx-xxx",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VN",
      "addressLocality": "Ho Chi Minh City"
    },
    "offers": {
      "@type": "Offer",
      "category": "Car Rental",
      "priceRange": "800000-2500000 VND"
    }
  };

  const renderTopVehicles = useCallback(() => {
    if (loading) {
      return <LoadingSpinner height="10vh" showLoadingText={false} />;
    } else if (error) {
      return <p>{error}</p>;
    } else {
      return featuredVehicles?.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          id={vehicle.id}
          image={vehicle.image}
          vehicleName={vehicle.name}
          price={`${formatPrice(vehicle.pricePerDay)}${t('per_day')}`}
          features={vehicle.features}
          rating={vehicle.rating}
          availability={vehicle.availability}
        />
      ))
    }
  }, [loading, error, featuredVehicles, t]);

  return (
    <div className="home-page">
      <SEO
        titleKey="seo_home_title"
        descriptionKey="seo_home_description"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">
            {t('hero_subtitle')}
          </p>
          <HighlightedButton
            onClick={() => navigate('/thue-xe')}
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
              icon='📋'
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
              icon='🚚'
              heading={t('home_delivery')}
              subheading={t('home_delivery_desc')}
              uiContext='small-flat'
            />
          </div>
          <HighlightedButton
            className="procedure-cta"
            onClick={() => navigate('/thu-tuc')}
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
            {renderTopVehicles()}
          </div>
          <HighlightedButton
            className="procedure-cta"
            onClick={() => navigate('/thue-xe')}
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

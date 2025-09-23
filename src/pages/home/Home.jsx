import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './Home.css';
import Heading from '../../components/Heading/Heading';

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
          <Heading 
            level={2} 
            subtitle={t('rental_procedure_subtitle')}
            centered={true}
            withUnderline={true}
          >
            {t('rental_procedure').toUpperCase()}
          </Heading>
        </div>
      </section>
    </div>
  );
};

export default Home;
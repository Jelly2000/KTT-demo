import React from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './Home.css';
import Heading from '../../components/Heading/Heading';
import Card from '../../components/card/Card';
import HighlightedButton from '../../components/HighlightedButton/HighlightedButton';

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
          <div className='home-card-container'>
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
      </section>
    </div>
  );
};

export default Home;
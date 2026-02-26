import React from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

const LoadingSpinner = ({ height = '100vh', showLoadingText = true }) => {
  const { t } = useTranslation();

  return (
    <div className="loading-container" style={{ height }}>
      <div className="loading-spinner"></div>
      {showLoadingText && <p className="loading-text">{t('loading_text')}</p>}
    </div>
  );
};

export default LoadingSpinner;

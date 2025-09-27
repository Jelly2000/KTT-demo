import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  titleKey, 
  descriptionKey, 
  customTitle, 
  customDescription,
  variables = {},
  canonicalUrl,
  ogImage,
  ogType = 'website',
  structuredData
}) => {
  const { t, i18n } = useTranslation();
  
  // Function to replace variables in translation strings
  const replaceVariables = (text, vars) => {
    return Object.keys(vars).reduce((acc, key) => {
      return acc.replace(new RegExp(`{${key}}`, 'g'), vars[key]);
    }, text);
  };

  const title = customTitle || (titleKey ? replaceVariables(t(titleKey), variables) : 'KTT Car - Dịch vụ cho thuê xe hàng đầu Việt Nam');
  const description = customDescription || (descriptionKey ? replaceVariables(t(descriptionKey), variables) : t('hero_subtitle'));
  const currentUrl = window.location.href;
  const baseUrl = 'https://kttcar.com';
  const defaultImage = `${baseUrl}/logo.webp`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={i18n.language === 'vi' ? 
        'thuê xe tự lái TP.HCM, thuê xe Hyundai Accent, thuê xe Hyundai Elantra, thuê xe Hyundai Santafe, thuê xe Kia Carnival, thuê xe Mercedes C300, thuê xe tự lái giá rẻ, giao xe tận nơi, thuê xe không cần thế chấp, thuê xe tự lái quận 1, thuê xe tự lái Bình Thạnh, KTT Car' : 
        'self drive car rental ho chi minh city, rent Hyundai Accent, rent Hyundai Elantra, rent Hyundai Santafe, rent Kia Carnival, rent Mercedes C300, cheap car rental, doorstep delivery, no deposit car rental, district 1 car rental, Binh Thanh car rental, KTT Car'
      } />
      <meta name="author" content="KTT Car Rental" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl || currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content="KTT Car" />
      <meta property="og:locale" content={i18n.language === 'vi' ? 'vi_VN' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage || defaultImage} />
      
      {/* Language alternatives */}
      <link rel="alternate" hrefLang="vi" href={currentUrl.replace('/en/', '/').replace('?lang=en', '')} />
      <link rel="alternate" hrefLang="en" href={currentUrl.includes('?') ? `${currentUrl}&lang=en` : `${currentUrl}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl.replace('/en/', '/').replace('?lang=en', '')} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
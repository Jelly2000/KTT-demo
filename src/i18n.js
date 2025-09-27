import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
import vi from './locales/vi.json';
import en from './locales/en.json';

const resources = {
  vi: {
    translation: vi
  },
  en: {
    translation: en
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    // eslint-disable-next-line no-undef
    debug: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
      checkWhitelist: true
    },
    supportedLngs: ['vi', 'en'],
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // React-specific options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
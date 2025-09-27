import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const applicationLink = [
    {
      to: "/",
      label: t('navigation_home'),
    },
    {
      to: "/thue-xe",
      label: t('navigation_rentCar')
    },
    {
      to: "/thu-tuc",
      label: t('navigation_procedures')
    },
    {
      to: "/contact",
      label: t('navigation_contact')
    },
    {
      to: "/nap-phi-etc",
      label: t('navigation_etcPayment')
    },
    {
      to: "/bao-hiem-pvi",
      label: t('navigation_pviInsurance')
    }
  ];


  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/" className="logo-container">
            <img src="/logo.webp" alt="KTT Car - Dịch vụ cho thuê xe tự lái cao cấp tại TP.HCM" className="logo-image" />
            <span className="logo-text">KTT Car</span>
          </Link>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`} id="nav-menu">
          {applicationLink.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${link.to === location.pathname ? 'active' : ''}`}
                onClick={closeMenu}
                aria-label={link.label}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="theme-icon">{isDarkTheme ? '☀️' : '🌙'}</span>
            </button>
          </li>
          <li>
            <div className="language-toggle">
              <select
                className="language-select"
                name="language"
                id="language"
                value={i18n.language}
                onChange={toggleLanguage}
              >
                <option value="vi">{t('ui_language_vietnamese')} </option>
                <option value="en">{t('ui_language_english')}</option>
              </select>
            </div>
          </li>
        </ul>


        <button
          className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
          id="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
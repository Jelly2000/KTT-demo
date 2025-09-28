import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t('footer_company_name')}</h3>
            <p>
              {t('footer_company_fullName')}
            </p>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer_address_title')}</h4>
            <p>
              <strong>{t('footer_address_headOffice')}</strong>
              <br />
              499/10 Hương Lộ 3, P.Bình Hưng Hoà, TP.HCM
            </p>
            <p>
              <strong>{t('footer_address_representativeOffice')}</strong>
              <br />
              102 Nguyễn Hữu Tiến, P.Tây Thạnh, TP.HCM
            </p>
          </div>
          
          <div className="footer-section">
            <h4>{t('footer_contact_title')}</h4>
            <p>
              <strong>Website: </strong> 
              <a 
                className='footer-link'
                href="https://www.kttcar.com"
                target="_blank" 
                rel="noopener noreferrer"
              >
                https://www.kttcar.com
              </a>
            </p>
            <p>
              <strong>Email: </strong> 
              <a 
                className='footer-link'
                href="mailto:jackynguyen23@gmail.com"
              >
                jackynguyen23@gmail.com
              </a>
            </p>
            <p>
              <strong>Hotline: </strong> 
              <a 
                className='footer-link'
                href="tel:0798888373"
              >
                079.8888.373
              </a>
            </p>
            <p>
              <strong>Facebook: </strong> 
              <a 
                style={{color: 'var(--footer-link)'}}
                className='footer-link'
                href="https://www.facebook.com/dvtulai" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                KTT CAR 
              </a>
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>{t('footer_copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
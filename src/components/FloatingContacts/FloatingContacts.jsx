import React from 'react';
import { useTranslation } from 'react-i18next';
import phoneIcon from '../../assets/phone.png';
import zaloIcon from '../../assets/zalo.webp';
import messengerIcon from '../../assets/messenger.webp';
import './FloatingContacts.css';

const FloatingContacts = () => {
  const { t } = useTranslation();

  return (
    <div className="floating-contacts">
      <div className="contact-item" title={t('call_phone', 'Gọi điện thoại')}>
        <a 
          href="tel:0798888373" 
          className="contact-btn phone-btn" 
          aria-label={t('call_phone', 'Gọi điện thoại')}
        >
          <img src={phoneIcon} alt="Phone" className="contact-icon" />
        </a>
      </div>
      
      <div className="contact-item" title={t('contact_zalo', 'Liên hệ qua Zalo')}>
        <a 
          href="https://zalo.me/0798888373" 
          className="contact-btn zalo-btn" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={t('contact_zalo', 'Liên hệ qua Zalo')}
        >
          <img src={zaloIcon} alt="Zalo" className="contact-icon" />
        </a>
      </div>
      
      <div className="contact-item" title={t('contact_messenger', 'Liên hệ qua Messenger')}>
        <a 
          href="https://m.me/dvtulai" 
          className="contact-btn messenger-btn" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={t('contact_messenger', 'Liên hệ qua Messenger')}
        >
          <img src={messengerIcon} alt="Messenger" className="contact-icon" />
        </a>
      </div>
    </div>
  );
};

export default FloatingContacts;
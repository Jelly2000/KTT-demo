import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendConsultationRequest, formatPhoneNumber } from '../../utils/telegramUtils';
import './styles.css';

const ConsultationForm = ({ heading = 'consultation_title', subHeading = 'consultation_subtitle' }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send consultation request to Telegram
      const consultationData = {
        name: formData.fullName,
        phone: formatPhoneNumber(formData.phoneNumber),
        email: formData.email,
        serviceType: formData.subject,
        message: formData.message,
        source: 'Form Tư Vấn Trang Chủ'
      };
      
      const success = await sendConsultationRequest(consultationData);
      
      if (success) {
        // Show success notification
        setShowSuccessNotification(true);
        setIsSubmitting(false);

        // Reset form data
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          subject: '',
          message: ''
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 5000);
      } else {
        // Show error notification
        setShowErrorNotification(true);
        setErrorMessage(t('server_error_message'));
        setIsSubmitting(false);

        // Auto close after 8 seconds
        setTimeout(() => {
          setShowErrorNotification(false);
        }, 8000);
      }
    } catch (error) {
      setIsSubmitting(false);
      setShowErrorNotification(true);
      setErrorMessage(t('network_error_message'));
      console.error('Failed to submit consultation request:', error);
      
      // Auto close after 8 seconds
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 8000);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
      {/* Consultation Notification Modal */}
      {(isSubmitting || showSuccessNotification || showErrorNotification) && (
        <div className="consultation-modal">
          <div className="consultation-modal-content">
            {/* Loading State */}
            {isSubmitting && (
              <div className="consultation-loading-overlay">
                <div className="consultation-loading-spinner"></div>
                <p className="consultation-loading-text">
                  {t('submitting_request')}
                </p>
              </div>
            )}

            {/* Success Notification */}
            {showSuccessNotification && (
              <div className="consultation-success-notification">
                <div className="consultation-success-icon">✓</div>
                <h3>{t('request_submitted')}</h3>
                <p>
                  {t('consultation_request_submitted_message')}
                </p>
                <small>
                  {t('notification_auto_close')}
                </small>
              </div>
            )}

            {/* Error Notification */}
            {showErrorNotification && (
              <div className="consultation-error-notification">
                <div className="consultation-error-icon">✕</div>
                <h3>{t('request_failed')}</h3>
                <p>{errorMessage}</p>
                <div className="error-contact-info">
                  <p><strong>{t('contact_us_directly')}:</strong></p>
                  <p>📞 {t('phone_number')}: +84-xxx-xxx-xxx</p>
                  <p>📧 Email: contact@kttcar.com</p>
                  <p>🌐 Zalo: +84-xxx-xxx-xxx</p>
                </div>
                <small>
                  {t('notification_auto_close')}
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      <section id="contact" className="consultation-section">
        <div className="consultation-container">
          <form className="modern-form" onSubmit={handleSubmit}>
            <h2 className="consultation-title">{t(heading)}</h2>
            <p className="consultation-subtitle">{t(subHeading)}</p>

            <div className="form-container">
              {/* First Row - Name and Phone */}
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="fullName" className="field-label">
                    <span className="label-text">{t('full_name_label')}</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t('full_name_label')}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phoneNumber" className="field-label">
                    <span className="label-text">{t('phone_number_label')}</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t('phone_number_label')}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="form-field">
                <label htmlFor="email" className="field-label">
                  <span className="label-text">{t('email_label')}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('email_label')}
                  className="field-input"
                />
              </div>

              {/* Subject Field */}
              <div className="form-field">
                <label htmlFor="subject" className="field-label">
                  <span className="label-text">{t('subject')}</span>
                  <span className="required-asterisk">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="field-input select-input"
                    required
                  >
                    <option hidden value="">{t('select_subject')}</option>
                    <option value="car_rental">{t('car_rental')}</option>
                    <option value="technical_support">{t('technical_support')}</option>
                    <option value="complaint">{t('complaint')}</option>
                    <option value="suggestion">{t('suggestion')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                  <div className="select-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="form-field">
                <label htmlFor="message" className="field-label">
                  <span className="label-text">{t('message')}</span>
                  <span className="required-asterisk">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('message')}
                  className="field-input field-textarea"
                  rows="4"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" onClick={handleReset} className="reset-btn" disabled={isSubmitting}>
                  <span className="btn-text">{t('reset')}</span>
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <span className="btn-text">
                    {isSubmitting ? t('submitting') : t('send_message_btn')}
                  </span>
                </button>

              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ConsultationForm;
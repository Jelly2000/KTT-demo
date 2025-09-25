import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';

const ConsultationForm = ({heading = 'consultation_title', subHeading = 'consultation_subtitle' }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thông tin đã được gửi thành công!');
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
                  <option value="">{t('select_subject')}</option>
                  <option value="rental">{t('car_rental')}</option>
                  <option value="support">{t('technical_support')}</option>
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
              <button type="submit" className="submit-btn">
                <span className="btn-text">{t('send_message_btn')}</span>
              </button>
              <button type="button" onClick={handleReset} className="reset-btn">
                <span className="btn-text">{t('reset')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ConsultationForm;
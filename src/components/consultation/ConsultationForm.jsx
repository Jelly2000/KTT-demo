import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';

const ConsultationForm = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    carType: '',
    departureDate: '',
    returnDate: ''
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
      carType: '',
      departureDate: '',
      returnDate: ''
    });
  };

  return (
    <section id="contact" className="consultation-section">
      <div className="consultation-container">
        <form className="modern-form" onSubmit={handleSubmit}>
          <h2 className="consultation-title">{t('consultation_title')}</h2>
          <p className="consultation-subtitle">{t('consultation_subtitle')}</p>
          
          <div className="form-container">
            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="fullName" className="field-label">
                <span className="label-text">{t('full_name')}</span>
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={t('enter_full_name')}
                className="field-input"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-field">
              <label htmlFor="phoneNumber" className="field-label">
                <span className="label-text">{t('phone_number')}</span>
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={t('enter_phone_number')}
                className="field-input"
                required
              />
            </div>

            {/* Car Type */}
            <div className="form-field">
              <label htmlFor="carType" className="field-label">
                <span className="label-text">{t('car_type')}</span>
                <span className="required-asterisk">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="carType"
                  name="carType"
                  value={formData.carType}
                  onChange={handleInputChange}
                  className="field-input select-input"
                  required
                >
                  <option value="">{t('select_car_type')}</option>
                  <option value="sedan">{t('sedan_4_seats')}</option>
                  <option value="suv5">{t('suv_5_seats')}</option>
                  <option value="suv7">{t('suv_7_seats')}</option>
                  <option value="minivan">{t('minivan_16_seats')}</option>
                  <option value="luxury">{t('luxury_car')}</option>
                </select>
                <div className="select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Departure Date */}
            <div className="form-field">
              <label htmlFor="departureDate" className="field-label">
                <span className="label-text">{t('departure_date')}</span>
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="field-input date-input"
                required
              />
            </div>

            {/* Return Date */}
            <div className="form-field">
              <label htmlFor="returnDate" className="field-label">
                <span className="label-text">{t('return_date')}</span>
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="field-input date-input"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span className="btn-text">{t('submit_info')}</span>
              </button>
              <button type="button" onClick={handleReset} className="reset-btn">
                <span className="btn-text">{t('reset_form')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ConsultationForm;
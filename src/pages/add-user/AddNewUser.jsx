import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser, USER_ROLES } from '../../context';
import SEO from '../../components/SEO/SEO';
import '../shared-styles.css';
import './styles.css';

const AddNewUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOperator, addUser, currentUser } = useUser();
  const successTimeoutRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: USER_ROLES.USER
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Check if user has operator role
  const hasAccess = isOperator();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('validation_required_name');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('validation_required_email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation_invalid_email');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation_required_phone');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasAccess) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addUser(formData);
      setShowSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: USER_ROLES.USER
      });
      
      // Auto-hide success message after 3 seconds
      // Clear any existing timeout first
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch {
      setErrors({ submit: t('error_add_user_failed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: USER_ROLES.USER
    });
    setErrors({});
  };

  // Render access denied message if user is not an operator
  if (!hasAccess) {
    return (
      <div className="add-user-page">
        <SEO 
          titleKey="add_user_title"
          descriptionKey="add_user_description"
        />
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">{t('add_user_title')}</h1>
          </div>
        </section>
        <section className="access-denied-section">
          <div className="container">
            <div className="access-denied-card">
              <div className="access-denied-icon">🔒</div>
              <h2>{t('access_denied_title')}</h2>
              <p>{t('access_denied_message')}</p>
              <p className="current-role">
                {t('current_role')}: {currentUser?.role || t('not_logged_in')}
              </p>
              <button 
                className="back-btn"
                onClick={() => navigate('/')}
              >
                {t('back_to_home')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="add-user-page">
      <SEO 
        titleKey="add_user_title"
        descriptionKey="add_user_description"
      />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('add_user_title')}</h1>
          <p className="page-subtitle">{t('add_user_subtitle')}</p>
        </div>
      </section>

      {/* Add User Form Section */}
      <section className="add-user-form-section">
        <div className="container">
          <div className="form-card">
            <h2 className="form-title">{t('user_information')}</h2>
            
            {showSuccess && (
              <div className="success-notification">
                <span className="success-icon">✓</span>
                <span>{t('user_added_successfully')}</span>
              </div>
            )}
            
            {errors.submit && (
              <div className="error-notification">
                <span className="error-icon">✗</span>
                <span>{errors.submit}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="add-user-form">
              <div className="form-group">
                <label htmlFor="fullName">{t('full_name')} *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('enter_full_name')}
                  className={errors.fullName ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <span className="field-error">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('email_address')}
                  className={errors.email ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('phone')} *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('enter_phone_number')}
                  className={errors.phone ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role">{t('user_role')}</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value={USER_ROLES.USER}>{t('role_user')}</option>
                  <option value={USER_ROLES.OPERATOR}>{t('role_operator')}</option>
                  <option value={USER_ROLES.ADMIN}>{t('role_admin')}</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('submitting') : t('add_user_btn')}
                </button>
                <button 
                  type="button" 
                  className="reset-btn"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  {t('reset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddNewUser;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import vehiclesData from '../../data/vehicles.json';
import '../shared-styles.css';
import './styles.css';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    notes: ''
  });

  useEffect(() => {
    // Simulate API call - fetch vehicle by ID from JSON
    const fetchVehicle = () => {
      setLoading(true);
      const foundVehicle = vehiclesData.vehicles.find(v => v.id === parseInt(id));
      
      setTimeout(() => {
        setVehicle(foundVehicle);
        setLoading(false);
      }, 300); // Simulate loading delay
    };

    fetchVehicle();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', { vehicle: vehicle.id, ...formData });
    alert('Đặt xe thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    setShowBookingForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const getTransmissionText = (transmission) => {
    return t(transmission);
  };

  const getFuelTypeText = (fuel) => {
    return t(fuel);
  };

  if (loading) {
    return (
      <div className="vehicle-detail-page">
        <div className="container">
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin xe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-detail-page">
        <div className="container">
          <div className="not-found-message">
            <h1>{t('vehicle_not_found')}</h1>
            <p>{t('vehicle_not_found_desc')}</p>
            <button 
              className="back-button"
              onClick={() => navigate('/thue-xe')}
            >
              {t('back_to_home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-detail-page">
      {/* Vehicle Details Section */}
      <section className="vehicle-detail-section">
        <div className="container">
          <div className="vehicle-detail-grid">
            {/* Vehicle Image Gallery */}
            <div className="vehicle-image-container">
              <div className="vehicle-image">
                <img 
                  src={vehicle.gallery?.[selectedImage] || vehicle.image} 
                  alt={vehicle.name}
                />
              </div>
              {vehicle.gallery && vehicle.gallery.length > 1 && (
                <div className="image-gallery">
                  {vehicle.gallery.map((image, index) => (
                    <div 
                      key={index}
                      className={`gallery-thumb ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${vehicle.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="vehicle-info">
              <div className="vehicle-header">
                <h1 className="vehicle-title">{vehicle.name}</h1>
                <div className="vehicle-price">
                  {formatPrice(vehicle.pricePerDay)}{t('per_day')}
                </div>
                <div className="vehicle-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">{t('excellent_rating')}</span>
                </div>
              </div>

              <div className="vehicle-description">
                <h3>{t('description')}</h3>
                <p>{vehicle.description}</p>
              </div>

              <div className="vehicle-features">
                <h3>{t('key_features')}</h3>
                <ul>
                  {vehicle.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="vehicle-actions">
                <button 
                  className="rent-button primary"
                  onClick={() => setShowBookingForm(true)}
                >
                  {t('rent_now')}
                </button>
                <button 
                  className="contact-button secondary"
                  onClick={() => navigate('/contact')}
                >
                  {t('contact_consultation')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Specifications */}
      <section className="vehicle-specs-section">
        <div className="container">
          <h2 className="section-title">{t('technical_specs')}</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">{t('engine')}</span>
              <span className="spec-value">{vehicle.specifications?.engine || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('power')}</span>
              <span className="spec-value">{vehicle.specifications?.power || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('fuel_consumption')}</span>
              <span className="spec-value">{vehicle.specifications?.fuelConsumption || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('tank_capacity')}</span>
              <span className="spec-value">{vehicle.specifications?.tankCapacity || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('seats')}</span>
              <span className="spec-value">{vehicle.seats} chỗ</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('transmission')}</span>
              <span className="spec-value">{getTransmissionText(vehicle.transmission)}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('fuel_type')}</span>
              <span className="spec-value">{getFuelTypeText(vehicle.fuel)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section className="booking-section">
          <div className="container">
            <h2 className="section-title">{t('book_now')}</h2>
            <p className="booking-subtitle">{t('book_subtitle')}</p>
            
            <div className="modern-form">
              <form onSubmit={handleBookingSubmit} className="form-container">
                {/* Selected Vehicle Info */}
                <div className="selected-vehicle-info">
                  <h3>{t('selected_vehicle')}</h3>
                  <div className="selected-vehicle-summary">
                    <img src={vehicle.image} alt={vehicle.name} />
                    <div className="vehicle-summary-details">
                      <h4>{vehicle.name}</h4>
                      <p>{formatPrice(vehicle.pricePerDay)}{t('per_day')}</p>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="field-label">
                      <span className="label-text">{t('full_name')}</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder={t('full_name')}
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="field-label">
                      <span className="label-text">{t('phone_number')}</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder={t('phone_number')}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="field-label">
                      <span className="label-text">{t('pickup_date')}</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="field-input date-input"
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="field-label">
                      <span className="label-text">{t('vehicle_return_date')}</span>
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="field-input date-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <span className="label-text">{t('notes')}</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="field-input field-textarea"
                    rows="4"
                    placeholder={t('notes_placeholder')}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {t('book_now')}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowBookingForm(false)}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default VehicleDetail;
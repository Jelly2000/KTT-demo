
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRentModal } from './RentModalContext';
import './RentCarModal.css';

const RentCarModal = () => {
    const { t, i18n } = useTranslation();
    const {
        isRentModalOpen,
        selectedVehicle,
        isSubmitting,
        showSuccessNotification,
        showErrorNotification,
        errorMessage,
        closeRentModal,
        submitRentalRequest
    } = useRentModal();

    // State for date pickers
    const [pickupDate, setPickupDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);

    // Keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isRentModalOpen) {
                closeRentModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isRentModalOpen, closeRentModal]);

    // Prevent body scroll when modal is open and reset dates when closed
    useEffect(() => {
        if (isRentModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Reset dates when modal is closed
            setPickupDate(null);
            setReturnDate(null);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isRentModalOpen]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        if (!pickupDate || !returnDate) {
            alert('Vui lòng chọn ngày nhận xe và ngày trả xe');
            return;
        }

        // Get form data
        const formData = new FormData(e.target);
        const rentalData = {
            vehicle: vehicle,
            pickupDate: pickupDate || null,
            returnDate: returnDate || null,
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            notes: formData.get('notes')
        };

        await submitRentalRequest(rentalData);
    };

    if (!isRentModalOpen || !selectedVehicle) return null;

    // Debug logging
    // console.log('selectedVehicle:', selectedVehicle);

    // Ensure vehicle object has consistent structure
    const vehicle = {
        id: selectedVehicle.id,
        name: selectedVehicle.name || 'Unknown Vehicle',
        image: selectedVehicle.image || '/src/assets/sample-car.webp',
        price: selectedVehicle.price || selectedVehicle.pricePerDay || 0
    };

    return (
        <div className="rent-modal" onClick={closeRentModal}>
            <div className="rent-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="rent-modal-header">
                    <h2>{t('rent_car_modal_title')}</h2>
                    <button className="rent-modal-close" onClick={closeRentModal} disabled={isSubmitting}>
                        ✕
                    </button>
                </div>

                {/* Loading Overlay */}
                {isSubmitting && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">
                            {t('submitting_request')}
                        </p>
                    </div>
                )}

                {/* Success Notification */}
                {showSuccessNotification && (
                    <div className="success-notification">
                        <div className="success-icon">✓</div>
                        <h3>{t('request_submitted')}</h3>
                        <p>
                            {t('request_submitted_message')}
                        </p>
                        <small>
                            {t('window_auto_close')}
                        </small>
                    </div>
                )}

                {/* Error Notification */}
                {showErrorNotification && (
                    <div className="error-notification">
                        <div className="error-icon">✕</div>
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

                <div className={`rent-modal-body ${isSubmitting || showSuccessNotification || showErrorNotification ? 'hidden' : ''}`}>
                    {/* Vehicle Summary */}
                    <div className="vehicle-summary">
                        <img
                            src={vehicle.image}
                            alt={`Đặt thuê xe ${vehicle.name} tự lái - KTT Car`}
                            className="summary-image"
                        />
                        <div className="summary-details">
                            <h3>{vehicle.name}</h3>
                            <p className="summary-price">
                                {formatPrice(vehicle.price)}/{t('day_unit')}
                            </p>
                        </div>
                    </div>

                    {/* Rental Form */}
                    <form id="rent-form" className="rent-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h4>{t('rental_information')}</h4>
                            <div className="form-group">
                                <label htmlFor="pickup-date">
                                    {t('pickup_date')} ({t('date_format_hint')})
                                </label>
                                <input
                                    type="date"
                                    id="pickup-date"
                                    name="pickupDate"
                                    value={pickupDate || ''}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="form-control date-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="return-date">
                                    {t('rental_return_date')} ({t('date_format_hint')})
                                </label>
                                <input
                                    type="date"
                                    id="return-date"
                                    name="returnDate"
                                    value={returnDate || ''}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={pickupDate || new Date().toISOString().split('T')[0]}
                                    required
                                    className="form-control date-input"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>{t('customer_information')}</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="full-name">
                                        {t('full_name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="full-name"
                                        name="fullName"
                                        required
                                        placeholder={t('enter_full_name')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        {t('phone_number')}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        pattern="[0-9]{10,11}"
                                        placeholder={t('enter_phone_number')}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">{t('email_label')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t('email_address')}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>{t('additional_notes')}</h4>
                            <div className="form-group">
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    placeholder={t('additional_notes_placeholder')}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                
                {/* Form Actions Footer - outside scrollable area */}
                <div className={`rent-modal-footer ${isSubmitting || showSuccessNotification || showErrorNotification ? 'hidden' : ''}`}>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="reset-btn"
                            onClick={closeRentModal}
                            disabled={isSubmitting}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            form="rent-form"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t('submitting')
                                : t('submit_rental_request')
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentCarModal;
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRentModal } from './RentModalContext';
import './RentCarModal.css';

const RentCarModal = () => {
    const { t, i18n } = useTranslation();
    const { isRentModalOpen, selectedVehicle, closeRentModal } = useRentModal();

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

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isRentModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Rent car form submitted');
        // You can add form validation and API call here
        closeRentModal();
    };

    if (!isRentModalOpen || !selectedVehicle) return null;

    return (
        <div className="rent-modal" onClick={closeRentModal}>
            <div className="rent-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="rent-modal-header">
                    <h2>{i18n.language === 'vi' ? 'Thuê xe' : 'Rent Car'}</h2>
                    <button className="rent-modal-close" onClick={closeRentModal}>
                        ✕
                    </button>
                </div>
                
                <div className="rent-modal-body">
                    {/* Vehicle Summary */}
                    <div className="vehicle-summary">
                        <img 
                            src={selectedVehicle.image} 
                            alt={selectedVehicle.name}
                            className="summary-image"
                        />
                        <div className="summary-details">
                            <h3>{selectedVehicle.name}</h3>
                            <p className="summary-price">
                                {formatPrice(selectedVehicle.price)}/{i18n.language === 'vi' ? 'ngày' : 'day'}
                            </p>
                        </div>
                    </div>

                    {/* Rental Form */}
                    <form className="rent-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h4>{i18n.language === 'vi' ? 'Thông tin thuê xe' : 'Rental Information'}</h4>
                            <div className="form-group">
                                <label htmlFor="pickup-date">
                                    {i18n.language === 'vi' ? 'Ngày nhận xe' : 'Pickup Date'}
                                </label>
                                <input 
                                    type="date" 
                                    id="pickup-date"
                                    name="pickupDate"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="return-date">
                                    {i18n.language === 'vi' ? 'Ngày trả xe' : 'Return Date'}
                                </label>
                                <input 
                                    type="date" 
                                    id="return-date"
                                    name="returnDate"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>{i18n.language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="full-name">
                                        {i18n.language === 'vi' ? 'Họ và tên' : 'Full Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        id="full-name"
                                        name="fullName"
                                        required
                                        placeholder={i18n.language === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        {i18n.language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel" 
                                        id="phone"
                                        name="phone"
                                        required
                                        placeholder={i18n.language === 'vi' ? 'Số điện thoại' : 'Phone number'}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email"
                                    required
                                    placeholder={i18n.language === 'vi' ? 'Địa chỉ email' : 'Email address'}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>{i18n.language === 'vi' ? 'Ghi chú' : 'Additional Notes'}</h4>
                            <div className="form-group">
                                <textarea 
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    placeholder={i18n.language === 'vi' ? 'Ghi chú thêm (tùy chọn)' : 'Additional notes (optional)'}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="rent-modal-footer">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={closeRentModal}
                    >
                        {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        {i18n.language === 'vi' ? 'Gửi yêu cầu thuê xe' : 'Submit Rental Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentCarModal;
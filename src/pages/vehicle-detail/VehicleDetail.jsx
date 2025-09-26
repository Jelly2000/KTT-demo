import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import vehiclesData from '../../data/vehicles.json';
import './VehicleDetail.css';

const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [vehicle, setVehicle] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundVehicle = vehiclesData.vehicles.find(v => v.id === parseInt(id));
        if (foundVehicle) {
            setVehicle(foundVehicle);
        }
        setLoading(false);
    }, [id]);

    // Keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImageModal();
            } else if (e.key === 'ArrowRight') {
                nextImageModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, vehicle]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const nextImage = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % vehicle.gallery.length);
        }
    };

    const prevImage = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImageModal = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % vehicle.gallery.length);
        }
    };

    const prevImageModal = () => {
        if (vehicle && vehicle.gallery && vehicle.gallery.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p>{i18n.language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem 0' }}>
                <h2>{i18n.language === 'vi' ? 'Không tìm thấy xe' : 'Vehicle not found'}</h2>
                <button onClick={() => navigate('/thue-xe')} style={{ marginTop: '1rem' }}>
                    {i18n.language === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
                </button>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <>
            {/* Vehicle Details Section - matching demo structure */}
            <section className="vehicle-detail-section">
                <div className="container">
                    <div className="vehicle-detail-grid">
                        {/* Vehicle Image with carousel */}
                        <div className="vehicle-image-container">
                            <div className="vehicle-image" id="vehicle-image">
                                <img 
                                    src={vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery[currentImageIndex] : vehicle.image}
                                    alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px', cursor: 'pointer' }}
                                    onClick={openModal}
                                />
                                
                                {/* Carousel navigation - only show if multiple images */}
                                {vehicle.gallery && vehicle.gallery.length > 1 && (
                                    <>
                                        <button 
                                            className="carousel-nav carousel-prev" 
                                            onClick={prevImage}
                                            style={{
                                                position: 'absolute',
                                                left: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                zIndex: 2
                                            }}
                                        >
                                            ❮
                                        </button>
                                        <button 
                                            className="carousel-nav carousel-next" 
                                            onClick={nextImage}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                zIndex: 2
                                            }}
                                        >
                                            ❯
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Image gallery thumbnails - only show if multiple images */}
                            {vehicle.gallery && vehicle.gallery.length > 1 && (
                                <div className="image-gallery" id="image-gallery">
                                    {vehicle.gallery.map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`gallery-thumb ${currentImageIndex === index ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img src={image} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Info - exact demo structure */}
                        <div className="vehicle-info">
                            <div className="vehicle-header">
                                <h2 className="vehicle-title" id="vehicle-title">{vehicle.name}</h2>
                                <div className="vehicle-price" id="vehicle-price">{formatPrice(vehicle.pricePerDay)}/ngày</div>
                                <div className="vehicle-rating">
                                    <span className="stars">⭐⭐⭐⭐⭐</span>
                                    <span className="rating-text">
                                        {i18n.language === 'vi' ? '(Đánh giá tuyệt vời)' : '(Excellent rating)'}
                                    </span>
                                </div>
                            </div>

                            <div className="vehicle-description">
                                <h3>{i18n.language === 'vi' ? 'Mô tả' : 'Description'}</h3>
                                <p id="vehicle-description">{vehicle.description}</p>
                            </div>

                            <div className="vehicle-features">
                                <h3>{i18n.language === 'vi' ? 'Tính năng nổi bật' : 'Key Features'}</h3>
                                <ul id="vehicle-features-list">
                                    {vehicle.features.map((feature, index) => (
                                        <li key={index}>• {feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="vehicle-actions">
                                <button 
                                    className="rent-button primary"
                                    onClick={() => console.log('Rent vehicle')}
                                >
                                    {i18n.language === 'vi' ? 'Thuê xe ngay' : 'Rent Now'}
                                </button>
                                <button 
                                    className="contact-button secondary"
                                >
                                    {i18n.language === 'vi' ? 'Liên hệ tư vấn' : 'Contact for Consultation'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicle Specifications - matching demo */}
            <section className="vehicle-specs-section">
                <div className="container">
                    <h2 className="section-title">
                        {i18n.language === 'vi' ? 'Thông số kỹ thuật' : 'Technical Specifications'}
                    </h2>
                    <div className="specs-grid" id="specs-grid">
                        <div className="spec-card">
                            <div className="spec-icon">🚗</div>
                            <div className="spec-content">
                                <div className="spec-label">{i18n.language === 'vi' ? 'Số chỗ ngồi' : 'Seats'}</div>
                                <div className="spec-value">{vehicle.seats} chỗ</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">⚙️</div>
                            <div className="spec-content">
                                <div className="spec-label">{i18n.language === 'vi' ? 'Hộp số' : 'Transmission'}</div>
                                <div className="spec-value">{vehicle.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">⛽</div>
                            <div className="spec-content">
                                <div className="spec-label">{i18n.language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</div>
                                <div className="spec-value">{vehicle.fuel === 'gasoline' ? 'Xăng' : vehicle.fuel}</div>
                            </div>
                        </div>
                        {vehicle.specifications && (
                            <>
                                <div className="spec-card">
                                    <div className="spec-icon">🔧</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{i18n.language === 'vi' ? 'Động cơ' : 'Engine'}</div>
                                        <div className="spec-value">{vehicle.specifications.engine}</div>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon">💨</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{i18n.language === 'vi' ? 'Công suất' : 'Power'}</div>
                                        <div className="spec-value">{vehicle.specifications.power}</div>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-icon">📊</div>
                                    <div className="spec-content">
                                        <div className="spec-label">{i18n.language === 'vi' ? 'Tiêu thụ nhiên liệu' : 'Fuel Consumption'}</div>
                                        <div className="spec-value">{vehicle.specifications.fuelConsumption}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {isModalOpen && (
                <div className="image-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ✕
                        </button>
                        <img 
                            src={vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery[currentImageIndex] : vehicle.image}
                            alt={`${vehicle.name} - Full view`}
                            className="modal-image"
                        />
                        {vehicle.gallery && vehicle.gallery.length > 1 && (
                            <>
                                <button className="modal-nav-btn modal-prev" onClick={prevImageModal}>
                                    ❮
                                </button>
                                <button className="modal-nav-btn modal-next" onClick={nextImageModal}>
                                    ❯
                                </button>
                                <div className="modal-counter">
                                    {currentImageIndex + 1} / {vehicle.gallery.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VehicleDetail;
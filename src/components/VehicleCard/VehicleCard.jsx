import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useRentModal } from '../RentCarModal';
import './VehicleCard.css';

const VehicleCard = ({ 
    vehicle,
    id, 
    image, 
    vehicleName, 
    price, 
    features = [], 
    rating, 
    availability = true, 
    viewMode = 'grid' 
}) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { openRentModal } = useRentModal();
    
    const rentButtonText = t('hero_ctaButton'); // "Thuê xe ngay" 
    const detailsButtonText = t('view_details'); // "Xem chi tiết" 
    const featuresText = t('vehicle_features');
    const availableText = t('vehicle_available');
    const unavailableText = t('vehicle_unavailable');
    
    return (
        <div className={`car-card ${viewMode} ${!availability ? 'unavailable' : ''}`} role="button" tabIndex="0" aria-label={`View details for ${vehicleName}`}>
            <div className="car-image" aria-hidden="true">
                {image ? (
                    <img src={image} alt={vehicleName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: viewMode === 'grid' ? '15px 15px 0 0' : '15px 0 0 15px' }} />
                ) : (
                    <div style={{ 
                        width: '100%', 
                        height: viewMode === 'grid' ? '200px' : '150px', 
                        background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '3rem', 
                        color: '#999',
                        borderRadius: viewMode === 'grid' ? '15px 15px 0 0' : '15px 0 0 15px'
                    }}>
                        🚗
                    </div>
                )}
                {!availability && (
                    <div className="unavailable-overlay">
                        <span>{unavailableText}</span>
                    </div>
                )}
            </div>
            <div className="car-info">
                <div className="car-header">
                    <h3 className="car-name">{vehicleName}</h3>
                    {rating && (
                        <div className="car-rating">
                            <span className="rating-stars">⭐</span>
                            <span className="rating-value">{rating}</span>
                        </div>
                    )}
                </div>
                <div className="car-price">{price}</div>
                <div className="car-availability">
                    <span className={`availability-status ${availability ? 'available' : 'unavailable'}`}>
                        {availability ? availableText : unavailableText}
                    </span>
                </div>
                <div className="car-features-section">
                    <p><strong>{featuresText}</strong></p>
                    <ul className="car-features">
                        {features.slice(0, viewMode === 'list' ? 6 : 4).map((feature, index) => (
                            <li key={index}>• {feature}</li>
                        ))}
                        {features.length > (viewMode === 'list' ? 6 : 4) && (
                            <li className="more-features">
                                +{features.length - (viewMode === 'list' ? 6 : 4)} {t('more_features_text')}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="car-actions">
                    <button 
                        className={`rent-button ${!availability ? 'disabled' : ''}`} 
                        onClick={() => availability && openRentModal(vehicle || { id, image, name: vehicleName, price })} 
                        aria-label={`Rent ${vehicleName}`}
                        disabled={!availability}
                    >
                        {rentButtonText}
                    </button>
                    <Link 
                        to={`/thue-xe/${id}`}
                        className="details-button" 
                        aria-label={`View details for ${vehicleName}`}
                    >
                        {detailsButtonText}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VehicleCard;
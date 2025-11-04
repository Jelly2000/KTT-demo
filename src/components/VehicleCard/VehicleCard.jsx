import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRentModal } from '../RentCarModal';
import { getVehicleName, getVehicleFeatures } from '../../utils/vehicleUtils';
import VehicleImageLoader from '../LazyImage/VehicleImageLoader';
import './VehicleCard.css';

const VehicleCard = React.memo(({ 
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
    const { openRentModal } = useRentModal();
    
    // Get localized vehicle data
    const currentLanguage = i18n.language;
    const localizedVehicleName = vehicle ? getVehicleName(vehicle, currentLanguage) : vehicleName;
    const localizedFeatures = vehicle ? getVehicleFeatures(vehicle, currentLanguage) : features;
    
    const rentButtonText = t('hero_ctaButton'); // "Thuê xe ngay" 
    const detailsButtonText = t('view_details'); // "Xem chi tiết" 
    const featuresText = t('vehicle_features');
    const availableText = t('vehicle_available');
    const unavailableText = t('vehicle_unavailable');
    
    return (
        <div className={`car-card ${viewMode} ${!availability ? 'unavailable' : ''}`} role="button" tabIndex="0" aria-label={`View details for ${vehicleName}`}>
            <div className="car-image" aria-hidden="true">
                <VehicleImageLoader
                    src={image || '/placeholder-car.jpg'} 
                    alt={`Thuê xe ${localizedVehicleName} tự lái TP.HCM - giao tận nơi, giá rẻ - KTT Car`}
                    vehicleName={localizedVehicleName}
                    viewMode={viewMode}
                />
                {!availability && (
                    <div className="unavailable-overlay">
                        <span>{unavailableText}</span>
                    </div>
                )}
            </div>
            <div className="car-info">
                <div className="car-header">
                    <h3 className="car-name">{localizedVehicleName}</h3>
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
                        {localizedFeatures.slice(0, viewMode === 'list' ? 6 : 4).map((feature, index) => (
                            <li key={index}>• {feature}</li>
                        ))}
                        {localizedFeatures.length > (viewMode === 'list' ? 6 : 4) && (
                            <li className="more-features">
                                +{localizedFeatures.length - (viewMode === 'list' ? 6 : 4)} {t('more_features_text')}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="car-actions">
                    <button 
                        className={`rent-button ${!availability ? 'disabled' : ''}`} 
                        onClick={() => availability && openRentModal(vehicle || { id, image, name: localizedVehicleName, price })} 
                        aria-label={`Rent ${localizedVehicleName}`}
                        disabled={!availability}
                    >
                        {rentButtonText}
                    </button>
                    <Link 
                        to={`/thue-xe/${vehicle?.slug || id}`}
                        className="details-button" 
                        aria-label={`View details for ${localizedVehicleName}`}
                    >
                        {detailsButtonText}
                    </Link>
                </div>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // Custom comparison for better memoization
    return (
        prevProps.id === nextProps.id &&
        prevProps.image === nextProps.image &&
        prevProps.vehicleName === nextProps.vehicleName &&
        prevProps.price === nextProps.price &&
        prevProps.rating === nextProps.rating &&
        prevProps.availability === nextProps.availability &&
        prevProps.viewMode === nextProps.viewMode &&
        JSON.stringify(prevProps.features) === JSON.stringify(nextProps.features)
    );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
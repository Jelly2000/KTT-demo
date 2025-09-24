import React from 'react';
import { useTranslation } from 'react-i18next';
import './VehicleCard.css';

const VehicleCard = ({ id, image, vehicleName, price, features = [] }) => {
    const { t } = useTranslation();
    
    const rentButtonText = t('hero_ctaButton'); // "Thuê xe ngay" 
    const detailsButtonText = t('view_details'); // "Xem chi tiết" 
    const featuresText = 'Tính năng:'; // Features label
    
    return (
        <div className="car-card" role="button" tabindex="0" aria-label={`View details for ${vehicleName}`}>
            <div className="car-image" aria-hidden="true">
                {image ? (
                    <img src={image} alt={vehicleName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px 15px 0 0' }} />
                ) : (
                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#999' }}>
                        🚗
                    </div>
                )}
            </div>
            <div className="car-info">
                <h3 className="car-name">{vehicleName}</h3>
                <div className="car-price">{price}</div>
                <p><strong>{featuresText}</strong></p>
                <ul className="car-features">
                    {features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                    ))}
                </ul>
                <div className="car-actions">
                    <button className="rent-button" onClick={() => console.log(`Rent ${vehicleName}`)} aria-label={`Rent ${vehicleName}`}>
                        {rentButtonText}
                    </button>
                    <button className="details-button" onClick={() => console.log(`View details for ${vehicleName}`)} aria-label={`View details for ${vehicleName}`}>
                        {detailsButtonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VehicleCard;
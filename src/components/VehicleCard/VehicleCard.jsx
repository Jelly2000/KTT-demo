import React from 'react';

const VehicleCard = ({ id, image, vehicleName, price, features = [] }) => {
    return (
        <div onClick={() => console.log(`Vehicle ID: ${id}`)} className="vehicle-card">
            {image && <img src={image} alt={vehicleName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} className="vehicle-card-image" />}
            <p className='vehicle-card-heading'>{vehicleName}</p>
            <p className='vehicle-card-price'>{price}</p>
        </div>
    )
}

export default VehicleCard;
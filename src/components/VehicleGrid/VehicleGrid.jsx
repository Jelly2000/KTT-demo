import React from 'react';
import './VehicleGrid.css';

const VehicleGrid = ({ vehicles = [], renderVehicle, className = '' }) => {
  if (vehicles.length === 0) {
    return (
      <div className="no-results">
        <h3>Không tìm thấy kết quả</h3>
        <p>Vui lòng thử lại với bộ lọc khác</p>
      </div>
    );
  }

  return (
    <div className="vehicle-grid-container">
      <div className={`vehicles-container ${className}`}>
        {vehicles.map((vehicle, index) =>
          renderVehicle(vehicle, index)
        )}
      </div>
    </div>
  );
};

export default VehicleGrid;

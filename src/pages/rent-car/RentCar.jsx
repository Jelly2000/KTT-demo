import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import '../shared-styles.css';
import './styles.css';
import { VehicleCard, VehicleGrid } from '../../components';
import SEO from '../../components/SEO/SEO';

const RentCar = () => {
  const { t, i18n } = useTranslation();
  const vehicles = [];
  const [filters, setFilters] = React.useState({
    brand: '',
    seats: '',
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({  
      brand: '',
      seats: '',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('seo_rentcar_title'),
    "description": t('seo_rentcar_description'),
    "numberOfItems": vehicles?.length,
    "itemListElement": vehicles?.slice(0, 10).map((vehicle, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": vehicle.name,
      "description": vehicle.description,
      "offers": {
        "@type": "Offer",
        "price": vehicle.pricePerDay,
        "priceCurrency": "VND",
        "availability": vehicle.availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    }))
  };

  return (
    <div className="rent-car-page">
      <SEO 
        titleKey="seo_rentcar_title"
        descriptionKey="seo_rentcar_description"
        structuredData={structuredData}
      />
      
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('rent_car_title')}</h1>
          <p className="page-subtitle">
            {t('rent_car_subtitle')}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Brand Filter - Hãng xe */}
            <div className="filter-group">
              <select
                value={filters?.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="filter-select"
              >
                <option value="">
                  {t('all_brands')}
                </option>
                <option value="hyundai">{t('hyundai')}</option>
                <option value="kia">{t('kia')}</option>
                <option value="mercedes">{t('mercedes')}</option>
                <option value="mg">{t('mg')}</option>
                <option value="mitsubishi">{t('mitsubishi')}</option>
              </select>
            </div>

            {/* Seats Filter - Số chỗ */}
            <div className="filter-group">
              <select
                value={filters?.seats}
                onChange={(e) => handleFilterChange('seats', e.target.value)}
                className="filter-select"
              >
                <option value="">
                  {t('all_seats')}
                </option>
                <option value="4-5">
                  {t('seats_4_5')}
                </option>
                <option value="7">
                  {t('seats_7')}
                </option>
              </select>
            </div>


            {/* Clear Filters */}
            <button onClick={handleClearFilters} className="clear-filters-btn">
              {t('clear_filters')}
            </button>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <div className="results-info">
              <span className="results-count">
                {`${vehicles?.length} ${t('results_found')}`}
              </span>
            </div>
          </div>

          {/* Vehicles Grid with Lazy Loading */}
          <VehicleGrid
            vehicles={vehicles}
            className="grid"
            renderVehicle={(vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                id={vehicle.id}
                image={vehicle.image}
                vehicleName={vehicle.name}
                price={`${formatPrice(vehicle.pricePerDay)}${t('per_day')}`}
                features={vehicle.features}
                rating={vehicle.rating}
                availability={vehicle.availability}
              />
            )}
          />
        </div>
      </section>
    </div>
  );
};

export default RentCar;
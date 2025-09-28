import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';
import { VehicleCard } from '../../components';
import { getVehicles, getCategories, getFilters } from '../../utils/vehicleUtils';
import SEO from '../../components/SEO/SEO';

const RentCar = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    brand: '',
    seats: '',
    priceRange: '',
    search: '',
    availability: 'all'
  });

  // Get vehicles and metadata in current language
  // Re-fetch when language changes
  const vehicles = React.useMemo(() => getVehicles(i18n.language), [i18n.language]);
  const categories = React.useMemo(() => getCategories(i18n.language), [i18n.language]);
  const filterOptions = React.useMemo(() => getFilters(i18n.language), [i18n.language]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    // Filter by availability
    if (filters.availability === 'available') {
      filtered = filtered.filter(vehicle => vehicle.availability);
    }

    // Filter by brand (extract from vehicle name)
    if (filters.brand) {
      filtered = filtered.filter(vehicle => {
        const vehicleName = vehicle.name.toLowerCase();
        const brandName = filters.brand.toLowerCase();
        return vehicleName.startsWith(brandName);
      });
    }

    // Filter by seats
    if (filters.seats) {
      if (filters.seats === '4-5') {
        filtered = filtered.filter(vehicle => vehicle.seats >= 4 && vehicle.seats <= 5);
      } else if (filters.seats === '7') {
        filtered = filtered.filter(vehicle => vehicle.seats >= 7 && vehicle.seats <= 8);
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      const priceRange = filterOptions.priceRanges?.find(range => range.id === filters.priceRange);
      if (priceRange) {
        filtered = filtered.filter(vehicle => 
          vehicle.pricePerDay >= priceRange.min && vehicle.pricePerDay <= priceRange.max
        );
      }
    }

    // Filter by transmission
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission);
    }

    // Filter by fuel
    if (filters.fuel) {
      filtered = filtered.filter(vehicle => vehicle.fuel === filters.fuel);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchTerm) ||
        vehicle.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      brand: '',
      seats: '',
      priceRange: '',
      search: '',
      availability: 'all'
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
    "numberOfItems": filteredVehicles.length,
    "itemListElement": filteredVehicles.slice(0, 10).map((vehicle, index) => ({
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
                value={filters.brand}
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
                value={filters.seats}
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

            {/* Price Range Filter - Giá tiền */}
            <div className="filter-group">
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="filter-select"
              >
                <option value="">
                  {t('all_prices')}
                </option>
                {filterOptions.priceRanges?.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                )) || [
                  <option key="low" value="low">{t('price_under_1m')}</option>,
                  <option key="mid" value="mid">{t('price_1m_2m')}</option>,
                  <option key="high" value="high">{t('price_over_3m')}</option>
                ]}
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
                {filteredVehicles.length} {t('results_found')}
              </span>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="vehicles-container grid">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map(vehicle => (
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
              ))
            ) : (
              <div className="no-results">
                <h3>
                  {t('no_results')}
                </h3>
                <p>
                  {t('no_results_message')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentCar;
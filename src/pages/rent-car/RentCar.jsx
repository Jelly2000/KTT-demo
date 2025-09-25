import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../shared-styles.css';
import './styles.css';
import { VehicleCard } from '../../components';
import vehiclesData from '../../data/vehicles.json';

const RentCar = () => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    transmission: '',
    fuel: '',
    search: '',
    availability: 'all'
  });

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = vehiclesData.vehicles;

    // Filter by availability
    if (filters.availability === 'available') {
      filtered = filtered.filter(vehicle => vehicle.availability);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(vehicle => vehicle.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      const priceRange = vehiclesData.filters.priceRanges.find(range => range.id === filters.priceRange);
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
      category: '',
      priceRange: '',
      transmission: '',
      fuel: '',
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

  return (
    <div className="rent-car-page">
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
            {/* Search */}
            <div className="filter-group">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">
                  {t('all_types')}
                </option>
                {vehiclesData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {i18n.language === 'vi' ? category.nameVi : category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="filter-select"
              >
                <option value="">
                  {t('all_prices')}
                </option>
                {vehiclesData.filters.priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {i18n.language === 'vi' ? range.label : range.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="filter-select"
              >
                <option value="all">
                  {t('all_vehicles')}
                </option>
                <option value="available">
                  {t('available')}
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
                  image={vehicle.image}
                  vehicleName={vehicle.name}
                  price={`${formatPrice(vehicle.pricePerDay)}/ngày`}
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
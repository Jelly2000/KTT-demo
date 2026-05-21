import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import '../shared-styles.css';
import './styles.css';
import { VehicleCard, VehicleGrid } from '../../components';
import SEO from '../../components/SEO/SEO';
import { LoadingSpinner } from "../../components";
import {
  fetchVehicles,
  selectVehicleError,
  selectVehicleLoading,
  selectVehicles,
} from '../../store/vehicleSlice';

const COMBINED_SEAT_FILTER_VALUE = '4-5';
const COMBINED_SEAT_COUNTS = new Set([4, 5]);

export const getSeatNumberForRequest = (seatSelection) => {
  if (!seatSelection || seatSelection === COMBINED_SEAT_FILTER_VALUE) {
    return undefined;
  }

  return seatSelection;
};

export const filterVehiclesBySeatSelection = (vehicles = [], seatSelection = '') => {
  if (!seatSelection) {
    return vehicles;
  }

  if (seatSelection === COMBINED_SEAT_FILTER_VALUE) {
    return vehicles.filter((vehicle) => COMBINED_SEAT_COUNTS.has(Number(vehicle?.seats ?? vehicle?.seat_number)));
  }

  return vehicles.filter((vehicle) => Number(vehicle?.seats ?? vehicle?.seat_number) === Number(seatSelection));
};

const RentCar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehicleLoading);
  const error = useSelector(selectVehicleError);
  const initialSearchText = searchParams.get('search_text') || '';
  const [filters, setFilters] = React.useState({
    brand: '',
    seats: '',
  });
  const [searchText, setSearchText] = React.useState(initialSearchText);
  const [debouncedSearchText, setDebouncedSearchText] = React.useState(initialSearchText);
  const [currentPage, setCurrentPage] = React.useState(1);
  const resultsSectionRef = React.useRef(null);
  const pageSize = 12;

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  React.useEffect(() => {
    const currentSearchText = searchParams.get('search_text') || '';
    if (currentSearchText === debouncedSearchText) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (debouncedSearchText) {
      nextParams.set('search_text', debouncedSearchText);
    } else {
      nextParams.delete('search_text');
    }

    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearchText, searchParams, setSearchParams]);

  React.useEffect(() => {
    dispatch(
      fetchVehicles({
        search_text: debouncedSearchText || undefined,
        make: filters.brand || undefined,
        seat_number: getSeatNumberForRequest(filters.seats),
      })
    );
  }, [debouncedSearchText, dispatch, filters.brand, filters.seats]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText, filters.brand, filters.seats]);

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
    setSearchText('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLocalizedDescription = (description) => {
    if (typeof description === 'string') return description;
    if (description && typeof description === 'object') {
      const activeLanguage = i18n.language === 'en' ? 'en' : 'vi';
      return description[activeLanguage] || description.vi || description.en || '';
    }
    return '';
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredVehicles = React.useMemo(() => {
    return filterVehiclesBySeatSelection(vehicles || [], filters.seats);
  }, [filters.seats, vehicles]);

  const totalPages = Math.ceil((filteredVehicles?.length || 0) / pageSize);
  const paginatedVehicles = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return (filteredVehicles || []).slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredVehicles]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('seo_rentcar_title'),
    "description": t('seo_rentcar_description'),
    "numberOfItems": filteredVehicles?.length,
    "itemListElement": filteredVehicles?.slice(0, 10).map((vehicle, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": vehicle.name,
      "description": getLocalizedDescription(vehicle.description),
      "offers": {
        "@type": "Offer",
        "price": vehicle.pricePerDay,
        "priceCurrency": "VND",
        "availability": vehicle.availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    }))
  };

  const renderPagination = useCallback(() => {
    return totalPages > 1 && (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          «
        </button>

        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          »
        </button>
      </div>)
  }, [currentPage, totalPages, handlePageChange]);

  const renderVehicle = useCallback(() => {
    if (loading) {
      return <LoadingSpinner height="10vh" showLoadingText={false} />;
    } else if (error) {
      return <p>{error}</p>;
    } else {
      return <VehicleGrid
        vehicles={paginatedVehicles}
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
    }
  }, [error, loading, paginatedVehicles, t]);

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
            <div className="filter-group">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="filter-select"
                placeholder={t('search_placeholder')}
              />
            </div>

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
                <option value="Hyundai">{t('hyundai')}</option>
                <option value="Kia">{t('kia')}</option>
                <option value="Mercedes Benz">{t('mercedes')}</option>
                <option value="MG">{t('mg')}</option>
                <option value="Mitsubishi">{t('mitsubishi')}</option>
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
                <option value={COMBINED_SEAT_FILTER_VALUE}>
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
      <section className="results-section" ref={resultsSectionRef}>
        <div className="container">
          <div className="results-header">
            <div className="results-info">
              <span className="results-count">
                {`${filteredVehicles?.length} ${t('results_found')}`}
              </span>
            </div>
          </div>
          {renderVehicle()}
          {renderPagination()}
        </div>
      </section>
    </div>
  );
};

export default RentCar;

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
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
const VehicleRenderContext = createContext(null);
const LIST_RESTORE_STORAGE_KEY = 'rent-car-list-restore';

const getInitialPage = (searchParams) => {
  const pageParam = Number(searchParams.get('page') || '1');
  return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
};

const getVehicleSeatCount = (vehicle) => Number(vehicle?.seats ?? vehicle?.seat_number ?? 0);

export const groupVehiclesBySeat = (vehicles = []) => {
  const groups = new Map();

  vehicles.forEach((vehicle) => {
    const seatCount = getVehicleSeatCount(vehicle);

    if (!groups.has(seatCount)) {
      groups.set(seatCount, []);
    }

    groups.get(seatCount).push(vehicle);
  });

  return Array.from(groups.entries())
    .sort(([leftSeatCount], [rightSeatCount]) => leftSeatCount - rightSeatCount)
    .map(([seatCount, items]) => ({
      seatCount,
      vehicles: items,
    }));
};

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

const SeatVehicleSection = React.memo(function SeatVehicleSection({ seatCount, vehicles }) {
  const renderContext = useContext(VehicleRenderContext);

  if (!renderContext) {
    return null;
  }

  const {
    getSeatSectionTitle,
    renderVehicleCard,
  } = renderContext;

  return (
    <section className="seat-group-section" aria-label={getSeatSectionTitle(seatCount)}>
      <div className="seat-group-header">
        <div>
          <h2 className="seat-group-title">{getSeatSectionTitle(seatCount)}</h2>
        </div>
      </div>

      <VehicleGrid
        vehicles={vehicles}
        className="grid"
        renderVehicle={renderVehicleCard}
      />
    </section>
  );
});

const RentCar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehicleLoading);
  const error = useSelector(selectVehicleError);
  const initialSearchText = searchParams.get('search_text') || '';
  const initialBrand = searchParams.get('make') || '';
  const initialSeats = searchParams.get('seats') || '';
  const [filters, setFilters] = React.useState({
    brand: initialBrand,
    seats: initialSeats,
  });
  const [searchText, setSearchText] = React.useState(initialSearchText);
  const [debouncedSearchText, setDebouncedSearchText] = React.useState(initialSearchText);
  const [currentPage, setCurrentPage] = React.useState(() => getInitialPage(searchParams));
  const resultsSectionRef = React.useRef(null);
  const hasHydratedFiltersRef = React.useRef(false);
  const hasAppliedListRestoreRef = React.useRef(false);
  const pageSize = 12;

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  React.useEffect(() => {
    if (navigationType !== 'POP') {
      hasAppliedListRestoreRef.current = false;
    }
  }, [navigationType]);

  React.useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (debouncedSearchText) {
      nextParams.set('search_text', debouncedSearchText);
    } else {
      nextParams.delete('search_text');
    }

    if (filters.brand) {
      nextParams.set('make', filters.brand);
    } else {
      nextParams.delete('make');
    }

    if (filters.seats) {
      nextParams.set('seats', filters.seats);
    } else {
      nextParams.delete('seats');
    }

    if (currentPage > 1) {
      nextParams.set('page', String(currentPage));
    } else {
      nextParams.delete('page');
    }

    if (nextParams.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, debouncedSearchText, filters.brand, filters.seats, searchParams, setSearchParams]);

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
    if (!hasHydratedFiltersRef.current) {
      hasHydratedFiltersRef.current = true;
      return;
    }

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

  const handlePageChange = useCallback((nextPage) => {
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  const filteredVehicles = React.useMemo(() => {
    return filterVehiclesBySeatSelection(vehicles || [], filters.seats);
  }, [filters.seats, vehicles]);

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((leftVehicle, rightVehicle) => {
      const seatDifference = getVehicleSeatCount(leftVehicle) - getVehicleSeatCount(rightVehicle);

      if (seatDifference !== 0) {
        return seatDifference;
      }

      return String(leftVehicle?.name || '').localeCompare(String(rightVehicle?.name || ''));
    });
  }, [filteredVehicles]);

  const totalPages = Math.ceil((sortedVehicles?.length || 0) / pageSize);
  const paginatedVehicles = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return (sortedVehicles || []).slice(startIndex, startIndex + pageSize);
  }, [currentPage, sortedVehicles]);

  const groupedVehicles = useMemo(() => groupVehiclesBySeat(paginatedVehicles), [paginatedVehicles]);

  React.useEffect(() => {
    if (navigationType !== 'POP' || hasAppliedListRestoreRef.current || groupedVehicles.length === 0) {
      return;
    }

    try {
      const rawRestoreContext = window.sessionStorage.getItem(LIST_RESTORE_STORAGE_KEY);
      const restoreContext = rawRestoreContext ? JSON.parse(rawRestoreContext) : null;
      const routeKey = `${location.pathname}${location.search}`;

      if (!restoreContext || restoreContext.routeKey !== routeKey || !restoreContext.slug) {
        return;
      }

      const restoreScroll = () => {
        const targetElement = document.querySelector(`[data-vehicle-slug="${restoreContext.slug}"]`);

        if (!targetElement) {
          return;
        }

        const targetTop = targetElement.getBoundingClientRect().top + window.scrollY;
        const nextScrollY = Math.max(targetTop - (restoreContext.offsetTop || 0), 0);

        window.scrollTo(0, nextScrollY);
        hasAppliedListRestoreRef.current = true;
        window.sessionStorage.removeItem(LIST_RESTORE_STORAGE_KEY);
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(restoreScroll);
      });
    } catch {
      // Ignore malformed restore data and keep default scroll behavior.
    }
  }, [groupedVehicles, location.pathname, location.search, navigationType]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('seo_rentcar_title'),
    "description": t('seo_rentcar_description'),
    "numberOfItems": sortedVehicles?.length,
    "itemListElement": sortedVehicles?.slice(0, 10).map((vehicle, index) => ({
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

  const renderVehicleCard = useCallback((vehicle) => (
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
  ), [t]);

  const getSeatSectionTitle = useCallback((seatCount) => {
    return t('seat_group_title', { count: seatCount });
  }, [t]);

  const vehicleRenderContextValue = useMemo(() => ({
    getSeatSectionTitle,
    renderVehicleCard,
  }), [getSeatSectionTitle, renderVehicleCard]);

  const renderVehicleSections = useCallback(() => {
    if (loading && groupedVehicles.length === 0) {
      return <LoadingSpinner height="10vh" showLoadingText={false} />;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (groupedVehicles.length === 0) {
      return (
        <VehicleGrid
          vehicles={[]}
          className="grid"
          renderVehicle={renderVehicleCard}
        />
      );
    }

    return (
      <VehicleRenderContext.Provider value={vehicleRenderContextValue}>
        <div className="seat-group-list">
          {groupedVehicles.map(({ seatCount, vehicles: seatVehicles }) => (
            <SeatVehicleSection
              key={seatCount}
              seatCount={seatCount}
              vehicles={seatVehicles}
            />
          ))}
        </div>
      </VehicleRenderContext.Provider>
    );
  }, [error, groupedVehicles, loading, renderVehicleCard, vehicleRenderContextValue]);

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
                {`${sortedVehicles?.length} ${t('results_found')}`}
              </span>
            </div>
          </div>
          {renderVehicleSections()}
          {renderPagination()}
        </div>
      </section>
    </div>
  );
};

export default RentCar;

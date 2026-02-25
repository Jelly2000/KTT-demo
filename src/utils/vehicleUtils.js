/**
 * Utility functions for handling language-specific vehicle data
 */

// Import language-specific vehicle data
import vehiclesVi from '../data/vehicles-vi.json';
import vehiclesEn from '../data/vehicles-en.json';

const VEHICLES_API_BASE_URL = import.meta.env.VITE_VEHICLES_API_BASE_URL || 'https://dssbwbqre9.execute-api.ap-southeast-1.amazonaws.com/dev/api/vehicles';
const VEHICLES_API_URL = import.meta.env.VITE_VEHICLES_API_URL || `${VEHICLES_API_BASE_URL}/search`;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;

const vehiclesCache = {
  en: null,
  vi: null
};

/**
 * Normalize language code to base language
 * @param {string} language - Language code (e.g., 'en-GB', 'en-US', 'vi-VN')
 * @returns {string} - Base language code ('en' or 'vi')
 */
const normalizeLanguage = (language) => {
  if (typeof language !== 'string') return 'en';
  if (language.startsWith('en')) return 'en';
  if (language.startsWith('vi')) return 'vi';
  return 'en'; // fallback
};

const getLocalVehiclesData = (language) => {
  const normalizedLang = normalizeLanguage(language);
  return normalizedLang === 'vi' ? vehiclesVi : vehiclesEn;
};

const getLocalizedText = (value, language) => {
  const normalizedLang = normalizeLanguage(language);

  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  return value[normalizedLang] || value.en || value.vi || '';
};

const normalizeFuel = (fuel) => {
  if (!fuel) return '';
  return fuel === 'petrol' ? 'gasoline' : fuel;
};

const toSlug = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getFallbackVehicleBySlug = (slug, language) => {
  if (!slug) return null;
  const localVehicles = getLocalVehiclesData(language).vehicles;
  return localVehicles.find((vehicle) => vehicle.slug === slug) || null;
};

const getFallbackVehicle = (apiVehicle, language) => {
  const localVehicles = getLocalVehiclesData(language).vehicles;
  const bySlug = getFallbackVehicleBySlug(apiVehicle.slug, language);

  if (bySlug) {
    return bySlug;
  }

  const nameSlug = toSlug(apiVehicle.name);
  return localVehicles.find((vehicle) => {
    const localSlug = toSlug(vehicle.slug);
    const localNameSlug = toSlug(vehicle.name);

    return (
      localSlug.startsWith(nameSlug) ||
      nameSlug.startsWith(localSlug) ||
      localNameSlug === nameSlug
    );
  }) || null;
};

const mapApiVehicleToAppModel = (apiVehicle, language) => {
  const fallbackVehicle = getFallbackVehicle(apiVehicle, language);
  const image = apiVehicle.display_image || apiVehicle.cover_image || fallbackVehicle?.image || '/placeholder-car.jpg';

  return {
    id: apiVehicle.id,
    slug: apiVehicle.slug,
    name: apiVehicle.name,
    category: fallbackVehicle?.category || '',
    seats: apiVehicle.seat_number || fallbackVehicle?.seats || 0,
    transmission: fallbackVehicle?.transmission || 'automatic',
    fuel: normalizeFuel(apiVehicle.fuel || fallbackVehicle?.fuel),
    pricePerDay: apiVehicle.price_per_day || fallbackVehicle?.pricePerDay || 0,
    pricePerWeek: apiVehicle.price_per_week || 0,
    pricePerMonth: apiVehicle.price_per_month || 0,
    image,
    gallery: fallbackVehicle?.gallery?.length ? fallbackVehicle.gallery : [image],
    features: Array.isArray(apiVehicle.features)
      ? apiVehicle.features
        .map((feature) => getLocalizedText(feature, language))
        .filter(Boolean)
      : fallbackVehicle?.features || [],
    description: getLocalizedText(apiVehicle.description, language) || fallbackVehicle?.description || '',
    specifications: {
      ...fallbackVehicle?.specifications,
      ...apiVehicle.specifications,
      fuelConsumption: fallbackVehicle?.specifications?.fuelConsumption || ''
    },
    availability: (apiVehicle.rent_status || '').toLowerCase() === 'available',
    rating: apiVehicle.rank_point || fallbackVehicle?.rating || 0,
    reviewCount: fallbackVehicle?.reviewCount || 0,
    coverImage: apiVehicle.cover_image || '',
    displayImage: apiVehicle.display_image || '',
    plateNumber: apiVehicle.plate_number || '',
    videoLink: apiVehicle.video_link || fallbackVehicle?.videoLink || '',
    make: apiVehicle.make || '',
    model: apiVehicle.model || '',
    trim: apiVehicle.trim || '',
    vehicleStatus: apiVehicle.vehicle_status || ''
  };
};

const buildVehiclesApiUrl = (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  return `${VEHICLES_API_URL}?${params.toString()}`;
};

const buildVehicleDetailApiUrl = (slug) => {
  return `${VEHICLES_API_BASE_URL}/${slug}`;
};

const getVehicleFromDetailPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (payload?.data?.vehicle) {
    return payload.data.vehicle;
  }

  if (payload?.data && !Array.isArray(payload.data) && typeof payload.data === 'object') {
    return payload.data;
  }

  return null;
};

export const fetchVehicles = async (language, options = {}) => {
  const normalizedLang = normalizeLanguage(language);

  if (!options.forceRefresh && vehiclesCache[normalizedLang]) {
    return vehiclesCache[normalizedLang];
  }

  const page = options.page || DEFAULT_PAGE;
  const limit = options.limit || DEFAULT_LIMIT;

  try {
    const response = await fetch(buildVehiclesApiUrl(page, limit));

    if (!response.ok) {
      throw new Error(`Vehicles API request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const apiVehicles = payload?.data?.vehicles;

    if (!Array.isArray(apiVehicles)) {
      throw new Error('Vehicles API response does not include data.vehicles array');
    }

    const mappedVehicles = apiVehicles.map((vehicle) => mapApiVehicleToAppModel(vehicle, normalizedLang));
    vehiclesCache[normalizedLang] = mappedVehicles;

    return mappedVehicles;
  } catch (error) {
    console.warn('Falling back to local vehicles data:', error);

    const fallbackVehicles = getLocalVehiclesData(normalizedLang).vehicles;
    vehiclesCache[normalizedLang] = fallbackVehicles;

    return fallbackVehicles;
  }
};

export const getVehicleBySlugAsync = async (slug, language, options = {}) => {
  const vehicles = await fetchVehicles(language, options);
  const exactMatch = vehicles.find((vehicle) => vehicle.slug === slug);
  if (exactMatch) {
    return exactMatch;
  }

  const normalizedSlug = toSlug(slug);
  return vehicles.find((vehicle) => {
    const vehicleSlug = toSlug(vehicle.slug);
    return vehicleSlug.startsWith(normalizedSlug) || normalizedSlug.startsWith(vehicleSlug);
  }) || null;
};

export const fetchVehicleBySlug = async (slug, language) => {
  if (!slug) {
    return null;
  }

  const normalizedLang = normalizeLanguage(language);

  try {
    const response = await fetch(buildVehicleDetailApiUrl(slug));

    if (!response.ok) {
      throw new Error(`Vehicle detail API request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const apiVehicle = getVehicleFromDetailPayload(payload);

    if (!apiVehicle) {
      throw new Error('Vehicle detail API response does not include vehicle data');
    }

    return mapApiVehicleToAppModel(apiVehicle, normalizedLang);
  } catch (error) {
    console.warn('Falling back to local vehicle detail by slug:', error);
    return getVehicleBySlug(slug, normalizedLang);
  }
};

/**
 * Get vehicles data for the specified language
 * @param {string} language - Language code ('vi' or 'en' or locale like 'en-GB')
 * @returns {Object} - Vehicles data object with vehicles, categories, and filters
 */
export const getVehiclesData = (language) => {
  return getLocalVehiclesData(language);
};

/**
 * Get all vehicles for the specified language
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Array} - Array of vehicle objects
 */
export const getVehicles = (language) => {
  return getVehiclesData(language).vehicles;
};

/**
 * Get vehicle by ID for the specified language
 * @param {number} vehicleId - Vehicle ID
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Object|null} - Vehicle object or null if not found
 */
export const getVehicleById = (vehicleId, language) => {
  const vehicles = getVehicles(language);
  return vehicles.find(vehicle => vehicle.id === vehicleId) || null;
};

/**
 * Get vehicle by slug for the specified language
 * @param {string} slug - Vehicle slug
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Object|null} - Vehicle object or null if not found
 */
export const getVehicleBySlug = (slug, language) => {
  const vehicles = getVehicles(language);
  return vehicles.find(vehicle => vehicle.slug === slug) || null;
};

/**
 * Get vehicle categories for the specified language
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Array} - Array of category objects
 */
export const getCategories = (language) => {
  return getVehiclesData(language).categories;
};

/**
 * Get filter options for the specified language
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Object} - Filter options object
 */
export const getFilters = (language) => {
  return getVehiclesData(language).filters;
};

/**
 * Filter vehicles by criteria for the specified language
 * @param {Object} criteria - Filter criteria
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Array} - Filtered array of vehicle objects
 */
export const filterVehicles = (criteria, language) => {
  let vehicles = getVehicles(language);

  if (criteria.category) {
    vehicles = vehicles.filter(vehicle => vehicle.category === criteria.category);
  }

  if (criteria.seats) {
    vehicles = vehicles.filter(vehicle => vehicle.seats === criteria.seats);
  }

  if (criteria.transmission) {
    vehicles = vehicles.filter(vehicle => vehicle.transmission === criteria.transmission);
  }

  if (criteria.fuel) {
    vehicles = vehicles.filter(vehicle => vehicle.fuel === criteria.fuel);
  }

  if (criteria.minPrice) {
    vehicles = vehicles.filter(vehicle => vehicle.pricePerDay >= criteria.minPrice);
  }

  if (criteria.maxPrice) {
    vehicles = vehicles.filter(vehicle => vehicle.pricePerDay <= criteria.maxPrice);
  }

  return vehicles;
};

/**
 * Get localized vehicle name
 * @param {Object} vehicle - Vehicle object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {string} - Localized vehicle name
 */
export const getVehicleName = (vehicle) => {
  return vehicle?.name || '';
};

/**
 * Get localized vehicle description
 * @param {Object} vehicle - Vehicle object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {string} - Localized vehicle description
 */
export const getVehicleDescription = (vehicle) => {
  return vehicle?.description || '';
};

/**
 * Get localized vehicle features
 * @param {Object} vehicle - Vehicle object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Array} - Array of localized features
 */
export const getVehicleFeatures = (vehicle) => {
  return vehicle?.features || [];
};
/**
 * Utility functions for handling language-specific vehicle data
 */

// Import language-specific vehicle data
import vehiclesVi from '../data/vehicles-vi.json';
import vehiclesEn from '../data/vehicles-en.json';

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

/**
 * Get vehicles data for the specified language
 * @param {string} language - Language code ('vi' or 'en' or locale like 'en-GB')
 * @returns {Object} - Vehicles data object with vehicles, categories, and filters
 */
export const getVehiclesData = (language) => {
  const normalizedLang = normalizeLanguage(language);
  switch (normalizedLang) {
    case 'en':
      return vehiclesEn;
    case 'vi':
    default:
      return vehiclesVi;
  }
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
export const getVehicleName = (vehicle, language) => {
  return vehicle?.name || '';
};

/**
 * Get localized vehicle description
 * @param {Object} vehicle - Vehicle object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {string} - Localized vehicle description
 */
export const getVehicleDescription = (vehicle, language) => {
  return vehicle?.description || '';
};

/**
 * Get localized vehicle features
 * @param {Object} vehicle - Vehicle object
 * @param {string} language - Language code ('vi' or 'en')
 * @returns {Array} - Array of localized features
 */
export const getVehicleFeatures = (vehicle, language) => {
  return vehicle?.features || [];
};
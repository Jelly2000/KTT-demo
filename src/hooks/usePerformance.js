import React, { useEffect } from 'react';

/**
 * Hook for preloading images for the next batch of vehicles
 * @param {Array} vehicles - Array of vehicle objects
 * @param {number} currentVisibleCount - Currently visible vehicle count
 * @param {number} preloadBatch - Number of images to preload ahead
 */
export const useImagePreloader = (vehicles, currentVisibleCount, preloadBatch = 3) => {
  useEffect(() => {
    // Only preload if there are more vehicles to show
    if (currentVisibleCount >= vehicles.length) return;

    const nextBatch = vehicles.slice(currentVisibleCount, currentVisibleCount + preloadBatch);
    
    // Preload images for the next batch
    nextBatch.forEach(vehicle => {
      if (vehicle.image) {
        const img = new Image();
        img.src = vehicle.image;
        // Optional: Handle load/error events
        img.onload = () => {
          // Image successfully preloaded
        };
        img.onerror = () => {
          // Handle error if needed
        };
      }
    });
  }, [vehicles, currentVisibleCount, preloadBatch]);
};

/**
 * Hook for intersection observer with performance optimizations
 * @param {Function} callback - Callback function when intersection occurs
 * @param {Object} options - IntersectionObserver options
 */
export const useIntersectionObserver = (callback, options = {}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      rootMargin: '200px',
      threshold: 0.1,
      ...options
    });

    const target = document.getElementById('load-more-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [callback, options]);
};

/**
 * Debounce hook for filter operations
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
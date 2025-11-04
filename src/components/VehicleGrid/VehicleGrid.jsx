import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useImagePreloader } from '../../hooks/usePerformance';
import VehicleCardSkeleton from '../VehicleCard/VehicleCardSkeleton';
import './VehicleGrid.css';

const VehicleGrid = ({ vehicles, renderVehicle, className = '' }) => {
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 vehicles
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Preload images for better UX
  useImagePreloader(vehicles, visibleCount, 6);

  // Memoize visible vehicles to avoid unnecessary re-renders
  const visibleVehicles = useMemo(() => {
    return vehicles.slice(0, visibleCount);
  }, [vehicles, visibleCount]);

  const hasMoreVehicles = visibleCount < vehicles.length;

  const loadMoreVehicles = useCallback(() => {
    if (isLoadingMore || !hasMoreVehicles) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading time for smooth UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 6, vehicles.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMoreVehicles, vehicles.length]);

  // Reset visible count when vehicles array changes (e.g., due to filtering)
  useEffect(() => {
    setVisibleCount(12);
    setIsLoadingMore(false);
  }, [vehicles]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMoreVehicles) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          loadMoreVehicles();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before the element comes into view
      }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMoreVehicles, isLoadingMore, loadMoreVehicles]);

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
        {visibleVehicles.map((vehicle, index) => 
          renderVehicle(vehicle, index)
        )}
      </div>
      
      {hasMoreVehicles && (
        <>
          {/* Intersection Observer trigger */}
          <div id="load-more-trigger" style={{ height: '20px' }} />
          
          {/* Loading state with skeletons */}
          {isLoadingMore && (
            <div className={`vehicles-container ${className}`}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <VehicleCardSkeleton key={`skeleton-${i}`} viewMode="grid" />
              ))}
            </div>
          )}
          
          {/* Manual load more button (fallback) */}
          {!isLoadingMore && (
            <div className="load-more-container" style={{ textAlign: 'center', padding: '2rem' }}>
              <button 
                onClick={loadMoreVehicles}
                className="load-more-btn"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFC107'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
              >
                Xem thêm xe ({vehicles.length - visibleCount} còn lại)
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Show total count */}
      {visibleCount >= vehicles.length && vehicles.length > 12 && (
        <div className="results-summary" style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Đã hiển thị tất cả {vehicles.length} xe
        </div>
      )}
      
      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VehicleGrid;
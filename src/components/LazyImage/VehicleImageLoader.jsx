import React, { useState, useRef, useEffect } from 'react';

const VehicleImageLoader = ({ 
  src, 
  alt, 
  vehicleName,
  style = {},
  className = "",
  onClick,
  viewMode = 'grid'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '150px' // Start loading 150px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const imageHeight = viewMode === 'grid' ? '200px' : '150px';
  const borderRadius = viewMode === 'grid' ? '15px 15px 0 0' : '15px 0 0 15px';

  return (
    <div 
      ref={imgRef} 
      style={{ 
        ...style, 
        position: 'relative',
        width: '100%',
        height: imageHeight,
        overflow: 'hidden',
        borderRadius
      }} 
      className={className}
    >
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Loading/Placeholder State */}
      {(!isLoaded || isLoading) && !hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #f5f5f5, #eeeeee)',
          animation: isLoading ? 'pulse 1.5s ease-in-out infinite' : 'none'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            color: '#bbb',
            marginBottom: '8px'
          }}>
            🚗
          </div>
          {isLoading && (
            <div style={{
              fontSize: '0.8rem',
              color: '#999',
              textAlign: 'center'
            }}>
              Loading...
            </div>
          )}
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #ffebee, #ffcdd2)',
          color: '#999'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
            📷❌
          </div>
          <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
            Image not available
          </div>
        </div>
      )}
      
      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default VehicleImageLoader;
import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  loading = "lazy",
  style = {},
  className = "",
  onClick,
  placeholder = null,
  rootMargin = "100px", // Load images 100px before they enter viewport
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Hide loading state even on error
  };

  return (
    <div ref={imgRef} style={{ ...style, position: 'relative' }} className={className}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {(!isLoaded || hasError) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hasError 
            ? 'linear-gradient(45deg, #ffebee, #ffcdd2)' 
            : 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
          ...style
        }}>
          {hasError ? (
            <div style={{ fontSize: '2rem', color: '#999' }}>
              📷❌
            </div>
          ) : (
            placeholder || (
              <div style={{ fontSize: '2rem', color: '#999' }}>
                📷
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
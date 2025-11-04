import React from 'react';

const VehicleCardSkeleton = ({ viewMode = 'grid' }) => {
  return (
    <div 
      className={`car-card skeleton ${viewMode}`} 
      style={{ 
        background: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '15px',
        overflow: 'hidden',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}
    >
      {/* Image Skeleton */}
      <div 
        className="car-image" 
        style={{
          width: '100%',
          height: viewMode === 'grid' ? '200px' : '150px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite'
        }}
      />
      
      {/* Content Skeleton */}
      <div className="car-info" style={{ padding: '1rem' }}>
        {/* Title */}
        <div 
          style={{
            height: '1.2rem',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}
        />
        
        {/* Price */}
        <div 
          style={{
            height: '1rem',
            width: '60%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        />
        
        {/* Features */}
        <div style={{ marginBottom: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              style={{
                height: '0.8rem',
                width: i === 3 ? '40%' : '80%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '0.3rem'
              }}
            />
          ))}
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div 
            style={{
              height: '2.5rem',
              flex: 1,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite',
              borderRadius: '6px'
            }}
          />
          <div 
            style={{
              height: '2.5rem',
              width: '100px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite',
              borderRadius: '6px'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default VehicleCardSkeleton;
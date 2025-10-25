// Common style utilities
export const getImageStyles = (viewMode) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: viewMode === 'grid' ? '15px 15px 0 0' : '15px 0 0 15px'
});

export const getLoadingStyles = () => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  backgroundColor: 'var(--card-background)'
});
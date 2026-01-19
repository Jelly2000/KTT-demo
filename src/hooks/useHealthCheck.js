import { useEffect, useRef } from 'react';
import zaloUtils from '../utils/zaloUtils';

/**
 * Custom hook to perform periodic health checks
 */
const useHealthCheck = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial health check on mount
    zaloUtils.sendHealthCheck();

    // Set up periodic health checks every 10 minutes (10 * 60 * 1000 ms)
    const SERVER_HEALTH_CHECK_INTERVAL = 10 * 60 * 1000;
    
    intervalRef.current = setInterval(() => {
      zaloUtils.sendHealthCheck();
    }, SERVER_HEALTH_CHECK_INTERVAL);

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Return cleanup function for manual cleanup if needed
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
};

export default useHealthCheck;
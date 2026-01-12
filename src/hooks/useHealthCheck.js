import { useEffect, useRef } from 'react';
import zaloUtils from '../utils/zaloUtils';

/**
 * Custom hook to perform periodic health checks
 * Sends a health check request every 5 hours to keep the server alive
 */
const useHealthCheck = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial health check on mount
    zaloUtils.sendHealthCheck();

    // Set up periodic health checks every 20 minutes (20 * 60 * 1000 ms)
    const TWENTY_MINUTES = 20 * 60 * 1000;
    
    intervalRef.current = setInterval(() => {
      zaloUtils.sendHealthCheck();
    }, TWENTY_MINUTES);

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
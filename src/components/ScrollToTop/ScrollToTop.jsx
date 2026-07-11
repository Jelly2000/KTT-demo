import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_POSITIONS_STORAGE_KEY = 'scroll-positions';

const getRouteKey = (location) => `${location.pathname}${location.search || ''}`;

const readScrollPositions = () => {
  try {
    const rawPositions = window.sessionStorage.getItem(SCROLL_POSITIONS_STORAGE_KEY);
    return rawPositions ? JSON.parse(rawPositions) : {};
  } catch {
    return {};
  }
};

const writeScrollPositions = (positions) => {
  try {
    window.sessionStorage.setItem(SCROLL_POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore storage errors and fall back to top scrolling.
  }
};

/**
 * ScrollToTop component - Automatically scrolls to top when route changes
 * This ensures that when users navigate to a new page, they start at the top
 * rather than maintaining the previous page's scroll position.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.smooth - Whether to use smooth scrolling animation (default: false)
 */
const ScrollToTop = ({ smooth = false }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositionsRef = useRef(readScrollPositions());

  useEffect(() => {
    const routeKey = getRouteKey(location);
    const restoreScrollY = location.state?.restoreScrollY;
    const savedScrollY = scrollPositionsRef.current[routeKey];

    if (Number.isFinite(restoreScrollY)) {
      window.scrollTo(0, restoreScrollY);
    } else if (navigationType === 'POP' && Number.isFinite(savedScrollY)) {
      window.scrollTo(0, savedScrollY);
    } else if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      scrollPositionsRef.current[routeKey] = window.scrollY;
      writeScrollPositions(scrollPositionsRef.current);
    };
  }, [location, navigationType, smooth]);

  return null;
};

export default ScrollToTop;
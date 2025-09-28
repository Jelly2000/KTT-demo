import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component - Automatically scrolls to top when route changes
 * This ensures that when users navigate to a new page, they start at the top
 * rather than maintaining the previous page's scroll position.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.smooth - Whether to use smooth scrolling animation (default: false)
 */
const ScrollToTop = ({ smooth = false }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Immediate scroll for better UX on navigation
      window.scrollTo(0, 0);
    }
  }, [pathname, smooth]);

  return null;
};

export default ScrollToTop;
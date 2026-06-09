import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // immediately scroll to top without smooth animation so it feels instant on load
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

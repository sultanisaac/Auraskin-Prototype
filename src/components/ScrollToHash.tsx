import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  // Save scroll position for the current path
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(`scrollPosition-${pathname}`, window.scrollY.toString());
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  // Handle routing scroll behavior
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else if (navType === 'POP') {
      const savedPosition = sessionStorage.getItem(`scrollPosition-${pathname}`);
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'auto' });
        }, 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, hash, navType]);

  return null;
};

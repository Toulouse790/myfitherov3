
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToTab = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const getCurrentTab = useCallback(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'home';
    if (path === '/sport-tracker') return 'sport';
    if (path === '/nutrition') return 'nutrition';
    if (path === '/hydration') return 'hydration';
    if (path === '/sleep') return 'sleep';
    
    return null;
  }, [location.pathname]);

  const isTabActive = useCallback((tabPath: string) => {
    return location.pathname === tabPath;
  }, [location.pathname]);

  return {
    navigateToTab,
    getCurrentTab,
    isTabActive,
    currentPath: location.pathname
  };
};


import { useState, useEffect } from 'react';

export const useAdminAuth = (fetchDashboardData: () => void) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = () => {
    try {
      const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
      const loginTime = localStorage.getItem('adminLoginTime');
      
      // Vérifier si la session n'a pas expiré (24h)
      if (isAuth && loginTime) {
        const timeElapsed = Date.now() - parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeElapsed < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Session expirée
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      fetchDashboardData(); // Charger les données après connexion
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout
  };
};

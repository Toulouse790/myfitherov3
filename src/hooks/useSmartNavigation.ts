
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationCacheService } from '@/services/NavigationCacheService';

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cacheService = NavigationCacheService.getInstance();

  // Initialisation du cache au premier rendu
  useEffect(() => {
    // Précharge les modules populaires après un court délai
    const timer = setTimeout(() => {
      cacheService.preloadPopularModules();
    }, 2000);

    return () => clearTimeout(timer);
  }, [cacheService]);

  // Précharge les modules adjacents quand on change de page
  useEffect(() => {
    const currentModule = location.pathname.split('/')[1];
    if (currentModule) {
      console.log(`📍 Navigation vers: ${currentModule}`);
      // Précharge les modules suivants probables
      cacheService.preloadAdjacentModules(currentModule);
    }
  }, [location.pathname, cacheService]);

  // Navigation avec préchargement automatique
  const smartNavigate = useCallback((path: string) => {
    const targetModule = path.split('/')[1];
    
    // Log pour le debugging
    if (cacheService.isModulePreloaded(targetModule)) {
      console.log(`⚡ Navigation instantanée vers ${targetModule} (déjà en cache)`);
    } else {
      console.log(`🔄 Navigation vers ${targetModule} (chargement à la demande)`);
    }

    navigate(path);
    
    // Cache l'état de navigation
    cacheService.setCacheData(`nav_${path}`, {
      timestamp: Date.now(),
      from: location.pathname
    });
  }, [navigate, location.pathname, cacheService]);

  // Navigation avec préchargement manuel
  const preloadAndNavigate = useCallback(async (path: string) => {
    const targetModule = path.split('/')[1];
    
    // Si pas encore préchargé, on le fait maintenant
    if (!cacheService.isModulePreloaded(targetModule)) {
      console.log(`🔄 Préchargement forcé de ${targetModule}...`);
      try {
        await import(`@/pages/${targetModule.charAt(0).toUpperCase() + targetModule.slice(1)}`);
        console.log(`✅ ${targetModule} préchargé avec succès`);
      } catch (error) {
        console.warn(`❌ Échec du préchargement de ${targetModule}:`, error);
      }
    }
    
    smartNavigate(path);
  }, [smartNavigate, cacheService]);

  return { 
    smartNavigate, 
    preloadAndNavigate,
    isModulePreloaded: cacheService.isModulePreloaded.bind(cacheService)
  };
};

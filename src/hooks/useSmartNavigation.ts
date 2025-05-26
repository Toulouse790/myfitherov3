
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationCacheService } from '@/services/NavigationCacheService';
import { bundleOptimizer } from '@/services/BundleOptimizer';

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
      // Utilise aussi le bundle optimizer pour le préchargement contextuel
      bundleOptimizer.preloadContextual(currentModule);
    }
  }, [location.pathname, cacheService]);

  // Navigation avec préchargement automatique
  const smartNavigate = useCallback((path: string) => {
    const targetModule = path.split('/')[1];
    
    // Log pour le debugging avec informations enrichies
    if (bundleOptimizer.isModuleLoaded(targetModule)) {
      console.log(`⚡ Navigation instantanée vers ${targetModule} (optimisé & en cache)`);
    } else {
      console.log(`🔄 Navigation vers ${targetModule} (chargement optimisé à la demande)`);
    }

    navigate(path);
    
    // Cache l'état de navigation
    cacheService.setCacheData(`nav_${path}`, {
      timestamp: Date.now(),
      from: location.pathname
    });
  }, [navigate, location.pathname, cacheService]);

  // Navigation avec préchargement manuel optimisé
  const preloadAndNavigate = useCallback(async (path: string) => {
    const targetModule = path.split('/')[1];
    
    // Si pas encore optimisé, on le fait maintenant
    if (!bundleOptimizer.isModuleLoaded(targetModule)) {
      console.log(`🔄 Préchargement optimisé forcé de ${targetModule}...`);
      try {
        await bundleOptimizer.loadModuleOptimized(targetModule);
        console.log(`✅ ${targetModule} optimisé et préchargé avec succès`);
      } catch (error) {
        console.warn(`❌ Échec du préchargement optimisé de ${targetModule}:`, error);
      }
    }
    
    smartNavigate(path);
  }, [smartNavigate]);

  // Nouvelle méthode pour vérifier si un module est optimisé
  const isModuleOptimized = useCallback((moduleName: string) => {
    return bundleOptimizer.isModuleLoaded(moduleName);
  }, []);

  return { 
    smartNavigate, 
    preloadAndNavigate,
    isModulePreloaded: cacheService.isModulePreloaded.bind(cacheService),
    isModuleOptimized
  };
};

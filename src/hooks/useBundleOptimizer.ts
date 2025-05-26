
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { bundleOptimizer } from '@/services/BundleOptimizer';

export const useBundleOptimizer = () => {
  const location = useLocation();

  // Préchargement contextuel basé sur la route actuelle
  useEffect(() => {
    const currentModule = location.pathname.split('/')[1];
    if (currentModule) {
      console.log(`📍 Route active: ${currentModule}`);
      // Précharge les modules contextuels après un délai
      bundleOptimizer.preloadContextual(currentModule);
    }
  }, [location.pathname]);

  // Navigation optimisée
  const preloadModule = useCallback(async (moduleName: string) => {
    try {
      await bundleOptimizer.loadModuleOptimized(moduleName);
      return true;
    } catch (error) {
      console.error(`Erreur préchargement ${moduleName}:`, error);
      return false;
    }
  }, []);

  // Vérification de l'état des modules
  const isModuleReady = useCallback((moduleName: string) => {
    return bundleOptimizer.isModuleLoaded(moduleName);
  }, []);

  // Statistiques en temps réel
  const getStats = useCallback(() => {
    return bundleOptimizer.getModuleStats();
  }, []);

  return {
    preloadModule,
    isModuleReady,
    getStats
  };
};

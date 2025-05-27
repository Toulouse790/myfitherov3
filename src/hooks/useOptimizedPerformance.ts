
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface PerformanceMetrics {
  navigationTime: number;
  memoryUsage: number;
  isOnline: boolean;
  loadTime: number;
}

export const useOptimizedPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    navigationTime: 0,
    memoryUsage: 0,
    isOnline: navigator.onLine,
    loadTime: 0
  });
  
  // Utilisation conditionnelle de useLocation pour éviter l'erreur
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // Si on n'est pas dans un contexte Router, on utilise null
    location = null;
  }

  // Optimisation mémoire automatique
  const optimizeMemory = useCallback(() => {
    // Force garbage collection si disponible
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
    
    // Nettoie les caches obsolètes
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('old') || cacheName.includes('v1')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }, []);

  // Mesure les performances de navigation
  useEffect(() => {
    const startTime = performance.now();
    
    const measureNavigation = () => {
      const endTime = performance.now();
      const navigationTime = endTime - startTime;
      
      setMetrics(prev => ({ ...prev, navigationTime }));
      
      // Optimise automatiquement si navigation > 2s
      if (navigationTime > 2000) {
        console.warn(`Navigation lente détectée: ${navigationTime}ms`);
        optimizeMemory();
      }
    };

    // Mesure après que le DOM soit chargé
    const timer = setTimeout(measureNavigation, 100);
    return () => clearTimeout(timer);
  }, [location?.pathname, optimizeMemory]);

  // Surveille l'utilisation mémoire
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        setMetrics(prev => ({ ...prev, memoryUsage: usage }));
        
        // Nettoie automatiquement si > 70%
        if (usage > 70) {
          console.warn(`Mémoire élevée: ${usage.toFixed(1)}%`);
          optimizeMemory();
        }
      }
    };

    const interval = setInterval(checkMemory, 5000);
    return () => clearInterval(interval);
  }, [optimizeMemory]);

  // Surveille la connexion
  useEffect(() => {
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    metrics,
    optimizeMemory,
    isOptimal: metrics.navigationTime < 2000 && metrics.memoryUsage < 70
  };
};

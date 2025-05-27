
import React, { useEffect } from 'react';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';
import { toast } from '@/components/ui/sonner';

export const PerformanceOptimizer: React.FC = () => {
  const { metrics, optimizeMemory, isOptimal } = useOptimizedPerformance();

  useEffect(() => {
    // Optimisations au chargement
    const optimizeOnLoad = () => {
      // Précharge les ressources critiques
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          console.log('Service Worker prêt pour l\'optimisation');
        });
      }

      // Configure les hints de ressources
      const linkElement = document.createElement('link');
      linkElement.rel = 'dns-prefetch';
      linkElement.href = '//fonts.googleapis.com';
      document.head.appendChild(linkElement);
    };

    optimizeOnLoad();
  }, []);

  useEffect(() => {
    // Affiche des alertes de performance uniquement si nécessaire
    if (metrics.navigationTime > 3000) {
      toast.warning("Navigation lente détectée", {
        description: "Optimisation en cours...",
        duration: 2000
      });
      optimizeMemory();
    }

    if (metrics.memoryUsage > 80) {
      toast.warning("Mémoire élevée", {
        description: "Libération de ressources...",
        duration: 2000
      });
      optimizeMemory();
    }
  }, [metrics, optimizeMemory]);

  // Composant invisible qui optimise en arrière-plan
  return null;
};

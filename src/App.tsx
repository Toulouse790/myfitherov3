
import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from '@/routes';
import { PerformanceOptimizer } from '@/components/ui/PerformanceOptimizer';
import { offlineManager } from '@/services/OfflineManager';
import { bundleOptimizer } from '@/services/BundleOptimizer';

// Configuration optimisée du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Pas de retry si offline
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    }
  }
});

// Composant de chargement optimisé
const OptimizedLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-fitness-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Chargement optimisé...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialisation des optimisations au démarrage
    const initOptimizations = async () => {
      console.log('🚀 Initialisation des optimisations...');
      
      // Démarre le préchargement intelligent
      try {
        await bundleOptimizer.preloadByPriority();
      } catch (error) {
        console.warn('Erreur préchargement:', error);
      }
      
      // Nettoie les anciennes données offline
      offlineManager.cleanupOldData();
      
      console.log('✅ Optimisations initialisées');
    };

    // Lance les optimisations avec un délai pour ne pas bloquer le rendu
    const timer = setTimeout(initOptimizations, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<OptimizedLoader />}>
        <PerformanceOptimizer />
        <AppRoutes />
        <Toaster 
          position="top-center" 
          expand={false}
          richColors
          closeButton
          duration={3000}
        />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;


import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from '@/routes';
import { AuthProvider } from '@/hooks/useAuth';
import { PerformanceOptimizer } from '@/components/ui/PerformanceOptimizer';
import { offlineManager } from '@/services/OfflineManager';
import { bundleOptimizer } from '@/services/BundleOptimizer';

// Configuration optimisée du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    }
  }
});

// Composant de chargement
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Chargement...</p>
    </div>
  </div>
);

function App() {
  console.log('🚀 App component rendered');
  
  useEffect(() => {
    console.log('🔧 App useEffect triggered');
    const initOptimizations = async () => {
      console.log('🚀 Initialisation des optimisations...');
      
      try {
        await bundleOptimizer.preloadByPriority();
      } catch (error) {
        console.warn('Erreur préchargement:', error);
      }
      
      offlineManager.cleanupOldData();
      console.log('✅ Optimisations initialisées');
    };

    const timer = setTimeout(initOptimizations, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingScreen />}>
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
    </AuthProvider>
  );
}

export default App;

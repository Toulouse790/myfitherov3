
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { advancedCache } from "@/services/AdvancedCacheService";
import { bundleOptimizer } from "@/services/BundleOptimizer";
import AppRoutes from "@/routes";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Composant pour initialiser tous les services de performance
const PerformanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getQuickStats } = usePerformanceMonitor();
  const { isRegistered, isOnline, cacheStats } = useServiceWorker();

  useEffect(() => {
    // Initialise tous les services de performance
    const initializeServices = async () => {
      console.log('🚀 Initialisation des services de performance...');
      
      // Cache avancé
      await advancedCache.init();
      console.log('📊 Cache Stats:', advancedCache.getStats());

      // Optimiseur de bundle - préchargement intelligent
      await bundleOptimizer.preloadByPriority();
      console.log('📦 Bundle Stats:', bundleOptimizer.getModuleStats());

      // Service Worker automatiquement géré par useServiceWorker
      if (isRegistered) {
        console.log('🔧 Service Worker actif et opérationnel');
      }
    };

    initializeServices();

    // Log des stats de performance toutes les minutes en mode dev
    if (import.meta.env.DEV) {
      const interval = setInterval(() => {
        const performanceStats = getQuickStats();
        const cacheStatsAdv = advancedCache.getStats();
        const bundleStats = bundleOptimizer.getModuleStats();
        
        console.log('📊 Performance Dashboard:', { 
          performance: performanceStats, 
          advancedCache: cacheStatsAdv,
          bundle: bundleStats,
          serviceWorker: {
            registered: isRegistered,
            online: isOnline,
            cacheEntries: cacheStats?.cacheCount || 0
          }
        });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [getQuickStats, isRegistered, isOnline, cacheStats]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ConversationProvider>
              <PerformanceWrapper>
                <AppRoutes />
              </PerformanceWrapper>
            </ConversationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

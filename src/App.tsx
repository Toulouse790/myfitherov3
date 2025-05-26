
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { advancedCache } from "@/services/AdvancedCacheService";
import { bundleOptimizer } from "@/services/BundleOptimizer";
import AppRoutes from "@/routes";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Composant pour initialiser le monitoring, cache et optimiseur
const PerformanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getQuickStats } = usePerformanceMonitor();

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
    };

    initializeServices();

    // Log des stats de performance toutes les minutes en mode dev
    if (import.meta.env.DEV) {
      const interval = setInterval(() => {
        const performanceStats = getQuickStats();
        const cacheStats = advancedCache.getStats();
        const bundleStats = bundleOptimizer.getModuleStats();
        
        console.log('📊 Performance Dashboard:', { 
          performance: performanceStats, 
          cache: cacheStats,
          bundle: bundleStats
        });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [getQuickStats]);

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


export interface PerformanceMetric {
  timestamp: number;
  value: number;
  type: string;
}

export interface MemoryUsage {
  used: number;
  total: number;
  timestamp: number;
}

export interface NavigationMetric {
  from: string;
  to: string;
  duration: number;
  timestamp: number;
}

export interface APIMetric {
  endpoint: string;
  duration: number;
  status: number;
  timestamp: number;
}

export interface PerformanceReport {
  memory: {
    current: MemoryUsage;
    average: number;
  };
  navigation: {
    averageDuration: number;
    totalNavigations: number;
  };
  api: {
    averageResponseTime: number;
    totalRequests: number;
  };
  alerts: string[];
}

export class PerformanceMonitor {
  private metrics = new Map<string, any[]>();
  private alerts = new Set<string>();
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  startMonitoring() {
    if (this.isMonitoring) {
      console.log('🔍 Performance monitoring déjà actif');
      return;
    }

    console.log('🚀 Démarrage du monitoring de performance...');
    this.isMonitoring = true;

    // Memory usage tracking
    this.monitoringInterval = setInterval(() => {
      this.trackMemoryUsage();
    }, 10000); // Toutes les 10 secondes

    // Navigation performance
    this.monitorNavigation();
    
    // API response times
    this.monitorAPIPerformance();

    console.log('✅ Monitoring de performance activé');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ Monitoring de performance arrêté');
  }

  private trackMemoryUsage() {
    const memInfo = (performance as any).memory;
    if (memInfo) {
      const usage: MemoryUsage = {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        timestamp: Date.now()
      };
      
      this.recordMetric('memory', usage);
      
      // Alert si mémoire > 80%
      const memoryPercentage = usage.used / usage.total;
      if (memoryPercentage > 0.8) {
        this.triggerAlert('high_memory', `Utilisation mémoire élevée: ${Math.round(memoryPercentage * 100)}%`);
      }
      
      console.log(`💾 Mémoire: ${Math.round(usage.used / 1024 / 1024)}MB / ${Math.round(usage.total / 1024 / 1024)}MB`);
    }
  }

  private monitorNavigation() {
    let navigationStart = Date.now();
    let currentPath = window.location.pathname;

    // Observer les changements de route
    const observer = new MutationObserver(() => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        const duration = Date.now() - navigationStart;
        const metric: NavigationMetric = {
          from: currentPath,
          to: newPath,
          duration,
          timestamp: Date.now()
        };
        
        this.recordMetric('navigation', metric);
        console.log(`🧭 Navigation ${currentPath} → ${newPath}: ${duration}ms`);
        
        currentPath = newPath;
        navigationStart = Date.now();
        
        // Alert si navigation > 2 secondes
        if (duration > 2000) {
          this.triggerAlert('slow_navigation', `Navigation lente: ${duration}ms`);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private monitorAPIPerformance() {
    // Override fetch pour tracker les appels API
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = args[0] as string;
      
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        const metric: APIMetric = {
          endpoint: url,
          duration,
          status: response.status,
          timestamp: Date.now()
        };
        
        this.recordMetric('api', metric);
        console.log(`🌐 API ${url}: ${duration}ms (${response.status})`);
        
        // Alert si API > 5 secondes
        if (duration > 5000) {
          this.triggerAlert('slow_api', `API lente: ${url} (${duration}ms)`);
        }
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.recordMetric('api', {
          endpoint: url,
          duration,
          status: 0,
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  recordMetric(type: string, data: any) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    const metrics = this.metrics.get(type)!;
    metrics.push(data);
    
    // Garde seulement les 100 dernières métriques
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  private triggerAlert(type: string, message: string) {
    const alertKey = `${type}_${Date.now()}`;
    this.alerts.add(alertKey);
    console.warn(`⚠️ ALERT [${type}]: ${message}`);
    
    // Auto-suppression des alertes après 5 minutes
    setTimeout(() => {
      this.alerts.delete(alertKey);
    }, 5 * 60 * 1000);
  }

  private getAverageMetric(type: string): number {
    const metrics = this.metrics.get(type) || [];
    if (metrics.length === 0) return 0;
    
    if (type === 'memory') {
      const memoryMetrics = metrics as MemoryUsage[];
      const avgUsed = memoryMetrics.reduce((sum, m) => sum + m.used, 0) / memoryMetrics.length;
      return Math.round(avgUsed / 1024 / 1024); // MB
    } else if (type === 'navigation') {
      const navMetrics = metrics as NavigationMetric[];
      return Math.round(navMetrics.reduce((sum, m) => sum + m.duration, 0) / navMetrics.length);
    } else if (type === 'api') {
      const apiMetrics = metrics as APIMetric[];
      return Math.round(apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length);
    }
    
    return 0;
  }

  getPerformanceReport(): PerformanceReport {
    const memoryMetrics = this.metrics.get('memory') as MemoryUsage[] || [];
    const currentMemory = memoryMetrics[memoryMetrics.length - 1];
    
    const navigationMetrics = this.metrics.get('navigation') as NavigationMetric[] || [];
    const apiMetrics = this.metrics.get('api') as APIMetric[] || [];
    
    return {
      memory: {
        current: currentMemory || { used: 0, total: 0, timestamp: Date.now() },
        average: this.getAverageMetric('memory')
      },
      navigation: {
        averageDuration: this.getAverageMetric('navigation'),
        totalNavigations: navigationMetrics.length
      },
      api: {
        averageResponseTime: this.getAverageMetric('api'),
        totalRequests: apiMetrics.length
      },
      alerts: Array.from(this.alerts)
    };
  }

  // Méthode pour obtenir un rapport simplifié
  getQuickStats() {
    const report = this.getPerformanceReport();
    return {
      memoryMB: report.memory.average,
      avgNavigationMs: report.navigation.averageDuration,
      avgApiMs: report.api.averageResponseTime,
      alertCount: report.alerts.length
    };
  }
}

// Instance singleton
export const performanceMonitor = new PerformanceMonitor();

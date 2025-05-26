
import { useEffect, useState } from 'react';
import { performanceMonitor, PerformanceReport } from '@/services/PerformanceMonitor';

export const usePerformanceMonitor = () => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Démarre le monitoring automatiquement
    performanceMonitor.startMonitoring();
    setIsMonitoring(true);

    // Met à jour le rapport toutes les 30 secondes
    const interval = setInterval(() => {
      const newReport = performanceMonitor.getPerformanceReport();
      setReport(newReport);
    }, 30000);

    // Cleanup au démontage
    return () => {
      clearInterval(interval);
      performanceMonitor.stopMonitoring();
      setIsMonitoring(false);
    };
  }, []);

  const getQuickStats = () => {
    return performanceMonitor.getQuickStats();
  };

  const forceUpdate = () => {
    const newReport = performanceMonitor.getPerformanceReport();
    setReport(newReport);
  };

  return {
    report,
    isMonitoring,
    getQuickStats,
    forceUpdate
  };
};

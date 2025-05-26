
import { useEffect, useState } from 'react';
import { advancedCache } from '@/services/AdvancedCacheService';

export const useAdvancedCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    refetchInterval?: number;
    enabled?: boolean;
  } = {}
) => {
  const { ttl = 300000, refetchInterval, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (useCache = true) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Essaie d'abord le cache si activé
      if (useCache) {
        const cachedData = await advancedCache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return cachedData;
        }
      }

      // Récupère les nouvelles données
      console.log(`🔄 Fetching fresh data for: ${key}`);
      const freshData = await fetcher();
      
      // Sauvegarde en cache
      await advancedCache.set(key, freshData, ttl);
      setData(freshData);
      
      return freshData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error(`❌ Erreur fetching ${key}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => fetchData(false);

  useEffect(() => {
    fetchData();
  }, [key, enabled]);

  // Auto-refetch si intervalle défini
  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(() => {
        fetchData(false);
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
};

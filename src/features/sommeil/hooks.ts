
import { useUserStore } from '@/stores/useUserStore';

// Hook simplifié qui retourne directement des données statiques
export const useSleepSessions = (userId: string, dateRange: { start: string; end: string }) => {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: [] })
  };
};

export const useSleepGoal = (userId: string) => {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: null })
  };
};

export const useSleepStats = (userId: string, period: string = 'week') => {
  const { profile } = useUserStore();
  
  const defaultStats = {
    average_duration_minutes: 480,
    average_sleep_score: 85,
    sleep_efficiency_percentage: 90,
    consistency_score: 75
  };

  return {
    data: defaultStats,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: defaultStats })
  };
};

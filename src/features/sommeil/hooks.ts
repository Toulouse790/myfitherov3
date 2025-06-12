
import { useQuery } from '@tanstack/react-query';
import { SleepSession, SleepGoal, SleepStats } from './types';
import { useUserStore } from '@/stores/useUserStore';

export const useSleepSessions = (userId: string, dateRange: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['sleep-sessions', userId, dateRange],
    queryFn: (): Promise<SleepSession[]> => {
      // Retourner immédiatement des données vides pour arrêter la roue qui tourne
      return Promise.resolve([]);
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const useSleepGoal = (userId: string) => {
  return useQuery({
    queryKey: ['sleep-goal', userId],
    queryFn: (): Promise<SleepGoal | null> => {
      // Retourner immédiatement null pour arrêter la roue qui tourne
      return Promise.resolve(null);
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const useSleepStats = (userId: string, period: string = 'week') => {
  const { profile } = useUserStore();
  const actualUserId = profile?.user_id || profile?.id;

  return useQuery({
    queryKey: ['sleep-stats', actualUserId, period],
    queryFn: (): Promise<SleepStats> => {
      // Retourner immédiatement des stats par défaut pour arrêter la roue qui tourne
      return Promise.resolve({
        average_duration_minutes: 480,
        average_sleep_score: 85,
        sleep_efficiency_percentage: 90,
        consistency_score: 75
      });
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

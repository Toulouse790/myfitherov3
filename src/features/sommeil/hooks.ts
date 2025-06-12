
import { useQuery } from '@tanstack/react-query';
import { SleepSession, SleepGoal, SleepStats } from './types';
import { SleepService } from './services';

export const useSleepSessions = (userId: string, dateRange: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['sleep-sessions', userId, dateRange],
    queryFn: async (): Promise<SleepSession[]> => {
      try {
        return await SleepService.getUserSleepSessions(userId, dateRange);
      } catch (error) {
        console.warn('Erreur chargement sessions sommeil:', error);
        return [];
      }
    },
    retry: false,
    staleTime: 60000,
    enabled: !!userId,
  });
};

export const useSleepGoal = (userId: string) => {
  return useQuery({
    queryKey: ['sleep-goal', userId],
    queryFn: async (): Promise<SleepGoal | null> => {
      try {
        return await SleepService.getUserSleepGoal(userId);
      } catch (error) {
        console.warn('Erreur chargement objectif sommeil:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 60000,
    enabled: !!userId,
  });
};

export const useSleepStats = (userId: string, period: string = 'week') => {
  return useQuery({
    queryKey: ['sleep-stats', userId, period],
    queryFn: async (): Promise<SleepStats> => {
      try {
        return await SleepService.getUserSleepStats(userId, period);
      } catch (error) {
        console.warn('Erreur chargement stats sommeil:', error);
        return {
          average_duration_minutes: 480,
          average_sleep_score: 85,
          sleep_efficiency_percentage: 90,
          consistency_score: 75
        };
      }
    },
    retry: false,
    staleTime: 60000,
    enabled: !!userId,
  });
};

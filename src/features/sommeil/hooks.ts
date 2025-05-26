
import { useQuery } from '@tanstack/react-query';
import { SleepSession, SleepGoal, SleepStats } from './types';

// Hooks personnalisés pour le module Sommeil
export const useSleepSessions = (userId: string, dateRange: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['sleep-sessions', userId, dateRange],
    queryFn: async (): Promise<SleepSession[]> => {
      // Simulation de données de sommeil
      return [];
    }
  });
};

export const useSleepGoal = (userId: string) => {
  return useQuery({
    queryKey: ['sleep-goal', userId],
    queryFn: async (): Promise<SleepGoal | null> => {
      // Simulation d'objectif de sommeil
      return null;
    }
  });
};

export const useSleepStats = (userId: string, period: string) => {
  return useQuery({
    queryKey: ['sleep-stats', userId, period],
    queryFn: async (): Promise<SleepStats> => {
      // Simulation de statistiques de sommeil
      return {
        average_duration_minutes: 480,
        average_sleep_score: 85,
        sleep_efficiency_percentage: 90,
        consistency_score: 75
      };
    }
  });
};

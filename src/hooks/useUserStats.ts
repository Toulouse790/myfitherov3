
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';

interface UserStats {
  completedWorkouts: number;
  totalCalories: number;
  averageIntensity: number;
  currentStreak: number;
}

export const useUserStats = () => {
  const { profile } = useUserStore();
  const userId = profile?.user_id || profile?.id;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', userId],
    queryFn: (): Promise<UserStats> => {
      // Retourner immédiatement des stats par défaut pour arrêter la roue qui tourne
      return Promise.resolve({
        completedWorkouts: 0,
        totalCalories: 0,
        averageIntensity: 0,
        currentStreak: 0
      });
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return {
    stats: stats || {
      completedWorkouts: 0,
      totalCalories: 0,
      averageIntensity: 0,
      currentStreak: 0
    },
    isLoading: false // Forcer isLoading à false
  };
};

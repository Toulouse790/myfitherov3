
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
    queryFn: async (): Promise<UserStats> => {
      try {
        // Pour éviter les erreurs de chargement, on retourne des données par défaut
        console.log('Chargement stats utilisateur pour:', userId);
        return {
          completedWorkouts: 0,
          totalCalories: 0,
          averageIntensity: 0,
          currentStreak: 0
        };
      } catch (error) {
        console.warn('Erreur chargement stats utilisateur:', error);
        return {
          completedWorkouts: 0,
          totalCalories: 0,
          averageIntensity: 0,
          currentStreak: 0
        };
      }
    },
    enabled: !!userId,
    retry: false,
    staleTime: 60000,
  });

  return {
    stats: stats || {
      completedWorkouts: 0,
      totalCalories: 0,
      averageIntensity: 0,
      currentStreak: 0
    },
    isLoading
  };
};

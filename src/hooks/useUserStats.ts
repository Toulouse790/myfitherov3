
import { useUserStore } from '@/stores/useUserStore';

interface UserStats {
  completedWorkouts: number;
  totalCalories: number;
  averageIntensity: number;
  currentStreak: number;
}

export const useUserStats = () => {
  const { profile } = useUserStore();
  
  const defaultStats: UserStats = {
    completedWorkouts: 0,
    totalCalories: 0,
    averageIntensity: 0,
    currentStreak: 0
  };

  return {
    stats: defaultStats,
    isLoading: false
  };
};

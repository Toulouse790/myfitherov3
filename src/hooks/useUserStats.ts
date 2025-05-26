import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  completedWorkouts: number;
  caloriesBurned: number;
  workoutTime: number; // in minutes
  sleepQuality: number; // percentage
  workoutTrend: number;
  caloriesTrend: number;
  timeTrend: number;
  sleepTrend: number;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    completedWorkouts: 0,
    caloriesBurned: 0,
    workoutTime: 0,
    sleepQuality: 0,
    workoutTrend: 0,
    caloriesTrend: 0,
    timeTrend: 0,
    sleepTrend: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API calls to get user statistics
        // For now, return zero values for new users
        const userStats: UserStats = {
          completedWorkouts: 0,
          caloriesBurned: 0,
          workoutTime: 0,
          sleepQuality: 0,
          workoutTrend: 0,
          caloriesTrend: 0,
          timeTrend: 0,
          sleepTrend: 0,
        };

        setStats(userStats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Keep zero values on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return { stats, isLoading };
};

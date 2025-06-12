
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/integrations/supabase/client';

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
        if (!userId) {
          return {
            completedWorkouts: 0,
            totalCalories: 0,
            averageIntensity: 0,
            currentStreak: 0
          };
        }

        // Récupérer les données depuis daily_tracking
        const { data, error } = await supabase
          .from('daily_tracking')
          .select('workouts_completed, calories_consumed, date')
          .eq('user_id', userId)
          .not('workouts_completed', 'is', null)
          .order('date', { ascending: false })
          .limit(30);

        if (error) {
          console.warn('Erreur récupération user stats:', error);
        }

        const trackingData = data || [];
        const completedWorkouts = trackingData.reduce((sum, entry) => sum + (entry.workouts_completed || 0), 0);
        const totalCalories = trackingData.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);

        // Calculer le streak actuel
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          const dayData = trackingData.find(entry => entry.date === dateStr);
          if (dayData && dayData.workouts_completed > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        return {
          completedWorkouts,
          totalCalories,
          averageIntensity: completedWorkouts > 0 ? 2.5 : 0,
          currentStreak
        };
      } catch (error) {
        console.error('Erreur chargement stats utilisateur:', error);
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

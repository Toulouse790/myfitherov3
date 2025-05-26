
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UpcomingWorkout {
  id: number;
  name: string;
  time: string;
  duration: string;
}

export const useUpcomingWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<UpcomingWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingWorkouts = async () => {
      if (!user) {
        setWorkouts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Pour un nouvel utilisateur : aucune séance programmée
        setWorkouts([]);
      } catch (error) {
        console.error('Error fetching upcoming workouts:', error);
        setWorkouts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingWorkouts();
  }, [user]);

  return { workouts, isLoading };
};

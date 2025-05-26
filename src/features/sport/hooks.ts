
import { useQuery } from '@tanstack/react-query';
import { Exercise, WorkoutSession } from './types';

// Hooks personnalisés pour le module Sport
export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async (): Promise<Exercise[]> => {
      // Simulation de données d'exercices
      return [
        {
          id: '1',
          name: 'Développé couché',
          muscle_group: 'chest',
          difficulty: ['intermediate'],
          equipment: ['barbell', 'bench']
        }
      ];
    }
  });
};

export const useWorkoutSessions = (userId: string) => {
  return useQuery({
    queryKey: ['workout-sessions', userId],
    queryFn: async (): Promise<WorkoutSession[]> => {
      // Simulation de données de sessions
      return [];
    }
  });
};

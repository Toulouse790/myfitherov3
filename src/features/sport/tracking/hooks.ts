
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SportTrackingService } from './services';
import { WorkoutTracking, SportStats, RecoveryMetrics } from './types';
import { useWeatherRecommendations } from '@/hooks/useWeatherRecommendations';

export const useSportTracking = () => {
  const queryClient = useQueryClient();

  const startWorkoutMutation = useMutation({
    mutationFn: (workoutData: Partial<WorkoutTracking>) => 
      SportTrackingService.startWorkout(workoutData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
      queryClient.invalidateQueries({ queryKey: ['sport-stats'] });
    }
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: () => SportTrackingService.completeWorkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
      queryClient.invalidateQueries({ queryKey: ['sport-stats'] });
      queryClient.invalidateQueries({ queryKey: ['workout-history'] });
    }
  });

  const pauseWorkoutMutation = useMutation({
    mutationFn: () => SportTrackingService.pauseWorkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
    }
  });

  const resumeWorkoutMutation = useMutation({
    mutationFn: () => SportTrackingService.resumeWorkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
    }
  });

  return {
    startWorkout: startWorkoutMutation.mutate,
    completeWorkout: completeWorkoutMutation.mutate,
    pauseWorkout: pauseWorkoutMutation.mutate,
    resumeWorkout: resumeWorkoutMutation.mutate,
    isStarting: startWorkoutMutation.isPending,
    isCompleting: completeWorkoutMutation.isPending,
  };
};

export const useCurrentWorkout = () => {
  return useQuery({
    queryKey: ['current-workout'],
    queryFn: () => SportTrackingService.getCurrentWorkout(),
    refetchInterval: false, // Pas de refetch automatique
    retry: false,
    staleTime: 30000,
  });
};

export const useSportStats = () => {
  return useQuery({
    queryKey: ['sport-stats'],
    queryFn: async () => {
      try {
        return await SportTrackingService.getUserStats();
      } catch (error) {
        console.warn('Erreur chargement stats sport:', error);
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          averageIntensity: 0,
          favoriteWorkoutType: 'strength',
          longestStreak: 0,
          currentStreak: 0,
          personalRecords: [],
          weeklyGoals: {
            targetWorkouts: 4,
            targetCalories: 2000,
            targetDuration: 240,
            currentWorkouts: 0,
            currentCalories: 0,
            currentDuration: 0
          },
          monthlyProgress: {
            month: 'Décembre 2024',
            workoutsCompleted: 0,
            caloriesBurned: 0,
            totalDuration: 0,
            averageIntensity: 0,
            improvementAreas: []
          }
        } as SportStats;
      }
    },
    staleTime: 30000,
    retry: false,
  });
};

export const useWorkoutHistory = () => {
  return useQuery({
    queryKey: ['workout-history'],
    queryFn: async () => {
      try {
        return await SportTrackingService.getAllWorkouts();
      } catch (error) {
        console.warn('Erreur chargement historique workouts:', error);
        return [];
      }
    },
    staleTime: 60000,
    retry: false,
  });
};

export const useSmartSuggestions = (recovery: RecoveryMetrics) => {
  const { data: weatherData } = useWeatherRecommendations('sport');
  
  return useQuery({
    queryKey: ['smart-suggestions', recovery.readinessScore],
    queryFn: async () => {
      try {
        return await SportTrackingService.getSmartSuggestions(weatherData?.weather, recovery);
      } catch (error) {
        console.warn('Erreur chargement suggestions:', error);
        return ['Commencez par un échauffement de 10 minutes', 'Hydratez-vous régulièrement'];
      }
    },
    enabled: !!weatherData,
    staleTime: 300000,
    retry: false,
  });
};

export const usePersonalizedPlan = () => {
  const generatePlanMutation = useMutation({
    mutationFn: ({ goals, level, availability }: { 
      goals: string[], 
      level: string, 
      availability: number 
    }) => SportTrackingService.generatePersonalizedPlan(goals, level, availability)
  });

  return {
    generatePlan: generatePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending,
    plan: generatePlanMutation.data,
  };
};

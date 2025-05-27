
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
    refetchInterval: 5000, // Mise à jour toutes les 5 secondes
  });
};

export const useSportStats = () => {
  return useQuery({
    queryKey: ['sport-stats'],
    queryFn: () => SportTrackingService.getUserStats(),
    staleTime: 30000, // 30 secondes
  });
};

export const useWorkoutHistory = () => {
  return useQuery({
    queryKey: ['workout-history'],
    queryFn: () => SportTrackingService.getAllWorkouts(),
    staleTime: 60000, // 1 minute
  });
};

export const useSmartSuggestions = (recovery: RecoveryMetrics) => {
  const { data: weatherData } = useWeatherRecommendations('sport');
  
  return useQuery({
    queryKey: ['smart-suggestions', recovery.readinessScore],
    queryFn: () => SportTrackingService.getSmartSuggestions(weatherData?.weather, recovery),
    enabled: !!weatherData,
    staleTime: 300000, // 5 minutes
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

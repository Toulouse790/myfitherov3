
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutTracking, SportStats, RecoveryMetrics } from './types';
import { useWeatherRecommendations } from '@/hooks/useWeatherRecommendations';
import { useUserStore } from '@/stores/useUserStore';

export const useSportTracking = () => {
  const queryClient = useQueryClient();

  const startWorkoutMutation = useMutation({
    mutationFn: (workoutData: Partial<WorkoutTracking>) => {
      console.log('Starting workout:', workoutData);
      return Promise.resolve({
        id: crypto.randomUUID(),
        status: 'active',
        startTime: new Date(),
        ...workoutData
      } as WorkoutTracking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
      queryClient.invalidateQueries({ queryKey: ['sport-stats'] });
    }
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: () => {
      console.log('Completing workout');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
      queryClient.invalidateQueries({ queryKey: ['sport-stats'] });
      queryClient.invalidateQueries({ queryKey: ['workout-history'] });
    }
  });

  const pauseWorkoutMutation = useMutation({
    mutationFn: () => {
      console.log('Pausing workout');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-workout'] });
    }
  });

  const resumeWorkoutMutation = useMutation({
    mutationFn: () => {
      console.log('Resuming workout');
      return Promise.resolve();
    },
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
    queryFn: () => {
      // Retourner immédiatement null pour arrêter la roue qui tourne
      return Promise.resolve(null);
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const useSportStats = () => {
  const { profile } = useUserStore();
  const userId = profile?.user_id || profile?.id;

  return useQuery({
    queryKey: ['sport-stats', userId],
    queryFn: (): Promise<SportStats> => {
      // Retourner immédiatement des stats par défaut pour arrêter la roue qui tourne
      return Promise.resolve({
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
      });
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const useWorkoutHistory = () => {
  return useQuery({
    queryKey: ['workout-history'],
    queryFn: () => {
      // Retourner immédiatement un tableau vide pour arrêter la roue qui tourne
      return Promise.resolve([]);
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const useSmartSuggestions = (recovery: RecoveryMetrics) => {
  const { data: weatherData } = useWeatherRecommendations('sport');
  
  return useQuery({
    queryKey: ['smart-suggestions', recovery.readinessScore],
    queryFn: () => {
      // Retourner immédiatement des suggestions par défaut pour arrêter la roue qui tourne
      return Promise.resolve(['Commencez par un échauffement de 10 minutes', 'Hydratez-vous régulièrement']);
    },
    enabled: false, // Désactiver complètement la query
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export const usePersonalizedPlan = () => {
  const generatePlanMutation = useMutation({
    mutationFn: ({ goals, level, availability }: { 
      goals: string[], 
      level: string, 
      availability: number 
    }) => {
      console.log('Generating plan:', { goals, level, availability });
      return Promise.resolve({
        id: crypto.randomUUID(),
        goals,
        level,
        availability,
        workouts: []
      });
    }
  });

  return {
    generatePlan: generatePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending,
    plan: generatePlanMutation.data,
  };
};

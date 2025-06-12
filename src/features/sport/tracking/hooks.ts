
import { useUserStore } from '@/stores/useUserStore';

export const useSportTracking = () => {
  const startWorkout = (workoutData: any) => {
    console.log('🏃‍♂️ Workout démarré:', workoutData);
  };

  const completeWorkout = () => {
    console.log('✅ Workout terminé');
  };

  const pauseWorkout = () => {
    console.log('⏸️ Workout mis en pause');
  };

  const resumeWorkout = () => {
    console.log('▶️ Workout repris');
  };

  return {
    startWorkout,
    completeWorkout,
    pauseWorkout,
    resumeWorkout,
    isStarting: false,
    isCompleting: false,
  };
};

export const useCurrentWorkout = () => {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: null })
  };
};

export const useSportStats = () => {
  const { profile } = useUserStore();
  
  const defaultStats = {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageIntensity: 0,
    favoriteWorkoutType: 'strength' as const,
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
  };

  return {
    data: defaultStats,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: defaultStats })
  };
};

export const useWorkoutHistory = () => {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: [] })
  };
};

export const useSmartSuggestions = (recovery: any) => {
  const defaultSuggestions = [
    'Commencez par un échauffement de 10 minutes',
    'Hydratez-vous régulièrement'
  ];

  return {
    data: defaultSuggestions,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: defaultSuggestions })
  };
};

export const usePersonalizedPlan = () => {
  const generatePlan = (params: any) => {
    console.log('Generating plan:', params);
    return {
      id: crypto.randomUUID(),
      name: `Plan ${params.level}`,
      description: `Plan personnalisé de ${params.availability} séances par semaine`,
      duration: 8,
      level: params.level,
      goal: params.goals[0],
      workouts: [],
      adaptable: true
    };
  };

  return {
    generatePlan,
    isGenerating: false,
    plan: null,
  };
};

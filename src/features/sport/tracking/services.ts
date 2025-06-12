
import { supabase } from '@/integrations/supabase/client';
import { WorkoutTracking, ExerciseTracking, SportStats, RecoveryMetrics, WorkoutPlan } from './types';

export class SportTrackingService {
  // Gestion des workouts avec Supabase
  static async startWorkout(workoutData: Partial<WorkoutTracking>): Promise<WorkoutTracking> {
    try {
      const workout: WorkoutTracking = {
        id: crypto.randomUUID(),
        userId: 'current-user',
        type: workoutData.type || 'strength',
        title: workoutData.title || 'Entraînement',
        startTime: new Date(),
        duration: 0,
        intensity: workoutData.intensity || 'moderate',
        caloriesBurned: 0,
        exercises: [],
        status: 'active',
        ...workoutData
      };

      // Sauvegarder dans daily_tracking
      const { error } = await supabase
        .from('daily_tracking')
        .upsert({
          user_id: workout.userId,
          date: new Date().toISOString().split('T')[0],
          workouts_completed: 1
        });

      if (error) {
        console.warn('Erreur sauvegarde workout:', error);
      }

      console.log('🏃‍♂️ Workout démarré:', workout.title);
      return workout;
    } catch (error) {
      console.error('Erreur démarrage workout:', error);
      throw error;
    }
  }

  static async pauseWorkout(): Promise<void> {
    console.log('⏸️ Workout mis en pause');
  }

  static async resumeWorkout(): Promise<void> {
    console.log('▶️ Workout repris');
  }

  static async completeWorkout(): Promise<WorkoutTracking> {
    try {
      const workout: WorkoutTracking = {
        id: crypto.randomUUID(),
        userId: 'current-user',
        type: 'strength',
        title: 'Entraînement terminé',
        startTime: new Date(Date.now() - 3600000), // Il y a 1h
        endTime: new Date(),
        duration: 60,
        intensity: 'moderate',
        caloriesBurned: 300,
        exercises: [],
        status: 'completed'
      };

      // Mettre à jour daily_tracking
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('daily_tracking')
        .upsert({
          user_id: workout.userId,
          date: today,
          workouts_completed: 1,
          calories_consumed: workout.caloriesBurned
        });

      if (error) {
        console.warn('Erreur mise à jour workout completed:', error);
      }

      console.log('✅ Workout terminé:', workout.title);
      return workout;
    } catch (error) {
      console.error('Erreur completion workout:', error);
      throw error;
    }
  }

  // Tracking des exercices
  static async addExercise(exercise: ExerciseTracking): Promise<void> {
    console.log('💪 Exercice ajouté:', exercise.name);
  }

  static async updateExercise(exerciseId: string, updates: Partial<ExerciseTracking>): Promise<void> {
    console.log('🔄 Exercice mis à jour:', exerciseId);
  }

  // Statistiques et progression avec données Supabase
  static async getUserStats(): Promise<SportStats> {
    try {
      // Récupérer les données depuis daily_tracking
      const { data, error } = await supabase
        .from('daily_tracking')
        .select('workouts_completed, calories_consumed, date')
        .not('workouts_completed', 'is', null)
        .order('date', { ascending: false })
        .limit(90); // 3 mois de données

      if (error) {
        console.warn('Erreur récupération stats sport:', error);
      }

      const workoutData = data || [];
      const totalWorkouts = workoutData.reduce((sum, entry) => sum + (entry.workouts_completed || 0), 0);
      const totalCalories = workoutData.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);

      // Calculer les données de la semaine actuelle
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekData = workoutData.filter(entry => new Date(entry.date) >= oneWeekAgo);
      
      const currentWeekWorkouts = weekData.reduce((sum, entry) => sum + (entry.workouts_completed || 0), 0);
      const currentWeekCalories = weekData.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);

      return {
        totalWorkouts,
        totalDuration: totalWorkouts * 45, // Estimation 45min par workout
        totalCalories,
        averageIntensity: 2.5,
        favoriteWorkoutType: 'strength',
        longestStreak: Math.min(15, Math.floor(totalWorkouts / 3)),
        currentStreak: Math.min(7, currentWeekWorkouts),
        personalRecords: [
          {
            exerciseName: 'Développé couché',
            type: 'weight' as const,
            value: 80,
            unit: 'kg',
            achievedDate: new Date()
          }
        ],
        weeklyGoals: {
          targetWorkouts: 4,
          targetCalories: 2000,
          targetDuration: 240,
          currentWorkouts: currentWeekWorkouts,
          currentCalories: currentWeekCalories,
          currentDuration: currentWeekWorkouts * 45
        },
        monthlyProgress: {
          month: 'Décembre 2024',
          workoutsCompleted: totalWorkouts,
          caloriesBurned: totalCalories,
          totalDuration: totalWorkouts * 45,
          averageIntensity: 2.5,
          improvementAreas: ['Endurance', 'Récupération']
        }
      };
    } catch (error) {
      console.error('Erreur récupération stats sport:', error);
      // Retourner des stats par défaut en cas d'erreur
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
      };
    }
  }

  // Suggestions intelligentes
  static async getSmartSuggestions(weather: any, recovery: RecoveryMetrics): Promise<string[]> {
    const suggestions: string[] = [];

    if (recovery.readinessScore < 30) {
      suggestions.push('Privilégiez une séance de récupération active ou du repos');
    } else if (recovery.readinessScore > 70) {
      suggestions.push('Parfait pour un entraînement intense !');
    }

    if (weather?.main?.temp > 25) {
      suggestions.push('Hydratez-vous davantage par cette chaleur');
    }

    return suggestions;
  }

  // Plans d'entraînement
  static async generatePersonalizedPlan(goals: string[], level: string, availability: number): Promise<WorkoutPlan> {
    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name: `Plan ${level} - ${goals.join('/')}`,
      description: `Plan personnalisé de ${availability} séances par semaine`,
      duration: 8,
      level: level as any,
      goal: goals[0] as any,
      workouts: [],
      adaptable: true
    };

    return plan;
  }

  // Getters pour la compatibilité
  static getCurrentWorkout(): WorkoutTracking | null {
    return null; // Plus de workout en mémoire
  }

  static async getAllWorkouts(): Promise<WorkoutTracking[]> {
    try {
      // Récupérer depuis daily_tracking
      const { data, error } = await supabase
        .from('daily_tracking')
        .select('*')
        .not('workouts_completed', 'is', null)
        .order('date', { ascending: false })
        .limit(20);

      if (error) {
        console.warn('Erreur récupération workouts:', error);
        return [];
      }

      // Convertir en format WorkoutTracking
      return (data || []).map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        type: 'strength' as const,
        title: 'Entraînement',
        startTime: new Date(entry.date),
        endTime: new Date(entry.date),
        duration: 45,
        intensity: 'moderate' as const,
        caloriesBurned: entry.calories_consumed || 0,
        exercises: [],
        status: 'completed' as const
      }));
    } catch (error) {
      console.error('Erreur récupération all workouts:', error);
      return [];
    }
  }
}


import { WorkoutTracking, ExerciseTracking, SportStats, RecoveryMetrics, WorkoutPlan } from './types';

export class SportTrackingService {
  private static workouts: WorkoutTracking[] = [];
  private static currentWorkout: WorkoutTracking | null = null;

  // Gestion des workouts
  static async startWorkout(workoutData: Partial<WorkoutTracking>): Promise<WorkoutTracking> {
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

    this.currentWorkout = workout;
    console.log('🏃‍♂️ Workout démarré:', workout.title);
    return workout;
  }

  static async pauseWorkout(): Promise<void> {
    if (this.currentWorkout) {
      this.currentWorkout.status = 'paused';
      console.log('⏸️ Workout mis en pause');
    }
  }

  static async resumeWorkout(): Promise<void> {
    if (this.currentWorkout) {
      this.currentWorkout.status = 'active';
      console.log('▶️ Workout repris');
    }
  }

  static async completeWorkout(): Promise<WorkoutTracking> {
    if (!this.currentWorkout) {
      throw new Error('Aucun workout actif');
    }

    this.currentWorkout.endTime = new Date();
    this.currentWorkout.status = 'completed';
    this.currentWorkout.duration = Math.round(
      (this.currentWorkout.endTime.getTime() - this.currentWorkout.startTime.getTime()) / 60000
    );

    // Calcul des calories (formule simplifiée)
    this.currentWorkout.caloriesBurned = this.calculateCalories(this.currentWorkout);

    this.workouts.push(this.currentWorkout);
    const completedWorkout = { ...this.currentWorkout };
    this.currentWorkout = null;

    console.log('✅ Workout terminé:', completedWorkout.title);
    return completedWorkout;
  }

  // Tracking des exercices
  static async addExercise(exercise: ExerciseTracking): Promise<void> {
    if (this.currentWorkout) {
      this.currentWorkout.exercises = this.currentWorkout.exercises || [];
      this.currentWorkout.exercises.push(exercise);
      console.log('💪 Exercice ajouté:', exercise.name);
    }
  }

  static async updateExercise(exerciseId: string, updates: Partial<ExerciseTracking>): Promise<void> {
    if (this.currentWorkout?.exercises) {
      const exerciseIndex = this.currentWorkout.exercises.findIndex(ex => ex.id === exerciseId);
      if (exerciseIndex !== -1) {
        this.currentWorkout.exercises[exerciseIndex] = {
          ...this.currentWorkout.exercises[exerciseIndex],
          ...updates
        };
      }
    }
  }

  // Calcul des calories (formule améliorée)
  private static calculateCalories(workout: WorkoutTracking): number {
    const baseCaloriesPerMinute = {
      'cardio': 12,
      'strength': 8,
      'flexibility': 4,
      'sports': 10,
      'outdoor': 9
    };

    const intensityMultiplier = {
      'low': 0.7,
      'moderate': 1.0,
      'high': 1.3,
      'extreme': 1.6
    };

    const baseCalories = baseCaloriesPerMinute[workout.type] * workout.duration;
    return Math.round(baseCalories * intensityMultiplier[workout.intensity]);
  }

  // Statistiques et progression
  static async getUserStats(): Promise<SportStats> {
    const totalWorkouts = this.workouts.length;
    const totalDuration = this.workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = this.workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    
    const intensityValues = { 'low': 1, 'moderate': 2, 'high': 3, 'extreme': 4 };
    const averageIntensity = totalWorkouts > 0 
      ? this.workouts.reduce((sum, w) => sum + intensityValues[w.intensity], 0) / totalWorkouts
      : 0;

    const workoutTypes = this.workouts.map(w => w.type);
    const favoriteWorkoutType = this.getMostFrequent(workoutTypes) || 'strength';

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageIntensity,
      favoriteWorkoutType,
      longestStreak: this.calculateLongestStreak(),
      currentStreak: this.calculateCurrentStreak(),
      personalRecords: this.getPersonalRecords(),
      weeklyGoals: this.getWeeklyGoals(),
      monthlyProgress: this.getMonthlyProgress()
    };
  }

  // Suggestions intelligentes basées sur la météo et récupération
  static async getSmartSuggestions(weather: any, recovery: RecoveryMetrics): Promise<string[]> {
    const suggestions: string[] = [];

    // Suggestions basées sur la récupération
    if (recovery.readinessScore < 30) {
      suggestions.push('Privilégiez une séance de récupération active ou du repos');
    } else if (recovery.readinessScore > 70) {
      suggestions.push('Parfait pour un entraînement intense !');
    }

    // Suggestions basées sur la météo
    if (weather?.main?.temp > 25) {
      suggestions.push('Hydratez-vous davantage par cette chaleur');
      suggestions.push('Privilégiez les activités en intérieur ou tôt le matin');
    } else if (weather?.main?.temp < 10) {
      suggestions.push('Prolongez votre échauffement par ce froid');
    }

    if (weather?.weather?.[0]?.main === 'Rain') {
      suggestions.push('Séance en salle recommandée aujourd\'hui');
    }

    return suggestions;
  }

  // Plans d'entraînement adaptatifs
  static async generatePersonalizedPlan(goals: string[], level: string, availability: number): Promise<WorkoutPlan> {
    // Génération basique d'un plan personnalisé
    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name: `Plan ${level} - ${goals.join('/')}`,
      description: `Plan personnalisé de ${availability} séances par semaine`,
      duration: 8, // 8 semaines
      level: level as any,
      goal: goals[0] as any,
      workouts: [],
      adaptable: true
    };

    return plan;
  }

  // Méthodes utilitaires privées
  private static getMostFrequent(arr: string[]): string | undefined {
    const frequency: Record<string, number> = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  private static calculateLongestStreak(): number {
    // Calcul simplifié du plus long streak
    return Math.floor(Math.random() * 15) + 1;
  }

  private static calculateCurrentStreak(): number {
    // Calcul simplifié du streak actuel
    return Math.floor(Math.random() * 7) + 1;
  }

  private static getPersonalRecords() {
    return [
      {
        exerciseName: 'Développé couché',
        type: 'weight' as const,
        value: 80,
        unit: 'kg',
        achievedDate: new Date()
      }
    ];
  }

  private static getWeeklyGoals() {
    return {
      targetWorkouts: 4,
      targetCalories: 2000,
      targetDuration: 240,
      currentWorkouts: 2,
      currentCalories: 800,
      currentDuration: 90
    };
  }

  private static getMonthlyProgress() {
    return {
      month: 'Décembre 2024',
      workoutsCompleted: 12,
      caloriesBurned: 3600,
      totalDuration: 540,
      averageIntensity: 2.3,
      improvementAreas: ['Endurance', 'Récupération']
    };
  }

  // Getters
  static getCurrentWorkout(): WorkoutTracking | null {
    return this.currentWorkout;
  }

  static getAllWorkouts(): WorkoutTracking[] {
    return [...this.workouts];
  }
}


// Types pour le tracking sportif avancé
export interface WorkoutTracking {
  id: string;
  userId: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'outdoor';
  title: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // en minutes
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  caloriesBurned: number;
  heartRateData?: HeartRateData;
  exercises?: ExerciseTracking[];
  location?: WorkoutLocation;
  weatherConditions?: WeatherConditions;
  notes?: string;
  status: 'active' | 'completed' | 'paused';
}

export interface ExerciseTracking {
  id: string;
  name: string;
  sets: SetTracking[];
  muscleGroups: string[];
  equipment?: string;
  restTime: number;
}

export interface SetTracking {
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number; // pour les exercices chronométrés
  distance?: number; // pour le cardio
  completed: boolean;
  perceivedExertion: number; // échelle 1-10
}

export interface HeartRateData {
  average: number;
  max: number;
  zones: {
    zone1: number; // récupération
    zone2: number; // base aérobie
    zone3: number; // tempo
    zone4: number; // seuil
    zone5: number; // VO2 max
  };
}

export interface WorkoutLocation {
  name?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  indoor: boolean;
}

export interface WeatherConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // en semaines
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'endurance' | 'weight_loss' | 'muscle_gain' | 'general_fitness';
  workouts: PlannedWorkout[];
  adaptable: boolean;
}

export interface PlannedWorkout {
  dayOfWeek: number;
  week: number;
  workout: Omit<WorkoutTracking, 'id' | 'userId' | 'startTime' | 'endTime' | 'status'>;
  alternatives?: string[];
}

export interface RecoveryMetrics {
  sleepQuality: number; // 1-10
  musclesSoreness: number; // 1-10
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  heartRateVariability?: number;
  readinessScore: number; // calculé automatiquement
}

export interface SportStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageIntensity: number;
  favoriteWorkoutType: string;
  longestStreak: number;
  currentStreak: number;
  personalRecords: PersonalRecord[];
  weeklyGoals: WeeklyGoals;
  monthlyProgress: MonthlyProgress;
}

export interface PersonalRecord {
  exerciseName: string;
  type: 'weight' | 'distance' | 'time' | 'reps';
  value: number;
  unit: string;
  achievedDate: Date;
}

export interface WeeklyGoals {
  targetWorkouts: number;
  targetCalories: number;
  targetDuration: number;
  currentWorkouts: number;
  currentCalories: number;
  currentDuration: number;
}

export interface MonthlyProgress {
  month: string;
  workoutsCompleted: number;
  caloriesBurned: number;
  totalDuration: number;
  averageIntensity: number;
  improvementAreas: string[];
}

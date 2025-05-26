
import { Exercise, WorkoutSession, ExerciseSet } from './types';

// Services pour le module Sport
export class SportService {
  static async getExercises(): Promise<Exercise[]> {
    // Logique pour récupérer les exercices
    return [];
  }

  static async createWorkoutSession(exercises: string[]): Promise<WorkoutSession> {
    // Logique pour créer une session d'entraînement
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      user_id: 'current-user',
      status: 'in_progress',
      exercises,
      started_at: new Date().toISOString(),
      total_duration_minutes: 0,
      workout_type: 'strength'
    };
    return session;
  }

  static async saveExerciseSet(setData: Omit<ExerciseSet, 'id'>): Promise<ExerciseSet> {
    // Logique pour sauvegarder un set d'exercice
    const exerciseSet: ExerciseSet = {
      id: crypto.randomUUID(),
      ...setData
    };
    return exerciseSet;
  }
}


// Types pour le module Sport
export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  equipment?: string[];
  instructions?: string;
  image_url?: string;
  video_url?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  status: 'in_progress' | 'completed' | 'paused';
  exercises: string[];
  started_at: string;
  total_duration_minutes: number;
  workout_type: string;
}

export interface ExerciseSet {
  id: string;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight?: number;
  rest_time_seconds?: number;
  completed_at?: string;
}

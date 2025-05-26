
// Types pour le module Sommeil
export interface SleepSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  sleep_score?: number;
  quality_metrics: {
    deep_sleep_minutes?: number;
    light_sleep_minutes?: number;
    rem_sleep_minutes?: number;
    awake_minutes?: number;
  };
  is_nap: boolean;
}

export interface SleepGoal {
  id: string;
  user_id: string;
  target_duration_minutes: number;
  target_bedtime: string;
  target_wake_time: string;
  is_active: boolean;
}

export interface SleepStats {
  average_duration_minutes: number;
  average_sleep_score: number;
  sleep_efficiency_percentage: number;
  consistency_score: number;
}

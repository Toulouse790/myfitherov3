
// Types pour le module Hydratation
export interface HydrationEntry {
  id: string;
  user_id: string;
  amount_ml: number;
  drink_type: 'water' | 'coffee' | 'tea' | 'juice' | 'other';
  recorded_at: string;
}

export interface HydrationGoal {
  id: string;
  user_id: string;
  daily_target_ml: number;
  is_active: boolean;
  created_at: string;
}

export interface HydrationStats {
  daily_intake_ml: number;
  daily_target_ml: number;
  percentage_complete: number;
  entries_count: number;
}

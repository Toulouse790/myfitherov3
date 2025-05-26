
// Types pour le module Nutrition
export interface Food {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  serving_size: number;
  serving_unit: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  plan_data: any;
  daily_status: Record<string, boolean>;
}


// Types pour le module Hydratation - Version simplifiée et bienveillante
export interface HydrationEntry {
  id: string;
  user_id: string;
  amount_ml: number;
  drink_type: 'water' | 'coffee' | 'tea' | 'juice' | 'other';
  recorded_at: string;
  created_at?: string;
}

export interface HydrationGoal {
  id: string;
  user_id: string;
  daily_target_ml: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HydrationStats {
  dailyIntake: number;
  dailyTarget: number;
  percentageComplete: number;
  entriesCount: number;
}

export interface BiometricsProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  preferences?: string[];
}

// Interface simplifiée pour les recommandations de bien-être
export interface WellnessRecommendation {
  suggestion: string;
  confidence: number;
  tips: string[];
}

// Interface pour les conseils d'hydratation positifs
export interface HydrationAdvice {
  message: string;
  motivation: string;
  nextSteps: string[];
  encouragement?: string;
}

// Types pour l'interface avec l'IA Hydratation
export interface HydrationCreateEntry {
  user_id: string;
  amount_ml: number;
  drink_type: 'water' | 'coffee' | 'tea' | 'juice' | 'other';
  recorded_at: string;
}

export interface HydrationCreateGoal {
  user_id: string;
  daily_target_ml: number;
  is_active: boolean;
}

// Interface simple pour le suivi des habitudes
export interface HydrationHabit {
  type: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  streak: number;
}

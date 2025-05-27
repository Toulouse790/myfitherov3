
import { WeatherData } from '@/services/WeatherService';

// Types simplifiés pour les recommandations sportives
export interface Recommendation {
  type: 'info' | 'tip' | 'success' | 'encouragement';
  title: string;
  message: string;
  action?: string;
  alternatives?: string[];
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  motivation?: string;
}

export interface UserProfile {
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  preferences?: string[];
  goals?: string[];
  age?: number;
  interests?: string[];
  fitnessLevel?: string;
}

export interface WeatherAnalysis {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isIndoorRecommended: boolean;
  comfortLevel: 'excellent' | 'good' | 'moderate';
}

// Interface simple pour les conseils bien-être
export interface WellnessAdvice {
  category: 'hydration' | 'nutrition' | 'exercise' | 'recovery';
  advice: string;
  benefits: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
}

// Interface pour les encouragements personnalisés
export interface PersonalEncouragement {
  message: string;
  achievement?: string;
  nextGoal?: string;
  celebrationLevel: 'small' | 'medium' | 'big';
}

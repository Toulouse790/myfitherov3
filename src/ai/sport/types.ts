
import { WeatherData } from '@/services/WeatherService';

export interface Recommendation {
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  alternatives?: string[];
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  contraindications?: string[];
  riskLevel?: 'safe' | 'caution' | 'warning';
}

export interface UserProfile {
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  preferences?: string[];
  goals?: string[];
  age?: number;
  medicalConditions?: string[];
  currentMedications?: string[];
  fitnessLevel?: string;
}

export interface WeatherAnalysis {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isIndoorRecommended: boolean;
  safetyLevel: 'safe' | 'caution' | 'warning';
}

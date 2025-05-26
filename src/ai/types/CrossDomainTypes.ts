
// Types pour le validateur croisé des recommandations IA

export interface AIRecommendation {
  source: 'sport' | 'hydration' | 'nutrition' | 'sleep';
  type: 'activity' | 'intake' | 'timing' | 'intensity' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  recommendation: string;
  contraindications: string[];
  medicalAlerts: string[];
  environmentalFactors: string[];
  timeframe: {
    start: Date;
    end: Date;
    duration: number; // minutes
  };
  riskLevel: 'safe' | 'caution' | 'warning' | 'critical' | 'emergency';
  confidence: number; // 0-100%
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: Conflict[];
  resolvedRecommendations: AIRecommendation[];
  overrides: Override[];
  emergencyAlerts: EmergencyAlert[];
  finalRiskLevel: 'safe' | 'caution' | 'warning' | 'critical' | 'emergency';
}

export interface Conflict {
  severity: 'minor' | 'moderate' | 'severe' | 'critical' | 'life_threatening';
  sources: string[];
  description: string;
  resolution: 'auto_resolved' | 'manual_required' | 'emergency_override';
  safetyImpact: string;
}

export interface Override {
  originalRecommendation: AIRecommendation;
  overriddenBy: 'safety_protocol' | 'medical_validation' | 'emergency_system';
  newRecommendation: string;
  reason: string;
}

export interface EmergencyAlert {
  level: 'immediate' | 'urgent' | 'critical';
  title: string;
  message: string;
  requiredActions: string[];
  seekMedicalAttention: boolean;
  stopAllActivities: boolean;
}

export interface EnvironmentalContext {
  temperature: number;
  humidity: number;
  heatIndex: number;
  uvIndex: number;
  airQuality: number;
  timeOfDay: number; // 0-23
}

export interface UserProfile {
  age: number;
  medicalConditions: string[];
  currentMedications: string[];
  fitnessLevel: string;
  recentActivity: ActivityHistory[];
}

export interface ActivityHistory {
  timestamp: Date;
  type: string;
  intensity: number;
  duration: number;
  hydrationLevel: number;
  fatigueLevel: number;
}

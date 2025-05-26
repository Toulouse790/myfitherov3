
import { BiometricProfile, MedicalCondition } from './medical-validation';

export function calculateAgeFromBirthdate(birthdate?: string): number | null {
  if (!birthdate) return null;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function estimateWeightFromProfile(profile: any): number {
  const height = profile.height_cm || 170;
  const bmiEstimate = profile.gender === 'female' ? 21 : 22; // IMC sécuritaire par genre
  return Math.round((bmiEstimate * Math.pow(height / 100, 2)));
}

export function mapFitnessLevelSecure(level?: string): 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete' {
  // Mapping conservateur pour éviter surestimation
  switch (level) {
    case 'beginner': return 'sedentary'; // Plus conservateur
    case 'intermediate': return 'light';
    case 'advanced': return 'moderate';
    case 'expert': return 'moderate'; // Pas intense sans validation
    default: return 'sedentary';
  }
}

export function extractMedicalConditions(profile: any, medicalProfile: any): MedicalCondition[] {
  const conditions: MedicalCondition[] = [];
  
  const age = profile.age || calculateAgeFromBirthdate(medicalProfile?.birthdate) || 30;
  
  // DÉTECTION ÂGE CRITIQUE
  if (age >= 75) {
    conditions.push({
      condition: 'elderly_75plus',
      severity: 'moderate',
      medications: []
    });
  }
  
  // DÉTECTION GROSSESSE (si données disponibles)
  if (profile.gender === 'female' && medicalProfile?.medical?.pregnancy) {
    conditions.push({
      condition: 'pregnancy',
      severity: 'moderate',
      medications: medicalProfile.medical.medications || []
    });
  }
  
  // CONDITIONS DÉCLARÉES
  if (medicalProfile?.medical?.conditions) {
    medicalProfile.medical.conditions.forEach((conditionName: string) => {
      // Mapper les conditions aux types autorisés
      const mappedCondition = mapConditionName(conditionName);
      if (mappedCondition) {
        conditions.push({
          condition: mappedCondition,
          severity: 'moderate',
          medications: medicalProfile.medical.medications || []
        });
      }
    });
  }
  
  return conditions;
}

function mapConditionName(conditionName: string): MedicalCondition['condition'] | null {
  const lowercaseName = conditionName.toLowerCase();
  
  if (lowercaseName.includes('heart') || lowercaseName.includes('cardiaque')) {
    return 'heart_failure';
  }
  if (lowercaseName.includes('kidney') || lowercaseName.includes('renal')) {
    return 'kidney_disease';
  }
  if (lowercaseName.includes('diabetes') || lowercaseName.includes('diabete')) {
    return 'diabetes';
  }
  if (lowercaseName.includes('hypertension')) {
    return 'hypertension';
  }
  if (lowercaseName.includes('pregnancy') || lowercaseName.includes('grossesse')) {
    return 'pregnancy';
  }
  
  return null; // Condition non reconnue
}

export function estimateUVIndex(weather: any): number {
  const hour = new Date().getHours();
  const condition = weather.weather[0]?.main || 'Clear';
  
  // UV conservateur selon heure et conditions
  if (hour < 7 || hour > 19) return 0;
  if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
  if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
  
  return 6; // Valeur prudente par défaut
}

export function calculateHeatIndex(temp: number, humidity: number): number {
  // Calcul Heat Index sécurisé
  if (temp <= 26 || humidity <= 40) return temp;
  
  // Formule simplifiée mais fiable
  const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
  return Math.round(temp + adjustmentFactor);
}

export function estimateCurrentActivity(profile: any, hour: number) {
  const level = profile.experience_level || 'beginner';
  
  // Estimation conservatrice selon heure et profil
  if (hour >= 6 && hour <= 9) {
    return {
      type: level === 'expert' ? 'light_walk' as const : 'rest' as const,
      duration: 30,
      intensity: 3,
      location: 'outdoor' as const
    };
  }
  
  if (hour >= 17 && hour <= 20) {
    return {
      type: level === 'advanced' || level === 'expert' ? 'moderate_exercise' as const : 'light_walk' as const,
      duration: 45,
      intensity: level === 'expert' ? 5 : 3,
      location: 'outdoor' as const
    };
  }
  
  return {
    type: 'rest' as const,
    duration: 0,
    intensity: 1,
    location: 'indoor' as const
  };
}

export function displayEmergencyActions(alert: any): void {
  console.log('🆘 ACTIONS URGENCE HYDRATATION:', alert.actions);
  
  // Interface d'urgence
  const actions = alert.actions.join('\n• ');
  window.alert(
    `🚨 ACTIONS URGENTES REQUISES\n\n• ${actions}\n\n` +
    `${alert.seekMedicalAttention ? '🏥 CONTACTEZ IMMÉDIATEMENT UN MÉDECIN' : ''}`
  );
}

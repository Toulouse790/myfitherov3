
// Types pour la validation médicale d'hydratation - Interface complète
export interface MedicalValidationResult {
  isValid: boolean;
  warnings: string[];
  contraindications: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  maxSafeAmount: number;  // ← AJOUTÉ pour corriger l'erreur TypeScript
  medicalAlerts: string[];  // ← AJOUTÉ pour corriger l'erreur TypeScript
}

export interface BiometricProfile {
  age: number;
  weight: number;
  height: number;
  sex: 'M' | 'F';
  fitnessLevel: 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete';
  medicalConditions: Array<{
    condition: string;
    severity: 'mild' | 'moderate' | 'severe';
    medications: string[];
  }>;
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  heatIndex: number;
  uvIndex: number;
  windSpeed: number;
}

// Validateur médical pour recommandations d'hydratation
class HydrationMedicalValidator {
  
  validateHydrationRecommendation(
    profile: BiometricProfile,
    environment: EnvironmentalData,
    recommendedAmount: number
  ): MedicalValidationResult {
    
    const result: MedicalValidationResult = {
      isValid: true,
      warnings: [],
      contraindications: [],
      riskLevel: 'low',
      maxSafeAmount: 5000, // Valeur par défaut sécuritaire (5L/jour max)
      medicalAlerts: []
    };

    // 1. VALIDATION ÂGE CRITIQUE
    if (profile.age < 5) {
      result.isValid = false;
      result.riskLevel = 'critical';
      result.maxSafeAmount = Math.min(1200, recommendedAmount); // 1.2L max enfants
      result.contraindications.push('Âge <5 ans - Supervision médicale obligatoire');
      result.medicalAlerts.push('PÉDIATRIE: Consultation immédiate requise');
    } else if (profile.age >= 75) {
      result.riskLevel = 'high';
      result.maxSafeAmount = Math.min(3500, recommendedAmount); // 3.5L max seniors
      result.warnings.push('Âge >75 ans - Risque hyperhydratation accru');
      result.medicalAlerts.push('GÉRIATRIE: Surveillance renforcée recommandée');
    }

    // 2. VALIDATION CONDITIONS MÉDICALES CRITIQUES
    profile.medicalConditions.forEach(condition => {
      switch (condition.condition.toLowerCase()) {
        case 'insuffisance_cardiaque':
        case 'heart_failure':
          result.riskLevel = 'critical';
          result.maxSafeAmount = Math.min(2000, recommendedAmount);
          result.contraindications.push('Insuffisance cardiaque - Restriction hydrique stricte');
          result.medicalAlerts.push('CARDIOLOGIE: Risque surcharge volumique');
          break;
          
        case 'insuffisance_renale':
        case 'kidney_disease':
          result.riskLevel = 'critical';
          result.maxSafeAmount = Math.min(1500, recommendedAmount);
          result.contraindications.push('Insuffisance rénale - Hydratation contrôlée');
          result.medicalAlerts.push('NÉPHROLOGIE: Consultation avant modification hydratation');
          break;
          
        case 'diabete':
        case 'diabetes':
          result.riskLevel = 'high';
          result.warnings.push('Diabète - Surveillance glycémie avec hydratation');
          result.medicalAlerts.push('ENDOCRINOLOGIE: Adapter selon glycémie');
          break;
          
        case 'hypertension':
          result.riskLevel = 'medium';
          result.warnings.push('Hypertension - Éviter surhydratation');
          break;
          
        case 'grossesse':
        case 'pregnancy':
          result.maxSafeAmount = Math.min(3500, recommendedAmount);
          result.warnings.push('Grossesse - Besoins hydriques augmentés mais contrôlés');
          result.medicalAlerts.push('OBSTÉTRIQUE: Adapter selon trimestre');
          break;
      }
    });

    // 3. VALIDATION ENVIRONNEMENTALE CRITIQUE
    if (environment.temperature > 35 && environment.humidity > 80) {
      result.riskLevel = Math.max(result.riskLevel === 'low' ? 'high' : result.riskLevel, 'high') as any;
      result.warnings.push(`Conditions extrêmes: ${environment.temperature}°C, ${environment.humidity}% humidité`);
      result.medicalAlerts.push('THERMIQUE: Risque coup de chaleur élevé');
    }

    // 4. VALIDATION QUANTITÉ RECOMMANDÉE
    if (recommendedAmount > 6000) { // Plus de 6L
      result.isValid = false;
      result.riskLevel = 'critical';
      result.maxSafeAmount = 5000;
      result.contraindications.push('Quantité excessive - Risque hyponatrémie');
      result.medicalAlerts.push('URGENCE: Risque déséquilibre électrolytique');
    } else if (recommendedAmount < 800) { // Moins de 800ml
      result.warnings.push('Hydratation insuffisante détectée');
      result.medicalAlerts.push('DÉSHYDRATATION: Surveillance symptômes');
    }

    // 5. VALIDATION FINALE SÉCURITAIRE
    if (!result.isValid) {
      result.maxSafeAmount = Math.min(result.maxSafeAmount, 2500); // Fallback ultra-conservateur
    }

    return result;
  }

  // Méthode utilitaire pour vérification rapide risque critique
  hasEmergencyRisk(profile: BiometricProfile, environment: EnvironmentalData): boolean {
    // Conditions urgentes nécessitant arrêt immédiat
    const criticalAge = profile.age < 5 || profile.age > 85;
    const criticalMedical = profile.medicalConditions.some(c => 
      ['insuffisance_cardiaque', 'insuffisance_renale', 'heart_failure', 'kidney_disease'].includes(c.condition.toLowerCase())
    );
    const criticalEnvironment = environment.temperature > 40 || environment.heatIndex > 45;
    
    return criticalAge || criticalMedical || criticalEnvironment;
  }

  // Calcul seuil sécuritaire selon profil
  calculateSafeHydrationLimit(profile: BiometricProfile): number {
    let baseLimit = 3500; // 3.5L de base
    
    // Ajustements selon âge
    if (profile.age < 12) baseLimit = 1500;
    else if (profile.age < 18) baseLimit = 2500;
    else if (profile.age > 75) baseLimit = 3000;
    
    // Ajustements selon poids (35ml/kg max)
    const weightBasedLimit = profile.weight * 35;
    
    // Ajustements selon conditions médicales
    const hasCriticalCondition = profile.medicalConditions.some(c => 
      ['insuffisance_cardiaque', 'insuffisance_renale'].includes(c.condition.toLowerCase())
    );
    
    if (hasCriticalCondition) baseLimit = Math.min(baseLimit, 2000);
    
    return Math.min(baseLimit, weightBasedLimit);
  }
}

// Export singleton
export const hydrationMedicalValidator = new HydrationMedicalValidator();

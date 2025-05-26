
// Types pour la validation médicale d'hydratation - Interface complète
export interface MedicalValidationResult {
  isValid: boolean;
  warnings: string[];
  contraindications: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  maxSafeAmount: number;
  medicalAlerts: string[];
}

export interface MedicalCondition {
  condition: 'heart_failure' | 'kidney_disease' | 'diabetes' | 'hypertension' | 'pregnancy' | 'elderly_75plus';
  severity: 'mild' | 'moderate' | 'severe';
  medications: string[];
}

export interface BiometricProfile {
  age: number;
  weight: number;
  height: number;
  sex: 'M' | 'F';
  fitnessLevel: 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete';
  medicalConditions: MedicalCondition[];
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
  
  // Helper function to escalate risk level
  private escalateRiskLevel(current: 'low' | 'medium' | 'high' | 'critical', target: 'low' | 'medium' | 'high' | 'critical'): 'low' | 'medium' | 'high' | 'critical' {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    const currentLevel = levels[current];
    const targetLevel = levels[target];
    
    if (targetLevel > currentLevel) {
      return target;
    }
    return current;
  }

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
      switch (condition.condition) {
        case 'heart_failure':
          result.riskLevel = 'critical';
          result.maxSafeAmount = Math.min(2000, recommendedAmount);
          result.contraindications.push('Insuffisance cardiaque - Restriction hydrique stricte');
          result.medicalAlerts.push('CARDIOLOGIE: Risque surcharge volumique');
          break;
          
        case 'kidney_disease':
          result.riskLevel = 'critical';
          result.maxSafeAmount = Math.min(1500, recommendedAmount);
          result.contraindications.push('Insuffisance rénale - Hydratation contrôlée');
          result.medicalAlerts.push('NÉPHROLOGIE: Consultation avant modification hydratation');
          break;
          
        case 'diabetes':
          result.riskLevel = 'high';
          result.warnings.push('Diabète - Surveillance glycémie avec hydratation');
          result.medicalAlerts.push('ENDOCRINOLOGIE: Adapter selon glycémie');
          break;
          
        case 'hypertension':
          result.riskLevel = 'medium';
          result.warnings.push('Hypertension - Éviter surhydratation');
          break;
          
        case 'pregnancy':
          result.maxSafeAmount = Math.min(3500, recommendedAmount);
          result.warnings.push('Grossesse - Besoins hydriques augmentés mais contrôlés');
          result.medicalAlerts.push('OBSTÉTRIQUE: Adapter selon trimestre');
          break;
      }
    });

    // 3. VALIDATION ENVIRONNEMENTALE CRITIQUE
    // Ensure temperature and humidity are numbers
    const temp = Number(environment.temperature);
    const humidity = Number(environment.humidity);
    
    if (temp > 35 && humidity > 80) {
      result.riskLevel = this.escalateRiskLevel(result.riskLevel, 'high');
      result.warnings.push(`Conditions extrêmes: ${temp}°C, ${humidity}% humidité`);
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
      ['heart_failure', 'kidney_disease'].includes(c.condition)
    );
    const criticalEnvironment = Number(environment.temperature) > 40 || Number(environment.heatIndex) > 45;
    
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
    const weightBasedLimit = Number(profile.weight) * 35;
    
    // Ajustements selon conditions médicales
    const hasCriticalCondition = profile.medicalConditions.some(c => 
      ['heart_failure', 'kidney_disease'].includes(c.condition)
    );
    
    if (hasCriticalCondition) baseLimit = Math.min(baseLimit, 2000);
    
    return Math.min(baseLimit, weightBasedLimit);
  }

  // Méthode pour les tests de populations vulnérables
  testVulnerablePopulations() {
    console.log('🧪 Tests populations vulnérables...');
    
    // Test profil senior 75+
    const elderlyProfile: BiometricProfile = {
      age: 78,
      weight: 65,
      height: 165,
      sex: 'F',
      fitnessLevel: 'light',
      medicalConditions: [{
        condition: 'elderly_75plus',
        severity: 'moderate',
        medications: ['antihypertenseur']
      }]
    };

    // Test profil enfant
    const childProfile: BiometricProfile = {
      age: 8,
      weight: 30,
      height: 130,
      sex: 'M',
      fitnessLevel: 'moderate',
      medicalConditions: []
    };

    // Test profil grossesse
    const pregnancyProfile: BiometricProfile = {
      age: 28,
      weight: 70,
      height: 165,
      sex: 'F',
      fitnessLevel: 'light',
      medicalConditions: [{
        condition: 'pregnancy',
        severity: 'moderate',
        medications: ['vitamines_prenatales']
      }]
    };

    const testEnvironment: EnvironmentalData = {
      temperature: 25,
      humidity: 60,
      heatIndex: 26,
      uvIndex: 5,
      windSpeed: 10
    };

    const elderlyResult = this.validateHydrationRecommendation(elderlyProfile, testEnvironment, 2500);
    const childResult = this.validateHydrationRecommendation(childProfile, testEnvironment, 1800);
    const pregnancyResult = this.validateHydrationRecommendation(pregnancyProfile, testEnvironment, 2800);

    return {
      elderly: {
        ...elderlyResult,
        medicalSupervisionRequired: elderlyResult.riskLevel === 'critical' || elderlyResult.riskLevel === 'high'
      },
      children: {
        ...childResult,
        medicalSupervisionRequired: childResult.riskLevel === 'critical'
      },
      pregnancy: {
        ...pregnancyResult,
        medicalSupervisionRequired: pregnancyResult.riskLevel === 'critical'
      }
    };
  }
}

// Export singleton
export const hydrationMedicalValidator = new HydrationMedicalValidator();

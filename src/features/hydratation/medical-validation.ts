
/**
 * SERVICE VALIDATION MÉDICALE HYDRATATION
 * Validation sécuritaire avant toute recommandation
 */

interface MedicalValidationResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  contraindications: string[];
  requiredActions: string[];
  medicalSupervisionRequired: boolean;
}

interface VulnerableProfile {
  isElderly: boolean;
  isChild: boolean;
  isPregnant: boolean;
  hasKidneyDisease: boolean;
  hasHeartCondition: boolean;
  hasDiabetes: boolean;
  isOnMedication: boolean;
}

export class HydrationMedicalValidator {
  
  /**
   * VALIDATION PRINCIPALE AVANT RECOMMANDATION
   */
  validateHydrationRecommendation(
    biometricProfile: any,
    environmentalData: any,
    recommendedIntake: number
  ): MedicalValidationResult {
    
    console.log('🏥 Validation médicale recommandation hydratation...');
    
    // 1. ANALYSE PROFIL VULNÉRABILITÉ
    const vulnerableProfile = this.analyzeVulnerability(biometricProfile);
    
    // 2. VALIDATION QUANTITÉ RECOMMANDÉE
    const quantityValidation = this.validateRecommendedQuantity(
      recommendedIntake, 
      biometricProfile, 
      vulnerableProfile
    );
    
    // 3. VALIDATION CONDITIONS ENVIRONNEMENTALES
    const environmentValidation = this.validateEnvironmentalConditions(
      environmentalData, 
      vulnerableProfile
    );
    
    // 4. COMPILATION RÉSULTATS
    const finalValidation = this.compileValidationResults(
      quantityValidation,
      environmentValidation,
      vulnerableProfile
    );
    
    console.log(`✅ Validation médicale terminée - Risque: ${finalValidation.riskLevel}`);
    
    return finalValidation;
  }

  /**
   * ANALYSE VULNÉRABILITÉ UTILISATEUR
   */
  private analyzeVulnerability(profile: any): VulnerableProfile {
    
    const conditions = profile.medicalConditions || [];
    
    return {
      isElderly: profile.age >= 65,
      isChild: profile.age < 18,
      isPregnant: conditions.some((c: any) => c.condition === 'pregnancy'),
      hasKidneyDisease: conditions.some((c: any) => c.condition === 'kidney_disease'),
      hasHeartCondition: conditions.some((c: any) => 
        ['heart_failure', 'hypertension'].includes(c.condition)
      ),
      hasDiabetes: conditions.some((c: any) => c.condition === 'diabetes'),
      isOnMedication: conditions.some((c: any) => c.medications && c.medications.length > 0)
    };
  }

  /**
   * VALIDATION QUANTITÉ HYDRATATION
   */
  private validateRecommendedQuantity(
    recommendedIntake: number,
    profile: any,
    vulnerable: VulnerableProfile
  ): Partial<MedicalValidationResult> {
    
    const warnings: string[] = [];
    const contraindications: string[] = [];
    const actions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // LIMITES ABSOLUES DE SÉCURITÉ
    const minSafe = this.calculateMinimumSafeIntake(profile, vulnerable);
    const maxSafe = this.calculateMaximumSafeIntake(profile, vulnerable);
    
    // VALIDATION MINIMUM VITAL
    if (recommendedIntake < minSafe) {
      riskLevel = 'critical';
      warnings.push(`⚠️ Hydratation insuffisante: ${recommendedIntake}ml < ${minSafe}ml minimum`);
      actions.push('Augmenter immédiatement l\'hydratation');
      
      if (vulnerable.isElderly) {
        contraindications.push('SENIOR : Risque déshydratation accru - Surveillance renforcée');
      }
      
      if (vulnerable.isChild) {
        contraindications.push('ENFANT : Déshydratation rapide possible - Alerte parents');
      }
    }
    
    // VALIDATION MAXIMUM SÉCURITAIRE
    if (recommendedIntake > maxSafe) {
      riskLevel = Math.max(riskLevel as any, 'high' as any) as any;
      warnings.push(`⚠️ Hydratation excessive: ${recommendedIntake}ml > ${maxSafe}ml maximum`);
      actions.push('Réduire hydratation - Risque hyperhydratation');
      
      if (vulnerable.hasKidneyDisease) {
        riskLevel = 'critical';
        contraindications.push('MALADIE RÉNALE : Restriction hydrique obligatoire');
        actions.push('CONSULTER NÉPHROLOGUE IMMÉDIATEMENT');
      }
      
      if (vulnerable.hasHeartCondition) {
        riskLevel = 'critical';
        contraindications.push('INSUFFISANCE CARDIAQUE : Surcharge hydrique dangereuse');
        actions.push('CONSULTER CARDIOLOGUE IMMÉDIATEMENT');
      }
    }
    
    // POPULATIONS SPÉCIALES
    if (vulnerable.isPregnant) {
      if (recommendedIntake < 2300) {
        warnings.push('GROSSESSE : Besoins hydriques augmentés');
        actions.push('Augmenter hydratation (minimum 2,3L/jour)');
      }
    }
    
    return { riskLevel, warnings, contraindications, requiredActions: actions };
  }

  /**
   * VALIDATION CONDITIONS ENVIRONNEMENTALES
   */
  private validateEnvironmentalConditions(
    environmental: any,
    vulnerable: VulnerableProfile
  ): Partial<MedicalValidationResult> {
    
    const warnings: string[] = [];
    const actions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // TEMPÉRATURE CRITIQUE
    if (environmental.temperature > 35) {
      riskLevel = 'critical';
      warnings.push(`🌡️ TEMPÉRATURE EXTRÊME: ${environmental.temperature}°C`);
      actions.push('ÉVITER TOUTE ACTIVITÉ EXTÉRIEURE');
      actions.push('Chercher climatisation/ombre immédiatement');
      
      if (vulnerable.isElderly || vulnerable.isChild) {
        warnings.push('POPULATION VULNÉRABLE : Risque coup de chaleur élevé');
        actions.push('SURVEILLANCE MÉDICALE RECOMMANDÉE');
      }
    } else if (environmental.temperature > 30) {
      riskLevel = Math.max(riskLevel as any, 'high' as any) as any;
      warnings.push(`🌡️ Forte chaleur: ${environmental.temperature}°C`);
      actions.push('Réduire intensité activité de 30%');
      actions.push('Hydratation préventive toutes les 15min');
    }
    
    // INDICE CHALEUR
    if (environmental.heatIndex > environmental.temperature + 5) {
      riskLevel = Math.max(riskLevel as any, 'high' as any) as any;
      warnings.push(`🥵 Indice chaleur élevé: ${environmental.heatIndex}°C ressenti`);
      actions.push('Surveillance symptômes épuisement thermique');
    }
    
    // HUMIDITÉ CRITIQUE
    if (environmental.humidity > 85) {
      warnings.push(`💨 Humidité élevée: ${environmental.humidity}% - Évaporation sueur réduite`);
      actions.push('Augmenter fréquence hydratation');
    }
    
    // UV DANGEREUX
    if (environmental.uvIndex > 8) {
      warnings.push(`☀️ UV extrême: ${environmental.uvIndex} - Protection solaire maximale`);
      actions.push('Éviter exposition 11h-16h');
    }
    
    return { riskLevel, warnings, requiredActions: actions };
  }

  /**
   * COMPILATION RÉSULTATS VALIDATION
   */
  private compileValidationResults(
    quantityValidation: Partial<MedicalValidationResult>,
    environmentValidation: Partial<MedicalValidationResult>,
    vulnerable: VulnerableProfile
  ): MedicalValidationResult {
    
    // NIVEAU RISQUE MAXIMUM
    const riskLevel = this.determineMaxRiskLevel([
      quantityValidation.riskLevel || 'low',
      environmentValidation.riskLevel || 'low'
    ]);
    
    // COMPILATION ALERTES
    const warnings = [
      ...(quantityValidation.warnings || []),
      ...(environmentValidation.warnings || [])
    ];
    
    const contraindications = [
      ...(quantityValidation.contraindications || []),
      ...(environmentValidation.contraindications || [])
    ];
    
    const requiredActions = [
      ...(quantityValidation.requiredActions || []),
      ...(environmentValidation.requiredActions || [])
    ];
    
    // SUPERVISION MÉDICALE REQUISE
    const medicalSupervisionRequired = 
      riskLevel === 'critical' ||
      vulnerable.hasKidneyDisease ||
      vulnerable.hasHeartCondition ||
      (vulnerable.isPregnant && riskLevel === 'high');
    
    // VALIDATION FINALE
    const isValid = riskLevel !== 'critical' && contraindications.length === 0;
    
    return {
      isValid,
      riskLevel,
      warnings,
      contraindications,
      requiredActions,
      medicalSupervisionRequired
    };
  }

  /**
   * CALCULS SEUILS SÉCURITAIRES
   */
  private calculateMinimumSafeIntake(profile: any, vulnerable: VulnerableProfile): number {
    let minimum = 1200; // Survie absolue
    
    // Ajustements selon poids
    if (profile.weight) {
      minimum = Math.max(minimum, profile.weight * 20); // 20ml/kg minimum
    }
    
    // Populations spéciales
    if (vulnerable.isChild) {
      minimum = Math.max(minimum, 1500); // Minimum enfants
    }
    
    if (vulnerable.isPregnant) {
      minimum = Math.max(minimum, 2300); // Minimum grossesse
    }
    
    if (vulnerable.isElderly) {
      minimum = Math.max(minimum, 1800); // Seniors besoins plus élevés
    }
    
    return minimum;
  }

  private calculateMaximumSafeIntake(profile: any, vulnerable: VulnerableProfile): number {
    let maximum = 6000; // Limite hyperhydratation
    
    // Ajustements selon poids
    if (profile.weight) {
      maximum = Math.min(maximum, profile.weight * 70); // 70ml/kg maximum
    }
    
    // Restrictions médicales STRICTES
    if (vulnerable.hasKidneyDisease) {
      maximum = 2000; // Restriction rénale
    }
    
    if (vulnerable.hasHeartCondition) {
      maximum = 1500; // Restriction cardiaque
    }
    
    // Populations spéciales
    if (vulnerable.isChild && profile.age < 12) {
      maximum = Math.min(maximum, 2500); // Limite enfants
    }
    
    return maximum;
  }

  private determineMaxRiskLevel(levels: ('low' | 'medium' | 'high' | 'critical')[]): 'low' | 'medium' | 'high' | 'critical' {
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('high')) return 'high';
    if (levels.includes('medium')) return 'medium';
    return 'low';
  }

  /**
   * TESTS SPÉCIFIQUES POPULATIONS VULNÉRABLES
   */
  testVulnerablePopulations(): { elderly: any, children: any, pregnancy: any } {
    console.log('🧪 Tests populations vulnérables...');
    
    // Test seniors 75+
    const elderlyTest = this.validateHydrationRecommendation(
      { age: 75, weight: 65, medicalConditions: [{ condition: 'elderly_75plus' }] },
      { temperature: 32, humidity: 70, heatIndex: 35 },
      2500
    );
    
    // Test enfant 8 ans
    const childTest = this.validateHydrationRecommendation(
      { age: 8, weight: 25, medicalConditions: [] },
      { temperature: 28, humidity: 60, heatIndex: 30 },
      2000
    );
    
    // Test grossesse
    const pregnancyTest = this.validateHydrationRecommendation(
      { age: 28, weight: 70, medicalConditions: [{ condition: 'pregnancy' }] },
      { temperature: 30, humidity: 75, heatIndex: 33 },
      2200
    );
    
    console.log('✅ Tests populations vulnérables terminés');
    
    return {
      elderly: elderlyTest,
      children: childTest,
      pregnancy: pregnancyTest
    };
  }
}

export const hydrationMedicalValidator = new HydrationMedicalValidator();

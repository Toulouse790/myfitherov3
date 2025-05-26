
/**
 * CROSS-DOMAIN VALIDATOR - VALIDATION RECOMMANDATIONS
 * 
 * MISSION :
 * - Vérifier cohérence entre Sport/Hydratation/Nutrition/Sommeil IA
 * - Prévenir conflits entre recommandations
 * - Validation sécuritaire
 */

import {
  AIRecommendation,
  ValidationResult,
  Conflict,
  Override,
  EmergencyAlert,
  EnvironmentalContext,
  UserProfile
} from './types/CrossDomainTypes';

export class CrossDomainValidator {
  
  /**
   * VALIDATION PRINCIPALE - COHÉRENCE MULTI-IA
   */
  validateRecommendations(
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext,
    userProfile: UserProfile
  ): ValidationResult {
    
    console.log('🔍 Début validation croisée des recommandations IA');
    
    // 1. DÉTECTION CONFLITS
    const conflicts = this.detectConflicts(recommendations, environment, userProfile);
    
    // 2. ÉVALUATION RISQUES COMBINÉS
    const combinedRisk = this.assessCombinedRisk(recommendations, environment, userProfile);
    
    // 3. RÉSOLUTION AUTOMATIQUE
    const resolved = this.resolveConflictsSafely(recommendations, conflicts, combinedRisk);
    
    // 4. GÉNÉRATION ALERTES (simplifiées)
    const emergencyAlerts = this.generateAlerts(conflicts, combinedRisk, environment);
    
    // 5. VALIDATION FINALE
    const finalValidation = this.performFinalValidation(resolved, userProfile);
    
    const result = {
      isValid: conflicts.filter(c => c.severity === 'critical').length === 0,
      conflicts,
      resolvedRecommendations: finalValidation.recommendations,
      overrides: finalValidation.overrides,
      emergencyAlerts,
      finalRiskLevel: this.determineFinalRiskLevel(combinedRisk, conflicts)
    };
    
    console.log(`✅ Validation terminée - Niveau final: ${result.finalRiskLevel}`);
    
    return result;
  }

  /**
   * DÉTECTION CONFLITS ENTRE IA
   */
  private detectConflicts(
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext,
    userProfile: UserProfile
  ): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // CONFLIT 1 : SPORT vs HYDRATATION
    const sportRecs = recommendations.filter(r => r.source === 'sport');
    const hydrationRecs = recommendations.filter(r => r.source === 'hydration');
    
    for (const sportRec of sportRecs) {
      for (const hydrationRec of hydrationRecs) {
        
        // Sport intensif mais hydratation insuffisante
        if (
          this.isIntenseActivity(sportRec) &&
          this.isInsufficientHydration(hydrationRec) &&
          environment.temperature > 25
        ) {
          conflicts.push({
            severity: 'moderate',
            sources: ['sport', 'hydration'],
            description: 'Activité intense avec hydratation insuffisante par chaleur',
            resolution: 'auto_resolved',
            safetyImpact: 'Risque de déshydratation'
          });
        }
      }
    }

    // CONFLIT 2 : NUTRITION vs SPORT
    const nutritionRecs = recommendations.filter(r => r.source === 'nutrition');
    
    for (const sportRec of sportRecs) {
      for (const nutritionRec of nutritionRecs) {
        
        // Sport intense mais nutrition insuffisante
        if (
          this.isIntenseActivity(sportRec) &&
          this.isRestrictiveNutrition(nutritionRec)
        ) {
          conflicts.push({
            severity: 'moderate',
            sources: ['sport', 'nutrition'],
            description: 'Sport intense avec restriction nutritionnelle',
            resolution: 'auto_resolved',
            safetyImpact: 'Risque de fatigue prématurée'
          });
        }
      }
    }

    // CONFLIT 3 : TIMING CONTRADICTOIRE
    conflicts.push(...this.detectTimingConflicts(recommendations));
    
    return conflicts;
  }

  /**
   * RÉSOLUTION AUTOMATIQUE
   */
  private resolveConflictsSafely(
    recommendations: AIRecommendation[],
    conflicts: Conflict[],
    combinedRisk: string
  ): AIRecommendation[] {
    
    let resolved = [...recommendations];
    
    for (const conflict of conflicts) {
      
      switch (conflict.severity) {
        
        case 'critical':
          // RÉDUCTION INTENSITÉ
          resolved = this.applyCriticalReduction(resolved, conflict);
          break;
          
        case 'severe':
          // MODIFICATIONS CONSERVATRICES
          resolved = this.applyConservativeModification(resolved, conflict);
          break;
          
        case 'moderate':
          // AJUSTEMENTS LÉGERS
          resolved = this.applyMinorAdjustments(resolved, conflict);
          break;
      }
    }
    
    return resolved;
  }

  /**
   * ÉVALUATION RISQUE COMBINÉ
   */
  private assessCombinedRisk(
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext,
    userProfile: UserProfile
  ): string {
    
    let riskScore = 0;
    
    // FACTEURS ENVIRONNEMENTAUX
    if (environment.temperature > 35) riskScore += 3;
    else if (environment.temperature > 32) riskScore += 2;
    else if (environment.temperature > 28) riskScore += 1;
    
    if (environment.humidity > 85) riskScore += 2;
    if (environment.heatIndex > environment.temperature + 5) riskScore += 1;
    
    // FACTEURS UTILISATEUR
    if (userProfile.age > 65) riskScore += 2;
    else if (userProfile.age < 18) riskScore += 1;
    
    if (userProfile.medicalConditions.includes('heart_disease')) riskScore += 3;
    if (userProfile.medicalConditions.includes('diabetes')) riskScore += 2;
    
    // COMBINAISONS RECOMMANDATIONS
    const hasIntenseSport = recommendations.some(r => 
      r.source === 'sport' && this.isIntenseActivity(r)
    );
    const hasHydrationWarning = recommendations.some(r => 
      r.source === 'hydration' && r.riskLevel !== 'safe'
    );
    
    if (hasIntenseSport && hasHydrationWarning && environment.temperature > 30) {
      riskScore += 2;
    }
    
    // CLASSIFICATION FINALE
    if (riskScore >= 8) return 'critical';
    if (riskScore >= 5) return 'warning';
    if (riskScore >= 3) return 'caution';
    return 'safe';
  }

  /**
   * GÉNÉRATION ALERTES SIMPLIFIÉES
   */
  private generateAlerts(
    conflicts: Conflict[],
    combinedRisk: string,
    environment: EnvironmentalContext
  ): EmergencyAlert[] {
    
    const alerts: EmergencyAlert[] = [];
    
    // ALERTE NIVEAU 1 : RISQUE ÉLEVÉ
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
    if (criticalConflicts.length > 0) {
      alerts.push({
        level: 'urgent',
        title: '⚠️ ATTENTION - Facteurs de risque détectés',
        message: 'Ajustement des recommandations pour votre sécurité',
        requiredActions: [
          'Réduisez l\'intensité de l\'activité',
          'Hydratez-vous davantage',
          'Prenez des pauses fréquentes'
        ],
        seekMedicalAttention: false,
        stopAllActivities: false
      });
    }
    
    // ALERTE NIVEAU 2 : SURVEILLANCE
    if (combinedRisk === 'warning' && environment.temperature > 30) {
      alerts.push({
        level: 'critical',
        title: '🔍 SURVEILLANCE - Conditions chaudes',
        message: 'Soyez attentif aux signaux de votre corps',
        requiredActions: [
          'Restez hydraté',
          'Cherchez de l\'ombre',
          'Écoutez votre corps'
        ],
        seekMedicalAttention: false,
        stopAllActivities: false
      });
    }
    
    return alerts;
  }

  /**
   * HELPERS - IDENTIFICATION TYPES RECOMMANDATIONS
   */
  private isIntenseActivity(rec: AIRecommendation): boolean {
    return rec.type === 'activity' && (
      rec.recommendation.includes('intense') ||
      rec.recommendation.includes('effort') ||
      rec.timeframe.duration > 90
    );
  }

  private isInsufficientHydration(rec: AIRecommendation): boolean {
    return rec.source === 'hydration' && ['warning', 'critical'].includes(rec.riskLevel);
  }

  private isRestrictiveNutrition(rec: AIRecommendation): boolean {
    const restrictiveKeywords = ['restriction', 'réduire', 'limiter'];
    return restrictiveKeywords.some(keyword => 
      rec.recommendation.toLowerCase().includes(keyword)
    );
  }

  /**
   * DÉTECTION CONFLITS TIMING
   */
  private detectTimingConflicts(recommendations: AIRecommendation[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    for (let i = 0; i < recommendations.length; i++) {
      for (let j = i + 1; j < recommendations.length; j++) {
        const rec1 = recommendations[i];
        const rec2 = recommendations[j];
        
        // Vérifier chevauchement temporel problématique
        const overlap = this.hasTemporalOverlap(rec1, rec2);
        if (overlap && this.isProblematicCombination(rec1, rec2)) {
          conflicts.push({
            severity: 'minor',
            sources: [rec1.source, rec2.source],
            description: `Conflit temporel entre ${rec1.source} et ${rec2.source}`,
            resolution: 'auto_resolved',
            safetyImpact: 'Efficacité réduite des recommandations'
          });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * VALIDATION FINALE
   */
  private performFinalValidation(
    recommendations: AIRecommendation[],
    userProfile: UserProfile
  ): { recommendations: AIRecommendation[]; overrides: Override[] } {
    
    const overrides: Override[] = [];
    const validated = recommendations.map(rec => {
      
      // Vérifications selon profil
      if (userProfile.medicalConditions.includes('heart_disease') && this.isIntenseActivity(rec)) {
        overrides.push({
          originalRecommendation: rec,
          overriddenBy: 'medical_validation',
          newRecommendation: 'Activité modérée recommandée',
          reason: 'Adaptation pour condition cardiaque'
        });
        
        return {
          ...rec,
          recommendation: 'Activité modérée recommandée (condition cardiaque)',
          priority: 'medium' as const,
          riskLevel: 'caution' as const
        };
      }
      
      return rec;
    });
    
    return { recommendations: validated, overrides };
  }

  /**
   * NIVEAU RISQUE FINAL
   */
  private determineFinalRiskLevel(
    combinedRisk: string,
    conflicts: Conflict[]
  ): 'safe' | 'caution' | 'warning' | 'critical' | 'emergency' {
    
    if (conflicts.some(c => c.severity === 'critical')) return 'critical';
    if (combinedRisk === 'critical') return 'critical';
    if (conflicts.some(c => c.severity === 'severe')) return 'warning';
    if (combinedRisk === 'warning') return 'warning';
    if (conflicts.length > 0) return 'caution';
    return 'safe';
  }

  // Méthodes utilitaires pour les réductions...
  private applyCriticalReduction(recommendations: AIRecommendation[], conflict: Conflict): AIRecommendation[] {
    return recommendations.map(rec => {
      if (conflict.sources.includes(rec.source) && rec.source === 'sport') {
        return {
          ...rec,
          recommendation: `Activité réduite : ${rec.recommendation.toLowerCase()} (intensité modérée)`,
          priority: 'medium',
          riskLevel: 'caution'
        };
      }
      return rec;
    });
  }

  private applyConservativeModification(recommendations: AIRecommendation[], conflict: Conflict): AIRecommendation[] {
    return recommendations.map(rec => {
      if (conflict.sources.includes(rec.source)) {
        return {
          ...rec,
          recommendation: `Modifié : ${rec.recommendation} (approche conservative)`,
          riskLevel: rec.riskLevel === 'safe' ? 'caution' : rec.riskLevel
        };
      }
      return rec;
    });
  }

  private applyMinorAdjustments(recommendations: AIRecommendation[], conflict: Conflict): AIRecommendation[] {
    return recommendations.map(rec => {
      if (conflict.sources.includes(rec.source)) {
        return {
          ...rec,
          contraindications: [...rec.contraindications, `Note: ${conflict.description}`]
        };
      }
      return rec;
    });
  }

  private hasTemporalOverlap(rec1: AIRecommendation, rec2: AIRecommendation): boolean {
    return (
      rec1.timeframe.start < rec2.timeframe.end &&
      rec2.timeframe.start < rec1.timeframe.end
    );
  }

  private isProblematicCombination(rec1: AIRecommendation, rec2: AIRecommendation): boolean {
    // Sport intense + repas lourd = problématique
    if (
      (rec1.source === 'sport' && this.isIntenseActivity(rec1)) &&
      (rec2.source === 'nutrition' && rec2.recommendation.includes('repas'))
    ) {
      return true;
    }
    
    return false;
  }
}

/**
 * INSTANCE SINGLETON VALIDATION
 */
export const crossDomainValidator = new CrossDomainValidator();

/**
 * FONCTION UTILITAIRE VALIDATION RAPIDE
 */
export function validateAllRecommendations(
  sportRecs: any[],
  hydrationRecs: any[],
  nutritionRecs: any[],
  sleepRecs: any[],
  environment: EnvironmentalContext,
  userProfile: UserProfile
): ValidationResult {
  
  const allRecommendations: AIRecommendation[] = [
    ...sportRecs.map(r => ({ ...r, source: 'sport' as const })),
    ...hydrationRecs.map(r => ({ ...r, source: 'hydration' as const })),
    ...nutritionRecs.map(r => ({ ...r, source: 'nutrition' as const })),
    ...sleepRecs.map(r => ({ ...r, source: 'sleep' as const }))
  ];
  
  return crossDomainValidator.validateRecommendations(
    allRecommendations,
    environment,
    userProfile
  );
}

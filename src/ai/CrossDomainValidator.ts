
/**
 * CROSS-DOMAIN VALIDATOR - PRÉVENTION RECOMMANDATIONS CONTRADICTOIRES MORTELLES
 * Responsable : Expert IA & Machine Learning Santé
 * 
 * MISSION CRITIQUE :
 * - Empêcher conflits dangereux entre Sport/Hydratation/Nutrition/Sommeil IA
 * - Hiérarchiser sécurité > performance
 * - Alertes cohérence temps réel
 * - Override sécuritaire automatique
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
    
    // 1. DÉTECTION CONFLITS CRITIQUES
    const conflicts = this.detectConflicts(recommendations, environment, userProfile);
    
    // 2. ÉVALUATION RISQUES COMBINÉS
    const combinedRisk = this.assessCombinedRisk(recommendations, environment, userProfile);
    
    // 3. RÉSOLUTION AUTOMATIQUE SÉCURITAIRE
    const resolved = this.resolveConflictsSafely(recommendations, conflicts, combinedRisk);
    
    // 4. GÉNÉRATION ALERTES URGENCE
    const emergencyAlerts = this.generateEmergencyAlerts(conflicts, combinedRisk, environment);
    
    // 5. VALIDATION FINALE MÉDICALE
    const finalValidation = this.performFinalMedicalValidation(resolved, userProfile);
    
    const result = {
      isValid: conflicts.filter(c => c.severity === 'life_threatening').length === 0,
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
   * DÉTECTION CONFLITS MORTELS ENTRE IA
   */
  private detectConflicts(
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext,
    userProfile: UserProfile
  ): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // CONFLIT 1 : SPORT vs HYDRATATION - LE PLUS MORTEL
    const sportRecs = recommendations.filter(r => r.source === 'sport');
    const hydrationRecs = recommendations.filter(r => r.source === 'hydration');
    
    for (const sportRec of sportRecs) {
      for (const hydrationRec of hydrationRecs) {
        
        // Sport dit "intensifiez" mais Hydratation dit "arrêtez"
        if (
          this.isIntensifyingRecommendation(sportRec) &&
          hydrationRec.riskLevel === 'emergency' &&
          environment.temperature > 30
        ) {
          conflicts.push({
            severity: 'life_threatening',
            sources: ['sport', 'hydration'],
            description: `Sport recommande intensification mais risque déshydratation mortelle par chaleur extrême (${environment.temperature}°C)`,
            resolution: 'emergency_override',
            safetyImpact: 'Risque coup de chaleur, hospitalisation possible'
          });
        }
        
        // Sport longue durée mais hydratation insuffisante
        if (
          sportRec.timeframe.duration > 120 && // >2h
          this.isInsufficientHydration(hydrationRec) &&
          environment.temperature > 25
        ) {
          conflicts.push({
            severity: 'critical',
            sources: ['sport', 'hydration'],
            description: 'Activité prolongée >2h avec hydratation insuffisante par chaleur',
            resolution: 'auto_resolved',
            safetyImpact: 'Risque déshydratation progressive'
          });
        }
      }
    }

    // CONFLIT 2 : NUTRITION vs SPORT - HYPOGLYCÉMIE
    const nutritionRecs = recommendations.filter(r => r.source === 'nutrition');
    
    for (const sportRec of sportRecs) {
      for (const nutritionRec of nutritionRecs) {
        
        // Sport intense mais jeûne recommandé
        if (
          this.isIntenseActivity(sportRec) &&
          this.isFastingRecommendation(nutritionRec) &&
          userProfile.medicalConditions.includes('diabetes')
        ) {
          conflicts.push({
            severity: 'life_threatening',
            sources: ['sport', 'nutrition'],
            description: 'Sport intense + jeûne chez diabétique = risque hypoglycémie sévère',
            resolution: 'emergency_override',
            safetyImpact: 'Risque coma hypoglycémique'
          });
        }
      }
    }

    // CONFLIT 3 : SOMMEIL vs SPORT - FATIGUE EXTRÊME
    const sleepRecs = recommendations.filter(r => r.source === 'sleep');
    
    for (const sportRec of sportRecs) {
      for (const sleepRec of sleepRecs) {
        
        // Sport intense mais sommeil <4h détecté
        if (
          this.isIntenseActivity(sportRec) &&
          this.isSevereSleepDeprivation(sleepRec) &&
          environment.temperature > 28
        ) {
          conflicts.push({
            severity: 'severe',
            sources: ['sport', 'sleep'],
            description: 'Sport intense avec privation sommeil sévère par chaleur',
            resolution: 'auto_resolved',
            safetyImpact: 'Risque malaise, chute, blessures'
          });
        }
      }
    }

    // CONFLIT 4 : TIMING CONTRADICTOIRE
    conflicts.push(...this.detectTimingConflicts(recommendations));
    
    // CONFLIT 5 : MÉDICATIONS INCOMPATIBLES
    if (userProfile.currentMedications.length > 0) {
      conflicts.push(...this.detectMedicationConflicts(recommendations, userProfile));
    }

    return conflicts;
  }

  /**
   * RÉSOLUTION AUTOMATIQUE SÉCURITAIRE
   */
  private resolveConflictsSafely(
    recommendations: AIRecommendation[],
    conflicts: Conflict[],
    combinedRisk: string
  ): AIRecommendation[] {
    
    let resolved = [...recommendations];
    
    for (const conflict of conflicts) {
      
      switch (conflict.severity) {
        
        case 'life_threatening':
          // OVERRIDE TOTAL - SÉCURITÉ ABSOLUE
          resolved = this.applyEmergencyOverride(resolved, conflict);
          break;
          
        case 'critical':
          // RÉDUCTION INTENSITÉ DRASTIQUE
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
    
    // VALIDATION HIÉRARCHIE SÉCURITÉ
    return this.enforceSecurityHierarchy(resolved);
  }

  /**
   * OVERRIDE D'URGENCE - ARRÊT TOTAL
   */
  private applyEmergencyOverride(
    recommendations: AIRecommendation[],
    conflict: Conflict
  ): AIRecommendation[] {
    
    return recommendations.map(rec => {
      if (conflict.sources.includes(rec.source)) {
        
        // SPORT : Arrêt immédiat
        if (rec.source === 'sport') {
          return {
            ...rec,
            recommendation: '🚨 ARRÊT IMMÉDIAT de toute activité physique',
            priority: 'emergency',
            riskLevel: 'emergency',
            contraindications: [
              ...rec.contraindications,
              'DANGER : Conditions potentiellement mortelles détectées'
            ]
          };
        }
        
        // HYDRATATION : Protocole urgence
        if (rec.source === 'hydration') {
          return {
            ...rec,
            recommendation: '💧 URGENCE : Hydratation massive 500ml immédiatement + ombre',
            priority: 'emergency',
            riskLevel: 'emergency'
          };
        }
        
        // NUTRITION : Sucres rapides si hypoglycémie
        if (rec.source === 'nutrition') {
          return {
            ...rec,
            recommendation: '🍯 URGENCE : 15g sucres rapides immédiatement si conscient',
            priority: 'emergency',
            riskLevel: 'emergency'
          };
        }
      }
      return rec;
    });
  }

  /**
   * HIÉRARCHIE SÉCURITÉ - PRIORITÉS ABSOLUES
   */
  private enforceSecurityHierarchy(recommendations: AIRecommendation[]): AIRecommendation[] {
    
    // ORDRE PRIORITÉ SÉCURITÉ :
    // 1. HYDRATATION (survie immédiate)
    // 2. NUTRITION (énergie vitale)  
    // 3. SOMMEIL (récupération)
    // 4. SPORT (performance)
    
    const emergencyHydration = recommendations.filter(r => 
      r.source === 'hydration' && r.riskLevel === 'emergency'
    );
    
    const emergencyNutrition = recommendations.filter(r => 
      r.source === 'nutrition' && r.riskLevel === 'emergency'
    );
    
    // Si urgence hydratation → TOUT s'arrête
    if (emergencyHydration.length > 0) {
      return recommendations.map(rec => {
        if (rec.source === 'sport') {
          return {
            ...rec,
            recommendation: '⛔ SUSPENDU : Urgence hydratation prioritaire',
            priority: 'critical',
            riskLevel: 'critical'
          };
        }
        return rec;
      });
    }
    
    // Si urgence nutrition → Sport modéré seulement
    if (emergencyNutrition.length > 0) {
      return recommendations.map(rec => {
        if (rec.source === 'sport' && this.isIntenseActivity(rec)) {
          return {
            ...rec,
            recommendation: '🔄 RÉDUIT : Activité légère seulement (urgence nutritionnelle)',
            priority: 'high',
            riskLevel: 'warning'
          };
        }
        return rec;
      });
    }
    
    return recommendations;
  }

  /**
   * ÉVALUATION RISQUE COMBINÉ MULTI-FACTEURS
   */
  private assessCombinedRisk(
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext,
    userProfile: UserProfile
  ): string {
    
    let riskScore = 0;
    
    // FACTEURS ENVIRONNEMENTAUX CRITIQUES
    if (environment.temperature > 35) riskScore += 5; // Chaleur mortelle
    else if (environment.temperature > 32) riskScore += 3;
    else if (environment.temperature > 28) riskScore += 1;
    
    if (environment.humidity > 85) riskScore += 3; // Sudation impossible
    if (environment.heatIndex > environment.temperature + 5) riskScore += 2;
    if (environment.uvIndex > 8) riskScore += 1;
    if (environment.airQuality > 150) riskScore += 2; // Qualité air dangereuse
    
    // FACTEURS UTILISATEUR VULNÉRABLES
    if (userProfile.age > 75) riskScore += 3;
    else if (userProfile.age > 65) riskScore += 2;
    else if (userProfile.age < 16) riskScore += 2;
    
    if (userProfile.medicalConditions.includes('heart_disease')) riskScore += 4;
    if (userProfile.medicalConditions.includes('diabetes')) riskScore += 3;
    if (userProfile.medicalConditions.includes('kidney_disease')) riskScore += 3;
    if (userProfile.medicalConditions.includes('pregnancy')) riskScore += 2;
    
    // COMBINAISONS DANGEREUSES RECOMMANDATIONS
    const hasIntenseSport = recommendations.some(r => 
      r.source === 'sport' && this.isIntenseActivity(r)
    );
    const hasHydrationWarning = recommendations.some(r => 
      r.source === 'hydration' && r.riskLevel !== 'safe'
    );
    
    if (hasIntenseSport && hasHydrationWarning && environment.temperature > 30) {
      riskScore += 4; // Combinaison potentiellement mortelle
    }
    
    // CLASSIFICATION FINALE
    if (riskScore >= 12) return 'emergency';
    if (riskScore >= 9) return 'critical';
    if (riskScore >= 6) return 'warning';
    if (riskScore >= 3) return 'caution';
    return 'safe';
  }

  /**
   * GÉNÉRATION ALERTES URGENCE MÉDICALE
   */
  private generateEmergencyAlerts(
    conflicts: Conflict[],
    combinedRisk: string,
    environment: EnvironmentalContext
  ): EmergencyAlert[] {
    
    const alerts: EmergencyAlert[] = [];
    
    // ALERTE NIVEAU 1 : MORT IMMINENTE POSSIBLE
    const lifeThreateningConflicts = conflicts.filter(c => c.severity === 'life_threatening');
    if (lifeThreateningConflicts.length > 0) {
      alerts.push({
        level: 'immediate',
        title: '🚨 DANGER IMMINENT - ACTION URGENTE',
        message: 'Combinaison de facteurs potentiellement mortelle détectée',
        requiredActions: [
          'ARRÊTEZ TOUTE ACTIVITÉ IMMÉDIATEMENT',
          'Cherchez environnement frais/climatisé',
          'Hydratez-vous par petites gorgées',
          'Contactez services d\'urgence si malaise',
          'NE RESTEZ PAS SEUL'
        ],
        seekMedicalAttention: true,
        stopAllActivities: true
      });
    }
    
    // ALERTE NIVEAU 2 : RISQUE CRITIQUE
    if (combinedRisk === 'critical' && environment.temperature > 32) {
      alerts.push({
        level: 'urgent',
        title: '⚠️ RISQUE CRITIQUE - SURVEILLANCE RENFORCÉE',
        message: 'Conditions dangereuses pour l\'activité physique',
        requiredActions: [
          'Réduisez drastiquement l\'intensité',
          'Doublez votre hydratation',
          'Restez en environnement frais',
          'Surveillez : vertiges, nausées, confusion'
        ],
        seekMedicalAttention: false,
        stopAllActivities: false
      });
    }
    
    // ALERTE NIVEAU 3 : ATTENTION SOUTENUE
    if (combinedRisk === 'warning') {
      alerts.push({
        level: 'critical',
        title: '🔍 SURVEILLANCE REQUISE',
        message: 'Facteurs de risque multiples identifiés',
        requiredActions: [
          'Activité modérée uniquement',
          'Hydratation renforcée',
          'Pauses fréquentes à l\'ombre'
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
  private isIntensifyingRecommendation(rec: AIRecommendation): boolean {
    const intensifyKeywords = [
      'intensifiez', 'augmentez', 'poussez', 'maximisez', 
      'effort maximal', 'haute intensité', 'performance'
    ];
    return intensifyKeywords.some(keyword => 
      rec.recommendation.toLowerCase().includes(keyword)
    );
  }

  private isIntenseActivity(rec: AIRecommendation): boolean {
    return rec.type === 'activity' && (
      rec.recommendation.includes('intense') ||
      rec.recommendation.includes('competition') ||
      rec.timeframe.duration > 90
    );
  }

  private isInsufficientHydration(rec: AIRecommendation): boolean {
    return rec.source === 'hydration' && ['warning', 'critical', 'emergency'].includes(rec.riskLevel);
  }

  private isFastingRecommendation(rec: AIRecommendation): boolean {
    const fastingKeywords = ['jeûne', 'à jeun', 'sans manger', 'restriction'];
    return fastingKeywords.some(keyword => 
      rec.recommendation.toLowerCase().includes(keyword)
    );
  }

  private isSevereSleepDeprivation(rec: AIRecommendation): boolean {
    return rec.source === 'sleep' && ['critical', 'emergency'].includes(rec.riskLevel);
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
            severity: 'moderate',
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
   * DÉTECTION CONFLITS MÉDICATIONS
   */
  private detectMedicationConflicts(
    recommendations: AIRecommendation[],
    userProfile: UserProfile
  ): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Bêta-bloquants + sport intense = danger cardiaque
    if (
      userProfile.currentMedications.includes('beta_blockers') &&
      recommendations.some(r => r.source === 'sport' && this.isIntenseActivity(r))
    ) {
      conflicts.push({
        severity: 'critical',
        sources: ['sport', 'medication'],
        description: 'Sport intense avec bêta-bloquants - risque cardiaque',
        resolution: 'emergency_override',
        safetyImpact: 'Risque d\'arythmie cardiaque'
      });
    }
    
    // Diurétiques + chaleur + sport = déshydratation extrême
    if (
      userProfile.currentMedications.includes('diuretics') &&
      recommendations.some(r => r.source === 'sport' && r.riskLevel !== 'safe')
    ) {
      conflicts.push({
        severity: 'severe',
        sources: ['sport', 'hydration', 'medication'],
        description: 'Diurétiques + activité = risque déshydratation sévère',
        resolution: 'auto_resolved',
        safetyImpact: 'Déshydratation accélérée'
      });
    }
    
    return conflicts;
  }

  /**
   * VALIDATION MÉDICALE FINALE
   */
  private performFinalMedicalValidation(
    recommendations: AIRecommendation[],
    userProfile: UserProfile
  ): { recommendations: AIRecommendation[]; overrides: Override[] } {
    
    const overrides: Override[] = [];
    const validated = recommendations.map(rec => {
      
      // Vérifications médicales spécifiques selon profil
      if (userProfile.medicalConditions.includes('heart_disease') && this.isIntenseActivity(rec)) {
        overrides.push({
          originalRecommendation: rec,
          overriddenBy: 'medical_validation',
          newRecommendation: 'Activité légère seulement (condition cardiaque)',
          reason: 'Protection cardiaque prioritaire'
        });
        
        return {
          ...rec,
          recommendation: 'Activité légère seulement (condition cardiaque)',
          priority: 'high' as const,
          riskLevel: 'warning' as const
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
    
    if (conflicts.some(c => c.severity === 'life_threatening')) return 'emergency';
    if (combinedRisk === 'emergency') return 'emergency';
    if (conflicts.some(c => c.severity === 'critical')) return 'critical';
    if (combinedRisk === 'critical') return 'critical';
    if (conflicts.some(c => c.severity === 'severe')) return 'warning';
    if (combinedRisk === 'warning') return 'warning';
    if (conflicts.length > 0) return 'caution';
    return 'safe';
  }

  // Méthodes utilitaires pour les autres réductions...
  private applyCriticalReduction(recommendations: AIRecommendation[], conflict: Conflict): AIRecommendation[] {
    return recommendations.map(rec => {
      if (conflict.sources.includes(rec.source) && rec.source === 'sport') {
        return {
          ...rec,
          recommendation: `🔻 RÉDUIT : ${rec.recommendation.toLowerCase()} (intensité réduite de 50%)`,
          priority: 'high',
          riskLevel: 'warning'
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
          recommendation: `⚠️ MODIFIÉ : ${rec.recommendation} (approche conservative)`,
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
          contraindications: [...rec.contraindications, `Attention: ${conflict.description}`]
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
    
    // Hydratation massive + sport immédiat = crampes
    if (
      (rec1.source === 'hydration' && rec1.recommendation.includes('massive')) &&
      (rec2.source === 'sport' && rec2.type === 'activity')
    ) {
      return true;
    }
    
    return false;
  }
}

/**
 * INSTANCE SINGLETON VALIDATION CRITIQUE
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

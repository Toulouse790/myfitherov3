
import { useState, useEffect, useMemo } from 'react';
import { crossDomainValidator, validateAllRecommendations } from '@/ai/CrossDomainValidator';
import { 
  ValidationResult, 
  EnvironmentalContext, 
  UserProfile,
  AIRecommendation 
} from '@/ai/types/CrossDomainTypes';
import { useUserStore } from '@/stores/useUserStore';

export const useCrossDomainValidator = () => {
  const { profile } = useUserStore();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Convertir le profil utilisateur au format attendu
  const userProfile: UserProfile = useMemo(() => {
    if (!profile) {
      return {
        age: 30,
        medicalConditions: [],
        currentMedications: [],
        fitnessLevel: 'beginner',
        recentActivity: []
      };
    }

    return {
      age: profile.age || 30,
      medicalConditions: profile.medical_conditions || [],
      currentMedications: profile.current_medications || [],
      fitnessLevel: profile.experience_level || 'beginner',
      recentActivity: [] // À enrichir avec l'historique d'activité
    };
  }, [profile]);

  /**
   * Valider un ensemble de recommandations
   */
  const validateRecommendations = async (
    recommendations: AIRecommendation[],
    environment: EnvironmentalContext
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = crossDomainValidator.validateRecommendations(
        recommendations,
        environment,
        userProfile
      );
      
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error('Erreur validation croisée:', error);
      
      // Fallback sécuritaire en cas d'erreur
      const fallbackResult: ValidationResult = {
        isValid: false,
        conflicts: [],
        resolvedRecommendations: recommendations,
        overrides: [],
        emergencyAlerts: [{
          level: 'critical',
          title: '⚠️ Erreur système de validation',
          message: 'Impossible de valider la sécurité des recommandations',
          requiredActions: ['Consultez un professionnel de santé'],
          seekMedicalAttention: true,
          stopAllActivities: true
        }],
        finalRiskLevel: 'critical'
      };
      
      setValidationResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Validation rapide multi-sources
   */
  const validateAllSources = async (
    sportRecs: any[] = [],
    hydrationRecs: any[] = [],
    nutritionRecs: any[] = [],
    sleepRecs: any[] = [],
    environment: EnvironmentalContext
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = validateAllRecommendations(
        sportRecs,
        hydrationRecs,
        nutritionRecs,
        sleepRecs,
        environment,
        userProfile
      );
      
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error('Erreur validation multi-sources:', error);
      
      const fallbackResult: ValidationResult = {
        isValid: false,
        conflicts: [],
        resolvedRecommendations: [],
        overrides: [],
        emergencyAlerts: [{
          level: 'critical',
          title: '⚠️ Erreur système de validation',
          message: 'Impossible de valider la sécurité des recommandations',
          requiredActions: ['Consultez un professionnel de santé'],
          seekMedicalAttention: true,
          stopAllActivities: true
        }],
        finalRiskLevel: 'critical'
      };
      
      setValidationResult(fallbackResult);
      return fallbackResult;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Créer un contexte environnemental par défaut
   */
  const createDefaultEnvironment = (): EnvironmentalContext => {
    return {
      temperature: 22, // Température ambiante
      humidity: 50,
      heatIndex: 22,
      uvIndex: 3,
      airQuality: 50,
      timeOfDay: new Date().getHours()
    };
  };

  /**
   * Vérifier si des alertes d'urgence sont présentes
   */
  const hasEmergencyAlerts = useMemo(() => {
    return validationResult?.emergencyAlerts.some(
      alert => alert.level === 'immediate' || alert.stopAllActivities
    ) || false;
  }, [validationResult]);

  /**
   * Obtenir le niveau de risque actuel
   */
  const currentRiskLevel = useMemo(() => {
    return validationResult?.finalRiskLevel || 'safe';
  }, [validationResult]);

  /**
   * Obtenir les recommandations résolues et sécurisées
   */
  const safeRecommendations = useMemo(() => {
    return validationResult?.resolvedRecommendations || [];
  }, [validationResult]);

  return {
    validationResult,
    isValidating,
    validateRecommendations,
    validateAllSources,
    createDefaultEnvironment,
    hasEmergencyAlerts,
    currentRiskLevel,
    safeRecommendations,
    userProfile
  };
};

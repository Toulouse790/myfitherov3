
import { WeatherData } from '@/services/WeatherService';
import { crossDomainValidator } from './CrossDomainValidator';
import { SportRecommendationGenerator } from './sport/SportRecommendationGenerator';
import { NutritionRecommendationGenerator } from './sport/NutritionRecommendationGenerator';
import { ValidationUtils } from './sport/ValidationUtils';
import { Recommendation, UserProfile } from './sport/types';
import { ValidationResult } from './types/CrossDomainTypes';

export class SportAIExpert {
  
  /**
   * Génère des recommandations météo avec validation croisée sécurisée
   */
  generateWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🤖 Génération recommandations sport avec validation croisée pour ${weather.main?.temp}°C`);
    
    // 1. Génération recommandations de base
    const baseRecommendations = SportRecommendationGenerator.generateWeatherRecommendations(weather, userProfile);
    
    // 2. Validation croisée
    try {
      const sportAIRecommendations = ValidationUtils.convertToAIRecommendations(baseRecommendations, 'sport');
      const environmentalContext = ValidationUtils.convertWeatherToEnvironmentalContext(weather);
      const crossDomainUserProfile = ValidationUtils.convertUserProfile(userProfile);
      
      const validationResult = crossDomainValidator.validateRecommendations(
        sportAIRecommendations,
        environmentalContext,
        crossDomainUserProfile
      );
      
      console.log('🔒 Validation croisée sport terminée:', {
        isValid: validationResult.isValid,
        conflicts: validationResult.conflicts.length,
        finalRiskLevel: validationResult.finalRiskLevel
      });
      
      return this.applyValidationResults(validationResult, baseRecommendations);
      
    } catch (error) {
      console.error('❌ Erreur validation croisée sport:', error);
      return baseRecommendations;
    }
  }

  /**
   * Génère des recommandations nutrition avec validation croisée
   */
  generateNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🍎 Génération recommandations nutrition avec validation croisée pour ${weather.main?.temp}°C`);
    
    const baseRecommendations = NutritionRecommendationGenerator.generateNutritionRecommendations(weather, userProfile);
    
    try {
      const nutritionAIRecommendations = ValidationUtils.convertToAIRecommendations(baseRecommendations, 'nutrition');
      const environmentalContext = ValidationUtils.convertWeatherToEnvironmentalContext(weather);
      const crossDomainUserProfile = ValidationUtils.convertUserProfile(userProfile);
      
      const validationResult = crossDomainValidator.validateRecommendations(
        nutritionAIRecommendations,
        environmentalContext,
        crossDomainUserProfile
      );
      
      return this.applyValidationResults(validationResult, baseRecommendations);
      
    } catch (error) {
      console.error('❌ Erreur validation croisée nutrition:', error);
      return baseRecommendations;
    }
  }

  private applyValidationResults(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    console.log('🔧 Application résultats validation croisée...');
    
    // Si conflits détectés, application des résolutions
    if (validationResult.conflicts.length > 0) {
      return this.applyConflictResolutions(validationResult, baseRecommendations);
    }
    
    // Enrichissement simple avec niveau de risque
    return this.enrichWithSafetyInfo(validationResult, baseRecommendations);
  }

  private applyConflictResolutions(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    let resolvedRecommendations = [...baseRecommendations];
    
    validationResult.conflicts.forEach(conflict => {
      if (conflict.severity === 'severe' || conflict.severity === 'critical') {
        resolvedRecommendations = resolvedRecommendations.map(rec => {
          if (conflict.description.toLowerCase().includes(rec.title.toLowerCase())) {
            return {
              ...rec,
              type: 'info',
              title: `🔧 ${rec.title} (Modifié)`,
              message: `${rec.message}\n\nRecommandation ajustée pour optimiser votre sécurité.`,
              priority: 'medium',
              riskLevel: 'caution'
            };
          }
          return rec;
        });
      }
    });
    
    return resolvedRecommendations;
  }

  private enrichWithSafetyInfo(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    const enrichedRecommendations = [...baseRecommendations];
    
    // Ajout d'information de sécurité générale si niveau de risque élevé
    if (validationResult.finalRiskLevel === 'warning') {
      enrichedRecommendations.unshift({
        type: 'info',
        title: '🔒 Validation Sécurité',
        message: 'Recommandations vérifiées et adaptées.',
        icon: '🛡️',
        priority: 'medium',
        riskLevel: validationResult.finalRiskLevel
      });
    }
    
    return enrichedRecommendations;
  }
}

// Re-export types for backward compatibility
export type { Recommendation, UserProfile } from './sport/types';

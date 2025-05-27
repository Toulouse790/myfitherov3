
import { WeatherData } from '@/services/WeatherService';
import { SportRecommendationGenerator } from './sport/SportRecommendationGenerator';
import { NutritionRecommendationGenerator } from './sport/NutritionRecommendationGenerator';
import { Recommendation, UserProfile } from './sport/types';

export class SportAIExpert {
  
  /**
   * Génère des recommandations météo simplifiées
   */
  generateWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🤖 Génération recommandations sport pour ${weather.main?.temp}°C`);
    
    const baseRecommendations = SportRecommendationGenerator.generateWeatherRecommendations(weather, userProfile);
    
    // Enrichissement simple avec informations de sécurité de base
    return this.enrichWithBasicSafetyInfo(baseRecommendations);
  }

  /**
   * Génère des recommandations nutrition
   */
  generateNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🍎 Génération recommandations nutrition pour ${weather.main?.temp}°C`);
    
    const baseRecommendations = NutritionRecommendationGenerator.generateNutritionRecommendations(weather, userProfile);
    
    return this.enrichWithBasicSafetyInfo(baseRecommendations);
  }

  private enrichWithBasicSafetyInfo(baseRecommendations: Recommendation[]): Recommendation[] {
    const enrichedRecommendations = [...baseRecommendations];
    
    // Ajout d'information de sécurité générale simple
    enrichedRecommendations.unshift({
      type: 'info',
      title: '💡 Conseils adaptés',
      message: 'Recommandations personnalisées selon la météo.',
      icon: '🛡️',
      priority: 'medium',
      riskLevel: 'safe'
    });
    
    return enrichedRecommendations;
  }
}

// Re-export types for backward compatibility
export type { Recommendation, UserProfile } from './sport/types';

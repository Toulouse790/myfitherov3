
import { WeatherData } from '@/services/WeatherService';
import { Recommendation, UserProfile } from './types';

export class NutritionRecommendationGenerator {
  static generateNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';

    // Temperature-based nutrition recommendations
    if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '🥤 Hydratation renforcée',
        message: 'Augmentez votre consommation d\'eau par temps chaud.',
        alternatives: ['Eau citronnée', 'Thé glacé', 'Fruits gorgés d\'eau'],
        icon: '💧',
        priority: 'medium',
        riskLevel: 'safe'
      });

      recommendations.push({
        type: 'info',
        title: '🥗 Alimentation rafraîchissante',
        message: 'Privilégiez les aliments frais et légers.',
        alternatives: ['Salades', 'Fruits frais', 'Smoothies', 'Yaourts'],
        icon: '🌿',
        priority: 'low',
        riskLevel: 'safe'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'tip',
        title: '🍲 Nutrition réconfortante',
        message: 'Optez pour des repas chauds et énergétiques.',
        alternatives: ['Soupes', 'Tisanes chaudes', 'Plats mijotés', 'Noix et fruits secs'],
        icon: '🔥',
        priority: 'low',
        riskLevel: 'safe'
      });
    }

    // Weather condition recommendations
    if (weatherCondition === 'Rain') {
      recommendations.push({
        type: 'tip',
        title: '☔ Boost moral',
        message: 'Par temps pluvieux, misez sur des aliments riches en vitamine D.',
        alternatives: ['Poissons gras', 'Œufs', 'Champignons', 'Chocolat noir'],
        icon: '🌈',
        priority: 'low',
        riskLevel: 'safe'
      });
    }

    return recommendations;
  }
}

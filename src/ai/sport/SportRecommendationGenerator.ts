
import { WeatherData } from '@/services/WeatherService';
import { Recommendation, UserProfile } from './types';
import { WeatherAnalyzer } from './WeatherAnalyzer';

export class SportRecommendationGenerator {
  static generateWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const analysis = WeatherAnalyzer.analyze(weather);

    // Temperature-based recommendations
    recommendations.push(...this.generateTemperatureRecommendations(analysis, userProfile));
    
    // Weather condition recommendations
    recommendations.push(...this.generateConditionRecommendations(analysis));
    
    // Humidity and wind recommendations
    recommendations.push(...this.generateEnvironmentalRecommendations(analysis));
    
    // User-specific recommendations
    if (userProfile) {
      recommendations.push(...this.generateUserSpecificRecommendations(userProfile));
    }

    return recommendations;
  }

  private static generateTemperatureRecommendations(analysis: any, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { temperature } = analysis;

    if (temperature > 35) {
      recommendations.push({
        type: 'info',
        title: '🌡️ Conditions chaudes',
        message: `Il fait ${temperature}°C. Privilégiez un entraînement en intérieur avec climatisation.`,
        alternatives: ['Salle de sport', 'Yoga à la maison', 'Natation en piscine couverte'],
        icon: '🏠',
        priority: 'high'
      });
    } else if (temperature > 30) {
      recommendations.push({
        type: 'info',
        title: '☀️ Temps chaud',
        message: `Il fait ${temperature}°C. Réduisez l'intensité et hydratez-vous davantage.`,
        action: 'adjust_intensity',
        icon: '💧',
        priority: 'medium'
      });
    } else if (temperature > 25) {
      recommendations.push({
        type: 'tip',
        title: '☀️ Temps agréable',
        message: 'Parfait pour l\'entraînement ! Pensez à vous hydrater régulièrement.',
        icon: '💧',
        priority: 'low'
      });
    } else if (temperature < 0) {
      recommendations.push({
        type: 'info',
        title: '🥶 Conditions froides',
        message: `Il fait ${temperature}°C. Privilégiez un entraînement en intérieur aujourd'hui.`,
        alternatives: ['Salle de sport', 'Fitness à domicile', 'Yoga'],
        icon: '🏠',
        priority: 'medium'
      });
    } else if (temperature < 5) {
      recommendations.push({
        type: 'tip',
        title: '❄️ Température froide',
        message: `Il fait ${temperature}°C. Prolongez votre échauffement de 5-10 minutes.`,
        action: 'extend_warmup',
        icon: '🔥',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private static generateConditionRecommendations(analysis: any): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { condition, temperature } = analysis;

    if (condition === 'Rain') {
      recommendations.push({
        type: 'info',
        title: '🌧️ Pluie détectée',
        message: 'Privilégiez un entraînement en intérieur aujourd\'hui.',
        alternatives: ['Yoga', 'Pilates', 'Musculation', 'Cardio indoor'],
        icon: '🏠',
        priority: 'medium'
      });
    } else if (condition === 'Thunderstorm') {
      recommendations.push({
        type: 'info',
        title: '⛈️ Orage en cours',
        message: 'Évitez les activités extérieures. Privilégiez un entraînement en intérieur.',
        alternatives: ['Méditation', 'Étirements', 'Exercices de respiration', 'Yoga'],
        icon: '🏠',
        priority: 'high'
      });
    } else if (condition === 'Clear' && temperature >= 15 && temperature <= 25) {
      recommendations.push({
        type: 'success',
        title: '🌞 Conditions parfaites',
        message: 'Temps idéal pour l\'entraînement en extérieur !',
        alternatives: ['Course à pied', 'Vélo', 'Randonnée', 'Exercices au parc'],
        icon: '🌟',
        priority: 'low'
      });
    }

    return recommendations;
  }

  private static generateEnvironmentalRecommendations(analysis: any): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { humidity, windSpeed } = analysis;

    if (humidity > 85) {
      recommendations.push({
        type: 'tip',
        title: '💨 Humidité élevée',
        message: `Humidité à ${humidity}%. Réduisez l'intensité et prenez des pauses plus fréquentes.`,
        action: 'reduce_intensity',
        icon: '🌫️',
        priority: 'medium'
      });
    }

    if (windSpeed > 20) {
      recommendations.push({
        type: 'info',
        title: '💨 Vent fort',
        message: `Vent à ${windSpeed} km/h. Considérez un entraînement en intérieur.`,
        alternatives: ['Salle de sport', 'Exercices à domicile'],
        icon: '🏠',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private static generateUserSpecificRecommendations(userProfile: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (userProfile.level === 'débutant') {
      recommendations.push({
        type: 'tip',
        title: '🎯 Conseil débutant',
        message: 'Commencez doucement et écoutez votre corps.',
        icon: '💡',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

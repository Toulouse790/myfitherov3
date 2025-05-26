
import { WeatherData } from '@/services/WeatherService';

export interface Recommendation {
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  alternatives?: string[];
  icon?: string;
}

export interface UserProfile {
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  preferences?: string[];
  goals?: string[];
}

export class SportAIExpert {
  generateWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';
    const humidity = weather.main?.humidity || 50;
    const windSpeed = weather.wind?.speed || 0;

    console.log(`🤖 Génération de recommandations pour ${temp}°C, ${weatherCondition}`);

    // Analyse de la température
    if (temp > 30) {
      recommendations.push({
        type: 'warning',
        title: '🌡️ Forte chaleur détectée',
        message: `Il fait ${temp}°C ! Réduisez l'intensité de 20% et hydratez-vous davantage.`,
        action: 'adjust_intensity',
        icon: '🥵'
      });
    } else if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '☀️ Temps chaud idéal',
        message: `Parfait pour l'entraînement ! Pensez à vous hydrater régulièrement.`,
        icon: '💧'
      });
    } else if (temp < 5) {
      recommendations.push({
        type: 'info',
        title: '🥶 Température froide',
        message: `Il fait ${temp}°C. Prolongez votre échauffement de 5-10 minutes.`,
        action: 'extend_warmup',
        icon: '🔥'
      });
    }

    // Analyse des conditions météorologiques
    if (weatherCondition === 'Rain') {
      recommendations.push({
        type: 'info',
        title: '🌧️ Pluie détectée',
        message: 'Privilégiez un entraînement en intérieur aujourd\'hui.',
        alternatives: ['Yoga', 'Pilates', 'Musculation', 'Cardio indoor'],
        icon: '🏠'
      });
    } else if (weatherCondition === 'Thunderstorm') {
      recommendations.push({
        type: 'warning',
        title: '⛈️ Orage en cours',
        message: 'Évitez absolument les activités extérieures. Restez en sécurité !',
        alternatives: ['Méditation', 'Étirements', 'Exercices de respiration'],
        icon: '⚠️'
      });
    } else if (weatherCondition === 'Clear' && temp >= 15 && temp <= 25) {
      recommendations.push({
        type: 'success',
        title: '🌞 Conditions parfaites',
        message: 'Temps idéal pour l\'entraînement en extérieur !',
        alternatives: ['Course à pied', 'Vélo', 'Randonnée', 'Exercices au parc'],
        icon: '🌟'
      });
    }

    // Analyse de l'humidité
    if (humidity > 80) {
      recommendations.push({
        type: 'tip',
        title: '💨 Humidité élevée',
        message: `Humidité à ${humidity}%. Réduisez l'intensité et aérez-vous davantage.`,
        action: 'increase_ventilation',
        icon: '🌫️'
      });
    }

    // Analyse du vent
    if (windSpeed > 15) {
      recommendations.push({
        type: 'info',
        title: '💨 Vent fort',
        message: `Vent à ${windSpeed} km/h. Adaptez vos exercices en extérieur.`,
        alternatives: ['Exercices au sol', 'Entraînement en intérieur'],
        icon: '🌪️'
      });
    }

    // Recommandations basées sur le profil utilisateur
    if (userProfile?.level === 'débutant') {
      recommendations.push({
        type: 'tip',
        title: '🎯 Conseil débutant',
        message: 'Commencez doucement et écoutez votre corps, surtout par ce temps.',
        icon: '💡'
      });
    }

    return recommendations;
  }

  generateNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';

    console.log(`🍎 Génération de recommandations nutrition pour ${temp}°C`);

    // Recommandations basées sur la température
    if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '🥤 Hydratation renforcée',
        message: 'Augmentez votre consommation d\'eau de 20-30% par temps chaud.',
        alternatives: ['Eau citronnée', 'Thé glacé', 'Fruits gorgés d\'eau'],
        icon: '💧'
      });

      recommendations.push({
        type: 'info',
        title: '🥗 Alimentation rafraîchissante',
        message: 'Privilégiez les aliments frais et légers.',
        alternatives: ['Salades', 'Fruits frais', 'Smoothies', 'Yaourts'],
        icon: '🌿'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'tip',
        title: '🍲 Nutrition réconfortante',
        message: 'Optez pour des repas chauds et énergétiques.',
        alternatives: ['Soupes', 'Tisanes chaudes', 'Plats mijotés', 'Noix et fruits secs'],
        icon: '🔥'
      });
    }

    // Recommandations selon les conditions
    if (weatherCondition === 'Rain') {
      recommendations.push({
        type: 'tip',
        title: '☔ Boost moral',
        message: 'Par temps pluvieux, misez sur des aliments riches en vitamine D.',
        alternatives: ['Poissons gras', 'Œufs', 'Champignons', 'Chocolat noir'],
        icon: '🌈'
      });
    }

    return recommendations;
  }
}

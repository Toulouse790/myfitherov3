
import { WeatherData } from '@/services/WeatherService';
import { crossDomainValidator } from './CrossDomainValidator';
import { 
  AIRecommendation, 
  EnvironmentalContext, 
  UserProfile as CrossDomainUserProfile,
  ValidationResult 
} from './types/CrossDomainTypes';

export interface Recommendation {
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  alternatives?: string[];
  icon?: string;
  // Ajout pour validation croisée (sans emergency)
  priority?: 'low' | 'medium' | 'high';
  contraindications?: string[];
  riskLevel?: 'safe' | 'caution' | 'warning';
}

export interface UserProfile {
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  preferences?: string[];
  goals?: string[];
  // Ajout pour validation croisée
  age?: number;
  medicalConditions?: string[];
  currentMedications?: string[];
  fitnessLevel?: string;
}

export class SportAIExpert {
  
  /**
   * Génère des recommandations météo avec validation croisée sécurisée
   */
  generateWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🤖 Génération recommandations sport avec validation croisée pour ${weather.main?.temp}°C`);
    
    // 1. Génération recommandations de base
    const baseRecommendations = this.generateBaseWeatherRecommendations(weather, userProfile);
    
    // 2. Conversion pour validation croisée
    const sportAIRecommendations = this.convertToAIRecommendations(baseRecommendations, 'sport');
    const environmentalContext = this.convertWeatherToEnvironmentalContext(weather);
    const crossDomainUserProfile = this.convertUserProfile(userProfile);
    
    // 3. VALIDATION CROISÉE (sans alertes d'urgence)
    try {
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
      
      // 4. Application des résultats de validation (sans alertes d'urgence)
      return this.applyValidationResults(validationResult, baseRecommendations);
      
    } catch (error) {
      console.error('❌ Erreur validation croisée sport:', error);
      
      // Fallback simple
      return baseRecommendations;
    }
  }

  /**
   * Génère des recommandations nutrition avec validation croisée
   */
  generateNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    console.log(`🍎 Génération recommandations nutrition avec validation croisée pour ${weather.main?.temp}°C`);
    
    const baseRecommendations = this.generateBaseNutritionRecommendations(weather, userProfile);
    const nutritionAIRecommendations = this.convertToAIRecommendations(baseRecommendations, 'nutrition');
    const environmentalContext = this.convertWeatherToEnvironmentalContext(weather);
    const crossDomainUserProfile = this.convertUserProfile(userProfile);
    
    try {
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

  // ===== MÉTHODES PRIVÉES VALIDATION CROISÉE =====

  private generateBaseWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';
    const humidity = weather.main?.humidity || 50;
    const windSpeed = weather.wind?.speed || 0;

    // Analyse de la température (sans alertes d'urgence)
    if (temp > 35) {
      recommendations.push({
        type: 'warning',
        title: '🌡️ Conditions chaudes',
        message: `Il fait ${temp}°C. Privilégiez un entraînement en intérieur avec climatisation.`,
        alternatives: ['Salle de sport', 'Yoga à la maison', 'Natation en piscine couverte'],
        icon: '🏠',
        priority: 'high',
        riskLevel: 'warning'
      });
    } else if (temp > 30) {
      recommendations.push({
        type: 'info',
        title: '☀️ Temps chaud',
        message: `Il fait ${temp}°C. Réduisez l'intensité et hydratez-vous davantage.`,
        action: 'adjust_intensity',
        icon: '💧',
        priority: 'medium',
        riskLevel: 'caution'
      });
    } else if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '☀️ Temps agréable',
        message: `Parfait pour l'entraînement ! Pensez à vous hydrater régulièrement.`,
        icon: '💧',
        priority: 'low',
        riskLevel: 'safe'
      });
    } else if (temp < 0) {
      recommendations.push({
        type: 'info',
        title: '🥶 Conditions froides',
        message: `Il fait ${temp}°C. Privilégiez un entraînement en intérieur aujourd'hui.`,
        alternatives: ['Salle de sport', 'Fitness à domicile', 'Yoga'],
        icon: '🏠',
        priority: 'medium',
        riskLevel: 'caution'
      });
    } else if (temp < 5) {
      recommendations.push({
        type: 'tip',
        title: '❄️ Température froide',
        message: `Il fait ${temp}°C. Prolongez votre échauffement de 5-10 minutes.`,
        action: 'extend_warmup',
        icon: '🔥',
        priority: 'medium',
        riskLevel: 'safe'
      });
    }

    // Analyse des conditions météorologiques
    if (weatherCondition === 'Rain') {
      recommendations.push({
        type: 'info',
        title: '🌧️ Pluie détectée',
        message: 'Privilégiez un entraînement en intérieur aujourd\'hui.',
        alternatives: ['Yoga', 'Pilates', 'Musculation', 'Cardio indoor'],
        icon: '🏠',
        priority: 'medium',
        riskLevel: 'safe'
      });
    } else if (weatherCondition === 'Thunderstorm') {
      recommendations.push({
        type: 'warning',
        title: '⛈️ Orage en cours',
        message: 'Évitez les activités extérieures. Privilégiez un entraînement en intérieur.',
        alternatives: ['Méditation', 'Étirements', 'Exercices de respiration', 'Yoga'],
        icon: '🏠',
        priority: 'high',
        riskLevel: 'warning'
      });
    } else if (weatherCondition === 'Clear' && temp >= 15 && temp <= 25) {
      recommendations.push({
        type: 'success',
        title: '🌞 Conditions parfaites',
        message: 'Temps idéal pour l\'entraînement en extérieur !',
        alternatives: ['Course à pied', 'Vélo', 'Randonnée', 'Exercices au parc'],
        icon: '🌟',
        priority: 'low',
        riskLevel: 'safe'
      });
    }

    // Analyse de l'humidité
    if (humidity > 85) {
      recommendations.push({
        type: 'tip',
        title: '💨 Humidité élevée',
        message: `Humidité à ${humidity}%. Réduisez l'intensité et prenez des pauses plus fréquentes.`,
        action: 'reduce_intensity',
        icon: '🌫️',
        priority: 'medium',
        riskLevel: 'caution'
      });
    }

    // Analyse du vent
    if (windSpeed > 20) {
      recommendations.push({
        type: 'info',
        title: '💨 Vent fort',
        message: `Vent à ${windSpeed} km/h. Considérez un entraînement en intérieur.`,
        alternatives: ['Salle de sport', 'Exercices à domicile'],
        icon: '🏠',
        priority: 'medium',
        riskLevel: 'caution'
      });
    }

    // Recommandations personnalisées selon profil
    if (userProfile?.level === 'débutant') {
      recommendations.push({
        type: 'tip',
        title: '🎯 Conseil débutant',
        message: 'Commencez doucement et écoutez votre corps.',
        icon: '💡',
        priority: 'medium',
        riskLevel: 'safe'
      });
    }

    return recommendations;
  }

  private generateBaseNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';

    // Recommandations basées sur la température
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

    // Recommandations selon les conditions
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

  private convertToAIRecommendations(recommendations: Recommendation[], source: 'sport' | 'nutrition'): AIRecommendation[] {
    return recommendations.map(rec => ({
      source,
      type: this.mapRecommendationType(rec.type),
      priority: rec.priority || 'medium',
      recommendation: rec.message,
      contraindications: rec.contraindications || [],
      medicalAlerts: [],
      environmentalFactors: [rec.title],
      timeframe: {
        start: new Date(),
        end: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        duration: 60 // 1h par défaut
      },
      riskLevel: rec.riskLevel || 'safe',
      confidence: this.calculateConfidence(rec)
    }));
  }

  private convertWeatherToEnvironmentalContext(weather: WeatherData): EnvironmentalContext {
    return {
      temperature: weather.main?.temp || 20,
      humidity: weather.main?.humidity || 50,
      heatIndex: this.calculateHeatIndex(weather.main?.temp || 20, weather.main?.humidity || 50),
      uvIndex: this.estimateUVIndex(weather),
      airQuality: 50, // Valeur par défaut
      timeOfDay: new Date().getHours()
    };
  }

  private convertUserProfile(userProfile?: UserProfile): CrossDomainUserProfile {
    return {
      age: userProfile?.age || 30,
      medicalConditions: userProfile?.medicalConditions || [],
      currentMedications: userProfile?.currentMedications || [],
      fitnessLevel: userProfile?.fitnessLevel || userProfile?.level || 'débutant',
      recentActivity: [] // À enrichir avec données d'activité
    };
  }

  private applyValidationResults(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    console.log('🔧 Application résultats validation croisée...');
    
    // Si conflits détectés, application des résolutions (sans alertes d'urgence)
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
        // Modifications conservatrices pour conflits sévères
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
        message: `Recommandations vérifiées et adaptées.`,
        icon: '🛡️',
        priority: 'medium',
        riskLevel: validationResult.finalRiskLevel
      });
    }
    
    return enrichedRecommendations;
  }

  // ===== MÉTHODES UTILITAIRES =====

  private mapRecommendationType(type: string): 'activity' | 'intake' | 'timing' | 'intensity' | 'alert' {
    switch (type) {
      case 'warning': return 'alert';
      case 'info': return 'activity';
      case 'tip': return 'intensity';
      default: return 'activity';
    }
  }

  private calculateConfidence(rec: Recommendation): number {
    // Calcul confiance basé sur le type et le niveau de risque
    if (rec.riskLevel === 'warning') return 85;
    if (rec.riskLevel === 'caution') return 75;
    return 70;
  }

  private calculateHeatIndex(temp: number, humidity: number): number {
    if (temp <= 26 || humidity <= 40) return temp;
    const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
    return Math.round(temp + adjustmentFactor);
  }

  private estimateUVIndex(weather: WeatherData): number {
    const hour = new Date().getHours();
    const condition = weather.weather?.[0]?.main || 'Clear';
    
    if (hour < 7 || hour > 19) return 0;
    if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
    if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
    
    return 6;
  }
}

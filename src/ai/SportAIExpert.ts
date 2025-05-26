
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
  // Ajout pour validation croisée
  priority?: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  contraindications?: string[];
  medicalAlerts?: string[];
  riskLevel?: 'safe' | 'caution' | 'warning' | 'critical' | 'emergency';
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
    
    // 3. VALIDATION CROISÉE CRITIQUE
    try {
      const validationResult = crossDomainValidator.validateRecommendations(
        sportAIRecommendations,
        environmentalContext,
        crossDomainUserProfile
      );
      
      console.log('🔒 Validation croisée sport terminée:', {
        isValid: validationResult.isValid,
        conflicts: validationResult.conflicts.length,
        emergencyAlerts: validationResult.emergencyAlerts.length,
        finalRiskLevel: validationResult.finalRiskLevel
      });
      
      // 4. Application des résultats de validation
      return this.applyValidationResults(validationResult, baseRecommendations);
      
    } catch (error) {
      console.error('❌ Erreur validation croisée sport:', error);
      
      // Fallback sécuritaire
      return this.applySafetyFallback(baseRecommendations);
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
      return this.applySafetyFallback(baseRecommendations);
    }
  }

  // ===== MÉTHODES PRIVÉES VALIDATION CROISÉE =====

  private generateBaseWeatherRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';
    const humidity = weather.main?.humidity || 50;
    const windSpeed = weather.wind?.speed || 0;

    // Analyse de la température avec niveaux de risque
    if (temp > 30) {
      recommendations.push({
        type: 'warning',
        title: '🌡️ Forte chaleur détectée',
        message: `Il fait ${temp}°C ! Réduisez l'intensité de 20% et hydratez-vous davantage.`,
        action: 'adjust_intensity',
        icon: '🥵',
        priority: 'critical',
        riskLevel: 'critical',
        contraindications: ['Effort intense prolongé', 'Activité en plein soleil'],
        medicalAlerts: ['Risque coup de chaleur élevé']
      });
    } else if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '☀️ Temps chaud idéal',
        message: `Parfait pour l'entraînement ! Pensez à vous hydrater régulièrement.`,
        icon: '💧',
        priority: 'medium',
        riskLevel: 'caution'
      });
    } else if (temp < 5) {
      recommendations.push({
        type: 'info',
        title: '🥶 Température froide',
        message: `Il fait ${temp}°C. Prolongez votre échauffement de 5-10 minutes.`,
        action: 'extend_warmup',
        icon: '🔥',
        priority: 'medium',
        riskLevel: 'caution'
      });
    }

    // Analyse des conditions météorologiques avec validation sécuritaire
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
        message: 'Évitez absolument les activités extérieures. Restez en sécurité !',
        alternatives: ['Méditation', 'Étirements', 'Exercices de respiration'],
        icon: '⚠️',
        priority: 'emergency',
        riskLevel: 'emergency',
        contraindications: ['Toute activité extérieure'],
        medicalAlerts: ['Risque de foudre - Restez à l\'intérieur']
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

    // Analyse de l'humidité avec risques physiologiques
    if (humidity > 80) {
      recommendations.push({
        type: 'tip',
        title: '💨 Humidité élevée',
        message: `Humidité à ${humidity}%. Réduisez l'intensité et aérez-vous davantage.`,
        action: 'increase_ventilation',
        icon: '🌫️',
        priority: 'high',
        riskLevel: 'warning',
        contraindications: ['Effort maximal', 'Sessions très longues'],
        medicalAlerts: ['Thermorégulation difficile - Surveillance accrue']
      });
    }

    // Analyse du vent avec impacts sécuritaires
    if (windSpeed > 15) {
      recommendations.push({
        type: 'info',
        title: '💨 Vent fort',
        message: `Vent à ${windSpeed} km/h. Adaptez vos exercices en extérieur.`,
        alternatives: ['Exercices au sol', 'Entraînement en intérieur'],
        icon: '🌪️',
        priority: 'medium',
        riskLevel: 'caution'
      });
    }

    // Recommandations personnalisées selon profil avec sécurité
    if (userProfile?.level === 'débutant') {
      recommendations.push({
        type: 'tip',
        title: '🎯 Conseil débutant',
        message: 'Commencez doucement et écoutez votre corps, surtout par ce temps.',
        icon: '💡',
        priority: 'high',
        riskLevel: 'safe'
      });
    }

    return recommendations;
  }

  private generateBaseNutritionRecommendations(weather: WeatherData, userProfile?: UserProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';

    // Recommandations basées sur la température avec validation médicale
    if (temp > 25) {
      recommendations.push({
        type: 'tip',
        title: '🥤 Hydratation renforcée',
        message: 'Augmentez votre consommation d\'eau de 20-30% par temps chaud.',
        alternatives: ['Eau citronnée', 'Thé glacé', 'Fruits gorgés d\'eau'],
        icon: '💧',
        priority: 'high',
        riskLevel: 'warning'
      });

      recommendations.push({
        type: 'info',
        title: '🥗 Alimentation rafraîchissante',
        message: 'Privilégiez les aliments frais et légers.',
        alternatives: ['Salades', 'Fruits frais', 'Smoothies', 'Yaourts'],
        icon: '🌿',
        priority: 'medium',
        riskLevel: 'safe'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'tip',
        title: '🍲 Nutrition réconfortante',
        message: 'Optez pour des repas chauds et énergétiques.',
        alternatives: ['Soupes', 'Tisanes chaudes', 'Plats mijotés', 'Noix et fruits secs'],
        icon: '🔥',
        priority: 'medium',
        riskLevel: 'safe'
      });
    }

    // Recommandations selon les conditions avec considérations santé
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
      medicalAlerts: rec.medicalAlerts || [],
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
    
    // Si validation échouée et urgence détectée
    if (!validationResult.isValid && validationResult.finalRiskLevel === 'emergency') {
      return this.generateEmergencyOverrides(validationResult);
    }
    
    // Si conflits détectés, application des résolutions
    if (validationResult.conflicts.length > 0) {
      return this.applyConflictResolutions(validationResult, baseRecommendations);
    }
    
    // Enrichissement avec alertes de sécurité
    return this.enrichWithSafetyAlerts(validationResult, baseRecommendations);
  }

  private generateEmergencyOverrides(validationResult: ValidationResult): Recommendation[] {
    const emergencyRecommendations: Recommendation[] = [];
    
    validationResult.emergencyAlerts.forEach(alert => {
      emergencyRecommendations.push({
        type: 'warning',
        title: `🚨 ${alert.title}`,
        message: alert.message,
        icon: '⚠️',
        priority: 'emergency',
        riskLevel: 'emergency',
        contraindications: ['Toute activité physique intense'],
        medicalAlerts: alert.requiredActions
      });
    });
    
    // Ajout recommandation d'arrêt si nécessaire
    if (validationResult.emergencyAlerts.some(alert => alert.stopAllActivities)) {
      emergencyRecommendations.push({
        type: 'warning',
        title: '⛔ ARRÊT ACTIVITÉS REQUIS',
        message: 'Conditions critiques détectées. Consultez un médecin avant reprise.',
        icon: '🏥',
        priority: 'emergency',
        riskLevel: 'emergency',
        alternatives: ['Repos complet', 'Consultation médicale', 'Surveillance symptômes']
      });
    }
    
    return emergencyRecommendations;
  }

  private applyConflictResolutions(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    let resolvedRecommendations = [...baseRecommendations];
    
    validationResult.conflicts.forEach(conflict => {
      if (conflict.severity === 'critical' || conflict.severity === 'life_threatening') {
        // Override automatique pour conflits critiques
        resolvedRecommendations = resolvedRecommendations.map(rec => {
          if (conflict.description.toLowerCase().includes(rec.title.toLowerCase())) {
            return {
              ...rec,
              type: 'warning',
              title: `⚠️ ${rec.title} (Modifié)`,
              message: `${rec.message}\n\n🔒 ATTENTION: ${conflict.safetyImpact}`,
              priority: 'critical',
              riskLevel: 'critical',
              contraindications: [...(rec.contraindications || []), conflict.description]
            };
          }
          return rec;
        });
      }
    });
    
    return resolvedRecommendations;
  }

  private enrichWithSafetyAlerts(validationResult: ValidationResult, baseRecommendations: Recommendation[]): Recommendation[] {
    const enrichedRecommendations = [...baseRecommendations];
    
    // Ajout d'alertes de sécurité générales si niveau de risque élevé
    if (validationResult.finalRiskLevel === 'critical' || validationResult.finalRiskLevel === 'warning') {
      enrichedRecommendations.unshift({
        type: 'warning',
        title: '🔒 Validation Sécurité Active',
        message: `Niveau de risque: ${validationResult.finalRiskLevel}. Recommandations ajustées pour votre sécurité.`,
        icon: '🛡️',
        priority: 'high',
        riskLevel: validationResult.finalRiskLevel
      });
    }
    
    return enrichedRecommendations;
  }

  private applySafetyFallback(baseRecommendations: Recommendation[]): Recommendation[] {
    console.warn('⚠️ Application fallback sécuritaire suite erreur validation');
    
    return [
      {
        type: 'warning',
        title: '🛡️ Mode Sécurité Activé',
        message: 'Système de validation en mode conservateur. Consultez un médecin pour recommandations personnalisées.',
        icon: '⚠️',
        priority: 'critical',
        riskLevel: 'warning',
        alternatives: ['Activité légère uniquement', 'Surveillance médicale', 'Hydratation renforcée']
      },
      ...baseRecommendations.map(rec => ({
        ...rec,
        priority: 'low' as const,
        riskLevel: 'caution' as const,
        message: `${rec.message} (Mode conservateur activé)`
      }))
    ];
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
    if (rec.riskLevel === 'emergency' || rec.riskLevel === 'critical') return 95;
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


import { Recommendation } from './types';
import { 
  AIRecommendation, 
  EnvironmentalContext, 
  UserProfile as CrossDomainUserProfile 
} from '../types/CrossDomainTypes';
import { WeatherData } from '@/services/WeatherService';

export class ValidationUtils {
  static convertToAIRecommendations(recommendations: Recommendation[], source: 'sport' | 'nutrition'): AIRecommendation[] {
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

  static convertWeatherToEnvironmentalContext(weather: WeatherData): EnvironmentalContext {
    return {
      temperature: weather.main?.temp || 20,
      humidity: weather.main?.humidity || 50,
      heatIndex: this.calculateHeatIndex(weather.main?.temp || 20, weather.main?.humidity || 50),
      uvIndex: this.estimateUVIndex(weather),
      airQuality: 50, // Valeur par défaut
      timeOfDay: new Date().getHours()
    };
  }

  static convertUserProfile(userProfile?: any): CrossDomainUserProfile {
    return {
      age: userProfile?.age || 30,
      medicalConditions: userProfile?.medicalConditions || [],
      currentMedications: userProfile?.currentMedications || [],
      fitnessLevel: userProfile?.fitnessLevel || userProfile?.level || 'débutant',
      recentActivity: [] // À enrichir avec données d'activité
    };
  }

  private static mapRecommendationType(type: string): 'activity' | 'intake' | 'timing' | 'intensity' | 'alert' {
    switch (type) {
      case 'warning': return 'alert';
      case 'info': return 'activity';
      case 'tip': return 'intensity';
      default: return 'activity';
    }
  }

  private static calculateConfidence(rec: Recommendation): number {
    if (rec.riskLevel === 'warning') return 85;
    if (rec.riskLevel === 'caution') return 75;
    return 70;
  }

  private static calculateHeatIndex(temp: number, humidity: number): number {
    if (temp <= 26 || humidity <= 40) return temp;
    const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
    return Math.round(temp + adjustmentFactor);
  }

  private static estimateUVIndex(weather: WeatherData): number {
    const hour = new Date().getHours();
    const condition = weather.weather?.[0]?.main || 'Clear';
    
    if (hour < 7 || hour > 19) return 0;
    if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
    if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
    
    return 6;
  }
}

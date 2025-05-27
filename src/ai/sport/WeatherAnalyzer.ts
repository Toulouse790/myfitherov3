
import { WeatherData } from '@/services/WeatherService';
import { WeatherAnalysis } from './types';

export class WeatherAnalyzer {
  static analyze(weather: WeatherData): WeatherAnalysis {
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';
    const humidity = weather.main?.humidity || 50;
    const windSpeed = weather.wind?.speed || 0;

    let isIndoorRecommended = false;
    let comfortLevel: 'excellent' | 'good' | 'moderate' = 'good';

    // Analyze conditions for indoor recommendation
    if (temp > 35 || temp < 0) {
      isIndoorRecommended = true;
      comfortLevel = 'moderate';
    } else if (temp > 30 || temp < 5 || windSpeed > 20) {
      comfortLevel = 'moderate';
    } else if (temp >= 15 && temp <= 25 && humidity < 80) {
      comfortLevel = 'excellent';
    }

    if (weatherCondition === 'Thunderstorm') {
      isIndoorRecommended = true;
      comfortLevel = 'moderate';
    } else if (weatherCondition === 'Rain') {
      isIndoorRecommended = true;
      comfortLevel = 'moderate';
    }

    if (humidity > 85) {
      comfortLevel = comfortLevel === 'excellent' ? 'good' : comfortLevel;
    }

    return {
      temperature: temp,
      condition: weatherCondition,
      humidity,
      windSpeed,
      isIndoorRecommended,
      comfortLevel
    };
  }

  static calculateHeatIndex(temp: number, humidity: number): number {
    if (temp <= 26 || humidity <= 40) return temp;
    const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
    return Math.round(temp + adjustmentFactor);
  }

  static estimateUVIndex(weather: WeatherData): number {
    const hour = new Date().getHours();
    const condition = weather.weather?.[0]?.main || 'Clear';
    
    if (hour < 7 || hour > 19) return 0;
    if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
    if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
    
    return 6;
  }
}

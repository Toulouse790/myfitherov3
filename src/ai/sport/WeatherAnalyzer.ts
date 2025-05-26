
import { WeatherData } from '@/services/WeatherService';
import { WeatherAnalysis } from './types';

export class WeatherAnalyzer {
  static analyze(weather: WeatherData): WeatherAnalysis {
    const temp = weather.main?.temp || 20;
    const weatherCondition = weather.weather?.[0]?.main || 'Clear';
    const humidity = weather.main?.humidity || 50;
    const windSpeed = weather.wind?.speed || 0;

    let isIndoorRecommended = false;
    let safetyLevel: 'safe' | 'caution' | 'warning' = 'safe';

    // Analyze conditions for indoor recommendation
    if (temp > 35 || temp < 0) {
      isIndoorRecommended = true;
      safetyLevel = 'warning';
    } else if (temp > 30 || temp < 5 || windSpeed > 20) {
      safetyLevel = 'caution';
    }

    if (weatherCondition === 'Thunderstorm') {
      isIndoorRecommended = true;
      safetyLevel = 'warning';
    } else if (weatherCondition === 'Rain') {
      isIndoorRecommended = true;
      safetyLevel = 'caution';
    }

    if (humidity > 85) {
      safetyLevel = safetyLevel === 'safe' ? 'caution' : safetyLevel;
    }

    return {
      temperature: temp,
      condition: weatherCondition,
      humidity,
      windSpeed,
      isIndoorRecommended,
      safetyLevel
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

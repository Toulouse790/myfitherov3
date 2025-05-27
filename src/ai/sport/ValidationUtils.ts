
import { Recommendation } from './types';
import { WeatherData } from '@/services/WeatherService';

export class ValidationUtils {
  
  static estimateUVIndex(weather: WeatherData): number {
    const hour = new Date().getHours();
    const condition = weather.weather?.[0]?.main || 'Clear';
    
    if (hour < 7 || hour > 19) return 0;
    if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
    if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
    
    return 6;
  }

  static calculateHeatIndex(temp: number, humidity: number): number {
    if (temp <= 26 || humidity <= 40) return temp;
    const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
    return Math.round(temp + adjustmentFactor);
  }

  static calculateConfidence(rec: Recommendation): number {
    if (rec.riskLevel === 'warning') return 85;
    if (rec.riskLevel === 'caution') return 75;
    return 70;
  }
}

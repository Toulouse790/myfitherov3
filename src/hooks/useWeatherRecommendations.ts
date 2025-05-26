
import { useQuery } from '@tanstack/react-query';
import { WeatherService } from '@/services/WeatherService';
import { SportAIExpert } from '@/ai/SportAIExpert';
import { useUserStore } from '@/stores/useUserStore';

export const useWeatherRecommendations = (type: 'sport' | 'nutrition' = 'sport') => {
  const { profile } = useUserStore();
  
  return useQuery({
    queryKey: ['weather-recommendations', type],
    queryFn: async () => {
      const weatherService = new WeatherService();
      const sportAI = new SportAIExpert();
      
      console.log(`🌤️ Récupération des recommandations ${type}...`);
      
      const weather = await weatherService.getCurrentWeather();
      
      if (type === 'sport') {
        return {
          weather,
          recommendations: sportAI.generateWeatherRecommendations(weather, profile)
        };
      } else {
        return {
          weather,
          recommendations: sportAI.generateNutritionRecommendations(weather, profile)
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Actualisation toutes les 10 minutes
  });
};

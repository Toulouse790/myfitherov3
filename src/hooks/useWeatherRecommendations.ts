
import { useQuery } from '@tanstack/react-query';
import { WeatherService } from '@/services/WeatherService';
import { SportAIExpert } from '@/ai/SportAIExpert';
import { useUserStore } from '@/stores/useUserStore';

export const useWeatherRecommendations = (type: 'sport' | 'nutrition' = 'sport') => {
  const { profile } = useUserStore();
  
  return useQuery({
    queryKey: ['weather-recommendations', type, profile?.id],
    queryFn: async () => {
      const weatherService = new WeatherService();
      const sportAI = new SportAIExpert();
      
      console.log(`🌤️ Récupération des recommandations ${type}...`);
      
      const weather = await weatherService.getCurrentWeather();
      
      // Profil utilisateur simplifié
      const enrichedProfile = {
        level: profile?.experience_level as 'débutant' | 'intermédiaire' | 'avancé' || 'débutant',
        preferences: profile?.preferences || [],
        goals: profile?.goals || [],
        age: profile?.age || 30,
        medicalConditions: profile?.medical_conditions || [],
        currentMedications: profile?.current_medications || [],
        fitnessLevel: profile?.experience_level || 'débutant'
      };
      
      if (type === 'sport') {
        console.log('🏃‍♂️ Génération recommandations sport...');
        return {
          weather,
          recommendations: sportAI.generateWeatherRecommendations(weather, enrichedProfile)
        };
      } else {
        console.log('🍎 Génération recommandations nutrition...');
        return {
          weather,
          recommendations: sportAI.generateNutritionRecommendations(weather, enrichedProfile)
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Actualisation toutes les 10 minutes
    enabled: !!profile // Ne déclenche que si profil utilisateur disponible
  });
};

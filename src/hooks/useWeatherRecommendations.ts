
import { useQuery } from '@tanstack/react-query';
import { WeatherService } from '@/services/WeatherService';
import { SportAIExpert } from '@/ai/SportAIExpert';
import { useUserStore } from '@/stores/useUserStore';
import { useCrossDomainValidator } from './useCrossDomainValidator';

export const useWeatherRecommendations = (type: 'sport' | 'nutrition' = 'sport') => {
  const { profile } = useUserStore();
  const { userProfile } = useCrossDomainValidator();
  
  return useQuery({
    queryKey: ['weather-recommendations', type, profile?.id],
    queryFn: async () => {
      const weatherService = new WeatherService();
      const sportAI = new SportAIExpert();
      
      console.log(`🌤️ Récupération des recommandations ${type} avec validation croisée...`);
      
      const weather = await weatherService.getCurrentWeather();
      
      // Enrichissement du profil utilisateur pour validation croisée
      const enrichedProfile = {
        level: profile?.experience_level as 'débutant' | 'intermédiaire' | 'avancé' || 'débutant',
        preferences: profile?.preferences || [],
        goals: profile?.goals || [],
        age: profile?.age || userProfile.age,
        medicalConditions: profile?.medical_conditions || userProfile.medicalConditions,
        currentMedications: profile?.current_medications || userProfile.currentMedications,
        fitnessLevel: profile?.experience_level || userProfile.fitnessLevel
      };
      
      if (type === 'sport') {
        console.log('🏃‍♂️ Génération recommandations sport avec CrossDomainValidator...');
        return {
          weather,
          recommendations: sportAI.generateWeatherRecommendations(weather, enrichedProfile)
        };
      } else {
        console.log('🍎 Génération recommandations nutrition avec CrossDomainValidator...');
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


import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { hydrationService } from './services';
import { HydrationEntry, HydrationCreateEntry, HydrationCreateGoal } from './types';
import { hydrationAIExpert, HydrationRecommendation, HydrationAlert } from '@/ai/HydrationAIExpert';
import { WeatherService, WeatherData } from '@/services/WeatherService';
import { toast } from '@/components/ui/sonner';

// Hook pour accéder aux données d'hydratation
export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [recommendation, setRecommendation] = useState<HydrationRecommendation | null>(null);
  const [alert, setAlert] = useState<HydrationAlert | null>(null);

  // Récupération des données d'historique d'hydratation
  const { data: entries = [], isLoading: isLoadingEntries, refetch: refetchEntries } = useQuery({
    queryKey: ['hydration-entries'],
    queryFn: async () => {
      if (!profile?.id) return [];
      return hydrationService.getUserEntries(profile.id);
    },
    enabled: !!profile?.id
  });

  // Récupération des objectifs d'hydratation
  const { data: goal, isLoading: isLoadingGoal } = useQuery({
    queryKey: ['hydration-goal'],
    queryFn: async () => {
      if (!profile?.id) return null;
      return hydrationService.getUserGoal(profile.id);
    },
    enabled: !!profile?.id
  });

  // Récupération des données météorologiques pour les recommandations
  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather-hydration'],
    queryFn: async () => {
      const weatherService = new WeatherService();
      return await weatherService.getCurrentWeather();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Calcul des statistiques d'hydratation
  const stats = {
    dailyIntake: currentIntake,
    dailyTarget: goal?.daily_target_ml || 2500,
    percentageComplete: Math.round((currentIntake / (goal?.daily_target_ml || 2500)) * 100),
    entriesCount: entries.length || 0,
  };

  // Générer des recommandations intelligentes basées sur le profil et l'environnement
  useEffect(() => {
    if (!weatherData || !profile) return;

    try {
      // Convertir les données du profil utilisateur
      const biometricProfile = {
        age: profile.age || 30,
        weight: profile.weight_kg || 70,
        height: profile.height_cm || 170,
        sex: profile.gender === 'female' ? 'F' as const : 'M' as const,
        fitnessLevel: mapFitnessLevel(profile.experience_level),
        medicalConditions: getMedicalConditions(profile)
      };

      // Convertir les données météo
      const environmentalData = mapWeatherToEnvironment(weatherData);

      // Estimer l'activité de l'utilisateur (à personnaliser)
      const activityData = {
        type: 'moderate_exercise' as const,
        duration: 60, // minutes par défaut
        intensity: 5, // niveau moyen
        location: 'outdoor' as const
      };

      // Générer la recommandation
      const hydrationRecommendation = hydrationAIExpert.calculateSafeHydrationNeeds(
        biometricProfile,
        environmentalData,
        activityData
      );

      setRecommendation(hydrationRecommendation);

      // Vérifier si une alerte est nécessaire
      const alertStatus = hydrationAIExpert.generateHydrationAlert(
        currentIntake,
        hydrationRecommendation.totalDailyNeed,
        environmentalData,
        biometricProfile
      );

      if (alertStatus) {
        setAlert(alertStatus);
        
        // Afficher une notification si l'alerte est critique ou urgente
        if (alertStatus.level === 'critical' || alertStatus.level === 'emergency') {
          toast.warning(alertStatus.title, {
            description: alertStatus.message,
            duration: 8000
          });
        }
      } else {
        setAlert(null);
      }

    } catch (error) {
      console.error('Erreur calcul recommandations hydratation:', error);
    }
  }, [weatherData, profile, currentIntake]);

  // Calcul de l'hydratation totale aujourd'hui
  useEffect(() => {
    if (entries.length) {
      // Filtrer les entrées d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = entries.filter(entry => 
        entry.recorded_at.split('T')[0] === today
      );
      
      // Calculer le total
      const total = todayEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
      setCurrentIntake(total);
    } else {
      setCurrentIntake(0);
    }
  }, [entries]);

  // Ajouter une entrée d'hydratation
  const addHydration = async (amount: number, drinkType: HydrationEntry['drink_type'] = 'water') => {
    if (!profile?.id) return false;
    
    try {
      const entry: HydrationCreateEntry = {
        user_id: profile.id,
        amount_ml: amount,
        drink_type: drinkType,
        recorded_at: new Date().toISOString()
      };
      
      await hydrationService.addEntry(entry);
      
      refetchEntries();
      
      // Mise à jour instantanée
      setCurrentIntake(prev => prev + amount);
      
      return true;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      return false;
    }
  };

  // Mettre à jour l'objectif d'hydratation
  const updateGoal = async (target: number) => {
    if (!profile?.id) return false;
    
    try {
      const goal: HydrationCreateGoal = {
        user_id: profile.id,
        daily_target_ml: target,
        is_active: true
      };
      
      await hydrationService.setUserGoal(goal);
      
      return true;
    } catch (error) {
      console.error('Erreur mise à jour objectif hydratation:', error);
      return false;
    }
  };

  return {
    entries,
    goal,
    stats,
    isLoading: isLoadingEntries || isLoadingGoal || isLoadingWeather,
    addHydration,
    updateGoal,
    recommendation,
    alert,
    weatherData
  };
};

// Fonctions utilitaires pour mapper les données

function mapFitnessLevel(level?: string): 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete' {
  switch (level) {
    case 'beginner': return 'light';
    case 'intermediate': return 'moderate';
    case 'advanced': return 'intense';
    case 'expert': return 'athlete';
    default: return 'moderate';
  }
}

function getMedicalConditions(profile: any) {
  const conditions = [];
  
  // Ces données doivent être présentes dans le profil utilisateur
  // Par précaution, on reste conservateur
  
  if (profile.medical?.kidney_disease) {
    conditions.push({
      condition: 'kidney_disease',
      severity: profile.medical.kidney_disease_severity || 'moderate',
      medications: profile.medical.medications || []
    });
  }
  
  if (profile.medical?.heart_condition) {
    conditions.push({
      condition: 'heart_failure',
      severity: profile.medical.heart_condition_severity || 'moderate',
      medications: profile.medical.medications || []
    });
  }
  
  if (profile.medical?.diabetes) {
    conditions.push({
      condition: 'diabetes',
      severity: profile.medical.diabetes_severity || 'moderate',
      medications: profile.medical.medications || []
    });
  }
  
  if (profile.age >= 75) {
    conditions.push({
      condition: 'elderly_75plus',
      severity: 'moderate',
      medications: []
    });
  }
  
  return conditions;
}

function mapWeatherToEnvironment(weather: WeatherData) {
  // Calcul du Heat Index (formule simplifiée)
  let heatIndex = weather.main.temp;
  if (weather.main.temp > 25 && weather.main.humidity > 60) {
    // Formule ultra-simplifiée de Heat Index
    heatIndex = weather.main.temp + (weather.main.humidity - 60) * 0.1;
  }
  
  return {
    temperature: weather.main.temp,
    humidity: weather.main.humidity,
    uvIndex: weather.weather[0]?.main === 'Clear' ? 8 : 3, // Estimation conservatrice
    windSpeed: weather.wind.speed,
    heatIndex: heatIndex
  };
}

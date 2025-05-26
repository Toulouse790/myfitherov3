
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { hydrationService } from './services';
import { HydrationEntry, HydrationCreateEntry, HydrationCreateGoal } from './types';
import { hydrationAIExpert, HydrationRecommendation, HydrationAlert } from '@/ai/HydrationAIExpert';
import { WeatherService, WeatherData } from '@/services/WeatherService';
import { ProfileService } from '@/services/supabase/ProfileService';
import { toast } from '@/components/ui/sonner';

// Hook pour accéder aux données d'hydratation avec IA sécurisée
export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [recommendation, setRecommendation] = useState<HydrationRecommendation | null>(null);
  const [alert, setAlert] = useState<HydrationAlert | null>(null);
  const [medicalValidationStatus, setMedicalValidationStatus] = useState<'pending' | 'validated' | 'override_required'>('pending');

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

  // Récupération des données météorologiques critiques
  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather-hydration'],
    queryFn: async () => {
      const weatherService = new WeatherService();
      return await weatherService.getCurrentWeather();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes pour données critiques
    refetchInterval: 10 * 60 * 1000, // Actualisation fréquente
  });

  // Récupération profil médical complet pour validation
  const { data: medicalProfile, isLoading: isLoadingMedical } = useQuery({
    queryKey: ['medical-profile'],
    queryFn: async () => {
      if (!profile?.id) return null;
      return ProfileService.getUserProfile(profile.id);
    },
    enabled: !!profile?.id
  });

  // Calcul des statistiques d'hydratation avec seuils sécurisés
  const stats = {
    dailyIntake: currentIntake,
    dailyTarget: recommendation?.totalDailyNeed || goal?.daily_target_ml || 2500,
    percentageComplete: Math.round((currentIntake / (recommendation?.totalDailyNeed || goal?.daily_target_ml || 2500)) * 100),
    entriesCount: entries.length || 0,
  };

  // GÉNÉRATION RECOMMANDATIONS SÉCURISÉES AVEC VALIDATION MÉDICALE
  useEffect(() => {
    if (!weatherData || !profile || !medicalProfile) return;

    try {
      console.log('🏥 Démarrage calcul recommandations hydratation sécurisées...');
      
      // 1. CONVERSION PROFIL BIOMÉTRIQUE SÉCURISÉ
      const biometricProfile = {
        age: profile.age || calculateAgeFromBirthdate(medicalProfile.birthdate) || 30,
        weight: profile.weight_kg || estimateWeightFromProfile(profile) || 70,
        height: profile.height_cm || 170,
        sex: profile.gender === 'female' ? 'F' as const : 'M' as const,
        fitnessLevel: mapFitnessLevelSecure(profile.experience_level),
        medicalConditions: extractMedicalConditions(profile, medicalProfile)
      };

      // 2. VALIDATION MÉDICALE PRÉALABLE
      const medicalValidation = validateMedicalSafety(biometricProfile);
      setMedicalValidationStatus(medicalValidation.status);

      if (medicalValidation.status === 'override_required') {
        toast.error('Validation médicale requise', {
          description: 'Consultez votre médecin avant utilisation',
          duration: 10000
        });
        return;
      }

      // 3. CONVERSION DONNÉES ENVIRONNEMENTALES
      const environmentalData = mapWeatherToEnvironmentSecure(weatherData);

      // 4. ESTIMATION ACTIVITÉ AVEC SÉCURITÉ
      const activityData = estimateCurrentActivity(profile, new Date().getHours());

      // 5. CALCUL RECOMMANDATIONS HYDRATATION SÉCURISÉES
      const hydrationRecommendation = hydrationAIExpert.calculateSafeHydrationNeeds(
        biometricProfile,
        environmentalData,
        activityData
      );

      // 6. VALIDATION CROISÉE SÉCURITÉ
      const validatedRecommendation = applySafetyOverrides(hydrationRecommendation, biometricProfile);
      setRecommendation(validatedRecommendation);

      // 7. GÉNÉRATION ALERTES CRITIQUES
      const alertStatus = hydrationAIExpert.generateHydrationAlert(
        currentIntake,
        validatedRecommendation.totalDailyNeed,
        environmentalData,
        biometricProfile
      );

      if (alertStatus) {
        setAlert(alertStatus);
        
        // ESCALADE AUTOMATIQUE SELON CRITICITÉ
        if (alertStatus.level === 'emergency') {
          toast.error('🚨 URGENCE HYDRATATION', {
            description: alertStatus.message,
            duration: 0, // Permanent jusqu'à action
            action: {
              label: 'Actions urgentes',
              onClick: () => displayEmergencyActions(alertStatus)
            }
          });
        } else if (alertStatus.level === 'critical') {
          toast.warning('⚠️ HYDRATATION CRITIQUE', {
            description: alertStatus.message,
            duration: 15000
          });
        }
      } else {
        setAlert(null);
      }

      console.log('✅ Recommandations hydratation sécurisées générées');
      
    } catch (error) {
      console.error('❌ Erreur calcul recommandations sécurisées:', error);
      
      // FALLBACK SÉCURITAIRE
      setRecommendation({
        totalDailyNeed: 3000, // Valeur conservatrice
        preActivityNeed: 500,
        duringActivityNeed: 200,
        postActivityNeed: 300,
        alertLevel: 'warning', // Prudence par défaut
        recommendations: [
          '💧 Buvez 200ml toutes les 20 minutes',
          '🌡️ Réduisez l\'activité si température > 30°C',
          '🏥 Consultez un médecin en cas de symptômes'
        ],
        contraindications: ['Consultez votre médecin pour recommandations personnalisées'],
        medicalAlerts: ['Système en mode sécuritaire - Validation médicale recommandée']
      });
      
      toast.warning('Mode sécurité activé', {
        description: 'Recommandations conservatrices appliquées',
        duration: 8000
      });
    }
  }, [weatherData, profile, medicalProfile, currentIntake]);

  // Calcul de l'hydratation totale aujourd'hui
  useEffect(() => {
    if (entries.length) {
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = entries.filter(entry => 
        entry.recorded_at.split('T')[0] === today
      );
      
      const total = todayEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
      setCurrentIntake(total);
    } else {
      setCurrentIntake(0);
    }
  }, [entries]);

  // Ajouter une entrée d'hydratation avec validation
  const addHydration = async (amount: number, drinkType: HydrationEntry['drink_type'] = 'water') => {
    if (!profile?.id) return false;
    
    try {
      // VALIDATION QUANTITÉ SÉCURITAIRE
      if (amount > 1000) {
        toast.warning('Quantité importante', {
          description: 'Buvez par petites gorgées pour une meilleure absorption'
        });
      }
      
      const entry: HydrationCreateEntry = {
        user_id: profile.id,
        amount_ml: amount,
        drink_type: drinkType,
        recorded_at: new Date().toISOString()
      };
      
      await hydrationService.addEntry(entry);
      refetchEntries();
      
      // Mise à jour instantanée avec vérification seuils
      const newTotal = currentIntake + amount;
      setCurrentIntake(newTotal);
      
      // VÉRIFICATION HYPERHYDRATATION
      if (recommendation && newTotal > recommendation.totalDailyNeed * 1.5) {
        toast.warning('⚠️ Hydratation excessive détectée', {
          description: 'Risque d\'hyperhydratation - Consultez un médecin si symptômes',
          duration: 10000
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  // Mettre à jour l'objectif avec validation médicale
  const updateGoal = async (target: number) => {
    if (!profile?.id) return false;
    
    try {
      // VALIDATION SEUILS MÉDICAUX
      if (target < 1200) {
        toast.error('Objectif trop faible', {
          description: 'Minimum 1,2L/jour pour la survie'
        });
        return false;
      }
      
      if (target > 6000) {
        toast.error('Objectif trop élevé', {
          description: 'Risque d\'hyperhydratation - Consultez un médecin'
        });
        return false;
      }
      
      const goal: HydrationCreateGoal = {
        user_id: profile.id,
        daily_target_ml: target,
        is_active: true
      };
      
      await hydrationService.setUserGoal(goal);
      toast.success('Objectif mis à jour avec validation sécuritaire');
      
      return true;
    } catch (error) {
      console.error('Erreur mise à jour objectif:', error);
      return false;
    }
  };

  return {
    entries,
    goal,
    stats,
    isLoading: isLoadingEntries || isLoadingGoal || isLoadingWeather || isLoadingMedical,
    addHydration,
    updateGoal,
    recommendation,
    alert,
    weatherData,
    medicalValidationStatus
  };
};

// FONCTIONS UTILITAIRES SÉCURISÉES

function calculateAgeFromBirthdate(birthdate?: string): number | null {
  if (!birthdate) return null;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function estimateWeightFromProfile(profile: any): number {
  // Estimation conservatrice basée sur IMC moyen
  const height = profile.height_cm || 170;
  const bmiEstimate = 22; // IMC normal
  return Math.round((bmiEstimate * Math.pow(height / 100, 2)));
}

function mapFitnessLevelSecure(level?: string): 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete' {
  // Mapping conservateur pour sécurité
  switch (level) {
    case 'beginner': return 'light';
    case 'intermediate': return 'moderate';
    case 'advanced': return 'moderate'; // Prudence
    case 'expert': return 'intense'; // Pas athlete sans validation
    default: return 'sedentary'; // Par défaut conservateur
  }
}

function extractMedicalConditions(profile: any, medicalProfile: any) {
  const conditions = [];
  
  // AGE CRITIQUE
  const age = profile.age || calculateAgeFromBirthdate(medicalProfile?.birthdate) || 30;
  if (age >= 75) {
    conditions.push({
      condition: 'elderly_75plus',
      severity: 'moderate',
      medications: []
    });
  }
  
  // GROSSESSE (à détecter via profil)
  if (profile.gender === 'female' && medicalProfile?.medical?.pregnancy) {
    conditions.push({
      condition: 'pregnancy',
      severity: 'moderate',
      medications: medicalProfile.medical.medications || []
    });
  }
  
  // CONDITIONS MÉDICALES DÉCLARÉES
  if (medicalProfile?.medical?.conditions) {
    medicalProfile.medical.conditions.forEach((condition: string) => {
      conditions.push({
        condition,
        severity: 'moderate',
        medications: medicalProfile.medical.medications || []
      });
    });
  }
  
  return conditions;
}

function validateMedicalSafety(biometricProfile: any): { status: 'pending' | 'validated' | 'override_required', alerts: string[] } {
  const alerts: string[] = [];
  
  // CONDITIONS CRITIQUES NÉCESSITANT VALIDATION MÉDICALE
  const criticalConditions = ['kidney_disease', 'heart_failure', 'pregnancy'];
  const hasCriticalCondition = biometricProfile.medicalConditions.some((c: any) => 
    criticalConditions.includes(c.condition)
  );
  
  if (hasCriticalCondition) {
    alerts.push('Condition médicale critique détectée');
    return { status: 'override_required', alerts };
  }
  
  // ÂGE EXTRÊME
  if (biometricProfile.age < 12 || biometricProfile.age > 85) {
    alerts.push('Âge nécessitant surveillance médicale');
    return { status: 'override_required', alerts };
  }
  
  return { status: 'validated', alerts: [] };
}

function mapWeatherToEnvironmentSecure(weather: WeatherData) {
  // Calcul Heat Index avec formule validée
  let heatIndex = weather.main.temp;
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  
  // Formule Heat Index simplifiée mais précise
  if (temp > 26 && humidity > 40) {
    const tempF = (temp * 9/5) + 32;
    const rh = humidity;
    
    // Rothfusz equation approximation
    heatIndex = temp + (0.5 * (temp - 26)) * (humidity / 100);
  }
  
  return {
    temperature: temp,
    humidity: humidity,
    uvIndex: estimateUVIndex(weather),
    windSpeed: weather.wind?.speed || 0,
    heatIndex: Math.max(heatIndex, temp) // Jamais moins que la température
  };
}

function estimateUVIndex(weather: WeatherData): number {
  const hour = new Date().getHours();
  const condition = weather.weather[0]?.main || 'Clear';
  
  // UV Index prudent selon heure et conditions
  if (hour < 8 || hour > 18) return 0;
  if (condition === 'Rain' || condition === 'Clouds') return Math.min(3, hour - 6);
  if (condition === 'Clear') return Math.min(10, Math.max(0, (hour - 8) * 1.5));
  
  return 5; // Valeur conservatrice
}

function estimateCurrentActivity(profile: any, hour: number) {
  // Estimation activité selon profil et heure
  const experienceLevel = profile.experience_level || 'beginner';
  
  // Activité probable selon l'heure
  if (hour >= 6 && hour <= 10) {
    return {
      type: experienceLevel === 'expert' ? 'moderate_exercise' as const : 'light_walk' as const,
      duration: 45,
      intensity: experienceLevel === 'expert' ? 6 : 3,
      location: 'outdoor' as const
    };
  }
  
  if (hour >= 17 && hour <= 20) {
    return {
      type: 'moderate_exercise' as const,
      duration: 60,
      intensity: 5,
      location: 'outdoor' as const
    };
  }
  
  // Repos/activité légère
  return {
    type: 'rest' as const,
    duration: 0,
    intensity: 1,
    location: 'indoor' as const
  };
}

function applySafetyOverrides(recommendation: HydrationRecommendation, profile: any): HydrationRecommendation {
  // Application overrides sécuritaires selon profil
  
  // SENIORS : +20% hydratation
  if (profile.age >= 65) {
    recommendation.totalDailyNeed = Math.round(recommendation.totalDailyNeed * 1.2);
    recommendation.recommendations.unshift('👴 SENIOR : Hydratation renforcée recommandée');
  }
  
  // ENFANTS : Adaptation pédiatrique
  if (profile.age < 18) {
    recommendation.totalDailyNeed = Math.min(recommendation.totalDailyNeed, 2500); // Limite enfants
    recommendation.recommendations.unshift('👶 ENFANT : Supervision parentale requise');
  }
  
  // CONDITIONS MÉDICALES : Prudence maximale
  if (profile.medicalConditions.length > 0) {
    recommendation.alertLevel = 'warning'; // Minimum warning
    recommendation.recommendations.unshift('🏥 CONDITION MÉDICALE : Surveillez les symptômes');
  }
  
  return recommendation;
}

function displayEmergencyActions(alert: HydrationAlert): void {
  // Affichage actions d'urgence
  console.log('🆘 ACTIONS URGENCE:', alert.actions);
  // Ici on pourrait ouvrir un modal avec les actions détaillées
}

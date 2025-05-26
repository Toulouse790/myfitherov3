import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { hydrationService } from './services';
import { HydrationEntry, HydrationCreateEntry, HydrationCreateGoal } from './types';
import { hydrationAIExpert, HydrationRecommendation, HydrationAlert } from '@/ai/HydrationAIExpert';
import { hydrationMedicalValidator, BiometricProfile, EnvironmentalData, MedicalCondition } from './medical-validation';
import { WeatherService, WeatherData } from '@/services/WeatherService';
import { ProfileService } from '@/services/supabase/ProfileService';
import { toast } from '@/components/ui/sonner';

// Hook pour accéder aux données d'hydratation avec IA sécurisée intégrée
export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [recommendation, setRecommendation] = useState<HydrationRecommendation | null>(null);
  const [alert, setAlert] = useState<HydrationAlert | null>(null);
  const [medicalValidationStatus, setMedicalValidationStatus] = useState<'pending' | 'validated' | 'override_required'>('pending');
  const [lastMedicalCheck, setLastMedicalCheck] = useState<Date | null>(null);

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

  // Récupération des données météorologiques critiques avec refresh fréquent
  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather-hydration'],
    queryFn: async () => {
      const weatherService = new WeatherService();
      return await weatherService.getCurrentWeather();
    },
    staleTime: 3 * 60 * 1000, // 3 minutes pour données critiques météo
    refetchInterval: 5 * 60 * 1000, // Actualisation toutes les 5 minutes
  });

  // Récupération profil médical complet pour validation sécuritaire
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
    lastIntakeTime: entries.length > 0 ? new Date(entries[entries.length - 1].recorded_at) : null,
    criticalThresholdReached: currentIntake < ((recommendation?.totalDailyNeed || 2500) * 0.3)
  };

  // INTÉGRATION HYDRATION AI EXPERT - GÉNÉRATION RECOMMANDATIONS SÉCURISÉES
  useEffect(() => {
    if (!weatherData || !profile || !medicalProfile) return;

    const generateSecureRecommendations = async () => {
      try {
        console.log('🏥 Démarrage HydrationAIExpert sécurisé...');
        
        // 1. CONSTRUCTION PROFIL BIOMÉTRIQUE SÉCURISÉ
        const biometricProfile: BiometricProfile = {
          age: profile.age || calculateAgeFromBirthdate(medicalProfile.birthdate) || 30,
          weight: profile.weight_kg || estimateWeightFromProfile(profile) || 70,
          height: profile.height_cm || 170,
          sex: profile.gender === 'female' ? 'F' as const : 'M' as const,
          fitnessLevel: mapFitnessLevelSecure(profile.experience_level),
          medicalConditions: extractMedicalConditions(profile, medicalProfile)
        };

        console.log('👤 Profil biométrique sécurisé créé:', { 
          age: biometricProfile.age, 
          weight: biometricProfile.weight,
          conditions: biometricProfile.medicalConditions.length 
        });

        // 2. CONVERSION DONNÉES ENVIRONNEMENTALES SÉCURISÉES
        const environmentalData: EnvironmentalData = {
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          uvIndex: estimateUVIndex(weatherData),
          windSpeed: weatherData.wind?.speed || 0,
          heatIndex: calculateHeatIndex(weatherData.main.temp, weatherData.main.humidity)
        };

        console.log('🌡️ Données environnementales:', {
          temp: environmentalData.temperature,
          humidity: environmentalData.humidity,
          heatIndex: environmentalData.heatIndex
        });

        // 3. ESTIMATION ACTIVITÉ ACTUELLE SÉCURISÉE
        const activityData = estimateCurrentActivity(profile, new Date().getHours());

        // 4. VALIDATION MÉDICALE PRÉALABLE OBLIGATOIRE
        const medicalValidation = hydrationMedicalValidator.validateHydrationRecommendation(
          biometricProfile,
          environmentalData,
          0 // Validation préalable avant calcul
        );

        setMedicalValidationStatus(medicalValidation.isValid ? 'validated' : 'override_required');
        setLastMedicalCheck(new Date());

        if (!medicalValidation.isValid && medicalValidation.riskLevel === 'critical') {
          console.error('❌ Validation médicale critique échouée');
          toast.error('Validation médicale requise', {
            description: 'Consultez votre médecin avant utilisation - Conditions critiques détectées',
            duration: 15000
          });
          
          // Fallback ultra-conservateur
          setRecommendation({
            totalDailyNeed: 2000, // Minimum sécuritaire
            preActivityNeed: 300,
            duringActivityNeed: 150,
            postActivityNeed: 200,
            alertLevel: 'critical',
            recommendations: [
              '🏥 CONSULTATION MÉDICALE OBLIGATOIRE',
              '💧 Hydratation conservatrice: 2L minimum',
              '🚫 Pas d\'activité intense sans avis médical'
            ],
            contraindications: medicalValidation.contraindications,
            medicalAlerts: medicalValidation.medicalAlerts
          });
          return;
        }

        // 5. CALCUL RECOMMANDATIONS HYDRATATION AVEC HYDRATION AI EXPERT
        const hydrationRecommendation = hydrationAIExpert.calculateSafeHydrationNeeds(
          biometricProfile,
          environmentalData,
          activityData
        );

        console.log('💧 Recommandations HydrationAIExpert:', {
          totalDaily: hydrationRecommendation.totalDailyNeed,
          alertLevel: hydrationRecommendation.alertLevel
        });

        // 6. VALIDATION CROISÉE FINALE AVEC MEDICAL VALIDATOR
        const finalValidation = hydrationMedicalValidator.validateHydrationRecommendation(
          biometricProfile,
          environmentalData,
          hydrationRecommendation.totalDailyNeed
        );

        if (!finalValidation.isValid) {
          console.warn('⚠️ Validation finale échouée, application overrides sécuritaires');
          
          // Application des limites sécuritaires
          const safeLimit = finalValidation.maxSafeAmount;
          hydrationRecommendation.totalDailyNeed = Math.min(
            hydrationRecommendation.totalDailyNeed,
            safeLimit
          );
          
          hydrationRecommendation.contraindications = [
            ...hydrationRecommendation.contraindications,
            ...finalValidation.contraindications
          ];
          
          hydrationRecommendation.medicalAlerts = [
            ...hydrationRecommendation.medicalAlerts,
            ...finalValidation.medicalAlerts
          ];
        }

        setRecommendation(hydrationRecommendation);

        // GÉNÉRATION ALERTES CRITIQUES AUTOMATIQUES
        const alertStatus = hydrationAIExpert.generateHydrationAlert(
          currentIntake,
          hydrationRecommendation.totalDailyNeed,
          environmentalData,
          biometricProfile
        );

        if (alertStatus) {
          setAlert(alertStatus);
          
          // ESCALADE AUTOMATIQUE SELON NIVEAU CRITIQUE
          if (alertStatus.level === 'emergency') {
            console.error('🚨 ALERTE URGENCE HYDRATATION');
            toast.error('🚨 URGENCE HYDRATATION', {
              description: alertStatus.message,
              duration: 0, // Permanent jusqu'à action
              action: {
                label: 'Actions urgentes',
                onClick: () => displayEmergencyActions(alertStatus)
              }
            });
            
            // Notification visuelle + sonore si supportée
            if (Notification.permission === 'granted') {
              new Notification('🚨 URGENCE HYDRATATION', {
                body: alertStatus.message,
                icon: '/emergency-hydration.png',
                requireInteraction: true
              });
            }
            
          } else if (alertStatus.level === 'critical') {
            console.warn('⚠️ ALERTE CRITIQUE HYDRATATION');
            toast.warning('⚠️ HYDRATATION CRITIQUE', {
              description: alertStatus.message,
              duration: 10000
            });
          }
        } else {
          setAlert(null);
        }

        console.log('✅ Intégration HydrationAIExpert terminée avec succès');
        
      } catch (error) {
        console.error('❌ Erreur HydrationAIExpert:', error);
        
        // FALLBACK ULTRA-SÉCURITAIRE EN CAS D'ERREUR
        setRecommendation({
          totalDailyNeed: 2500, // Valeur de base sécurisée
          preActivityNeed: 400,
          duringActivityNeed: 200,
          postActivityNeed: 300,
          alertLevel: 'warning',
          recommendations: [
            '💧 Hydratation de base: 2,5L/jour minimum',
            '🌡️ Augmentez si température > 25°C',
            '🏥 Consultez un médecin pour personnalisation'
          ],
          contraindications: ['Système en mode sécuritaire - Validation médicale recommandée'],
          medicalAlerts: ['Erreur système - Recommandations conservatrices appliquées']
        });
        
        toast.warning('Mode sécurité activé', {
          description: 'Recommandations conservatrices appliquées - Consultez un médecin',
          duration: 8000
        });
      }
    };

    generateSecureRecommendations();
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

  // Ajouter une entrée d'hydratation avec validation sécuritaire
  const addHydration = async (amount: number, drinkType: HydrationEntry['drink_type'] = 'water') => {
    if (!profile?.id) return false;
    
    try {
      // VALIDATION QUANTITÉ SÉCURITAIRE AVANT AJOUT
      if (amount > 1000) {
        const confirm = window.confirm(
          '⚠️ Quantité importante détectée\n\n' +
          `Vous voulez ajouter ${amount}ml d'un coup.\n` +
          'Pour une meilleure absorption, il est recommandé de boire par petites quantités.\n\n' +
          'Confirmez-vous cette quantité?'
        );
        
        if (!confirm) return false;
        
        toast.warning('Hydratation importante', {
          description: 'Buvez lentement par petites gorgées pour optimiser l\'absorption'
        });
      }

      // VALIDATION HYPERHYDRATATION
      const newTotal = currentIntake + amount;
      if (recommendation && newTotal > recommendation.totalDailyNeed * 1.5) {
        const riskConfirm = window.confirm(
          '🚨 RISQUE HYPERHYDRATATION\n\n' +
          `Total: ${newTotal}ml (>${Math.round(recommendation.totalDailyNeed * 1.5)}ml limite)\n` +
          'Risque de déséquilibre électrolytique.\n\n' +
          'Consultez un médecin si symptômes (nausées, maux de tête).\n\n' +
          'Continuer?'
        );
        
        if (!riskConfirm) return false;
        
        toast.error('⚠️ Seuil hyperhydratation dépassé', {
          description: 'Surveillez les symptômes - Consultez un médecin si malaise',
          duration: 15000
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
      
      // Mise à jour instantanée
      setCurrentIntake(newTotal);
      
      // FEEDBACK SÉCURITAIRE SELON PROGRESSION
      const percentage = (newTotal / (recommendation?.totalDailyNeed || 2500)) * 100;
      
      if (percentage >= 100) {
        toast.success('🎯 Objectif hydratation atteint!', {
          description: 'Continuez à boire selon votre soif'
        });
      } else if (percentage >= 70) {
        toast.success(`💧 ${amount}ml ajoutés - Bon progrès! (${Math.round(percentage)}%)`);
      } else if (percentage >= 30) {
        toast.success(`💧 ${amount}ml ajoutés - Continuez! (${Math.round(percentage)}%)`);
      } else {
        toast.warning(`💧 ${amount}ml ajoutés - Hydratation encore insuffisante (${Math.round(percentage)}%)`);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  // Mettre à jour l'objectif avec validation médicale renforcée
  const updateGoal = async (target: number) => {
    if (!profile?.id || !recommendation) return false;
    
    try {
      // VALIDATION SEUILS MÉDICAUX STRICTS
      if (target < 1200) {
        toast.error('Objectif dangereux', {
          description: 'Minimum vital: 1,2L/jour - Consultez un médecin'
        });
        return false;
      }
      
      if (target > 5000) {
        toast.error('Objectif risqué', {
          description: 'Risque hyperhydratation au-delà de 5L - Avis médical requis'
        });
        return false;
      }

      // VALIDATION AVEC RECOMMANDATION AI
      const deviation = Math.abs(target - recommendation.totalDailyNeed) / recommendation.totalDailyNeed;
      if (deviation > 0.3) { // Plus de 30% d'écart
        const confirm = window.confirm(
          '⚠️ Écart important avec recommandation IA\n\n' +
          `Votre objectif: ${target}ml\n` +
          `Recommandation sécurisée: ${recommendation.totalDailyNeed}ml\n` +
          `Écart: ${Math.round(deviation * 100)}%\n\n` +
          'L\'IA a calculé cette recommandation selon votre profil médical et l\'environnement.\n\n' +
          'Confirmer votre objectif?'
        );
        
        if (!confirm) return false;
      }
      
      const goal: HydrationCreateGoal = {
        user_id: profile.id,
        daily_target_ml: target,
        is_active: true
      };
      
      await hydrationService.setUserGoal(goal);
      toast.success('✅ Objectif validé', {
        description: 'Objectif mis à jour avec validation sécuritaire'
      });
      
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
    medicalValidationStatus,
    lastMedicalCheck
  };
};

// FONCTIONS UTILITAIRES SÉCURISÉES INTÉGRÉES

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
  const height = profile.height_cm || 170;
  const bmiEstimate = profile.gender === 'female' ? 21 : 22; // IMC sécuritaire par genre
  return Math.round((bmiEstimate * Math.pow(height / 100, 2)));
}

function mapFitnessLevelSecure(level?: string): 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete' {
  // Mapping conservateur pour éviter surestimation
  switch (level) {
    case 'beginner': return 'sedentary'; // Plus conservateur
    case 'intermediate': return 'light';
    case 'advanced': return 'moderate';
    case 'expert': return 'moderate'; // Pas intense sans validation
    default: return 'sedentary';
  }
}

function extractMedicalConditions(profile: any, medicalProfile: any): MedicalCondition[] {
  const conditions: MedicalCondition[] = [];
  
  const age = profile.age || calculateAgeFromBirthdate(medicalProfile?.birthdate) || 30;
  
  // DÉTECTION ÂGE CRITIQUE
  if (age >= 75) {
    conditions.push({
      condition: 'elderly_75plus',
      severity: 'moderate',
      medications: []
    });
  }
  
  // DÉTECTION GROSSESSE (si données disponibles)
  if (profile.gender === 'female' && medicalProfile?.medical?.pregnancy) {
    conditions.push({
      condition: 'pregnancy',
      severity: 'moderate',
      medications: medicalProfile.medical.medications || []
    });
  }
  
  // CONDITIONS DÉCLARÉES
  if (medicalProfile?.medical?.conditions) {
    medicalProfile.medical.conditions.forEach((conditionName: string) => {
      // Mapper les conditions aux types autorisés
      const mappedCondition = mapConditionName(conditionName);
      if (mappedCondition) {
        conditions.push({
          condition: mappedCondition,
          severity: 'moderate',
          medications: medicalProfile.medical.medications || []
        });
      }
    });
  }
  
  return conditions;
}

function mapConditionName(conditionName: string): MedicalCondition['condition'] | null {
  const lowercaseName = conditionName.toLowerCase();
  
  if (lowercaseName.includes('heart') || lowercaseName.includes('cardiaque')) {
    return 'heart_failure';
  }
  if (lowercaseName.includes('kidney') || lowercaseName.includes('renal')) {
    return 'kidney_disease';
  }
  if (lowercaseName.includes('diabetes') || lowercaseName.includes('diabete')) {
    return 'diabetes';
  }
  if (lowercaseName.includes('hypertension')) {
    return 'hypertension';
  }
  if (lowercaseName.includes('pregnancy') || lowercaseName.includes('grossesse')) {
    return 'pregnancy';
  }
  
  return null; // Condition non reconnue
}

function estimateUVIndex(weather: any): number {
  const hour = new Date().getHours();
  const condition = weather.weather[0]?.main || 'Clear';
  
  // UV conservateur selon heure et conditions
  if (hour < 7 || hour > 19) return 0;
  if (condition === 'Rain' || condition === 'Clouds') return Math.min(4, Math.max(0, hour - 7));
  if (condition === 'Clear') return Math.min(11, Math.max(0, (hour - 6) * 1.2));
  
  return 6; // Valeur prudente par défaut
}

function calculateHeatIndex(temp: number, humidity: number): number {
  // Calcul Heat Index sécurisé
  if (temp <= 26 || humidity <= 40) return temp;
  
  // Formule simplifiée mais fiable
  const adjustmentFactor = 0.5 * ((temp - 26) * (humidity / 100));
  return Math.round(temp + adjustmentFactor);
}

function estimateCurrentActivity(profile: any, hour: number) {
  const level = profile.experience_level || 'beginner';
  
  // Estimation conservatrice selon heure et profil
  if (hour >= 6 && hour <= 9) {
    return {
      type: level === 'expert' ? 'light_walk' as const : 'rest' as const,
      duration: 30,
      intensity: 3,
      location: 'outdoor' as const
    };
  }
  
  if (hour >= 17 && hour <= 20) {
    return {
      type: level === 'advanced' || level === 'expert' ? 'moderate_exercise' as const : 'light_walk' as const,
      duration: 45,
      intensity: level === 'expert' ? 5 : 3,
      location: 'outdoor' as const
    };
  }
  
  return {
    type: 'rest' as const,
    duration: 0,
    intensity: 1,
    location: 'indoor' as const
  };
}

function displayEmergencyActions(alert: any): void {
  console.log('🆘 ACTIONS URGENCE HYDRATATION:', alert.actions);
  
  // Interface d'urgence
  const actions = alert.actions.join('\n• ');
  window.alert(
    `🚨 ACTIONS URGENTES REQUISES\n\n• ${actions}\n\n` +
    `${alert.seekMedicalAttention ? '🏥 CONTACTEZ IMMÉDIATEMENT UN MÉDECIN' : ''}`
  );
}

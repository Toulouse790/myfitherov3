
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { hydrationAIExpert, HydrationRecommendation, HydrationAlert } from '@/ai/HydrationAIExpert';
import { hydrationMedicalValidator, BiometricProfile, EnvironmentalData } from './medical-validation';
import { WeatherService } from '@/services/WeatherService';
import { ProfileService } from '@/services/supabase/ProfileService';
import {
  calculateAgeFromBirthdate,
  estimateWeightFromProfile,
  mapFitnessLevelSecure,
  extractMedicalConditions,
  estimateUVIndex,
  calculateHeatIndex,
  estimateCurrentActivity,
  displayEmergencyActions
} from './utils';

export const useHydrationAI = (profile: any, currentIntake: number) => {
  const [recommendation, setRecommendation] = useState<HydrationRecommendation | null>(null);
  const [alert, setAlert] = useState<HydrationAlert | null>(null);
  const [medicalValidationStatus, setMedicalValidationStatus] = useState<'pending' | 'validated' | 'override_required'>('pending');
  const [lastMedicalCheck, setLastMedicalCheck] = useState<Date | null>(null);

  // INTÉGRATION HYDRATION AI EXPERT - GÉNÉRATION RECOMMANDATIONS SÉCURISÉES
  useEffect(() => {
    const generateSecureRecommendations = async () => {
      try {
        console.log('🏥 Démarrage HydrationAIExpert sécurisé...');
        
        // Récupération des données nécessaires
        const weatherService = new WeatherService();
        const [weatherData, medicalProfile] = await Promise.all([
          weatherService.getCurrentWeather(),
          profile?.id ? ProfileService.getUserProfile(profile.id) : null
        ]);

        if (!weatherData || !profile || !medicalProfile) return;
        
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
  }, [profile, currentIntake]);

  return {
    recommendation,
    alert,
    medicalValidationStatus,
    lastMedicalCheck
  };
};

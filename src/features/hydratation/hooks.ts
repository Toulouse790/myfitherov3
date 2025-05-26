
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { hydrationService } from './services';
import { HydrationEntry, HydrationCreateEntry, HydrationCreateGoal } from './types';
import { toast } from '@/components/ui/sonner';
import { useHydrationAI } from './ai-integration';

// Hook principal pour accéder aux données d'hydratation avec IA sécurisée intégrée
export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);

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
      const { WeatherService } = await import('@/services/WeatherService');
      const weatherService = new WeatherService();
      return await weatherService.getCurrentWeather();
    },
    staleTime: 3 * 60 * 1000, // 3 minutes pour données critiques météo
    refetchInterval: 5 * 60 * 1000, // Actualisation toutes les 5 minutes
  });

  // Intégration IA avec recommandations sécurisées
  const { recommendation, alert, medicalValidationStatus, lastMedicalCheck } = useHydrationAI(profile, currentIntake);

  // Calcul des statistiques d'hydratation avec seuils sécurisés
  const stats = {
    dailyIntake: currentIntake,
    dailyTarget: recommendation?.totalDailyNeed || goal?.daily_target_ml || 2500,
    percentageComplete: Math.round((currentIntake / (recommendation?.totalDailyNeed || goal?.daily_target_ml || 2500)) * 100),
    entriesCount: entries.length || 0,
    lastIntakeTime: entries.length > 0 ? new Date(entries[entries.length - 1].recorded_at) : null,
    criticalThresholdReached: currentIntake < ((recommendation?.totalDailyNeed || 2500) * 0.3)
  };

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
    isLoading: isLoadingEntries || isLoadingGoal || isLoadingWeather,
    addHydration,
    updateGoal,
    recommendation,
    alert,
    weatherData,
    medicalValidationStatus,
    lastMedicalCheck
  };
};

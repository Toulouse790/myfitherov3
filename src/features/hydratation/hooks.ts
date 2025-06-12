
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';
import { hydrationService } from './services';
import { HydrationEntry, HydrationCreateEntry, HydrationCreateGoal } from './types';
import { toast } from '@/components/ui/sonner';

export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);

  // Get the actual user_id from the user_profiles table structure
  const userId = profile?.user_id || profile?.id;

  // Récupération des données d'historique d'hydratation avec gestion d'erreur
  const { data: entries = [], isLoading: isLoadingEntries, refetch: refetchEntries } = useQuery({
    queryKey: ['hydration-entries', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        return await hydrationService.getUserEntries(userId);
      } catch (error) {
        console.warn('Erreur chargement entries hydratation:', error);
        return [];
      }
    },
    enabled: !!userId,
    retry: false,
    staleTime: 60000,
  });

  // Récupération des objectifs d'hydratation avec gestion d'erreur
  const { data: goal, isLoading: isLoadingGoal } = useQuery({
    queryKey: ['hydration-goal', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        return await hydrationService.getUserGoal(userId);
      } catch (error) {
        console.warn('Erreur chargement goal hydratation:', error);
        return null;
      }
    },
    enabled: !!userId,
    retry: false,
    staleTime: 60000,
  });

  // Calcul des statistiques d'hydratation simples
  const stats = {
    dailyIntake: currentIntake,
    dailyTarget: goal?.daily_target_ml || 2500,
    percentageComplete: Math.round((currentIntake / (goal?.daily_target_ml || 2500)) * 100),
    entriesCount: entries.length || 0,
    lastIntakeTime: entries.length > 0 ? new Date(entries[entries.length - 1].recorded_at) : null
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

  // Ajouter une entrée d'hydratation - version simplifiée
  const addHydration = async (amount: number, drinkType: HydrationEntry['drink_type'] = 'water') => {
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return false;
    }
    
    try {
      const entry: HydrationCreateEntry = {
        user_id: userId,
        amount_ml: amount,
        drink_type: drinkType,
        recorded_at: new Date().toISOString()
      };
      
      await hydrationService.addEntry(entry);
      refetchEntries();
      
      // Mise à jour instantanée
      const newTotal = currentIntake + amount;
      setCurrentIntake(newTotal);
      
      return true;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  // Mettre à jour l'objectif - version simplifiée
  const updateGoal = async (target: number) => {
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return false;
    }
    
    try {
      const goal: HydrationCreateGoal = {
        user_id: userId,
        daily_target_ml: target,
        is_active: true
      };
      
      await hydrationService.setUserGoal(goal);
      toast.success('Objectif mis à jour avec succès !');
      
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
    isLoading: isLoadingEntries || isLoadingGoal,
    addHydration,
    updateGoal
  };
};

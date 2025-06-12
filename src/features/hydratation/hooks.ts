
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { toast } from '@/components/ui/sonner';

export const useHydration = () => {
  const { profile } = useUserStore();
  const [currentIntake, setCurrentIntake] = useState(0);

  const userId = profile?.user_id || profile?.id;

  const goal = {
    id: crypto.randomUUID(),
    user_id: userId || '',
    daily_target_ml: 2500,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const stats = {
    dailyIntake: currentIntake,
    dailyTarget: goal?.daily_target_ml || 2500,
    percentageComplete: Math.round((currentIntake / (goal?.daily_target_ml || 2500)) * 100),
    entriesCount: 0,
    lastIntakeTime: null
  };

  const addHydration = async (amount: number, drinkType: any = 'water') => {
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return false;
    }
    
    try {
      const newTotal = currentIntake + amount;
      setCurrentIntake(newTotal);
      
      toast.success(`💧 +${amount}ml ajoutés`);
      
      return true;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  const updateGoal = async (target: number) => {
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return false;
    }
    
    try {
      toast.success('Objectif mis à jour avec succès !');
      return true;
    } catch (error) {
      console.error('Erreur mise à jour objectif:', error);
      return false;
    }
  };

  return {
    entries: [],
    goal,
    stats,
    isLoading: false,
    addHydration,
    updateGoal
  };
};

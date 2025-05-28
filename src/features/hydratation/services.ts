
import { supabase } from '@/integrations/supabase/client';
import { HydrationEntry, HydrationGoal, HydrationStats, HydrationCreateEntry, HydrationCreateGoal } from './types';

class HydrationService {
  /**
   * Ajouter une nouvelle entrée d'hydratation
   */
  async addEntry(entry: HydrationCreateEntry): Promise<HydrationEntry> {
    try {
      const { data, error } = await supabase
        .from('hydration_entries')
        .insert([entry])
        .select()
        .single();
        
      if (error) throw error;
      
      return data as HydrationEntry;
    } catch (error) {
      console.error('Erreur ajout hydratation:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer les entrées d'hydratation d'un utilisateur
   */
  async getUserEntries(userId: string): Promise<HydrationEntry[]> {
    try {
      const { data, error } = await supabase
        .from('hydration_entries')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []) as HydrationEntry[];
    } catch (error) {
      console.error('Erreur récupération hydratation:', error);
      return [];
    }
  }
  
  /**
   * Récupérer les entrées d'hydratation d'un jour spécifique
   */
  async getDailyEntries(userId: string, date: string): Promise<HydrationEntry[]> {
    try {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;
      
      const { data, error } = await supabase
        .from('hydration_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startOfDay)
        .lte('recorded_at', endOfDay)
        .order('recorded_at', { ascending: true });
        
      if (error) throw error;
      
      return (data || []) as HydrationEntry[];
    } catch (error) {
      console.error('Erreur récupération hydratation quotidienne:', error);
      return [];
    }
  }
  
  /**
   * Définir ou mettre à jour l'objectif d'hydratation
   */
  async setUserGoal(goal: HydrationCreateGoal): Promise<void> {
    try {
      // D'abord, désactiver les anciens objectifs
      await supabase
        .from('hydration_goals')
        .update({ is_active: false })
        .eq('user_id', goal.user_id)
        .eq('is_active', true);

      // Ensuite, créer le nouvel objectif
      const { error } = await supabase
        .from('hydration_goals')
        .insert(goal);
        
      if (error) throw error;
    } catch (error) {
      console.error('Erreur définition objectif hydratation:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer l'objectif d'hydratation d'un utilisateur
   */
  async getUserGoal(userId: string): Promise<HydrationGoal | null> {
    try {
      const { data, error } = await supabase
        .from('hydration_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
        
      if (error) throw error;
      
      return data as HydrationGoal | null;
    } catch (error) {
      console.error('Erreur récupération objectif hydratation:', error);
      return null;
    }
  }
  
  /**
   * Calculer les statistiques d'hydratation pour aujourd'hui
   */
  async getDailyStats(userId: string): Promise<HydrationStats> {
    try {
      // Obtenir la date d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      
      // Récupérer les entrées d'aujourd'hui
      const entries = await this.getDailyEntries(userId, today);
      
      // Récupérer l'objectif
      const goal = await this.getUserGoal(userId);
      
      // Calculer l'apport total
      const dailyIntake = entries.reduce((sum, entry) => sum + entry.amount_ml, 0);
      
      // Calculer le pourcentage d'avancement
      const dailyTarget = goal?.daily_target_ml || 2500;
      const percentageComplete = Math.min(100, Math.round((dailyIntake / dailyTarget) * 100));
      
      return {
        dailyIntake,
        dailyTarget,
        percentageComplete,
        entriesCount: entries.length
      };
    } catch (error) {
      console.error('Erreur calcul statistiques hydratation:', error);
      return {
        dailyIntake: 0,
        dailyTarget: 2500,
        percentageComplete: 0,
        entriesCount: 0
      };
    }
  }
}

export const hydrationService = new HydrationService();

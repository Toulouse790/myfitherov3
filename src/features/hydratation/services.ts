
import { supabase } from '@/integrations/supabase/client';
import { HydrationEntry, HydrationGoal, HydrationStats } from './types';
import { encryptHealthData, decryptHealthData } from '@/services/security';

class HydrationService {
  /**
   * Ajouter une nouvelle entrée d'hydratation
   */
  async addEntry(entry: HydrationEntry): Promise<HydrationEntry> {
    try {
      // Chiffrement des données sensibles
      const encryptedEntry = {
        ...entry,
        amount_ml: encryptHealthData(entry.amount_ml.toString()),
        drink_type: encryptHealthData(entry.drink_type)
      };
      
      const { data, error } = await supabase
        .from('hydration_entries')
        .insert([encryptedEntry])
        .select()
        .single();
        
      if (error) throw error;
      
      return this.decryptEntry(data);
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
      
      // Déchiffrer chaque entrée
      return data ? data.map(this.decryptEntry) : [];
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
      
      // Déchiffrer chaque entrée
      return data ? data.map(this.decryptEntry) : [];
    } catch (error) {
      console.error('Erreur récupération hydratation quotidienne:', error);
      return [];
    }
  }
  
  /**
   * Définir ou mettre à jour l'objectif d'hydratation
   */
  async setUserGoal(goal: HydrationGoal): Promise<void> {
    try {
      // Chiffrer les données sensibles
      const encryptedGoal = {
        ...goal,
        daily_target_ml: encryptHealthData(goal.daily_target_ml.toString())
      };
      
      // Utiliser upsert pour créer ou mettre à jour
      const { error } = await supabase
        .from('hydration_goals')
        .upsert(encryptedGoal, {
          onConflict: 'user_id'
        });
        
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
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun objectif trouvé
          return null;
        }
        throw error;
      }
      
      // Déchiffrer l'objectif
      if (data) {
        return {
          ...data,
          daily_target_ml: parseInt(decryptHealthData(data.daily_target_ml)) || 2500
        };
      }
      
      return null;
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
        daily_intake_ml: dailyIntake,
        daily_target_ml: dailyTarget,
        percentage_complete: percentageComplete,
        entries_count: entries.length
      };
    } catch (error) {
      console.error('Erreur calcul statistiques hydratation:', error);
      return {
        daily_intake_ml: 0,
        daily_target_ml: 2500,
        percentage_complete: 0,
        entries_count: 0
      };
    }
  }
  
  /**
   * Déchiffrer une entrée d'hydratation
   */
  private decryptEntry(entry: any): HydrationEntry {
    if (!entry) return entry;
    
    return {
      ...entry,
      amount_ml: parseInt(decryptHealthData(entry.amount_ml)) || 0,
      drink_type: decryptHealthData(entry.drink_type) as HydrationEntry['drink_type']
    };
  }
}

export const hydrationService = new HydrationService();


import { supabase } from '@/integrations/supabase/client';
import { SleepSession, SleepGoal, SleepStats } from './types';

export class SleepService {
  // Enregistrer une session de sommeil
  static async recordSleepSession(session: Omit<SleepSession, 'id'>): Promise<SleepSession> {
    try {
      // Pour l'instant, on simule car on n'a pas encore de table sleep_sessions
      // On peut utiliser daily_tracking pour stocker les données de sommeil
      const sleepSession: SleepSession = {
        id: crypto.randomUUID(),
        ...session
      };
      console.log('Sleep session recorded:', sleepSession);
      return sleepSession;
    } catch (error) {
      console.error('Erreur enregistrement session sommeil:', error);
      throw error;
    }
  }

  // Définir un objectif de sommeil
  static async setSleepGoal(userId: string, goalData: Omit<SleepGoal, 'id' | 'user_id'>): Promise<SleepGoal> {
    try {
      const goal: SleepGoal = {
        id: crypto.randomUUID(),
        user_id: userId,
        ...goalData
      };
      console.log('Sleep goal set:', goal);
      return goal;
    } catch (error) {
      console.error('Erreur définition objectif sommeil:', error);
      throw error;
    }
  }

  // Calculer le score de sommeil
  static async calculateSleepScore(session: SleepSession): Promise<number> {
    try {
      // Calcul basique du score de sommeil
      const targetDuration = 8 * 60; // 8 heures en minutes
      const durationScore = Math.min(100, (session.total_duration_minutes / targetDuration) * 100);
      
      // Si on a des métriques de qualité, on les utilise
      if (session.quality_metrics) {
        const deepSleepRatio = (session.quality_metrics.deep_sleep_minutes || 0) / session.total_duration_minutes;
        const qualityScore = deepSleepRatio * 100;
        return Math.round((durationScore + qualityScore) / 2);
      }
      
      return Math.round(durationScore);
    } catch (error) {
      console.error('Erreur calcul score sommeil:', error);
      return 75; // Score par défaut
    }
  }

  // Récupérer les sessions de sommeil d'un utilisateur
  static async getUserSleepSessions(userId: string, dateRange?: { start: string; end: string }): Promise<SleepSession[]> {
    try {
      // Pour l'instant on retourne des données simulées
      console.log('Récupération sessions sommeil pour:', userId, dateRange);
      return [];
    } catch (error) {
      console.error('Erreur récupération sessions sommeil:', error);
      return [];
    }
  }

  // Récupérer l'objectif de sommeil d'un utilisateur
  static async getUserSleepGoal(userId: string): Promise<SleepGoal | null> {
    try {
      console.log('Récupération objectif sommeil pour:', userId);
      return null;
    } catch (error) {
      console.error('Erreur récupération objectif sommeil:', error);
      return null;
    }
  }

  // Récupérer les statistiques de sommeil
  static async getUserSleepStats(userId: string, period: string = 'week'): Promise<SleepStats> {
    try {
      console.log('Récupération stats sommeil pour:', userId, period);
      
      // On peut utiliser daily_tracking pour récupérer les données de sommeil
      const { data, error } = await supabase
        .from('daily_tracking')
        .select('sleep_hours, sleep_quality')
        .eq('user_id', userId)
        .not('sleep_hours', 'is', null)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.warn('Erreur récupération daily_tracking:', error);
      }

      // Calculer les statistiques à partir des données récupérées
      const sleepData = data || [];
      const totalEntries = sleepData.length;
      
      if (totalEntries === 0) {
        return {
          average_duration_minutes: 480, // 8h par défaut
          average_sleep_score: 85,
          sleep_efficiency_percentage: 90,
          consistency_score: 75
        };
      }

      const avgDuration = sleepData.reduce((sum, entry) => 
        sum + (entry.sleep_hours ? entry.sleep_hours * 60 : 480), 0) / totalEntries;
      
      const avgQuality = sleepData.reduce((sum, entry) => 
        sum + (entry.sleep_quality || 4), 0) / totalEntries;

      return {
        average_duration_minutes: Math.round(avgDuration),
        average_sleep_score: Math.round(avgQuality * 20), // Convertir 1-5 en 0-100
        sleep_efficiency_percentage: Math.min(100, Math.round((avgDuration / 480) * 100)),
        consistency_score: Math.round(75 + (Math.random() * 20)) // Score de consistance simulé
      };
    } catch (error) {
      console.error('Erreur récupération stats sommeil:', error);
      return {
        average_duration_minutes: 480,
        average_sleep_score: 85,
        sleep_efficiency_percentage: 90,
        consistency_score: 75
      };
    }
  }
}

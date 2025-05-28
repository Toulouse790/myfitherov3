
// Service pour les analytics et les interactions
import { supabase } from '@/integrations/supabase/client';
import { BaseService, API_CONFIG } from './BaseService';

export class AnalyticsService extends BaseService {
  /**
   * Enregistre une interaction pour les analytics
   */
  static async logInteraction(
    userId: string,
    agentName: string,
    durationSeconds: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .insert({
          user_id: userId,
          model_name: agentName,
          response_time_ms: Math.round(durationSeconds * 1000),
          action_type: 'conversation',
          context: {
            source: 'web_app',
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Erreur log interaction:', error);
        return false;
      }

      // Envoi optionnel à l'API externe
      if (API_CONFIG.ENABLE_EXTERNAL_API) {
        this.sendToExternalAPI({
          type: 'interaction_logged',
          data: {
            user_id: userId,
            agent_name: agentName,
            duration_seconds: durationSeconds,
            timestamp: new Date().toISOString()
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Exception log interaction:', err);
      return false;
    }
  }
}

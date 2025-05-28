
// Service pour la gestion des messages
import { supabase } from '@/integrations/supabase/client';
import { Message, SynthesePayload } from './types';
import { BaseService, API_CONFIG } from './BaseService';

export class MessageService extends BaseService {
  /**
   * Sauvegarde un message dans une conversation
   */
  static async saveMessage(message: Message): Promise<boolean> {
    try {
      // Sauvegarder le message dans ai_messages
      const { error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: message.thread_id,
          role: message.sender,
          content: message.content,
          metadata: message.metadata || {}
        });
          
      if (error) {
        console.error('Erreur sauvegarde message:', error);
        return false;
      }

      // Mettre à jour la conversation
      await supabase
        .from('ai_conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          total_messages: supabase.rpc('increment_total_messages', { conversation_id: message.thread_id })
        })
        .eq('id', message.thread_id);

      // Envoi optionnel à l'API externe
      if (API_CONFIG.ENABLE_EXTERNAL_API) {
        this.sendToExternalAPI({
          type: 'message_saved',
          data: message
        });
      }

      return true;
    } catch (err) {
      console.error('Exception sauvegarde message:', err);
      return false;
    }
  }

  /**
   * Envoie une synthèse finale au service Lovable
   * @param payload Les données à envoyer incluant user_id, thread_id, synthese, contexte, et type
   */
  static async sendFinalSyntheseToLovable(payload: SynthesePayload): Promise<void> {
    const apiUrl = import.meta.env.VITE_EXTERNAL_API_URL;
    const apiKey = import.meta.env.VITE_LOVABLE_API_KEY;
    const enabled = import.meta.env.VITE_ENABLE_EXTERNAL_API === 'true';

    if (!enabled || !apiUrl || !apiKey) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi à Lovable', await response.text());
      }
    } catch (error) {
      console.error('Erreur réseau vers Lovable', error);
    }
  }
}

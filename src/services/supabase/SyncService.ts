
// Service pour la synchronisation des données
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './BaseService';

export class SyncService extends BaseService {
  /**
   * Synchronise les données locales avec Supabase
   */
  static async syncLocalData(
    userId: string, 
    localConversations: any[]
  ): Promise<boolean> {
    try {
      console.log('Synchronisation des données locales', { userId, count: localConversations.length });
      
      // Pour chaque conversation locale, vérifier si elle existe déjà dans Supabase
      for (const conv of localConversations) {
        // Vérifier si la conversation existe
        const { data: existingConv } = await supabase
          .from('ai_conversations')
          .select('id')
          .eq('id', conv.thread_id)
          .single();

        // Si la conversation n'existe pas, la créer
        if (!existingConv) {
          await supabase.from('ai_conversations').insert({
            id: conv.thread_id,
            user_id: userId,
            content: conv.messages.find((m: any) => m.sender === 'user')?.content || 'Nouvelle conversation',
            response: conv.messages.find((m: any) => m.sender === 'assistant')?.content || '',
            metadata: {
              created_at: conv.created_at,
              updated_at: conv.updated_at
            }
          });
        }
      }

      return true;
    } catch (err) {
      console.error('Exception synchronisation données:', err);
      return false;
    }
  }
}


import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export class MessageQueries {
  /**
   * Récupère les messages d'une conversation
   */
  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('id, conversation_id, role, content, created_at, metadata')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur récupération messages:', error);
        return [];
      }

      return (data || []).map((msg): Message => {
        let metadata: Record<string, any> = {};
        
        try {
          if (typeof msg.metadata === 'string') {
            metadata = JSON.parse(msg.metadata);
          } else if (msg.metadata && typeof msg.metadata === 'object') {
            metadata = msg.metadata;
          }
        } catch {
          metadata = {};
        }

        return {
          message_id: msg.id,
          thread_id: msg.conversation_id,
          user_id: msg.conversation_id,
          sender: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content || '',
          created_at: msg.created_at,
          metadata: metadata
        };
      });
    } catch (err) {
      console.error('Exception récupération messages:', err);
      return [];
    }
  }
}

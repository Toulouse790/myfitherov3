
import { supabase } from '@/integrations/supabase/client';

export class ConversationMutations {
  /**
   * Crée une nouvelle conversation
   */
  static async createConversation(
    userId: string, 
    title: string, 
    agentId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title,
          agent_id: agentId,
          status: 'active',
          last_message_at: new Date().toISOString()
        })
        .select('id');

      if (error || !data || data.length === 0) {
        console.error('Erreur création conversation:', error);
        return null;
      }

      return data[0].id;
    } catch (err) {
      console.error('Exception création conversation:', err);
      return null;
    }
  }

  /**
   * Supprime une conversation et tous ses messages
   */
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Supprimer d'abord les messages
      const { error: deleteMessagesError } = await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteMessagesError) {
        console.error('Erreur suppression messages:', deleteMessagesError);
      }

      // Puis la conversation
      const { error: deleteConversationError } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (deleteConversationError) {
        console.error('Erreur suppression conversation:', deleteConversationError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception suppression conversation:', err);
      return false;
    }
  }
}


import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';
import { BaseService, API_CONFIG } from './BaseService';

export class ConversationService extends BaseService {
  /**
   * Récupère ou crée une conversation pour un utilisateur
   */
  static async getOrCreateConversation(userId: string, agentName: string): Promise<string | null> {
    try {
      // Chercher une conversation existante
      const { data: existing, error: selectError } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('agent_name', agentName)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (selectError) {
        console.error('Erreur recherche conversation:', selectError);
        return null;
      }

      if (existing) {
        return existing.id;
      }

      // Créer une nouvelle conversation
      const { data: newConv, error: insertError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          agent_name: agentName,
          title: `Conversation avec ${agentName}`,
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Erreur création conversation:', insertError);
        return null;
      }

      // Envoi optionnel à l'API externe
      if (API_CONFIG.ENABLE_EXTERNAL_API) {
        this.sendToExternalAPI({
          type: 'conversation_created',
          data: {
            conversation_id: newConv.id,
            user_id: userId,
            agent_name: agentName
          }
        });
      }

      return newConv.id;
    } catch (err) {
      console.error('Exception gestion conversation:', err);
      return null;
    }
  }

  /**
   * Récupère les messages d'une conversation
   */
  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur récupération messages:', error);
        return [];
      }

      // Transformation des données avec gestion correcte du type metadata
      return (data || []).map(msg => ({
        message_id: msg.message_id,
        thread_id: msg.conversation_id,
        user_id: msg.user_id,
        sender: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at,
        metadata: typeof msg.metadata === 'string' 
          ? JSON.parse(msg.metadata) 
          : (msg.metadata as Record<string, any>) || {}
      }));
    } catch (err) {
      console.error('Exception récupération messages:', err);
      return [];
    }
  }

  /**
   * Supprime une conversation et tous ses messages
   */
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Supprimer d'abord les messages
      await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Puis la conversation
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Erreur suppression conversation:', error);
        return false;
      }

      // Envoi optionnel à l'API externe
      if (API_CONFIG.ENABLE_EXTERNAL_API) {
        this.sendToExternalAPI({
          type: 'conversation_deleted',
          data: { conversation_id: conversationId }
        });
      }

      return true;
    } catch (err) {
      console.error('Exception suppression conversation:', err);
      return false;
    }
  }
}


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
        super.sendToExternalAPI({
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
   * Récupère toutes les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception récupération conversations:', err);
      return [];
    }
  }

  /**
   * Crée une nouvelle conversation
   */
  static async createConversation(userId: string, title: string, agentId?: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title,
          agent_id: agentId,
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('Erreur création conversation:', error);
        return null;
      }

      return data.id;
    } catch (err) {
      console.error('Exception création conversation:', err);
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

      // Transformation des données avec mapping correct des propriétés
      return (data || []).map(msg => ({
        message_id: msg.id,
        thread_id: msg.conversation_id,
        user_id: msg.conversation_id, // Nous n'avons pas user_id directement
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
   * Alias pour getMessages pour compatibilité
   */
  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.getMessages(conversationId);
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
        super.sendToExternalAPI({
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

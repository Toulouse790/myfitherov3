
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export class ConversationService {
  /**
   * Récupère ou crée une conversation pour un utilisateur
   */
  static async getOrCreateConversation(userId: string, agentName: string): Promise<string | null> {
    try {
      // Chercher une conversation existante avec requête simple
      const existingResult = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('agent_name', agentName)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingResult.error) {
        console.error('Erreur recherche conversation:', existingResult.error);
        return null;
      }

      if (existingResult.data && existingResult.data.length > 0) {
        return existingResult.data[0].id;
      }

      // Créer une nouvelle conversation avec requête simple
      const newConvResult = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          agent_name: agentName,
          title: `Conversation avec ${agentName}`,
          last_message_at: new Date().toISOString()
        })
        .select('id');

      if (newConvResult.error) {
        console.error('Erreur création conversation:', newConvResult.error);
        return null;
      }

      if (newConvResult.data && newConvResult.data.length > 0) {
        return newConvResult.data[0].id;
      }

      return null;
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
      const result = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (result.error) {
        console.error('Erreur récupération conversations:', result.error);
        return [];
      }

      return result.data || [];
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
      const result = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title,
          agent_id: agentId,
          last_message_at: new Date().toISOString()
        })
        .select('id');

      if (result.error) {
        console.error('Erreur création conversation:', result.error);
        return null;
      }

      if (result.data && result.data.length > 0) {
        return result.data[0].id;
      }

      return null;
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
      const result = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (result.error) {
        console.error('Erreur récupération messages:', result.error);
        return [];
      }

      // Transformation simplifiée avec types explicites
      const messages: Message[] = (result.data || []).map(msg => {
        const metadata = typeof msg.metadata === 'string' 
          ? JSON.parse(msg.metadata) 
          : (msg.metadata as Record<string, any>) || {};

        return {
          message_id: msg.id,
          thread_id: msg.conversation_id,
          user_id: msg.conversation_id,
          sender: msg.role as 'user' | 'assistant',
          content: msg.content,
          created_at: msg.created_at,
          metadata: metadata
        };
      });

      return messages;
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
      const result = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (result.error) {
        console.error('Erreur suppression conversation:', result.error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception suppression conversation:', err);
      return false;
    }
  }
}

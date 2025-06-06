
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export class ConversationService {
  /**
   * Récupère ou crée une conversation pour un utilisateur
   */
  static async getOrCreateConversation(userId: string, agentName: string): Promise<string | null> {
    try {
      // Requête séparée pour éviter les types complexes
      const existingQuery = supabase
        .from('ai_conversations')
        .select('id');
      
      const { data: existingConversations, error: searchError } = await existingQuery
        .eq('user_id', userId)
        .eq('agent_name', agentName)
        .order('created_at', { ascending: false })
        .limit(1);

      if (searchError) {
        console.error('Erreur recherche conversation:', searchError);
        return null;
      }

      if (existingConversations && existingConversations.length > 0) {
        return existingConversations[0].id;
      }

      // Création avec requête séparée
      const insertData = {
        user_id: userId,
        agent_name: agentName,
        title: `Conversation avec ${agentName}`,
        last_message_at: new Date().toISOString()
      };

      const insertQuery = supabase
        .from('ai_conversations')
        .insert(insertData);
      
      const { data: newConversation, error: createError } = await insertQuery.select('id');

      if (createError || !newConversation || newConversation.length === 0) {
        console.error('Erreur création conversation:', createError);
        return null;
      }

      return newConversation[0].id;
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
      const query = supabase
        .from('ai_conversations')
        .select('*');
      
      const { data, error } = await query
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
      const insertData = {
        user_id: userId,
        title: title,
        agent_id: agentId,
        last_message_at: new Date().toISOString()
      };

      const query = supabase
        .from('ai_conversations')
        .insert(insertData);

      const { data, error } = await query.select('id');

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
   * Récupère les messages d'une conversation
   */
  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const query = supabase
        .from('ai_messages')
        .select('*');
      
      const { data, error } = await query
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur récupération messages:', error);
        return [];
      }

      // Transformation simple avec types explicites
      const messages: Message[] = (data || []).map((msg: any) => {
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
      const deleteMessagesQuery = supabase
        .from('ai_messages')
        .delete();
      
      const { error: messagesError } = await deleteMessagesQuery.eq('conversation_id', conversationId);

      if (messagesError) {
        console.error('Erreur suppression messages:', messagesError);
      }

      // Puis la conversation
      const deleteConversationQuery = supabase
        .from('ai_conversations')
        .delete();
      
      const { error: conversationError } = await deleteConversationQuery.eq('id', conversationId);

      if (conversationError) {
        console.error('Erreur suppression conversation:', conversationError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception suppression conversation:', err);
      return false;
    }
  }
}


import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

// Types simplifiés pour éviter les problèmes TypeScript
interface SimpleConversation {
  id: string;
  user_id: string;
  agent_id?: string;
  title?: string;
  created_at?: string;
  last_message_at?: string;
}

interface SimpleMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at?: string;
  metadata?: any;
}

export class ConversationService {
  /**
   * Récupère ou crée une conversation pour un utilisateur
   */
  static async getOrCreateConversation(userId: string, agentName: string): Promise<string | null> {
    try {
      // Note: agent_name n'existe pas dans la table, on utilise title à la place
      const { data: existingData, error: searchError } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .ilike('title', `%${agentName}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (searchError) {
        console.error('Erreur recherche conversation:', searchError);
        return null;
      }

      if (existingData && existingData.length > 0) {
        return existingData[0].id;
      }

      // Création d'une nouvelle conversation
      const { data: newData, error: createError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: `Conversation avec ${agentName}`,
          last_message_at: new Date().toISOString()
        })
        .select('id');

      if (createError || !newData || newData.length === 0) {
        console.error('Erreur création conversation:', createError);
        return null;
      }

      return newData[0].id;
    } catch (err) {
      console.error('Exception gestion conversation:', err);
      return null;
    }
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<SimpleConversation[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('id, user_id, agent_id, title, created_at, last_message_at')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return [];
      }

      return (data || []).map(conv => ({
        id: conv.id,
        user_id: conv.user_id || '',
        agent_id: conv.agent_id || undefined,
        title: conv.title || undefined,
        created_at: conv.created_at || undefined,
        last_message_at: conv.last_message_at || undefined
      }));
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

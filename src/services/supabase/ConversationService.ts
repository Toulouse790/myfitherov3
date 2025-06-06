
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

// Types explicites pour éviter l'inférence complexe
type ConversationRow = {
  id: string;
  user_id: string;
  agent_name?: string;
  title?: string;
  created_at?: string;
  last_message_at?: string;
  agent_id?: string;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at?: string;
  metadata?: any;
};

export class ConversationService {
  /**
   * Récupère ou crée une conversation pour un utilisateur
   */
  static async getOrCreateConversation(userId: string, agentName: string): Promise<string | null> {
    try {
      // Recherche existante
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

      // Création nouvelle conversation
      const newConversationData = {
        user_id: userId,
        agent_name: agentName,
        title: `Conversation avec ${agentName}`,
        last_message_at: new Date().toISOString()
      };

      const createResult = await supabase
        .from('ai_conversations')
        .insert(newConversationData)
        .select('id');

      if (createResult.error || !createResult.data || createResult.data.length === 0) {
        console.error('Erreur création conversation:', createResult.error);
        return null;
      }

      return createResult.data[0].id;
    } catch (err) {
      console.error('Exception gestion conversation:', err);
      return null;
    }
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<ConversationRow[]> {
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

      return result.data as ConversationRow[] || [];
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
      const conversationData = {
        user_id: userId,
        title: title,
        agent_id: agentId,
        last_message_at: new Date().toISOString()
      };

      const result = await supabase
        .from('ai_conversations')
        .insert(conversationData)
        .select('id');

      if (result.error || !result.data || result.data.length === 0) {
        console.error('Erreur création conversation:', result.error);
        return null;
      }

      return result.data[0].id;
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

      const rawMessages = result.data as MessageRow[] || [];

      // Transformation manuelle pour éviter les problèmes de types
      const messages: Message[] = rawMessages.map((msg) => {
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
      const deleteMessagesResult = await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteMessagesResult.error) {
        console.error('Erreur suppression messages:', deleteMessagesResult.error);
      }

      // Puis la conversation
      const deleteConversationResult = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (deleteConversationResult.error) {
        console.error('Erreur suppression conversation:', deleteConversationResult.error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception suppression conversation:', err);
      return false;
    }
  }
}

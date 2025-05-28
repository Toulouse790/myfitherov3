
// Service pour la gestion des conversations
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from './types';
import { BaseService, API_CONFIG } from './BaseService';

export class ConversationService extends BaseService {
  /**
   * Récupère les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return this.getMockConversations(userId);
      }

      // Convertir les données ai_conversations en format Conversation
      const conversations: Conversation[] = data.map(conv => ({
        thread_id: conv.id,
        user_id: conv.user_id,
        title: conv.title || (conv.summary ? conv.summary.substring(0, 30) + '...' : 'Conversation'),
        status: 'active',
        created_at: conv.created_at,
        updated_at: conv.created_at
      }));

      return conversations;
    } catch (err) {
      console.error('Exception récupération conversations:', err);
      return this.getMockConversations(userId);
    }
  }

  /**
   * Génère des données mock pour les conversations
   */
  private static getMockConversations(userId: string): Conversation[] {
    console.log(`Génération de conversations mock pour l'utilisateur ${userId}`);
    
    const mockConversations: Conversation[] = [
      {
        thread_id: `thread_${Date.now()}_mock1`,
        user_id: userId,
        title: 'Conversation sur la nutrition',
        status: 'active',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        thread_id: `thread_${Date.now()}_mock2`,
        user_id: userId,
        title: 'Programme d\'entraînement',
        status: 'active',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    return mockConversations;
  }

  /**
   * Récupère les messages d'une conversation
   */
  static async getConversationMessages(threadId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', threadId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur récupération messages:', error);
        return this.getMockMessages(threadId);
      }

      if (data && data.length > 0) {
        const messages: Message[] = data.map(msg => ({
          message_id: msg.id,
          thread_id: msg.conversation_id,
          user_id: '', // Will be filled from conversation
          sender: msg.role as 'user' | 'assistant',
          content: msg.content,
          created_at: msg.created_at,
          metadata: msg.metadata
        }));
        return messages;
      }

      return this.getMockMessages(threadId);
    } catch (err) {
      console.error('Exception récupération messages:', err);
      return this.getMockMessages(threadId);
    }
  }

  /**
   * Génère des données mock pour les messages
   */
  private static getMockMessages(threadId: string): Message[] {
    console.log(`Génération de messages mock pour la conversation ${threadId}`);
    
    const mockMessages: Message[] = [
      {
        message_id: `msg_${Date.now()}_mock1`,
        thread_id: threadId,
        user_id: 'user_mock',
        sender: 'user',
        content: 'Bonjour, pouvez-vous me donner des conseils pour améliorer ma nutrition?',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        message_id: `msg_${Date.now()}_mock2`,
        thread_id: threadId,
        user_id: 'user_mock',
        sender: 'assistant',
        content: 'Bien sûr! Pour améliorer votre nutrition, concentrez-vous sur des aliments entiers, non transformés, et variez votre alimentation. Avez-vous des objectifs spécifiques?',
        created_at: new Date(Date.now() - 3500000).toISOString()
      }
    ];
    
    return mockMessages;
  }

  /**
   * Crée une nouvelle conversation
   */
  static async createConversation(conversation: Conversation): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .insert({
          id: conversation.thread_id,
          user_id: conversation.user_id,
          title: conversation.title,
          status: conversation.status
        });

      if (error) {
        console.error('Erreur création conversation:', error);
        return false;
      }

      // Envoi optionnel à l'API externe
      if (API_CONFIG.ENABLE_EXTERNAL_API) {
        this.sendToExternalAPI({
          type: 'conversation_created',
          data: conversation
        });
      }

      return true;
    } catch (err) {
      console.error('Exception création conversation:', err);
      return false;
    }
  }
}

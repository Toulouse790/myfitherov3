// This is the Supabase service implementation
// It provides functions to interact with Supabase for storing conversations and messages
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  thread_id: string;
  user_id: string;
  title: string;
  status: 'active' | 'archived' | 'deleted';
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  message_id: string;
  thread_id: string;
  user_id: string;
  sender: 'user' | 'assistant';
  content: string;
  type_demande?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export class SupabaseService {
  /**
   * Teste la connexion à Supabase
   */
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('health_check').select('*').limit(1);
      if (error) {
        console.error('Erreur de connexion Supabase:', error);
        return false;
      }
      console.log('Connexion Supabase OK:', data);
      return true;
    } catch (err) {
      console.error('Exception connexion Supabase:', err);
      return false;
    }
  }

  /**
   * Récupère les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return this.getMockConversations(userId);
      }

      return data as Conversation[];
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
    
    // Pour l'instant, retourne des données mock
    const mockConversations: Conversation[] = [
      {
        thread_id: `thread_${Date.now()}_mock1`,
        user_id: userId,
        title: 'Conversation sur la nutrition',
        status: 'active',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
        updated_at: new Date().toISOString()
      },
      {
        thread_id: `thread_${Date.now()}_mock2`,
        user_id: userId,
        title: 'Programme d\'entraînement',
        status: 'active',
        created_at: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
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
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur récupération messages:', error);
        return this.getMockMessages(threadId);
      }

      return data as Message[];
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
    
    // Pour l'instant, retourne des données mock
    const mockMessages: Message[] = [
      {
        message_id: `msg_${Date.now()}_mock1`,
        thread_id: threadId,
        user_id: 'user_mock',
        sender: 'user',
        content: 'Bonjour, pouvez-vous me donner des conseils pour améliorer ma nutrition?',
        created_at: new Date(Date.now() - 3600000).toISOString() // Il y a 1 heure
      },
      {
        message_id: `msg_${Date.now()}_mock2`,
        thread_id: threadId,
        user_id: 'user_mock',
        sender: 'assistant',
        content: 'Bien sûr! Pour améliorer votre nutrition, concentrez-vous sur des aliments entiers, non transformés, et variez votre alimentation. Avez-vous des objectifs spécifiques?',
        created_at: new Date(Date.now() - 3500000).toISOString() // Il y a 58 minutes
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
        .from('conversations')
        .insert(conversation);

      if (error) {
        console.error('Erreur création conversation:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception création conversation:', err);
      return false;
    }
  }

  /**
   * Sauvegarde un message dans une conversation
   */
  static async saveMessage(message: Message): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert(message);

      if (error) {
        console.error('Erreur sauvegarde message:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception sauvegarde message:', err);
      return false;
    }
  }

  /**
   * Enregistre une interaction pour les analytics
   */
  static async logInteraction(
    userId: string,
    agentName: string,
    durationSeconds: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interactions')
        .insert({
          user_id: userId,
          agent_name: agentName,
          duration_seconds: durationSeconds,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur log interaction:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception log interaction:', err);
      return false;
    }
  }

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
          .from('conversations')
          .select('thread_id')
          .eq('thread_id', conv.thread_id)
          .single();

        // Si la conversation n'existe pas, la créer
        if (!existingConv) {
          await supabase.from('conversations').insert({
            thread_id: conv.thread_id,
            user_id: userId,
            title: conv.title || `Conversation du ${new Date(conv.created_at).toLocaleDateString()}`,
            status: 'active',
            created_at: conv.created_at,
            updated_at: conv.updated_at
          });
        }

        // Synchroniser les messages
        for (const msg of conv.messages) {
          const { data: existingMsg } = await supabase
            .from('messages')
            .select('message_id')
            .eq('message_id', msg.id)
            .single();

          // Si le message n'existe pas, le créer
          if (!existingMsg) {
            await supabase.from('messages').insert({
              message_id: msg.id,
              thread_id: conv.thread_id,
              user_id: userId,
              sender: msg.sender,
              content: msg.content,
              type_demande: msg.type_demande,
              created_at: msg.timestamp
            });
          }
        }
      }

      return true;
    } catch (err) {
      console.error('Exception synchronisation données:', err);
      return false;
    }
  }
}

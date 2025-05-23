
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
      // Vérifier si l'utilisateur est connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Erreur d\'authentification Supabase:', authError);
        return false;
      }
      
      // Tenter une requête simple sur une table disponible (profiles)
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
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
      // Vérifiez si la table "ai_conversations" existe dans votre base de données
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
        title: conv.content.substring(0, 30) + '...',
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
      // Dans notre cas, nous n'avons qu'une seule ligne dans ai_conversations qui contient
      // à la fois la question (content) et la réponse (response)
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', threadId);

      if (error) {
        console.error('Erreur récupération messages:', error);
        return this.getMockMessages(threadId);
      }

      if (data && data.length > 0) {
        const conversation = data[0];
        // Créer deux messages à partir de la conversation: question et réponse
        const messages: Message[] = [
          {
            message_id: `msg_user_${conversation.id}`,
            thread_id: conversation.id,
            user_id: conversation.user_id,
            sender: 'user',
            content: conversation.content,
            created_at: conversation.created_at
          },
          {
            message_id: `msg_assistant_${conversation.id}`,
            thread_id: conversation.id,
            user_id: conversation.user_id,
            sender: 'assistant',
            content: conversation.response,
            created_at: conversation.created_at
          }
        ];
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
      // Créer une entrée dans la table ai_conversations
      const { error } = await supabase
        .from('ai_conversations')
        .insert({
          id: conversation.thread_id,
          user_id: conversation.user_id,
          content: conversation.title,
          response: "Conversation initiée", // Réponse par défaut
          metadata: { status: conversation.status }
        });

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
      // Pour les messages utilisateur, mettre à jour le contenu de la conversation
      if (message.sender === 'user') {
        const { error } = await supabase
          .from('ai_conversations')
          .update({ 
            content: message.content,
            metadata: { ...message.metadata, type_demande: message.type_demande }
          })
          .eq('id', message.thread_id);
          
        if (error) {
          console.error('Erreur sauvegarde message utilisateur:', error);
          return false;
        }
      } 
      // Pour les messages assistant, mettre à jour la réponse de la conversation
      else if (message.sender === 'assistant') {
        const { error } = await supabase
          .from('ai_conversations')
          .update({ 
            response: message.content,
            metadata: message.metadata
          })
          .eq('id', message.thread_id);
          
        if (error) {
          console.error('Erreur sauvegarde message assistant:', error);
          return false;
        }
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
        .from('ai_training_data')
        .insert({
          user_id: userId,
          model_name: agentName,
          response_time_ms: Math.round(durationSeconds * 1000),
          action_type: 'conversation',
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
          .from('ai_conversations')
          .select('id')
          .eq('id', conv.thread_id)
          .single();

        // Si la conversation n'existe pas, la créer
        if (!existingConv) {
          await supabase.from('ai_conversations').insert({
            id: conv.thread_id,
            user_id: userId,
            content: conv.messages.find((m: any) => m.sender === 'user')?.content || 'Nouvelle conversation',
            response: conv.messages.find((m: any) => m.sender === 'assistant')?.content || '',
            metadata: {
              created_at: conv.created_at,
              updated_at: conv.updated_at
            }
          });
        }
      }

      return true;
    } catch (err) {
      console.error('Exception synchronisation données:', err);
      return false;
    }
  }
}

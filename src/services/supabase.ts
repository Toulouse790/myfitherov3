
// This is the Supabase service implementation
// It provides functions to interact with Supabase for storing conversations and messages

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
    console.log('Test de connexion Supabase (mock)');
    return true;
  }

  /**
   * Récupère les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    console.log(`Récupération des conversations pour l'utilisateur ${userId} (mock)`);
    
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
    console.log(`Récupération des messages pour la conversation ${threadId} (mock)`);
    
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
    console.log('Création d\'une nouvelle conversation (mock)', conversation);
    return true;
  }

  /**
   * Sauvegarde un message dans une conversation
   */
  static async saveMessage(message: Message): Promise<boolean> {
    console.log('Sauvegarde d\'un message (mock)', message);
    return true;
  }

  /**
   * Enregistre une interaction pour les analytics
   */
  static async logInteraction(
    userId: string,
    agentName: string,
    durationSeconds: number
  ): Promise<boolean> {
    console.log(`Log d'interaction: ${userId}, ${agentName}, ${durationSeconds}s (mock)`);
    return true;
  }

  /**
   * Synchronise les données locales avec Supabase
   */
  static async syncLocalData(
    userId: string, 
    localConversations: any[]
  ): Promise<boolean> {
    console.log('Synchronisation des données locales (mock)', { userId, count: localConversations.length });
    return true;
  }
}

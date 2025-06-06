
import { ApiService } from './api';
import { StorageService } from './storage';
import { SupabaseService, User, Conversation, Message } from './supabase/index';

export interface UserInteraction {
  user_id: string;
  type_demande: 'sommeil' | 'nutrition' | 'diagnostic_global' | 'hydratation' | 'mental' | 'exercice' | 'general';
  contenu: string;
  thread_id?: string;
  metadata?: {
    timestamp: string;
    device_info?: string;
    user_context?: Record<string, any>;
  };
}

export interface AIResponse {
  thread_id: string;
  response: string;
  type_reponse: string;
  badges?: string[];
  actions_suggerees?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
  metadata?: {
    agent_utilise: string;
    confiance_score: number;
    duree_traitement: number;
  };
}

export interface ConversationThread {
  thread_id: string;
  user_id: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    type_demande?: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export class AIIntegrationService {
  private static readonly USER_ID_KEY = 'user_id';
  private static readonly CONVERSATIONS_KEY = 'conversations';
  private static readonly SYNC_ENABLED_KEY = 'supabase_sync_enabled';

  /**
   * Vérifie si la synchronisation Supabase est activée
   */
  private static isSyncEnabled(): boolean {
    return StorageService.getItem<boolean>(this.SYNC_ENABLED_KEY, true);
  }

  /**
   * Active/désactive la synchronisation Supabase
   */
  static setSyncEnabled(enabled: boolean) {
    StorageService.setItem(this.SYNC_ENABLED_KEY, enabled);
  }

  /**
   * Génère un UUID simple sans dépendance externe
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Obtient ou génère un ID utilisateur unique
   */
  static getUserId(): string {
    let userId = StorageService.getItem<string>(this.USER_ID_KEY, '');
    
    if (!userId) {
      userId = `user_${Date.now()}_${this.generateUUID().split('-')[0]}`;
      StorageService.setItem(this.USER_ID_KEY, userId);
    }
    
    return userId;
  }

  /**
   * Génère un nouvel ID de thread pour une conversation
   */
  static generateThreadId(): string {
    return `thread_${Date.now()}_${this.generateUUID().split('-')[0]}`;
  }

  /**
   * Détecte le type de demande à partir du contenu
   */
  static detectRequestType(content: string): UserInteraction['type_demande'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('dormir') || lowerContent.includes('sommeil')) {
      return 'sommeil';
    }
    if (lowerContent.includes('manger') || lowerContent.includes('nutrition') || lowerContent.includes('alimentation')) {
      return 'nutrition';
    }
    if (lowerContent.includes('eau') || lowerContent.includes('hydrat')) {
      return 'hydratation';
    }
    if (lowerContent.includes('musculation') || lowerContent.includes('exercice') || lowerContent.includes('entraînement')) {
      return 'exercice';
    }
    if (lowerContent.includes('stress') || lowerContent.includes('mental') || lowerContent.includes('anxiété')) {
      return 'mental';
    }
    
    return 'general';
  }

  /**
   * Envoie une interaction utilisateur vers n8n avec sauvegarde Supabase
   */
  static async sendUserInteraction(
    content: string,
    threadId?: string,
    typeDemande?: UserInteraction['type_demande']
  ): Promise<AIResponse> {
    const userId = this.getUserId();
    const finalThreadId = threadId || this.generateThreadId();
    const finalTypeDemande = typeDemande || this.detectRequestType(content);
    const startTime = Date.now();

    const interaction: UserInteraction = {
      user_id: userId,
      type_demande: finalTypeDemande,
      contenu: content,
      thread_id: finalThreadId,
      metadata: {
        timestamp: new Date().toISOString(),
        device_info: navigator.userAgent,
        user_context: {
          page: window.location.pathname,
          session_id: this.getSessionId(),
        }
      }
    };

    try {
      // 1. Sauvegarder le message utilisateur
      await this.saveMessage(finalThreadId, content, 'user', finalTypeDemande);

      // 2. Envoi vers n8n
      const response = await ApiService.sendToN8n(interaction);
      
      let aiResponse: AIResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'envoi vers n8n');
      }

      // 3. Traitement de la réponse n8n ou fallback
      aiResponse = response.data || {
        thread_id: finalThreadId,
        response: this.generateMockResponse(content, finalTypeDemande),
        type_reponse: finalTypeDemande,
        metadata: {
          agent_utilise: `agent_${finalTypeDemande}`,
          confiance_score: 0.85,
          duree_traitement: (Date.now() - startTime) / 1000
        }
      };

      // 4. Sauvegarder la réponse IA
      await this.saveMessage(finalThreadId, aiResponse.response, 'assistant');

      // 5. Mettre à jour les analytics si Supabase est activé
      if (this.isSyncEnabled() && aiResponse.metadata) {
        await SupabaseService.logInteraction(
          userId, 
          aiResponse.metadata.agent_utilise, 
          aiResponse.metadata.duree_traitement
        );
      }

      return aiResponse;
    } catch (error) {
      console.error('Erreur lors de l\'envoi vers n8n:', error);
      
      // Fallback en cas d'erreur
      const fallbackResponse: AIResponse = {
        thread_id: finalThreadId,
        response: "Je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
        type_reponse: 'error',
        metadata: {
          agent_utilise: 'fallback',
          confiance_score: 0,
          duree_traitement: (Date.now() - startTime) / 1000
        }
      };

      // Sauvegarder même la réponse d'erreur
      await this.saveMessage(finalThreadId, fallbackResponse.response, 'assistant');

      return fallbackResponse;
    }
  }

  /**
   * Sauvegarde un message (local + Supabase si activé)
   */
  private static async saveMessage(
    threadId: string,
    content: string,
    sender: 'user' | 'assistant',
    typeDemande?: string
  ) {
    const userId = this.getUserId();
    const messageId = `msg_${Date.now()}_${this.generateUUID().split('-')[0]}`;
    const timestamp = new Date();

    // 1. Sauvegarde locale (toujours)
    this.saveConversationMessageLocal(threadId, content, sender, typeDemande, messageId, timestamp);

    // 2. Sauvegarde Supabase (si activée et connexion disponible)
    if (this.isSyncEnabled()) {
      try {
        // Créer la conversation si elle n'existe pas
        const conversations = await SupabaseService.getUserConversations(userId);
        const existingConv = conversations.find(conv => conv.id === threadId);
        
        if (!existingConv) {
          // Utiliser la signature correcte de createConversation avec userId et title
          await SupabaseService.createConversation(
            userId,
            sender === 'user' ? content.substring(0, 50) + '...' : 'Nouvelle conversation'
          );
        }

        // Sauvegarder le message
        await SupabaseService.saveMessage({
          message_id: messageId,
          thread_id: threadId,
          user_id: userId,
          sender,
          content,
          type_demande: typeDemande,
          metadata: {
            timestamp: timestamp.toISOString(),
            device_info: navigator.userAgent
          }
        });

      } catch (error) {
        console.warn('Erreur lors de la sauvegarde Supabase (mode dégradé):', error);
        // Continue en mode local seulement
      }
    }
  }

  /**
   * Sauvegarde locale des messages (backup)
   */
  private static saveConversationMessageLocal(
    threadId: string,
    content: string,
    sender: 'user' | 'assistant',
    typeDemande?: string,
    messageId?: string,
    timestamp?: Date
  ) {
    const conversations = this.getConversationsLocal();
    const userId = this.getUserId();
    
    let conversation = conversations.find(conv => conv.thread_id === threadId);
    
    if (!conversation) {
      conversation = {
        thread_id: threadId,
        user_id: userId,
        messages: [],
        created_at: timestamp || new Date(),
        updated_at: timestamp || new Date()
      };
      conversations.push(conversation);
    }

    const finalMessageId = messageId || `msg_${Date.now()}_${this.generateUUID().split('-')[0]}`;
    
    conversation.messages.push({
      id: finalMessageId,
      content,
      sender,
      timestamp: timestamp || new Date(),
      type_demande: typeDemande
    });

    conversation.updated_at = timestamp || new Date();
    
    StorageService.setItem(this.CONVERSATIONS_KEY, conversations);
  }

  /**
   * Récupère les conversations (Supabase en priorité, local en fallback)
   */
  static async getConversations(): Promise<ConversationThread[]> {
    if (this.isSyncEnabled()) {
      try {
        const userId = this.getUserId();
        const supabaseConversations = await SupabaseService.getUserConversations(userId);
        
        // Convertir les conversations Supabase au format local
        const conversations: ConversationThread[] = [];
        
        for (const conv of supabaseConversations) {
          const messages = await SupabaseService.getConversationMessages(conv.id);
          
          conversations.push({
            thread_id: conv.id, // Utiliser conv.id au lieu de conv.thread_id
            user_id: conv.user_id,
            messages: messages.map(msg => ({
              id: msg.message_id,
              content: msg.content,
              sender: msg.sender,
              timestamp: new Date(msg.created_at || ''),
              type_demande: msg.type_demande
            })),
            created_at: new Date(conv.created_at || ''),
            updated_at: new Date(conv.last_message_at || conv.created_at || '') // Utiliser last_message_at au lieu de updated_at
          });
        }
        
        return conversations;
      } catch (error) {
        console.warn('Erreur Supabase, utilisation du stockage local:', error);
      }
    }
    
    // Fallback : conversations locales
    return this.getConversationsLocal();
  }

  /**
   * Récupère les conversations locales
   */
  private static getConversationsLocal(): ConversationThread[] {
    return StorageService.getItem<ConversationThread[]>(this.CONVERSATIONS_KEY, []);
  }

  /**
   * Récupère une conversation spécifique
   */
  static async getConversation(threadId: string): Promise<ConversationThread | null> {
    const conversations = await this.getConversations();
    return conversations.find(conv => conv.thread_id === threadId) || null;
  }

  /**
   * Synchronise les données locales avec Supabase
   */
  static async syncWithSupabase(): Promise<boolean> {
    if (!this.isSyncEnabled()) return false;

    try {
      const userId = this.getUserId();
      const localConversations = this.getConversationsLocal();
      
      console.log('🔄 Synchronisation des données avec Supabase...');
      
      const success = await SupabaseService.syncLocalData(userId, localConversations);
      
      if (success) {
        console.log('✅ Synchronisation réussie');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      return false;
    }
  }

  /**
   * Test de connexion Supabase
   */
  static async testSupabaseConnection(): Promise<boolean> {
    return await SupabaseService.testConnection();
  }

  /**
   * Génère un ID de session
   */
  private static getSessionId(): string {
    const sessionKey = 'session_id';
    let sessionId = sessionStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${this.generateUUID().split('-')[0]}`;
      sessionStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
  }

  /**
   * Génère une réponse mock en attendant l'intégration complète
   */
  private static generateMockResponse(content: string, typeDemande: string): string {
    const responses = {
      sommeil: "Pour améliorer votre sommeil, je recommande de maintenir un horaire régulier et de créer un environnement propice au repos. Voulez-vous que je vous propose un plan de sommeil personnalisé ?",
      nutrition: "Pour optimiser votre nutrition, il est important de respecter vos besoins caloriques et en macronutriments. Puis-je vous aider à créer un plan alimentaire adapté à vos objectifs ?",
      exercice: "Pour votre entraînement, il est essentiel d'adapter l'intensité et la fréquence à votre niveau. Souhaitez-vous que je vous propose un programme personnalisé ?",
      hydratation: "L'hydratation est cruciale pour vos performances. Je recommande de boire environ 35ml d'eau par kg de poids corporel par jour. Voulez-vous des conseils pour optimiser votre hydratation ?",
      mental: "La gestion du stress et le bien-être mental sont essentiels pour votre équilibre global. Puis-je vous suggérer des techniques de relaxation et de gestion du stress ?",
      general: "Merci pour votre question. Je suis là pour vous aider avec tous les aspects de votre programme de fitness et bien-être. Pouvez-vous me préciser quel domaine vous intéresse le plus ?"
    };
    
    return responses[typeDemande as keyof typeof responses] || responses.general;
  }
}

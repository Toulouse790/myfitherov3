
import { ApiService } from './api';
import { StorageService } from './storage';

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
   * Envoie une interaction utilisateur vers n8n
   */
  static async sendUserInteraction(
    content: string,
    threadId?: string,
    typeDemande?: UserInteraction['type_demande']
  ): Promise<AIResponse> {
    const userId = this.getUserId();
    const finalThreadId = threadId || this.generateThreadId();
    const finalTypeDemande = typeDemande || this.detectRequestType(content);

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
      // Envoi vers n8n via l'API
      const response = await ApiService.sendToN8n(interaction);
      
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'envoi vers n8n');
      }

      // Simulation de réponse si n8n ne répond pas encore (en attendant l'intégration complète)
      const aiResponse: AIResponse = response.data || {
        thread_id: finalThreadId,
        response: this.generateMockResponse(content, finalTypeDemande),
        type_reponse: finalTypeDemande,
        metadata: {
          agent_utilise: `agent_${finalTypeDemande}`,
          confiance_score: 0.85,
          duree_traitement: 1.2
        }
      };

      // Sauvegarder la conversation
      this.saveConversationMessage(finalThreadId, content, 'user', finalTypeDemande);
      this.saveConversationMessage(finalThreadId, aiResponse.response, 'assistant');

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
          duree_traitement: 0
        }
      };

      return fallbackResponse;
    }
  }

  /**
   * Récupère les conversations de l'utilisateur
   */
  static getConversations(): ConversationThread[] {
    return StorageService.getItem<ConversationThread[]>(this.CONVERSATIONS_KEY, []);
  }

  /**
   * Récupère une conversation spécifique
   */
  static getConversation(threadId: string): ConversationThread | null {
    const conversations = this.getConversations();
    return conversations.find(conv => conv.thread_id === threadId) || null;
  }

  /**
   * Sauvegarde un message dans une conversation
   */
  private static saveConversationMessage(
    threadId: string,
    content: string,
    sender: 'user' | 'assistant',
    typeDemande?: string
  ) {
    const conversations = this.getConversations();
    const userId = this.getUserId();
    
    let conversation = conversations.find(conv => conv.thread_id === threadId);
    
    if (!conversation) {
      conversation = {
        thread_id: threadId,
        user_id: userId,
        messages: [],
        created_at: new Date(),
        updated_at: new Date()
      };
      conversations.push(conversation);
    }

    const messageId = `msg_${Date.now()}_${this.generateUUID().split('-')[0]}`;
    
    conversation.messages.push({
      id: messageId,
      content,
      sender,
      timestamp: new Date(),
      type_demande: typeDemande
    });

    conversation.updated_at = new Date();
    
    StorageService.setItem(this.CONVERSATIONS_KEY, conversations);
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

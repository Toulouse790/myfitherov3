
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from './api';
import { StorageService } from './storage';
import { ChatMessage } from './ai';

const STORAGE_KEY = 'ai_conversations';

export interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messages: ChatMessage[];
}

export class AIIntegrationService {
  /**
   * Génère un nouvel identifiant de thread
   */
  static generateThreadId(): string {
    return uuidv4();
  }

  /**
   * Récupère toutes les conversations
   */
  static getConversations(): ConversationThread[] {
    return StorageService.getItem<ConversationThread[]>(STORAGE_KEY) || [];
  }

  /**
   * Récupère une conversation par son ID
   */
  static getConversation(threadId: string): ConversationThread | undefined {
    const conversations = this.getConversations();
    return conversations.find((c) => c.id === threadId);
  }

  /**
   * Met à jour la liste des threads avec le nouveau message
   */
  private static updateThreadsList(threadId: string, lastMessage: string): void {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex((c) => c.id === threadId);
    
    if (conversationIndex >= 0) {
      // Mettre à jour une conversation existante
      conversations[conversationIndex].lastMessage = lastMessage;
      conversations[conversationIndex].updatedAt = new Date();
    } else {
      // Créer une nouvelle conversation
      conversations.push({
        id: threadId,
        title: lastMessage.slice(0, 40) + (lastMessage.length > 40 ? '...' : ''),
        lastMessage,
        updatedAt: new Date(),
        messages: []
      });
    }
    
    // Trier par date de mise à jour
    conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    StorageService.setItem(STORAGE_KEY, conversations);
  }

  /**
   * Envoie une interaction utilisateur à l'IA et met à jour les messages locaux
   */
  static async sendUserInteraction(message: string, threadId: string, type?: string): Promise<any> {
    // Mettre à jour la liste des threads
    this.updateThreadsList(threadId, message);
    
    // Ajouter le message de l'utilisateur à la conversation
    const userMessage: ChatMessage = {
      id: `${threadId}_${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    this.saveMessageToThread(threadId, userMessage);
    
    try {
      // Envoyer le message à n8n
      const response = await ApiService.sendToN8n({
        message,
        thread_id: threadId,
        interaction_type: type || 'chat'
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Échec de l\'envoi à l\'IA');
      }
      
      const aiResponse = response.data;
      
      // Ajouter la réponse de l'IA à la conversation
      const aiMessage: ChatMessage = {
        id: `${threadId}_${Date.now()}_ai`,
        content: aiResponse.message || '',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      this.saveMessageToThread(threadId, aiMessage);
      
      // Mettre à jour le résumé du thread avec la réponse de l'IA
      this.updateThreadsList(threadId, aiMessage.content);
      
      return aiResponse;
    } catch (error) {
      console.error('Erreur lors de l\'envoi à l\'IA:', error);
      throw error;
    }
  }
  
  /**
   * Sauvegarde un message dans un thread
   */
  private static saveMessageToThread(threadId: string, message: ChatMessage): void {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex((c) => c.id === threadId);
    
    if (conversationIndex >= 0) {
      // Ajouter à une conversation existante
      conversations[conversationIndex].messages.push(message);
    } else {
      // Créer une nouvelle conversation
      conversations.push({
        id: threadId,
        title: message.content.slice(0, 40) + (message.content.length > 40 ? '...' : ''),
        lastMessage: message.content,
        updatedAt: new Date(),
        messages: [message]
      });
    }
    
    StorageService.setItem(STORAGE_KEY, conversations);
  }
}

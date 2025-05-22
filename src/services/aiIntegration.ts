
import { ApiService } from './api';
import { AIService, ChatMessage } from './ai';
import { StorageService } from './storage';

const STORAGE_KEY_PREFIX = 'ai_thread_';
const THREADS_LIST_KEY = 'ai_threads';

export interface AIResponse {
  response: string;
  thread_id: string;
}

export interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export class AIIntegrationService {
  /**
   * Génère un identifiant unique pour un fil de conversation
   */
  static generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Envoie une interaction utilisateur à l'API
   */
  static async sendUserInteraction(
    message: string,
    threadId: string,
    typeDemande?: string
  ): Promise<AIResponse> {
    try {
      // Récupérer l'historique du thread si disponible
      const conversation = this.getConversation(threadId);
      const history = conversation ? conversation.messages : [];

      // Utiliser le service AI existant pour obtenir la réponse
      const aiMessage = await AIService.getChatResponse(message, history);

      // Créer le message utilisateur
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };

      // Sauvegarder la conversation
      this.saveMessage(threadId, userMessage);
      this.saveMessage(threadId, aiMessage);

      // Mettre à jour la liste des threads
      this.updateThreadsList(threadId, message);

      return {
        response: aiMessage.content,
        thread_id: threadId
      };
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  /**
   * Récupère une conversation par son identifiant
   */
  static getConversation(threadId: string): ConversationThread | null {
    const storageKey = `${STORAGE_KEY_PREFIX}${threadId}`;
    const threadData = StorageService.getItem<{
      title: string;
      lastMessage: string;
      timestamp: string;
      messages: ChatMessage[];
    }>(storageKey);

    if (!threadData) return null;

    return {
      id: threadId,
      title: threadData.title || "Nouvelle conversation",
      lastMessage: threadData.lastMessage || "",
      timestamp: new Date(threadData.timestamp),
      messages: threadData.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  }

  /**
   * Récupère toutes les conversations
   */
  static getConversations(): ConversationThread[] {
    const threadsList = StorageService.getItem<{
      id: string;
      title: string;
      lastMessage: string;
      timestamp: string;
    }[]>(THREADS_LIST_KEY, []);

    return threadsList.map(thread => ({
      ...thread,
      timestamp: new Date(thread.timestamp),
      messages: this.getConversation(thread.id)?.messages || []
    }));
  }

  /**
   * Sauvegarde un message dans une conversation
   */
  private static saveMessage(threadId: string, message: ChatMessage): void {
    const storageKey = `${STORAGE_KEY_PREFIX}${threadId}`;
    const existingData = StorageService.getItem<{
      title: string;
      lastMessage: string;
      timestamp: string;
      messages: ChatMessage[];
    }>(storageKey, {
      title: "Nouvelle conversation",
      lastMessage: "",
      timestamp: new Date().toISOString(),
      messages: []
    });

    // Ajouter le nouveau message
    const updatedData = {
      ...existingData,
      lastMessage: message.content.substring(0, 50) + (message.content.length > 50 ? "..." : ""),
      timestamp: new Date().toISOString(),
      messages: [...existingData.messages, message]
    };

    // Si c'est le premier message utilisateur, extraire un titre
    if (existingData.title === "Nouvelle conversation" && message.sender === 'user') {
      updatedData.title = message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "");
    }

    StorageService.setItem(storageKey, updatedData);
  }

  /**
   * Met à jour la liste des threads de conversation
   */
  private static updateThreadsList(threadId: string, lastMessage: string): void {
    const threadsList = StorageService.getItem<{
      id: string;
      title: string;
      lastMessage: string;
      timestamp: string;
    }[]>(THREADS_LIST_KEY, []);

    const threadIndex = threadsList.findIndex(t => t.id === threadId);
    const conversation = this.getConversation(threadId);

    if (!conversation) return;

    const threadInfo = {
      id: threadId,
      title: conversation.title,
      lastMessage: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? "..." : ""),
      timestamp: new Date().toISOString()
    };

    if (threadIndex >= 0) {
      // Mettre à jour un thread existant
      threadsList[threadIndex] = threadInfo;
    } else {
      // Ajouter un nouveau thread
      threadsList.push(threadInfo);
    }

    // Trier par date décroissante
    threadsList.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    StorageService.setItem(THREADS_LIST_KEY, threadsList);
  }
}

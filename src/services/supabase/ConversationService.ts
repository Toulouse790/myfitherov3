
import { ConversationQueries } from './ConversationQueries';
import { ConversationMutations } from './ConversationMutations';
import { MessageQueries } from './MessageQueries';
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

interface SimpleAgent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
}

export class ConversationService {
  /**
   * Récupère ou crée une conversation pour un utilisateur avec un agent spécifique
   */
  static async getOrCreateConversation(userId: string, agentSlugOrName?: string): Promise<string | null> {
    try {
      let agentId: string | undefined;
      let agentName = 'Assistant';

      // Si un agent est spécifié, essayer de le trouver
      if (agentSlugOrName) {
        const agent = await ConversationQueries.findAgent(agentSlugOrName);
        if (agent) {
          agentId = agent.id;
          agentName = agent.name;
        }
      }

      // Chercher une conversation existante
      const existingConversationId = await ConversationQueries.findExistingConversation(userId, agentId);
      if (existingConversationId) {
        return existingConversationId;
      }

      // Création d'une nouvelle conversation
      return await ConversationMutations.createConversation(
        userId,
        `Conversation avec ${agentName}`,
        agentId
      );
    } catch (err) {
      console.error('Exception gestion conversation:', err);
      return null;
    }
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<SimpleConversation[]> {
    return ConversationQueries.getUserConversations(userId);
  }

  /**
   * Crée une nouvelle conversation avec un agent
   */
  static async createConversation(userId: string, title: string, agentSlug?: string): Promise<string | null> {
    try {
      let agentId: string | undefined;

      // Si un slug d'agent est fourni, récupérer son ID
      if (agentSlug) {
        const agent = await ConversationQueries.findAgent(agentSlug);
        if (agent) {
          agentId = agent.id;
        }
      }

      return await ConversationMutations.createConversation(userId, title, agentId);
    } catch (err) {
      console.error('Exception création conversation:', err);
      return null;
    }
  }

  /**
   * Récupère les messages d'une conversation
   */
  static async getMessages(conversationId: string): Promise<Message[]> {
    return MessageQueries.getMessages(conversationId);
  }

  /**
   * Alias pour getMessages pour compatibilité
   */
  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    return MessageQueries.getMessages(conversationId);
  }

  /**
   * Récupère les agents disponibles
   */
  static async getAvailableAgents(): Promise<SimpleAgent[]> {
    return ConversationQueries.getAvailableAgents();
  }

  /**
   * Supprime une conversation et tous ses messages
   */
  static async deleteConversation(conversationId: string): Promise<boolean> {
    return ConversationMutations.deleteConversation(conversationId);
  }
}

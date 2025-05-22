
import { useState, useCallback, useEffect } from 'react';
import { AIIntegrationService, ConversationThread } from '@/services/aiIntegration';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type_demande?: string;
}

export const useAIChat = (threadId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string>(
    threadId || AIIntegrationService.generateThreadId()
  );

  // Charger la conversation existante au montage
  useEffect(() => {
    const loadConversation = async () => {
      if (currentThreadId) {
        const conversation = await AIIntegrationService.getConversation(currentThreadId);
        if (conversation) {
          setMessages(conversation.messages as ChatMessage[]);
        }
      }
    };
    
    loadConversation();
  }, [currentThreadId]);

  /**
   * Envoie un message à l'IA
   */
  const sendMessage = useCallback(async (content: string, typeDemande?: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Envoyer vers l'IA via le service d'intégration
      const aiResponse = await AIIntegrationService.sendUserInteraction(
        content.trim(),
        currentThreadId,
        typeDemande as any
      );

      // Récupérer les messages mis à jour
      const conversation = await AIIntegrationService.getConversation(currentThreadId);
      if (conversation) {
        setMessages(conversation.messages as ChatMessage[]);
      }

      // Mettre à jour le thread ID si nécessaire
      if (aiResponse.thread_id !== currentThreadId) {
        setCurrentThreadId(aiResponse.thread_id);
      }

      return aiResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Ajouter un message d'erreur localement (pas sauvegardé dans le thread)
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        content: `Désolé, une erreur s'est produite : ${errorMessage}`,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentThreadId]);

  /**
   * Démarre une nouvelle conversation
   */
  const startNewConversation = useCallback(() => {
    const newThreadId = AIIntegrationService.generateThreadId();
    setCurrentThreadId(newThreadId);
    setMessages([]);
    setError(null);
    
    return newThreadId;
  }, []);

  /**
   * Charge une conversation existante
   */
  const loadConversation = useCallback(async (threadId: string) => {
    const conversation = await AIIntegrationService.getConversation(threadId);
    if (conversation) {
      setCurrentThreadId(threadId);
      setMessages(conversation.messages as ChatMessage[]);
      setError(null);
    }
  }, []);

  /**
   * Récupère toutes les conversations de l'utilisateur
   */
  const getAllConversations = useCallback(async (): Promise<ConversationThread[]> => {
    return await AIIntegrationService.getConversations();
  }, []);

  /**
   * Efface l'erreur actuelle
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Régénère la dernière réponse de l'IA
   */
  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(msg => msg.sender === 'user');
    if (!lastUserMessage) return;

    // Supprimer la dernière réponse de l'IA
    setMessages(prev => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      if (newMessages[lastIndex]?.sender === 'assistant') {
        newMessages.pop();
      }
      return newMessages;
    });

    // Renvoyer le message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    loading,
    error,
    currentThreadId,
    sendMessage,
    startNewConversation,
    loadConversation,
    getAllConversations,
    clearError,
    regenerateLastResponse
  };
};

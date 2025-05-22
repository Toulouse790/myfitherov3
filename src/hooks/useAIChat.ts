
import { useState, useCallback, useEffect } from 'react';
import { AIIntegrationService, ConversationThread } from '@/services/aiIntegration';
import { ChatMessage } from '@/services/ai';

export type { ChatMessage };

export const useAIChat = (threadId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string>(
    threadId || AIIntegrationService.generateThreadId()
  );

  // Charger la conversation existante au montage
  useEffect(() => {
    if (currentThreadId) {
      const conversation = AIIntegrationService.getConversation(currentThreadId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    }
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
        typeDemande
      );

      // Récupérer les messages mis à jour
      const conversation = AIIntegrationService.getConversation(currentThreadId);
      if (conversation) {
        setMessages(conversation.messages);
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
  const loadConversation = useCallback((threadId: string) => {
    const conversation = AIIntegrationService.getConversation(threadId);
    if (conversation) {
      setCurrentThreadId(threadId);
      setMessages(conversation.messages);
      setError(null);
    }
  }, []);

  /**
   * Récupère toutes les conversations de l'utilisateur
   */
  const getAllConversations = useCallback((): ConversationThread[] => {
    return AIIntegrationService.getConversations();
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

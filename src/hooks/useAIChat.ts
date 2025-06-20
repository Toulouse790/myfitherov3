
import { useState, useCallback } from 'react';
import { AIIntegrationService, type Conversation, type Message } from '@/services/aiIntegration';

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useAIChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);

  const generateThreadId = useCallback(async () => {
    return await AIIntegrationService.generateThreadId();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const conversation = await AIIntegrationService.getConversation(id);
      if (conversation) {
        setCurrentConversationId(id);
        const history = await AIIntegrationService.getConversationHistory(id);
        const formattedMessages: AIMessage[] = history.map(msg => ({
          id: msg.id || '',
          content: msg.message || '',
          role: (msg.type_demande as 'user' | 'assistant') || 'user',
          timestamp: new Date(msg.horodatage || Date.now())
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Erreur lors du chargement de la conversation');
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      let conversationIdToUse = currentConversationId;
      
      if (!conversationIdToUse) {
        conversationIdToUse = await generateThreadId();
        setCurrentConversationId(conversationIdToUse);
      }

      // Add user message
      const userMessage: AIMessage = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      const response = await AIIntegrationService.sendUserInteraction(content, conversationIdToUse);

      // Mock AI response
      const aiResponse: AIMessage = {
        id: crypto.randomUUID(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      await AIIntegrationService.addMessage(conversationIdToUse, aiResponse.content, 'assistant');

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, generateThreadId]);

  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;
    
    setIsLoading(true);
    try {
      // Remove last assistant message and regenerate
      const newMessages = messages.slice(0, -1);
      setMessages(newMessages);
      
      const lastUserMessage = newMessages[newMessages.length - 1];
      if (lastUserMessage && lastUserMessage.role === 'user') {
        await sendMessage(lastUserMessage.content);
      }
    } catch (error) {
      console.error('Error regenerating response:', error);
      setError('Erreur lors de la régénération');
    } finally {
      setIsLoading(false);
    }
  }, [messages, sendMessage]);

  const startNewConversation = useCallback(async () => {
    const newThreadId = await generateThreadId();
    setCurrentConversationId(newThreadId);
    setMessages([]);
    setError(null);
  }, [generateThreadId]);

  const getConversationHistory = useCallback(async (id: string) => {
    try {
      const conversation = await AIIntegrationService.getConversation(id);
      return conversation;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return null;
    }
  }, []);

  const getAllConversations = useCallback(async (userId: string) => {
    try {
      return await AIIntegrationService.getConversations(userId);
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentConversationId,
    sendMessage,
    loadConversation,
    startNewConversation,
    getConversationHistory,
    getAllConversations,
    clearError,
    regenerateLastResponse
  };
};

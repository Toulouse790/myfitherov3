
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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);

  const generateThreadId = useCallback(async () => {
    return await AIIntegrationService.generateThreadId();
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
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
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

      await AIIntegrationService.sendUserInteraction({
        conversationId: conversationIdToUse,
        message: content,
        role: 'user'
      });

      // Mock AI response
      const aiResponse: AIMessage = {
        id: crypto.randomUUID(),
        content: 'Merci pour votre message. Je suis là pour vous aider avec vos objectifs de fitness.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      await AIIntegrationService.addMessage(conversationIdToUse, aiResponse.content, 'assistant');

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, generateThreadId]);

  const startNewConversation = useCallback(async () => {
    const newThreadId = await generateThreadId();
    setCurrentConversationId(newThreadId);
    setMessages([]);
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
    currentConversationId,
    sendMessage,
    loadConversation,
    startNewConversation,
    getConversationHistory,
    getAllConversations
  };
};

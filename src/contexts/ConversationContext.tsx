
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ConversationContextType {
  currentInput: string;
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  conversations: Record<string, Message[]>;
  addMessage: (conversationId: string, message: Message) => void;
  clearConversation: (conversationId: string) => void;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [currentInput, setCurrentInput] = useState<string>('');

  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message]
    }));
  };

  const clearConversation = (conversationId: string) => {
    setConversations(prev => {
      const newConversations = { ...prev };
      delete newConversations[conversationId];
      return newConversations;
    });
  };

  return (
    <ConversationContext.Provider
      value={{
        currentInput,
        setCurrentInput,
        conversations,
        addMessage,
        clearConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mic, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useConversation } from '@/contexts/ConversationContext';
import { useAIChat, AIMessage } from '@/hooks/useAIChat';

const AIChat: React.FC = () => {
  const { currentInput, setCurrentInput } = useConversation();
  const { messages, isLoading, sendMessage } = useAIChat();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim()) return;
    
    try {
      await sendMessage(currentInput);
      setCurrentInput('');
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir une réponse de l'assistant pour le moment."
      });
    }
  }, [currentInput, sendMessage, setCurrentInput, toast]);
  
  const handleVoiceInput = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La reconnaissance vocale sera disponible prochainement."
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2" size={20} />
          Coach IA MyFitHero
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
              <div className="flex space-x-1">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-75">●</span>
                <span className="animate-pulse delay-150">●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleVoiceInput}
            aria-label="Utiliser la voix"
          >
            <Mic size={20} />
          </Button>
          <Input
            placeholder="Posez une question à votre coach..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentInput.trim() || isLoading}
            aria-label="Envoyer"
          >
            <Send size={20} />
            <span className="sr-only">Envoyer</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;

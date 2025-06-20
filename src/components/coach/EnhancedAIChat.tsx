
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mic, MessageSquare, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAIChat } from '@/hooks/useAIChat';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnhancedAIChatProps {
  threadId?: string;
  autoWelcome?: boolean;
  className?: string;
  title?: string;
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({ 
  threadId, 
  autoWelcome = true, 
  className,
  title = "Coach IA MyFitHero"
}) => {
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearError,
    regenerateLastResponse
  } = useAIChat(threadId);
  
  // Afficher un message de bienvenue si pas de messages
  useEffect(() => {
    const hasMessages = messages.length > 0;
    if (!hasMessages && autoWelcome) {
      // Ajouter un message de bienvenue simulé
      setInputValue('Bonjour');
      handleSendMessage();
    }
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    try {
      const message = inputValue;
      setInputValue('');
      await sendMessage(message);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };
  
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
  
  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Card className={cn("flex flex-col h-[600px] max-h-[80vh]", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2" size={20} />
          {title}
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal underline ml-2"
                onClick={clearError}
              >
                Effacer
              </Button>
            </AlertDescription>
          </Alert>
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
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={regenerateLastResponse}
              disabled={isLoading}
              aria-label="Regénérer la réponse"
            >
              <RotateCcw size={18} />
            </Button>
          )}
          <Input
            placeholder="Posez une question à votre coach..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
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

export default EnhancedAIChat;

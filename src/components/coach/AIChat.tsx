
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mic, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AIService, ChatMessage } from '@/services/ai';
import { StorageService } from '@/services/storage';

const STORAGE_KEY = 'chatHistory';
const MAX_SAVED_MESSAGES = 50;

const AIChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Charger l'historique des messages au démarrage
  useEffect(() => {
    const savedMessages = StorageService.getItem<ChatMessage[]>(STORAGE_KEY, []);
    
    // Ensure all timestamps are proper Date objects
    const parsedMessages = savedMessages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
    }));
    
    if (parsedMessages.length === 0) {
      // Message de bienvenue par défaut
      setMessages([{
        id: '1',
        content: 'Bonjour, je suis votre coach personnel MyFitHero. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'assistant',
        timestamp: new Date(),
      }]);
    } else {
      setMessages(parsedMessages);
    }
  }, []);
  
  // Enregistrer les messages mis à jour
  useEffect(() => {
    if (messages.length > 0) {
      // Ne sauvegarder que les X derniers messages pour éviter de surcharger le localStorage
      const limitedHistory = messages.slice(-MAX_SAVED_MESSAGES);
      StorageService.setItem(STORAGE_KEY, limitedHistory);
    }
  }, [messages]);
  
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Obtenir la réponse de l'IA (avec l'historique pour le contexte)
      const aiResponse = await AIService.getChatResponse(
        inputValue, 
        messages.slice(-10) // Limiter au contexte récent pour performances
      );
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir une réponse de l'assistant pour le moment."
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, messages, toast]);
  
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
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.sender === 'user'
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
        {isProcessing && (
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isProcessing}
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

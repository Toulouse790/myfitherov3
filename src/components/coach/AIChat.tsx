
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mic, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, je suis votre coach personnel MyFitHero. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Predefined responses based on keywords
      let response = '';
      const input = inputValue.toLowerCase();
      
      if (input.includes('bonjour') || input.includes('salut')) {
        response = "Bonjour ! Comment puis-je vous aider avec votre entraînement aujourd'hui ?";
      } else if (input.includes('musculation') || input.includes('exercice')) {
        response = "Pour progresser en musculation, la constance est clé. Je recommande 3-4 séances par semaine avec une attention particulière à votre technique et à la récupération. Souhaitez-vous un plan d'entraînement personnalisé ?";
      } else if (input.includes('nutrition') || input.includes('alimentation') || input.includes('manger')) {
        response = "Une bonne nutrition est essentielle pour atteindre vos objectifs. Pour la prise de masse, visez un surplus calorique d'environ 10-15% avec 1.6-2g de protéines par kg de poids corporel par jour.";
      } else if (input.includes('dormir') || input.includes('sommeil')) {
        response = "Le sommeil est crucial pour la récupération musculaire et vos performances. Visez 7-9h de sommeil par nuit et établissez une routine régulière pour optimiser votre récupération.";
      } else {
        response = "Merci pour votre message. Pour vous aider efficacement, pourriez-vous me préciser si votre question concerne l'entraînement, la nutrition, la récupération ou un autre aspect de votre programme ?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };
  
  const handleVoiceInput = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La reconnaissance vocale sera disponible prochainement.",
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

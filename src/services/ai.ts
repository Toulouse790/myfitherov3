
import { ApiService } from './api';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AIResponse {
  content: string;
}

export class AIService {
  // Utilise un mock en dev, OpenAI en prod
  static async getChatResponse(
    message: string, 
    history: ChatMessage[] = []
  ): Promise<ChatMessage> {
    // Version dev - réponses prédéfinies
    if (import.meta.env.DEV) {
      return this.getMockResponse(message);
    }
    
    // Version prod - OpenAI
    try {
      const response = await ApiService.request<AIResponse>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          history: history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get AI response');
      }

      return {
        id: Date.now().toString(),
        content: response.data.content,
        sender: 'assistant',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('AI service error:', error);
      
      // Fallback à une réponse générique en cas d'échec
      return {
        id: Date.now().toString(),
        content: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.",
        sender: 'assistant',
        timestamp: new Date(),
      };
    }
  }

  private static getMockResponse(message: string): ChatMessage {
    const input = message.toLowerCase();
    let content = '';
    
    if (input.includes('bonjour') || input.includes('salut')) {
      content = "Bonjour ! Comment puis-je vous aider avec votre entraînement aujourd'hui ?";
    } else if (input.includes('musculation') || input.includes('exercice')) {
      content = "Pour progresser en musculation, la constance est clé. Je recommande 3-4 séances par semaine avec une attention particulière à votre technique et à la récupération. Souhaitez-vous un plan d'entraînement personnalisé ?";
    } else if (input.includes('nutrition') || input.includes('alimentation') || input.includes('manger')) {
      content = "Une bonne nutrition est essentielle pour atteindre vos objectifs. Pour la prise de masse, visez un surplus calorique d'environ 10-15% avec 1.6-2g de protéines par kg de poids corporel par jour.";
    } else if (input.includes('dormir') || input.includes('sommeil')) {
      content = "Le sommeil est crucial pour la récupération musculaire et vos performances. Visez 7-9h de sommeil par nuit et établissez une routine régulière pour optimiser votre récupération.";
    } else {
      content = "Merci pour votre message. Pour vous aider efficacement, pourriez-vous me préciser si votre question concerne l'entraînement, la nutrition, la récupération ou un autre aspect de votre programme ?";
    }
    
    return {
      id: Date.now().toString(),
      content,
      sender: 'assistant',
      timestamp: new Date(),
    };
  }
}

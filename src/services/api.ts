
import { toast } from "@/components/ui/sonner";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class ApiService {
  private static baseUrl = import.meta.env.DEV 
    ? '/api' 
    : 'https://myfithero.app/api';

  public static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Affichage d'un toast uniquement en production pour éviter le spam en dev
      if (!import.meta.env.DEV) {
        toast.error("Une erreur est survenue", {
          description: "Veuillez réessayer plus tard"
        });
      }
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envoie des données vers n8n avec la structure attendue
   * @param data Données à envoyer (UserInteraction)
   */
  static async sendToN8n(data: any): Promise<ApiResponse<any>> {
    console.log('📤 Envoi vers n8n:', data);
    
    return this.request('/send-to-n8n', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Teste la connexion avec un webhook n8n
   * @param webhookUrl URL du webhook à tester
   * @param testData Données de test
   */
  static async testWebhook(webhookUrl: string, testData: any): Promise<ApiResponse<any>> {
    return this.request('/test-webhook', {
      method: 'POST',
      body: JSON.stringify({
        webhookUrl,
        ...testData
      }),
    });
  }

  /**
   * Récupère la configuration n8n depuis l'admin
   */
  static async getN8nConfig(): Promise<ApiResponse<{ url: string; status: string }>> {
    return this.request('/admin/config/n8n', {
      method: 'GET',
    });
  }
}

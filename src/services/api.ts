
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
      
      // Affichage d'un toast uniquement en production
      if (!import.meta.env.DEV) {
        toast("Une erreur est survenue", {
          description: "Veuillez réessayer plus tard"
        });
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async sendToN8n(data: any): Promise<ApiResponse<any>> {
    return this.request('/send-to-n8n', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async testWebhook(webhookUrl: string, testData: any): Promise<ApiResponse<any>> {
    return this.request('/test-webhook', {
      method: 'POST',
      body: JSON.stringify({
        webhookUrl,
        ...testData
      }),
    });
  }
}

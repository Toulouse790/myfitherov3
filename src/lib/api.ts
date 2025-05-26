
import { toast } from "@/components/ui/sonner";

// Configuration API centrale
const API_CONFIG = {
  baseUrl: import.meta.env.DEV ? '/api' : 'https://myfithero.app/api',
  timeout: 10000,
  retryAttempts: 3
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: any;
};

// Classe API centrale pour toutes les requêtes
export class ApiClient {
  private static baseUrl = API_CONFIG.baseUrl;

  private static async request<T>(
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
      
      if (!import.meta.env.DEV) {
        toast.error("Une erreur est survenue", {
          description: "Veuillez réessayer plus tard"
        });
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // Méthodes HTTP génériques
  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Méthodes spécialisées
  static async sendToN8n(data: any): Promise<ApiResponse<any>> {
    console.log('📤 Envoi vers n8n:', data);
    return this.post('/send-to-n8n', data);
  }

  static async testWebhook(webhookUrl: string, testData: any): Promise<ApiResponse<any>> {
    return this.post('/test-webhook', { webhookUrl, ...testData });
  }

  static async getN8nConfig(): Promise<ApiResponse<{ url: string; status: string }>> {
    return this.get('/admin/config/n8n');
  }
}


import { ApiService } from '../api';
import { N8nConfig, OpenAIConfig } from './types';

/**
 * Service for admin configuration functionality
 */
export class AdminConfigService {
  private static API_BASE_URL = '/api/admin';
  
  /**
   * Gets n8n configuration
   * @returns Promise resolving to n8n configuration
   */
  static async getN8nConfig(): Promise<N8nConfig> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/config/n8n`);
      
      if (!response.ok) {
        // Extraction des détails d'erreur si disponibles
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || '';
        } catch (e) {
          // Ignorer les erreurs lors de l'analyse JSON
        }
        
        throw new Error(`Réponse du serveur: ${response.status} ${errorDetails}`);
      }
      
      const data = await response.json();
      return data.data || { url: '', status: 'unknown' };
    } catch (error) {
      console.error('Error fetching n8n config:', error);
      return {
        url: 'https://n8n.example.com/webhook/myfit-prod-123456',
        status: 'unknown'
      };
    }
  }

  /**
   * Updates n8n configuration
   * @param url New n8n webhook URL
   * @returns Promise resolving to success status
   */
  static async updateN8nConfig(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/config/n8n`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || '';
        } catch (e) {
          // Ignorer les erreurs lors de l'analyse JSON
        }
        
        throw new Error(`Réponse du serveur: ${response.status} ${errorDetails}`);
      }
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating n8n config:', error);
      return false;
    }
  }

  /**
   * Gets OpenAI configuration
   * @returns Promise resolving to OpenAI configuration
   */
  static async getOpenAIConfig(): Promise<OpenAIConfig> {
    try {
      const response = await ApiService.request<OpenAIConfig>('/admin/config/openai', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch OpenAI config');
    } catch (error) {
      console.error('Error fetching OpenAI config:', error);
      return {
        key: 'sk-•••••••••••••••••••••••••••••••••••',
        model: 'gpt-4o'
      };
    }
  }

  /**
   * Updates OpenAI API key
   * @param key New OpenAI API key
   * @returns Promise resolving to success status
   */
  static async updateOpenAIKey(key: string): Promise<boolean> {
    try {
      const response = await ApiService.request('/admin/config/openai', {
        method: 'POST',
        body: JSON.stringify({ key }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Error updating OpenAI key:', error);
      return false;
    }
  }
}


import { ApiService } from './api';
import { StorageService } from './storage';

export interface AdminStats {
  users: number;
  conversations: number;
  successRate: number;
  responseTime: number;
  activeSessions: number;
}

export interface AgentStats {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  responseTime: number;
  successRate: number;
  lastActive: string;
  model: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'error' | 'warning' | 'info';
  source: string;
  message: string;
}

export interface N8nConfig {
  url: string;
  status: 'connected' | 'error' | 'unknown';
}

export interface OpenAIConfig {
  key: string;
  model: string;
}

export class AdminService {
  private static ADMIN_AUTH_KEY = 'adminAuth';
  private static API_BASE_URL = '/api/admin';
  
  // Authentification
  static isAuthenticated(): boolean {
    return StorageService.getItem<boolean>(this.ADMIN_AUTH_KEY, false);
  }
  
  static authenticate(password: string): Promise<boolean> {
    // For demo purposes, we're using a direct comparison
    // In production, this should be a secure API call to validate credentials
    const isValid = password === "admin123"; // This should be replaced with a secure auth system
    
    if (isValid) {
      StorageService.setItem(this.ADMIN_AUTH_KEY, true);
    }
    
    return Promise.resolve(isValid);
  }
  
  static logout(): void {
    StorageService.removeItem(this.ADMIN_AUTH_KEY);
  }
  
  // Statistiques
  static async getSystemStats(): Promise<AdminStats> {
    try {
      const response = await ApiService.request<AdminStats>('/admin/stats', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch system stats');
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Fallback aux données fictives en cas d'erreur
      return {
        users: 1245,
        conversations: 8790,
        successRate: 94.2,
        responseTime: 1.8,
        activeSessions: 32
      };
    }
  }
  
  // Agents
  static async getAgents(): Promise<AgentStats[]> {
    try {
      const response = await ApiService.request<AgentStats[]>('/admin/agents', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch agents');
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Fallback aux données fictives
      return [
        { 
          id: 'nutrition-agent', 
          name: 'Agent Nutrition', 
          type: 'nutrition',
          status: 'active', 
          responseTime: 1.2,
          successRate: 97.8,
          lastActive: new Date().toISOString(),
          model: 'gpt-4o'
        },
        { 
          id: 'sommeil-agent', 
          name: 'Agent Sommeil', 
          type: 'sommeil',
          status: 'active', 
          responseTime: 1.5,
          successRate: 95.2,
          lastActive: new Date().toISOString(),
          model: 'gpt-4o'
        },
        { 
          id: 'muscu-agent', 
          name: 'Agent Musculation', 
          type: 'muscu',
          status: 'active', 
          responseTime: 1.8,
          successRate: 96.5,
          lastActive: new Date().toISOString(),
          model: 'gpt-4o'
        },
        { 
          id: 'hydratation-agent', 
          name: 'Agent Hydratation', 
          type: 'hydratation',
          status: 'inactive', 
          responseTime: 1.4,
          successRate: 94.7,
          lastActive: new Date().toISOString(),
          model: 'gpt-4o-mini'
        },
        { 
          id: 'synthese-agent', 
          name: 'Agent Synthèse', 
          type: 'synthese',
          status: 'active', 
          responseTime: 2.5,
          successRate: 98.3,
          lastActive: new Date().toISOString(),
          model: 'gpt-4o'
        }
      ];
    }
  }
  
  // Mise à jour du statut d'un agent
  static async updateAgentStatus(id: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const response = await ApiService.request('/admin/agents/update-status', {
        method: 'POST',
        body: JSON.stringify({ id, status }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
  }
  
  // Logs système
  static async getSystemLogs(filters?: {
    type?: 'error' | 'warning' | 'info';
    date?: string;
    limit?: number;
  }): Promise<LogEntry[]> {
    try {
      let url = '/admin/logs';
      
      // Build query string for filters
      if (filters) {
        const params = new URLSearchParams();
        
        if (filters.type) {
          params.append('type', filters.type);
        }
        
        if (filters.date) {
          params.append('date', filters.date);
        }
        
        if (filters.limit) {
          params.append('limit', filters.limit.toString());
        }
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }
      
      const response = await ApiService.request<LogEntry[]>(url, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch system logs');
    } catch (error) {
      console.error('Error fetching system logs:', error);
      // Données fictives de logs
      return [
        {
          timestamp: '2025-05-21T14:32:15Z',
          type: 'error',
          source: 'Agent Nutrition',
          message: 'Échec de connexion à l\'API OpenAI - Timeout après 30s'
        },
        {
          timestamp: '2025-05-21T14:28:10Z',
          type: 'warning',
          source: 'n8n Webhook',
          message: 'Réponse lente du service externe (5.2s)'
        },
        {
          timestamp: '2025-05-21T14:15:43Z',
          type: 'info',
          source: 'Système',
          message: 'Configuration mise à jour avec succès'
        }
      ];
    }
  }

  /**
   * Récupère la configuration n8n
   * @returns Promise contenant les informations de configuration
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
   * Met à jour la configuration n8n
   * @param url L'URL du webhook n8n
   * @returns Promise avec le résultat du test de connexion
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

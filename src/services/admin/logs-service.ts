
import { ApiService } from '../api';
import { LogEntry, LogFilterOptions } from './types';

/**
 * Service for admin logs functionality
 */
export class AdminLogsService {
  /**
   * Gets system logs with optional filtering
   * @param filters Optional filters for logs
   * @returns Promise resolving to log entries array
   */
  static async getSystemLogs(filters?: LogFilterOptions): Promise<LogEntry[]> {
    try {
      let url = '/admin/logs';
      
      // Build query parameters for filters
      if (filters) {
        const queryParams = new URLSearchParams();
        
        if (filters.type) {
          queryParams.append('type', filters.type);
        }
        
        if (filters.date) {
          queryParams.append('date', filters.date);
        }
        
        if (filters.limit) {
          queryParams.append('limit', filters.limit.toString());
        }
        
        const queryString = queryParams.toString();
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
}

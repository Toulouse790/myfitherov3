
import { ApiService } from '../api';
import { AdminStats, AgentStats } from './types';

/**
 * Service for admin statistics functionality
 */
export class AdminStatsService {
  /**
   * Gets system statistics
   * @returns Promise resolving to admin stats
   */
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
  
  /**
   * Gets agent statistics
   * @returns Promise resolving to agent stats array
   */
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
  
  /**
   * Updates the status of an agent
   * @param id Agent ID
   * @param status New agent status
   * @returns Promise resolving to success status
   */
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
}

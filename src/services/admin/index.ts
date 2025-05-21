
import { AdminAuthService } from './auth-service';
import { AdminStatsService } from './stats-service';
import { AdminLogsService } from './logs-service';
import { AdminConfigService } from './config-service';
export * from './types';

/**
 * Main admin service that re-exports functionality from specialized services
 */
export class AdminService {
  // Re-export authentication methods
  static isAuthenticated = AdminAuthService.isAuthenticated;
  static authenticate = AdminAuthService.authenticate;
  static logout = AdminAuthService.logout;
  
  // Re-export stats methods
  static getSystemStats = AdminStatsService.getSystemStats;
  static getAgents = AdminStatsService.getAgents;
  static updateAgentStatus = AdminStatsService.updateAgentStatus;
  
  // Re-export logs methods
  static getSystemLogs = AdminLogsService.getSystemLogs;
  
  // Re-export configuration methods
  static getN8nConfig = AdminConfigService.getN8nConfig;
  static updateN8nConfig = AdminConfigService.updateN8nConfig;
  static getOpenAIConfig = AdminConfigService.getOpenAIConfig;
  static updateOpenAIKey = AdminConfigService.updateOpenAIKey;
}

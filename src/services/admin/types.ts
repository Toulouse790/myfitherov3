
/**
 * Type definitions for admin services
 */

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

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
}

export type LogFilterOptions = {
  type?: 'error' | 'warning' | 'info';
  date?: string;
  limit?: number;
};

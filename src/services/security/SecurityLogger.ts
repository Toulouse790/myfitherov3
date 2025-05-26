
import { SECURITY_CONFIG, SecurityError } from './SecurityConfig';

export class SecurityLogger {
  private static logs: SecurityLog[] = [];

  /**
   * Log un événement de sécurité
   */
  static log(level: LogLevel, event: string, details?: Record<string, any>): void {
    const log: SecurityLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      event,
      details: SECURITY_CONFIG.logging.sanitizePersonalData 
        ? this.sanitizeDetails(details) 
        : details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(log);
    
    // Nettoyer les logs anciens
    this.cleanupOldLogs();

    // Log en console selon le niveau
    this.consoleLog(log);
  }

  /**
   * Log une erreur de sécurité
   */
  static error(event: string, error: Error, details?: Record<string, any>): void {
    this.log('error', event, {
      ...details,
      error: error.message,
      stack: SECURITY_CONFIG.logging.includeStackTrace ? error.stack : undefined
    });
  }

  /**
   * Log un avertissement de sécurité
   */
  static warn(event: string, details?: Record<string, any>): void {
    this.log('warn', event, details);
  }

  /**
   * Log d'information
   */
  static info(event: string, details?: Record<string, any>): void {
    this.log('info', event, details);
  }

  /**
   * Log de debug
   */
  static debug(event: string, details?: Record<string, any>): void {
    if (SECURITY_CONFIG.logging.level === 'debug') {
      this.log('debug', event, details);
    }
  }

  /**
   * Obtient les logs de sécurité
   */
  static getLogs(level?: LogLevel): SecurityLog[] {
    return level 
      ? this.logs.filter(log => log.level === level)
      : this.logs;
  }

  /**
   * Exporte les logs pour audit
   */
  static exportLogs(): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      application: 'MyFitHero',
      version: '1.0.0',
      logs: this.logs
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Nettoie les logs anciens selon la rétention
   */
  private static cleanupOldLogs(): void {
    const retentionPeriod = SECURITY_CONFIG.dataRetention.auditLogs;
    const cutoffDate = new Date(Date.now() - retentionPeriod);
    
    this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
  }

  /**
   * Sanitise les détails pour supprimer les données personnelles
   */
  private static sanitizeDetails(details?: Record<string, any>): Record<string, any> | undefined {
    if (!details) return undefined;

    const sanitized = { ...details };
    const sensitiveFields = ['email', 'password', 'token', 'phone', 'address'];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Log en console
   */
  private static consoleLog(log: SecurityLog): void {
    const message = `[${log.level.toUpperCase()}] ${log.event}`;
    
    switch (log.level) {
      case 'error':
        console.error(message, log.details);
        break;
      case 'warn':
        console.warn(message, log.details);
        break;
      case 'info':
        console.info(message, log.details);
        break;
      case 'debug':
        console.debug(message, log.details);
        break;
    }
  }

  /**
   * Génère un ID unique pour le log
   */
  private static generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface SecurityLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  event: string;
  details?: Record<string, any>;
  userAgent: string;
  url: string;
}

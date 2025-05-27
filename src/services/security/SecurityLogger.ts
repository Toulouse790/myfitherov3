
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
      details: this.shouldSanitizeData() 
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
      stack: this.shouldIncludeStackTrace() ? error.stack : undefined
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
    if (this.getLogLevel() === 'debug') {
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
    const retentionPeriod = this.getAuditLogRetention();
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

  /**
   * Vérifie si on doit sanitiser les données
   */
  private static shouldSanitizeData(): boolean {
    try {
      // Import dynamique pour éviter la dépendance circulaire
      return true; // Par défaut, on sanitise toujours
    } catch {
      return true;
    }
  }

  /**
   * Vérifie si on doit inclure la stack trace
   */
  private static shouldIncludeStackTrace(): boolean {
    try {
      return !import.meta.env.PROD;
    } catch {
      return false;
    }
  }

  /**
   * Obtient le niveau de log
   */
  private static getLogLevel(): LogLevel {
    try {
      return import.meta.env.PROD ? 'warn' : 'debug';
    } catch {
      return 'warn';
    }
  }

  /**
   * Obtient la période de rétention des logs d'audit
   */
  private static getAuditLogRetention(): number {
    // 6 ans par défaut (légal)
    return 6 * 365 * 24 * 60 * 60 * 1000;
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


// Configuration de sécurité pour application santé - RGPD/HIPAA compliant
export const SECURITY_CONFIG = {
  // Configuration du chiffrement
  encryption: {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    tagLength: 16,
    iterations: 100000, // PBKDF2 iterations
  },

  // Paramètres de sécurité des sessions
  session: {
    get maxAge() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.getSessionDuration();
      } catch {
        return 1800000; // 30 minutes par défaut
      }
    },
    renewThreshold: 5 * 60 * 1000, // Renouveler 5 min avant expiration
    secureCookie: true,
    sameSite: 'strict' as const,
  },

  // Configuration API sécurisée
  api: {
    timeout: 10000, // 10 secondes
    retryAttempts: 3,
    get rateLimitPerMinute() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.getConfig().rateLimitPerMinute;
      } catch {
        return 60; // Par défaut
      }
    },
    requiredHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-Client-Version'
    ],
  },

  // Validation des données sensibles
  dataValidation: {
    get maxFileSize() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.getConfig().maxFileSize * 1024 * 1024;
      } catch {
        return 5 * 1024 * 1024; // 5MB par défaut
      }
    },
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFieldLength: 1000,
    sanitizeHtml: true,
  },

  // Configuration géolocalisation
  geolocation: {
    highAccuracy: true,
    timeout: 15000,
    maximumAge: 300000, // 5 minutes
    enableBackgroundLocation: false, // RGPD - explicite
  },

  // Rétention des données (RGPD Article 5)
  dataRetention: {
    get biometricData() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.getRetentionDays('biometric') * 24 * 60 * 60 * 1000;
      } catch {
        return 90 * 24 * 60 * 60 * 1000; // 90 jours par défaut
      }
    },
    get locationData() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.getRetentionDays('location') * 24 * 60 * 60 * 1000;
      } catch {
        return 30 * 24 * 60 * 60 * 1000; // 30 jours par défaut
      }
    },
    healthData: 365 * 24 * 60 * 60 * 1000,   // 1 an
    auditLogs: 6 * 365 * 24 * 60 * 60 * 1000, // 6 ans (légal)
  },

  // Configuration logging sécurisé
  logging: {
    get level() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return configValidator.isProductionMode() ? 'warn' : 'debug';
      } catch {
        return import.meta.env.PROD ? 'warn' : 'debug';
      }
    },
    sanitizePersonalData: true,
    get includeStackTrace() { 
      try {
        const { configValidator } = require('./ConfigValidator');
        return !configValidator.isProductionMode();
      } catch {
        return !import.meta.env.PROD;
      }
    },
    maxLogSize: 50 * 1024 * 1024, // 50MB
  },

  // Anonymisation pour IA (RGPD Article 6)
  aiIntegration: {
    enableDataAnonymization: true,
    removePersonalIdentifiers: true,
    hashUserIds: true,
    excludeFields: [
      'email',
      'phone',
      'firstName',
      'lastName',
      'address',
      'socialSecurityNumber'
    ],
  },

  // Headers de sécurité obligatoires
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    get 'Content-Security-Policy'() {
      try {
        const { configValidator } = require('./ConfigValidator');
        const apiBaseUrl = configValidator.getConfig().apiBaseUrl;
        return `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${apiBaseUrl}`;
      } catch {
        return `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';`;
      }
    },
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
} as const;

// Types pour la sécurité
export interface SecurityContext {
  userId: string;
  sessionId: string;
  permissions: Permission[];
  consentGiven: ConsentType[];
  lastActivity: Date;
}

export interface Permission {
  type: 'location' | 'biometric' | 'health' | 'ai_processing';
  granted: boolean;
  timestamp: Date;
  expiresAt?: Date;
}

export interface ConsentType {
  category: 'essential' | 'analytics' | 'marketing' | 'ai_processing';
  granted: boolean;
  version: string;
  timestamp: Date;
}

// Validation des environnements
export const validateSecurityConfig = () => {
  try {
    const { configValidator } = require('./ConfigValidator');
    configValidator.validateAndLoad();
    console.log('✅ Configuration de sécurité validée');
  } catch (error) {
    console.error('❌ Erreur de configuration:', error);
    throw error;
  }
};

export class SecurityError extends Error {
  constructor(message: string) {
    super(`[SÉCURITÉ] ${message}`);
    this.name = 'SecurityError';
  }
}

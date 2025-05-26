
import { configValidator } from './ConfigValidator';

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
    get maxAge() { return configValidator.getSessionDuration(); },
    renewThreshold: 5 * 60 * 1000, // Renouveler 5 min avant expiration
    secureCookie: true,
    sameSite: 'strict' as const,
  },

  // Configuration API sécurisée
  api: {
    timeout: 10000, // 10 secondes
    retryAttempts: 3,
    get rateLimitPerMinute() { return configValidator.getConfig().rateLimitPerMinute; },
    requiredHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-Client-Version'
    ],
  },

  // Validation des données sensibles
  dataValidation: {
    get maxFileSize() { return configValidator.getConfig().maxFileSize * 1024 * 1024; }, // Conversion en bytes
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
    get biometricData() { return configValidator.getRetentionDays('biometric') * 24 * 60 * 60 * 1000; },
    get locationData() { return configValidator.getRetentionDays('location') * 24 * 60 * 60 * 1000; },
    healthData: 365 * 24 * 60 * 60 * 1000,   // 1 an
    auditLogs: 6 * 365 * 24 * 60 * 60 * 1000, // 6 ans (légal)
  },

  // Configuration logging sécurisé
  logging: {
    get level() { return configValidator.isProductionMode() ? 'warn' : 'debug'; },
    sanitizePersonalData: true,
    get includeStackTrace() { return !configValidator.isProductionMode(); },
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
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${configValidator.getConfig().apiBaseUrl}`,
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

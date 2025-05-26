
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
    maxAge: 30 * 60 * 1000, // 30 minutes
    renewThreshold: 5 * 60 * 1000, // Renouveler 5 min avant expiration
    secureCookie: true,
    sameSite: 'strict' as const,
  },

  // Configuration API sécurisée
  api: {
    timeout: 10000, // 10 secondes
    retryAttempts: 3,
    rateLimitPerMinute: 60,
    requiredHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-Client-Version'
    ],
  },

  // Validation des données sensibles
  dataValidation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
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
    biometricData: 90 * 24 * 60 * 60 * 1000, // 90 jours
    locationData: 30 * 24 * 60 * 60 * 1000,  // 30 jours
    healthData: 365 * 24 * 60 * 60 * 1000,   // 1 an
    auditLogs: 6 * 365 * 24 * 60 * 60 * 1000, // 6 ans (légal)
  },

  // Configuration logging sécurisé
  logging: {
    level: import.meta.env.PROD ? 'warn' : 'debug',
    sanitizePersonalData: true,
    includeStackTrace: !import.meta.env.PROD,
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
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
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
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
    'VITE_ENCRYPTION_KEY',
    'VITE_SESSION_SECRET'
  ];

  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new SecurityError(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }

  // Vérifier que nous sommes en HTTPS en production
  if (import.meta.env.PROD && location.protocol !== 'https:') {
    throw new SecurityError('HTTPS requis en production pour les données de santé');
  }
};

export class SecurityError extends Error {
  constructor(message: string) {
    super(`[SÉCURITÉ] ${message}`);
    this.name = 'SecurityError';
  }
}

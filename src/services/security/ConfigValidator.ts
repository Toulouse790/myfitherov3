
import { SecurityLogger } from './SecurityLogger';

export interface SecurityConfig {
  encryptionKey: string;
  sessionSecret: string;
  hashSalt: string;
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  dpoDp_email: string;
  maxFileSize: number;
  rateLimitPerMinute: number;
  sessionDuration: number;
  biometricRetentionDays: number;
  locationRetentionDays: number;
}

export class ConfigValidator {
  private static instance: ConfigValidator;
  private config: SecurityConfig | null = null;

  static getInstance(): ConfigValidator {
    if (!this.instance) {
      this.instance = new ConfigValidator();
    }
    return this.instance;
  }

  validateAndLoad(): SecurityConfig {
    if (this.config) {
      return this.config;
    }

    const requiredVars = [
      'VITE_ENCRYPTION_KEY',
      'VITE_SESSION_SECRET',
      'VITE_HASH_SALT',
      'VITE_API_BASE_URL',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_DPO_EMAIL'
    ];

    const missingVars = requiredVars.filter(key => !import.meta.env[key]);
    
    if (missingVars.length > 0) {
      const error = `Variables d'environnement manquantes: ${missingVars.join(', ')}`;
      SecurityLogger.error('Configuration validation failed', new Error(error));
      throw new Error(error);
    }

    // Validation HTTPS en production
    if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL?.startsWith('https://')) {
      throw new Error('HTTPS requis en production pour les données de santé');
    }

    // Validation longueur des clés
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Clé de chiffrement trop faible (minimum 32 caractères)');
    }

    this.config = {
      encryptionKey,
      sessionSecret: import.meta.env.VITE_SESSION_SECRET,
      hashSalt: import.meta.env.VITE_HASH_SALT,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      dpoDp_email: import.meta.env.VITE_DPO_EMAIL,
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5'),
      rateLimitPerMinute: parseInt(import.meta.env.VITE_RATE_LIMIT_PER_MINUTE || '60'),
      sessionDuration: parseInt(import.meta.env.VITE_SESSION_DURATION || '1800000'),
      biometricRetentionDays: parseInt(import.meta.env.VITE_BIOMETRIC_RETENTION_DAYS || '90'),
      locationRetentionDays: parseInt(import.meta.env.VITE_LOCATION_RETENTION_DAYS || '30')
    };

    SecurityLogger.info('Security configuration validated successfully');
    return this.config;
  }

  getConfig(): SecurityConfig {
    if (!this.config) {
      return this.validateAndLoad();
    }
    return this.config;
  }

  // Méthodes utilitaires pour accéder aux configurations spécifiques
  getRetentionDays(dataType: 'biometric' | 'location'): number {
    const config = this.getConfig();
    return dataType === 'biometric' 
      ? config.biometricRetentionDays 
      : config.locationRetentionDays;
  }

  isProductionMode(): boolean {
    return import.meta.env.PROD;
  }

  isDebugEnabled(): boolean {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  }

  getSessionDuration(): number {
    return this.getConfig().sessionDuration;
  }

  getDpoEmail(): string {
    return this.getConfig().dpoDp_email;
  }
}

export const configValidator = ConfigValidator.getInstance();

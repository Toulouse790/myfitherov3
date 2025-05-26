
// Export centralisé des services de sécurité
export { SECURITY_CONFIG, validateSecurityConfig, SecurityError } from './SecurityConfig';
export { EncryptionService } from './EncryptionService';
export { ConsentManager } from './ConsentManager';
export { DataAnonymizer } from './DataAnonymizer';
export { SecurityLogger } from './SecurityLogger';

export type {
  SecurityContext,
  Permission,
  ConsentType
} from './SecurityConfig';

export type {
  LogLevel,
  SecurityLog
} from './SecurityLogger';

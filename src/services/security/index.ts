
// Export centralisé des services de sécurité
export { SECURITY_CONFIG, validateSecurityConfig, SecurityError } from './SecurityConfig';
export { EncryptionService } from './EncryptionService';
export { DataEncryptionService, encryptionService, encryptHealthData, decryptHealthData, anonymizeForAI } from './DataEncryptionService';
export { ConsentManager } from './ConsentManager';
export { DataAnonymizer } from './DataAnonymizer';
export { SecurityLogger } from './SecurityLogger';
export { ConfigValidator, configValidator } from './ConfigValidator';

export type {
  SecurityContext,
  Permission,
  ConsentType
} from './SecurityConfig';

export type {
  LogLevel,
  SecurityLog
} from './SecurityLogger';

export type {
  SecurityConfig
} from './ConfigValidator';

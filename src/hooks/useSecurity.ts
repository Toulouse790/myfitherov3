
import { useState, useEffect } from 'react';
import { ConsentManager, Permission, ConsentType, SecurityLogger, EncryptionService, configValidator } from '@/services/security';
import { toast } from '@/components/ui/sonner';

export const useSecurity = () => {
  const [consents, setConsents] = useState<ConsentType[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [configStatus, setConfigStatus] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      // Valider la configuration en premier
      const config = configValidator.validateAndLoad();
      setConfigStatus({ isValid: true, errors: [] });

      // Initialiser le service de chiffrement avec la clé de l'environnement
      await EncryptionService.initialize(config.encryptionKey);

      // Charger les consentements et permissions
      setConsents(ConsentManager.getConsents());
      setPermissions(ConsentManager.getPermissions());
      
      setIsInitialized(true);
      SecurityLogger.info('Security services initialized with environment config');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de configuration';
      setConfigStatus({ 
        isValid: false, 
        errors: [errorMessage] 
      });
      
      SecurityLogger.error('Failed to initialize security services', error as Error);
      toast.error('Erreur d\'initialisation de sécurité', {
        description: errorMessage
      });
    }
  };

  const updateConsent = (category: ConsentType['category'], granted: boolean) => {
    ConsentManager.updateConsent(category, granted);
    setConsents(ConsentManager.getConsents());
    
    SecurityLogger.info('Consent updated', { category, granted });
    
    toast.success(
      granted ? 'Consentement accordé' : 'Consentement retiré',
      { description: `Catégorie: ${category}` }
    );
  };

  const requestPermission = async (type: Permission['type']): Promise<boolean> => {
    try {
      const granted = await ConsentManager.requestPermission(type);
      setPermissions(ConsentManager.getPermissions());
      
      SecurityLogger.info('Permission requested', { type, granted });
      
      if (granted) {
        toast.success('Permission accordée', { description: `Type: ${type}` });
      } else {
        toast.warning('Permission refusée', { description: `Type: ${type}` });
      }
      
      return granted;
    } catch (error) {
      SecurityLogger.error('Permission request failed', error as Error, { type });
      toast.error('Erreur de permission');
      return false;
    }
  };

  const hasConsent = (category: ConsentType['category']): boolean => {
    return ConsentManager.hasConsent(category);
  };

  const hasPermission = (type: Permission['type']): boolean => {
    return ConsentManager.hasPermission(type);
  };

  const revokeAllConsents = () => {
    ConsentManager.revokeAllConsents();
    setConsents(ConsentManager.getConsents());
    setPermissions(ConsentManager.getPermissions());
    
    SecurityLogger.warn('All non-essential consents revoked');
    toast.info('Consentements révoqués', {
      description: 'Tous les consentements non-essentiels ont été retirés'
    });
  };

  const getConsentReport = () => {
    const report = ConsentManager.getConsentReport();
    SecurityLogger.info('Consent report generated');
    return report;
  };

  const encryptSensitiveData = async (data: string): Promise<string> => {
    try {
      return await EncryptionService.encrypt(data);
    } catch (error) {
      SecurityLogger.error('Data encryption failed', error as Error);
      throw error;
    }
  };

  const decryptSensitiveData = async (encryptedData: string): Promise<string> => {
    try {
      return await EncryptionService.decrypt(encryptedData);
    } catch (error) {
      SecurityLogger.error('Data decryption failed', error as Error);
      throw error;
    }
  };

  // Nouvelles méthodes pour la gestion de configuration
  const getConfigStatus = () => configStatus;
  
  const getRetentionDays = (dataType: 'biometric' | 'location'): number => {
    return configValidator.getRetentionDays(dataType);
  };

  const getDpoEmail = (): string => {
    return configValidator.getDpoEmail();
  };

  return {
    // État
    consents,
    permissions,
    isInitialized,
    configStatus,
    
    // Actions de consentement
    updateConsent,
    hasConsent,
    revokeAllConsents,
    getConsentReport,
    
    // Actions de permission
    requestPermission,
    hasPermission,
    
    // Chiffrement
    encryptSensitiveData,
    decryptSensitiveData,
    
    // Configuration
    getConfigStatus,
    getRetentionDays,
    getDpoEmail,
    
    // Utilitaires
    initializeSecurity
  };
};

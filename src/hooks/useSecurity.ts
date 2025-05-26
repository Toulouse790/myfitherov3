
import { useState, useEffect } from 'react';
import { ConsentManager, Permission, ConsentType, SecurityLogger, EncryptionService } from '@/services/security';
import { toast } from '@/components/ui/sonner';

export const useSecurity = () => {
  const [consents, setConsents] = useState<ConsentType[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      // Initialiser le service de chiffrement
      const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-for-development';
      await EncryptionService.initialize(encryptionKey);

      // Charger les consentements et permissions
      setConsents(ConsentManager.getConsents());
      setPermissions(ConsentManager.getPermissions());
      
      setIsInitialized(true);
      SecurityLogger.info('Security services initialized');
    } catch (error) {
      SecurityLogger.error('Failed to initialize security services', error as Error);
      toast.error('Erreur d\'initialisation de sécurité');
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

  return {
    // État
    consents,
    permissions,
    isInitialized,
    
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
    
    // Utilitaires
    initializeSecurity
  };
};

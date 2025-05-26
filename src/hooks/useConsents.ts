
import { useState, useEffect } from 'react';
import { ConsentManager } from '@/services/security';
import type { ConsentType } from '@/services/security';

export const useConsents = () => {
  const [consents, setConsents] = useState<ConsentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConsents = () => {
      try {
        const currentConsents = ConsentManager.getConsents();
        setConsents(currentConsents);
      } catch (error) {
        console.error('Erreur chargement consentements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsents();
  }, []);

  const hasConsent = (category: ConsentType['category']): boolean => {
    return consents.find(c => c.category === category)?.granted || false;
  };

  const updateConsent = (category: ConsentType['category'], granted: boolean) => {
    ConsentManager.updateConsent(category, granted);
    setConsents(ConsentManager.getConsents());
  };

  const revokeAllConsents = () => {
    ConsentManager.revokeAllConsents();
    setConsents(ConsentManager.getConsents());
  };

  // Méthodes utilitaires pour des vérifications rapides
  const canUseLocation = (): boolean => hasConsent('analytics'); // Mapping temporaire
  const canUseBiometric = (): boolean => hasConsent('marketing'); // Mapping temporaire
  const canUseAI = (): boolean => hasConsent('ai_processing');
  const canUseAnalytics = (): boolean => hasConsent('analytics');

  // Fonction de validation avant collecte de données sensibles
  const validateDataCollection = (requiredConsents: ConsentType['category'][]): boolean => {
    return requiredConsents.every(consent => hasConsent(consent));
  };

  return {
    consents,
    isLoading,
    hasConsent,
    updateConsent,
    revokeAllConsents,
    canUseLocation,
    canUseBiometric,
    canUseAI,
    canUseAnalytics,
    validateDataCollection
  };
};

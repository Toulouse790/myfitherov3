
import { SECURITY_CONFIG } from './SecurityConfig';
import { EncryptionService } from './EncryptionService';

export class DataAnonymizer {
  /**
   * Anonymise les données pour l'IA
   */
  static async anonymizeForAI(data: Record<string, any>): Promise<Record<string, any>> {
    if (!SECURITY_CONFIG.aiIntegration.enableDataAnonymization) {
      return data;
    }

    const anonymized = { ...data };

    // Supprimer les champs personnels
    SECURITY_CONFIG.aiIntegration.excludeFields.forEach(field => {
      delete anonymized[field];
    });

    // Hasher les IDs utilisateurs
    if (SECURITY_CONFIG.aiIntegration.hashUserIds && anonymized.user_id) {
      anonymized.user_id = await EncryptionService.hashUserId(anonymized.user_id);
    }

    // Supprimer les identifiants personnels
    if (SECURITY_CONFIG.aiIntegration.removePersonalIdentifiers) {
      return this.removePersonalIdentifiers(anonymized);
    }

    return anonymized;
  }

  /**
   * Supprime les identifiants personnels du texte
   */
  private static removePersonalIdentifiers(data: Record<string, any>): Record<string, any> {
    let anonymized = { ...data };

    Object.keys(anonymized).forEach(key => {
      if (typeof anonymized[key] === 'string') {
        let value = anonymized[key];
        
        // Remplacer les emails
        value = value.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
        
        // Remplacer les numéros de téléphone
        value = value.replace(/\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, '[PHONE]');
        
        // Remplacer les URLs
        value = value.replace(/https?:\/\/[^\s]+/g, '[URL]');
        
        anonymized[key] = value;
      }
    });

    return anonymized;
  }

  /**
   * Vérifie si des données contiennent des informations personnelles
   */
  static containsPersonalData(data: any): boolean {
    const dataString = JSON.stringify(data).toLowerCase();
    
    const personalDataIndicators = [
      'email', 'phone', 'address', 'firstname', 'lastname',
      'nom', 'prénom', 'adresse', 'téléphone',
      '@', '.com', '.fr', '+33'
    ];

    return personalDataIndicators.some(indicator => 
      dataString.includes(indicator)
    );
  }

  /**
   * Génère un ID de session anonyme
   */
  static generateAnonymousSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `anon_${timestamp}_${random}`;
  }
}

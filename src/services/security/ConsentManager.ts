
import { ConsentType, Permission, SECURITY_CONFIG } from './SecurityConfig';
import { StorageService } from '../storage';

export class ConsentManager {
  private static readonly CONSENT_KEY = 'user_consent_v1';
  private static readonly PERMISSIONS_KEY = 'user_permissions_v1';

  /**
   * Obtient les consentements actuels
   */
  static getConsents(): ConsentType[] {
    return StorageService.getItem<ConsentType[]>(this.CONSENT_KEY, []);
  }

  /**
   * Met à jour un consentement
   */
  static updateConsent(category: ConsentType['category'], granted: boolean): void {
    const consents = this.getConsents();
    const existingIndex = consents.findIndex(c => c.category === category);

    const newConsent: ConsentType = {
      category,
      granted,
      version: '1.0',
      timestamp: new Date()
    };

    if (existingIndex >= 0) {
      consents[existingIndex] = newConsent;
    } else {
      consents.push(newConsent);
    }

    StorageService.setItem(this.CONSENT_KEY, consents);
    
    console.log(`✅ Consentement ${category}: ${granted ? 'accordé' : 'retiré'}`);
  }

  /**
   * Vérifie si un consentement est accordé
   */
  static hasConsent(category: ConsentType['category']): boolean {
    const consents = this.getConsents();
    const consent = consents.find(c => c.category === category);
    return consent?.granted === true;
  }

  /**
   * Obtient les permissions actuelles
   */
  static getPermissions(): Permission[] {
    return StorageService.getItem<Permission[]>(this.PERMISSIONS_KEY, []);
  }

  /**
   * Demande une permission
   */
  static async requestPermission(type: Permission['type']): Promise<boolean> {
    let granted = false;

    try {
      switch (type) {
        case 'location':
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, SECURITY_CONFIG.geolocation);
          });
          granted = !!position;
          break;

        case 'biometric':
          // Vérifier si l'API biométrique est disponible
          granted = 'credentials' in navigator && 'PublicKeyCredential' in window;
          break;

        case 'health':
          // Permission pour les données de santé (explicite)
          granted = this.hasConsent('essential');
          break;

        case 'ai_processing':
          // Permission pour le traitement IA
          granted = this.hasConsent('ai_processing');
          break;
      }
    } catch (error) {
      console.warn(`Permission ${type} refusée:`, error);
      granted = false;
    }

    this.updatePermission(type, granted);
    return granted;
  }

  /**
   * Met à jour une permission
   */
  static updatePermission(type: Permission['type'], granted: boolean, expiresAt?: Date): void {
    const permissions = this.getPermissions();
    const existingIndex = permissions.findIndex(p => p.type === type);

    const newPermission: Permission = {
      type,
      granted,
      timestamp: new Date(),
      expiresAt
    };

    if (existingIndex >= 0) {
      permissions[existingIndex] = newPermission;
    } else {
      permissions.push(newPermission);
    }

    StorageService.setItem(this.PERMISSIONS_KEY, permissions);
  }

  /**
   * Vérifie si une permission est accordée et valide
   */
  static hasPermission(type: Permission['type']): boolean {
    const permissions = this.getPermissions();
    const permission = permissions.find(p => p.type === type);
    
    if (!permission?.granted) return false;
    
    // Vérifier l'expiration
    if (permission.expiresAt && new Date() > permission.expiresAt) {
      this.updatePermission(type, false);
      return false;
    }

    return true;
  }

  /**
   * Révoque tous les consentements (droit à l'oubli RGPD)
   */
  static revokeAllConsents(): void {
    const categories: ConsentType['category'][] = ['essential', 'analytics', 'marketing', 'ai_processing'];
    
    categories.forEach(category => {
      if (category !== 'essential') { // Les essentiels ne peuvent pas être révoqués
        this.updateConsent(category, false);
      }
    });

    console.log('🔒 Tous les consentements non-essentiels ont été révoqués');
  }

  /**
   * Obtient un rapport des consentements (RGPD Article 15)
   */
  static getConsentReport(): {
    consents: ConsentType[];
    permissions: Permission[];
    lastUpdated: Date;
  } {
    return {
      consents: this.getConsents(),
      permissions: this.getPermissions(),
      lastUpdated: new Date()
    };
  }
}

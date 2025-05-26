
// Service de chiffrement des données sensibles - Conformité RGPD/HIPAA
import { SECURITY_CONFIG, SecurityError } from './SecurityConfig';

export class DataEncryptionService {
  private static instance: DataEncryptionService;
  private cryptoKey: CryptoKey | null = null;

  private constructor() {}

  public static getInstance(): DataEncryptionService {
    if (!DataEncryptionService.instance) {
      DataEncryptionService.instance = new DataEncryptionService();
    }
    return DataEncryptionService.instance;
  }

  // Initialisation de la clé de chiffrement
  async initializeEncryption(): Promise<void> {
    try {
      const keyMaterial = await this.getKeyMaterial();
      this.cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Erreur initialisation chiffrement:', error);
      throw new SecurityError('Impossible d\'initialiser le chiffrement des données sensibles');
    }
  }

  // Génération sécurisée de la clé
  private async getKeyMaterial(): Promise<ArrayBuffer> {
    const password = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-dev-only';
    const salt = new TextEncoder().encode('myfithero-health-salt-2024');
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    return await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: SECURITY_CONFIG.encryption.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
  }

  // Chiffrement des données biométriques
  async encryptBiometricData(data: any): Promise<string> {
    if (!this.cryptoKey) {
      await this.initializeEncryption();
    }

    try {
      const jsonData = JSON.stringify(data);
      const encodedData = new TextEncoder().encode(jsonData);
      const iv = window.crypto.getRandomValues(new Uint8Array(SECURITY_CONFIG.encryption.ivLength));

      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.cryptoKey!,
        encodedData
      );

      // Combiner IV et données chiffrées
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Erreur chiffrement données biométriques:', error);
      throw new SecurityError('Échec du chiffrement des données sensibles');
    }
  }

  // Déchiffrement des données biométriques
  async decryptBiometricData(encryptedData: string): Promise<any> {
    if (!this.cryptoKey) {
      await this.initializeEncryption();
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, SECURITY_CONFIG.encryption.ivLength);
      const encrypted = combined.slice(SECURITY_CONFIG.encryption.ivLength);

      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.cryptoKey!,
        encrypted
      );

      const jsonString = new TextDecoder().decode(decryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Erreur déchiffrement:', error);
      throw new SecurityError('Impossible de déchiffrer les données');
    }
  }

  // Anonymisation pour l'IA (RGPD Article 6)
  async anonymizeForAI(healthData: any): Promise<any> {
    const anonymized = { ...healthData };
    
    // Supprimer les identifiants personnels
    SECURITY_CONFIG.aiIntegration.excludeFields.forEach(field => {
      delete anonymized[field];
    });

    // Remplacer l'ID utilisateur par un hash
    if (anonymized.userId) {
      anonymized.userId = await this.hashUserId(anonymized.userId);
    }

    // Généraliser les données de localisation (précision réduite)
    if (anonymized.location) {
      anonymized.location = this.generalizeLocation(anonymized.location);
    }

    // Généraliser les dates (semaine au lieu de jour exact)
    if (anonymized.timestamp) {
      anonymized.timestamp = this.generalizeTimestamp(anonymized.timestamp);
    }

    return anonymized;
  }

  // Hash sécurisé des IDs utilisateur
  private async hashUserId(userId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + 'salt-myfithero-2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Généralisation de la localisation (RGPD)
  private generalizeLocation(location: { lat: number; lng: number }) {
    // Réduire la précision à ~1km (2 décimales)
    return {
      lat: Math.round(location.lat * 100) / 100,
      lng: Math.round(location.lng * 100) / 100
    };
  }

  // Généralisation des timestamps
  private generalizeTimestamp(timestamp: string | Date): string {
    const date = new Date(timestamp);
    // Arrondir à la semaine
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString();
  }

  // Nettoyage sécurisé de la mémoire
  clearSensitiveData(): void {
    this.cryptoKey = null;
    // Force garbage collection si disponible
    if ((window as any).gc) {
      (window as any).gc();
    }
  }

  // Validation de l'intégrité des données
  async validateDataIntegrity(data: any, expectedHash?: string): Promise<boolean> {
    if (!expectedHash) return true;

    try {
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const currentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return currentHash === expectedHash;
    } catch (error) {
      console.error('Erreur validation intégrité:', error);
      return false;
    }
  }
}

// Export de l'instance singleton
export const encryptionService = DataEncryptionService.getInstance();

// Utilitaires de chiffrement rapide
export const encryptHealthData = async (data: any): Promise<string> => {
  return await encryptionService.encryptBiometricData(data);
};

export const decryptHealthData = async (encryptedData: string): Promise<any> => {
  return await encryptionService.decryptBiometricData(encryptedData);
};

export const anonymizeForAI = async (data: any): Promise<any> => {
  return await encryptionService.anonymizeForAI(data);
};

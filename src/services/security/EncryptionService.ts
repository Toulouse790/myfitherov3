
import { SECURITY_CONFIG, SecurityError } from './SecurityConfig';

export class EncryptionService {
  private static key: CryptoKey | null = null;

  /**
   * Initialise la clé de chiffrement à partir de la passphrase
   */
  static async initialize(passphrase: string): Promise<void> {
    try {
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      this.key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('MyFitHero-Salt-2024'),
          iterations: SECURITY_CONFIG.encryption.iterations,
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: SECURITY_CONFIG.encryption.algorithm,
          length: SECURITY_CONFIG.encryption.keyLength,
        },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      throw new SecurityError(`Erreur initialisation chiffrement: ${error}`);
    }
  }

  /**
   * Chiffre des données sensibles
   */
  static async encrypt(data: string): Promise<string> {
    if (!this.key) {
      throw new SecurityError('Service de chiffrement non initialisé');
    }

    try {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(SECURITY_CONFIG.encryption.ivLength));
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: SECURITY_CONFIG.encryption.algorithm,
          iv: iv,
        },
        this.key,
        encoder.encode(data)
      );

      // Combine IV + données chiffrées
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      throw new SecurityError(`Erreur de chiffrement: ${error}`);
    }
  }

  /**
   * Déchiffre des données
   */
  static async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) {
      throw new SecurityError('Service de chiffrement non initialisé');
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, SECURITY_CONFIG.encryption.ivLength);
      const encrypted = combined.slice(SECURITY_CONFIG.encryption.ivLength);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: SECURITY_CONFIG.encryption.algorithm,
          iv: iv,
        },
        this.key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new SecurityError(`Erreur de déchiffrement: ${error}`);
    }
  }

  /**
   * Hash sécurisé pour les IDs utilisateurs
   */
  static async hashUserId(userId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + 'MyFitHero-Salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

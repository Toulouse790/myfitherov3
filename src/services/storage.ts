
export class StorageService {
  private static PREFIX = 'myFitHero_';
  
  /**
   * Enregistre des données avec préfixage des clés
   */
  static setItem(key: string, data: any): void {
    try {
      const serialized = JSON.stringify(data);
      const prefixedKey = this.PREFIX + key;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(prefixedKey, serialized);
      }
    } catch (error) {
      console.error(`Storage error (set ${key}):`, error);
    }
  }
  
  /**
   * Récupère des données avec gestion d'erreur
   */
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const prefixedKey = this.PREFIX + key;
      
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      
      const item = localStorage.getItem(prefixedKey);
      
      if (!item) {
        return defaultValue;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Storage error (get ${key}):`, error);
      return defaultValue;
    }
  }
  
  /**
   * Supprime des données
   */
  static removeItem(key: string): void {
    try {
      const prefixedKey = this.PREFIX + key;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(prefixedKey);
      }
    } catch (error) {
      console.error(`Storage error (remove ${key}):`, error);
    }
  }
  
  /**
   * Valide si une clé existe
   */
  static hasItem(key: string): boolean {
    try {
      const prefixedKey = this.PREFIX + key;
      
      if (typeof window === 'undefined') {
        return false;
      }
      
      return localStorage.getItem(prefixedKey) !== null;
    } catch (error) {
      console.error(`Storage error (has ${key}):`, error);
      return false;
    }
  }
}


interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  compressed: boolean;
}

export class AdvancedCacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private dbCache: IDBDatabase | null = null;
  private compressionEnabled = true;
  private dbName = 'MyFitHeroCache';
  private dbVersion = 1;

  async init() {
    console.log('🗄️ Initialisation du cache avancé...');
    try {
      this.dbCache = await this.openDB();
      this.startCleanupInterval();
      console.log('✅ Cache avancé initialisé avec succès');
    } catch (error) {
      console.warn('⚠️ Impossible d\'initialiser IndexedDB, cache mémoire uniquement:', error);
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    console.log(`📖 Lecture cache: ${key}`);
    
    // Niveau 1: Mémoire (ultra-rapide)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      if (!this.isExpired(entry)) {
        console.log(`⚡ Cache mémoire hit: ${key}`);
        return this.decompress(entry);
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Niveau 2: IndexedDB (persistant)
    if (this.dbCache) {
      try {
        const entry = await this.getFromDB(key);
        if (entry && !this.isExpired(entry)) {
          console.log(`💾 Cache DB hit: ${key}`);
          // Remonte en mémoire pour accès futurs
          this.memoryCache.set(key, entry);
          return this.decompress(entry);
        } else if (entry) {
          // Supprime entrée expirée
          this.deleteFromDB(key);
        }
      } catch (error) {
        console.warn(`Erreur lecture DB cache pour ${key}:`, error);
      }
    }

    console.log(`❌ Cache miss: ${key}`);
    return null;
  }

  async set<T>(key: string, data: T, ttl: number = 300000): Promise<void> {
    console.log(`💾 Écriture cache: ${key} (TTL: ${ttl}ms)`);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      compressed: false
    };

    // Compression si activée et données importantes
    if (this.compressionEnabled && this.shouldCompress(data)) {
      entry.data = await this.compress(data);
      entry.compressed = true;
    }

    // Stockage simultané multi-niveaux
    this.memoryCache.set(key, entry);
    
    if (this.dbCache) {
      try {
        await this.saveToDB(key, entry);
      } catch (error) {
        console.warn(`Erreur sauvegarde DB cache pour ${key}:`, error);
      }
    }
  }

  private async getFromDB(key: string): Promise<CacheEntry<any> | null> {
    if (!this.dbCache) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.dbCache!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.entry : null);
      };
    });
  }

  private async saveToDB(key: string, entry: CacheEntry<any>): Promise<void> {
    if (!this.dbCache) return;

    return new Promise((resolve, reject) => {
      const transaction = this.dbCache!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({ key, entry });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async deleteFromDB(key: string): Promise<void> {
    if (!this.dbCache) return;

    return new Promise((resolve, reject) => {
      const transaction = this.dbCache!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private shouldCompress(data: any): boolean {
    const dataSize = JSON.stringify(data).length;
    return dataSize > 1024; // Compresse si > 1KB
  }

  private async compress<T>(data: T): Promise<T> {
    // Simulation de compression (ici on garde les données telles quelles)
    // En production, on pourrait utiliser une vraie compression
    return data;
  }

  private decompress<T>(entry: CacheEntry<T>): T {
    // Si compressé, décompresse
    if (entry.compressed) {
      // Simulation de décompression
      return entry.data;
    }
    return entry.data;
  }

  // Nettoyage automatique
  cleanup(): void {
    console.log('🧹 Nettoyage cache mémoire...');
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`✅ ${cleaned} entrées nettoyées du cache mémoire`);
    }
  }

  private startCleanupInterval(): void {
    // Nettoyage automatique toutes les 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Statistiques du cache
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      memorySize: this.getMemorySize(),
      dbAvailable: !!this.dbCache
    };
  }

  private getMemorySize(): number {
    let size = 0;
    for (const [key, entry] of this.memoryCache.entries()) {
      size += JSON.stringify(key).length + JSON.stringify(entry).length;
    }
    return size;
  }

  // Vide tout le cache
  async clear(): Promise<void> {
    console.log('🗑️ Vidage complet du cache...');
    
    this.memoryCache.clear();
    
    if (this.dbCache) {
      return new Promise((resolve, reject) => {
        const transaction = this.dbCache!.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.clear();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log('✅ Cache vidé complètement');
          resolve();
        };
      });
    }
  }
}

// Instance singleton
export const advancedCache = new AdvancedCacheService();

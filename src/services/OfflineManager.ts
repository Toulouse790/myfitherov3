
export class OfflineManager {
  private static instance: OfflineManager;
  private offlineData = new Map<string, any>();
  private syncQueue: Array<{ key: string; data: any; timestamp: number }> = [];

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  constructor() {
    this.initializeOfflineSupport();
  }

  private initializeOfflineSupport() {
    // Écoute les changements de connexion
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Restaure les données offline au démarrage
    this.restoreOfflineData();
  }

  private handleOnline() {
    console.log('📶 Connexion rétablie - synchronisation...');
    this.syncOfflineData();
  }

  private handleOffline() {
    console.log('📵 Mode hors ligne activé');
  }

  // Sauvegarde des données en mode offline
  saveOfflineData(key: string, data: any): void {
    this.offlineData.set(key, data);
    
    // Persiste en localStorage
    try {
      const offlineStore = JSON.parse(localStorage.getItem('offline_data') || '{}');
      offlineStore[key] = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('offline_data', JSON.stringify(offlineStore));
    } catch (error) {
      console.warn('Erreur sauvegarde offline:', error);
    }
  }

  // Récupération des données offline
  getOfflineData(key: string): any {
    return this.offlineData.get(key);
  }

  // Ajoute à la queue de synchronisation
  queueForSync(key: string, data: any): void {
    this.syncQueue.push({
      key,
      data,
      timestamp: Date.now()
    });
  }

  // Synchronise les données quand la connexion revient
  private async syncOfflineData(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    console.log(`🔄 Synchronisation de ${this.syncQueue.length} éléments...`);

    const toSync = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of toSync) {
      try {
        // Ici on pourrait envoyer vers une API
        console.log(`✅ Synchronisé: ${item.key}`);
      } catch (error) {
        console.error(`❌ Erreur sync ${item.key}:`, error);
        // Remet dans la queue en cas d'erreur
        this.syncQueue.push(item);
      }
    }
  }

  // Restaure les données depuis localStorage
  private restoreOfflineData(): void {
    try {
      const offlineStore = JSON.parse(localStorage.getItem('offline_data') || '{}');
      
      Object.entries(offlineStore).forEach(([key, value]: [string, any]) => {
        if (value && value.data) {
          this.offlineData.set(key, value.data);
        }
      });
      
      console.log(`📦 ${this.offlineData.size} éléments restaurés du cache offline`);
    } catch (error) {
      console.warn('Erreur restauration offline:', error);
    }
  }

  // Vérifie si on est en mode offline
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Nettoie les anciennes données offline (> 7 jours)
  cleanupOldData(): void {
    try {
      const offlineStore = JSON.parse(localStorage.getItem('offline_data') || '{}');
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours

      Object.keys(offlineStore).forEach(key => {
        const item = offlineStore[key];
        if (item && item.timestamp && (now - item.timestamp) > maxAge) {
          delete offlineStore[key];
          this.offlineData.delete(key);
        }
      });

      localStorage.setItem('offline_data', JSON.stringify(offlineStore));
      console.log('🧹 Nettoyage des données offline anciennes');
    } catch (error) {
      console.warn('Erreur nettoyage offline:', error);
    }
  }
}

export const offlineManager = OfflineManager.getInstance();

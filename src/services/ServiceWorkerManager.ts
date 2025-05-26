export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker non supporté par ce navigateur');
      return;
    }

    try {
      console.log('🔧 Enregistrement du Service Worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker enregistré:', this.registration.scope);

      // Écoute les mises à jour
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Vérifie les mises à jour
      await this.checkForUpdates();

      // Écoute les messages du Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event);
      });

      // Nettoyage périodique du cache (toutes les heures)
      setInterval(() => {
        this.cleanupCache();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('❌ Erreur enregistrement Service Worker:', error);
    }
  }

  private handleUpdateFound(): void {
    if (!this.registration?.installing) return;

    const installingWorker = this.registration.installing;
    console.log('🔄 Mise à jour du Service Worker détectée...');

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // Mise à jour disponible
          this.updateAvailable = true;
          console.log('📢 Mise à jour du Service Worker prête');
          this.notifyUpdateAvailable();
        } else {
          // Premier install
          console.log('✅ Service Worker installé pour la première fois');
        }
      }
    });
  }

  private async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('🔍 Vérification des mises à jour Service Worker');
    } catch (error) {
      console.warn('⚠️ Erreur vérification mise à jour:', error);
    }
  }

  private handleMessage(event: MessageEvent): void {
    const { data } = event;
    
    switch (data?.type) {
      case 'CACHE_UPDATED':
        console.log('📦 Cache mis à jour:', data.url);
        break;
      case 'OFFLINE_FALLBACK':
        console.log('📴 Mode hors ligne activé');
        break;
      default:
        console.log('📨 Message Service Worker:', data);
    }
  }

  private notifyUpdateAvailable(): void {
    // Notification visuelle (toast) pour l'utilisateur
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('sw-update-available'));
    }
  }

  async applyUpdate(): Promise<void> {
    if (!this.updateAvailable || !this.registration?.waiting) {
      console.warn('⚠️ Aucune mise à jour disponible');
      return;
    }

    console.log('🔄 Application de la mise à jour...');
    
    // Dit au Service Worker en attente de prendre le contrôle
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Recharge la page après mise à jour
    window.location.reload();
  }

  async cleanupCache(): Promise<void> {
    if (!this.registration?.active) return;

    console.log('🧹 Demande de nettoyage du cache...');
    this.registration.active.postMessage({ type: 'CLEAN_CACHE' });
  }

  // Vérifications de statut
  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  isRegistered(): boolean {
    return !!this.registration;
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  // Statistiques
  async getCacheStats(): Promise<any> {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const stats = {
        cacheCount: cacheNames.length,
        caches: {}
      };

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats.caches[cacheName] = {
          entryCount: keys.length,
          urls: keys.map(key => key.url)
        };
      }

      return stats;
    } catch (error) {
      console.error('❌ Erreur statistiques cache:', error);
      return null;
    }
  }

  // Force une synchronisation
  async forceSync(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.warn('⚠️ Background Sync non supporté');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // Type assertion pour l'API Background Sync expérimentale
      await (registration as any).sync.register('force-sync');
      console.log('🔄 Synchronisation forcée demandée');
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
    }
  }
}

// Instance singleton
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

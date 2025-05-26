
import { useEffect, useState } from 'react';
import { serviceWorkerManager } from '@/services/ServiceWorkerManager';
import { toast } from '@/components/ui/sonner';

export const useServiceWorker = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    // Enregistrement automatique du Service Worker
    const initServiceWorker = async () => {
      if (serviceWorkerManager.isSupported()) {
        console.log('🚀 Initialisation du Service Worker...');
        await serviceWorkerManager.register();
        setIsRegistered(serviceWorkerManager.isRegistered());
        
        // Récupère les stats initiales
        const stats = await serviceWorkerManager.getCacheStats();
        setCacheStats(stats);
      }
    };

    initServiceWorker();

    // Écoute les événements de mise à jour
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
      toast.info("Mise à jour disponible", {
        description: "Une nouvelle version de l'application est prête",
        action: {
          label: "Mettre à jour",
          onClick: () => handleApplyUpdate()
        },
        duration: 10000
      });
    };

    // Écoute les changements de connexion
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connexion rétablie", {
        description: "Synchronisation des données en cours..."
      });
      serviceWorkerManager.forceSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Mode hors ligne", {
        description: "Les données seront synchronisées à la reconnexion"
      });
    };

    // Ajout des listeners
    window.addEventListener('sw-update-available', handleUpdateAvailable);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mise à jour des stats toutes les 5 minutes
    const statsInterval = setInterval(async () => {
      if (serviceWorkerManager.isRegistered()) {
        const stats = await serviceWorkerManager.getCacheStats();
        setCacheStats(stats);
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(statsInterval);
    };
  }, []);

  const handleApplyUpdate = async () => {
    try {
      await serviceWorkerManager.applyUpdate();
      toast.success("Mise à jour appliquée", {
        description: "L'application va redémarrer"
      });
    } catch (error) {
      toast.error("Erreur de mise à jour", {
        description: "Veuillez recharger manuellement la page"
      });
    }
  };

  const cleanupCache = async () => {
    try {
      await serviceWorkerManager.cleanupCache();
      const stats = await serviceWorkerManager.getCacheStats();
      setCacheStats(stats);
      toast.success("Cache nettoyé", {
        description: "L'espace de stockage a été optimisé"
      });
    } catch (error) {
      toast.error("Erreur de nettoyage", {
        description: "Impossible de nettoyer le cache"
      });
    }
  };

  const forceSync = async () => {
    try {
      await serviceWorkerManager.forceSync();
      toast.info("Synchronisation lancée", {
        description: "Les données sont en cours de synchronisation"
      });
    } catch (error) {
      toast.error("Erreur de synchronisation", {
        description: "Impossible de synchroniser maintenant"
      });
    }
  };

  return {
    isRegistered,
    updateAvailable,
    isOnline,
    cacheStats,
    applyUpdate: handleApplyUpdate,
    cleanupCache,
    forceSync,
    isSupported: serviceWorkerManager.isSupported()
  };
};

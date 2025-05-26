
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

export class CapacitorService {
  private static instance: CapacitorService;
  private isNative = Capacitor.isNativePlatform();

  public static getInstance(): CapacitorService {
    if (!CapacitorService.instance) {
      CapacitorService.instance = new CapacitorService();
    }
    return CapacitorService.instance;
  }

  // Vérification si on est sur mobile natif
  isNativePlatform(): boolean {
    return this.isNative;
  }

  // Géolocalisation continue pour tracking GPS 24h/24
  async startLocationTracking(): Promise<void> {
    if (!this.isNative) {
      console.log('Géolocalisation web utilisée');
      return;
    }

    try {
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location === 'granted') {
        // Configuration pour tracking haute précision
        const watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 3000
          },
          (position) => {
            this.handleLocationUpdate(position);
          }
        );
        console.log('Tracking GPS activé, ID:', watchId);
      }
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
    }
  }

  private handleLocationUpdate(position: any) {
    // Stockage sécurisé de la position
    const locationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().toISOString()
    };
    
    this.storeSecureData('location_history', JSON.stringify(locationData));
  }

  // Simulation des capteurs de mouvement (pour le web, utilise DeviceMotionEvent)
  async startMotionTracking(): Promise<void> {
    if (!this.isNative) {
      // Utilise l'API Web pour les capteurs de mouvement
      if (typeof DeviceMotionEvent !== 'undefined') {
        window.addEventListener('devicemotion', (event) => {
          this.analyzeWebMotion(event);
        });
        console.log('Capteurs web de mouvement activés');
      }
      return;
    }

    try {
      // Pour les plateformes natives, on utilise l'API Web DeviceMotion
      if (typeof DeviceMotionEvent !== 'undefined') {
        window.addEventListener('devicemotion', (event) => {
          this.analyzeWebMotion(event);
        });
        console.log('Capteurs de mouvement natifs activés');
      }
    } catch (error) {
      console.error('Erreur capteurs mouvement:', error);
    }
  }

  private analyzeWebMotion(event: DeviceMotionEvent) {
    if (event.acceleration) {
      // Calcul de l'intensité du mouvement
      const intensity = Math.sqrt(
        (event.acceleration.x || 0) ** 2 + 
        (event.acceleration.y || 0) ** 2 + 
        (event.acceleration.z || 0) ** 2
      );
      
      // Détection d'activité (seuil à ajuster)
      if (intensity > 1.2) {
        console.log('Activité détectée, intensité:', intensity);
        // Stocker les données de mouvement
        this.storeSecureData('motion_data', JSON.stringify({
          intensity,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }

  // Notifications push pour rappels santé
  async initializePushNotifications(): Promise<void> {
    if (!this.isNative) return;

    try {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();

      // Écouter les notifications reçues
      PushNotifications.addListener('registration', (token) => {
        console.log('Token push:', token.value);
        this.storeSecureData('push_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Erreur registration push:', error);
      });

    } catch (error) {
      console.error('Erreur notifications push:', error);
    }
  }

  // Notifications locales pour rappels
  async scheduleHealthReminder(title: string, body: string, scheduleAt: Date): Promise<void> {
    if (!this.isNative) return;

    try {
      await LocalNotifications.requestPermissions();
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: scheduleAt },
            extra: {
              type: 'health_reminder'
            }
          }
        ]
      });
    } catch (error) {
      console.error('Erreur notification locale:', error);
    }
  }

  // Stockage sécurisé pour données de santé
  async storeSecureData(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({
        key: `secure_${key}`,
        value
      });
    } catch (error) {
      console.error('Erreur stockage sécurisé:', error);
    }
  }

  async getSecureData(key: string): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: `secure_${key}` });
      return result.value;
    } catch (error) {
      console.error('Erreur lecture sécurisée:', error);
      return null;
    }
  }

  // Synchronisation offline des données critiques
  async syncOfflineData(): Promise<void> {
    const offlineKeys = ['location_history', 'motion_data', 'health_metrics'];
    
    for (const key of offlineKeys) {
      const data = await this.getSecureData(key);
      if (data) {
        // Ici vous intégreriez avec votre API Supabase
        console.log(`Synchronisation ${key}:`, data);
      }
    }
  }

  // Nettoyage des données (conformité RGPD)
  async clearAllSecureData(): Promise<void> {
    try {
      await Preferences.clear();
      console.log('Données sécurisées effacées');
    } catch (error) {
      console.error('Erreur nettoyage:', error);
    }
  }
}

export const capacitorService = CapacitorService.getInstance();

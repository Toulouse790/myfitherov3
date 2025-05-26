
import { useState, useEffect } from 'react';
import { capacitorService } from '@/services/mobile/CapacitorService';
import { toast } from '@/components/ui/sonner';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [locationTracking, setLocationTracking] = useState(false);
  const [motionTracking, setMotionTracking] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    setIsNative(capacitorService.isNativePlatform());
    
    if (capacitorService.isNativePlatform()) {
      initializeMobileFeatures();
    }
  }, []);

  const initializeMobileFeatures = async () => {
    try {
      // Initialiser les notifications push
      await capacitorService.initializePushNotifications();
      setPushEnabled(true);
      
      toast.success('Fonctionnalités mobiles initialisées');
    } catch (error) {
      toast.error('Erreur initialisation mobile');
    }
  };

  const startLocationTracking = async () => {
    try {
      await capacitorService.startLocationTracking();
      setLocationTracking(true);
      toast.success('Tracking GPS activé');
    } catch (error) {
      toast.error('Impossible d\'activer le GPS');
    }
  };

  const startMotionTracking = async () => {
    try {
      await capacitorService.startMotionTracking();
      setMotionTracking(true);
      toast.success('Capteurs de mouvement activés');
    } catch (error) {
      toast.error('Impossible d\'activer les capteurs');
    }
  };

  const scheduleReminder = async (title: string, body: string, date: Date) => {
    try {
      await capacitorService.scheduleHealthReminder(title, body, date);
      toast.success('Rappel programmé');
    } catch (error) {
      toast.error('Erreur programmation rappel');
    }
  };

  const syncData = async () => {
    try {
      await capacitorService.syncOfflineData();
      toast.success('Données synchronisées');
    } catch (error) {
      toast.error('Erreur synchronisation');
    }
  };

  return {
    isNative,
    locationTracking,
    motionTracking,
    pushEnabled,
    startLocationTracking,
    startMotionTracking,
    scheduleReminder,
    syncData,
    clearData: capacitorService.clearAllSecureData
  };
};

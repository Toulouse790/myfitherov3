
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Activity, Bell, Smartphone, Wifi } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';

export const MobileFeatures: React.FC = () => {
  const {
    isNative,
    locationTracking,
    motionTracking,
    pushEnabled,
    startLocationTracking,
    startMotionTracking,
    scheduleReminder,
    syncData,
    clearData
  } = useCapacitor();

  const testNotification = () => {
    const reminderTime = new Date();
    reminderTime.setMinutes(reminderTime.getMinutes() + 1);
    
    scheduleReminder(
      'Rappel Santé',
      'N\'oubliez pas votre séance d\'entraînement !',
      reminderTime
    );
  };

  return (
    <div className="space-y-4">
      <Card className={`border-l-4 ${isNative ? 'border-l-green-500' : 'border-l-orange-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            État Mobile
          </CardTitle>
          <CardDescription>
            Statut des fonctionnalités natives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={isNative ? "default" : "secondary"}>
              {isNative ? 'App Native' : 'Web Browser'}
            </Badge>
            {isNative && <Badge variant="outline">Capacitor Actif</Badge>}
          </div>
          
          {!isNative && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                <strong>Mode Test Web :</strong> Les fonctionnalités mobiles sont simulées. 
                Déployez sur mobile pour tester les vraies APIs natives.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              Géolocalisation GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tracking 24h/24</span>
              <Badge variant={locationTracking ? "default" : "secondary"}>
                {locationTracking ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            <Button 
              onClick={startLocationTracking}
              disabled={locationTracking}
              className="w-full"
            >
              {locationTracking ? 'GPS Activé' : 'Activer GPS'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Capteurs Mouvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Accéléromètre</span>
              <Badge variant={motionTracking ? "default" : "secondary"}>
                {motionTracking ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            <Button 
              onClick={startMotionTracking}
              disabled={motionTracking}
              className="w-full"
            >
              {motionTracking ? 'Capteurs Actifs' : 'Activer Capteurs'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push & Locales</span>
              <Badge variant={pushEnabled ? "default" : "secondary"}>
                {pushEnabled ? 'Configuré' : 'Non configuré'}
              </Badge>
            </div>
            <Button onClick={testNotification} className="w-full">
              Tester Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wifi className="h-5 w-5" />
              Synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Sync offline des données critiques
            </p>
            <div className="space-y-2">
              <Button onClick={syncData} variant="outline" className="w-full">
                Synchroniser Maintenant
              </Button>
              <Button onClick={clearData} variant="destructive" size="sm" className="w-full">
                Nettoyer Données
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

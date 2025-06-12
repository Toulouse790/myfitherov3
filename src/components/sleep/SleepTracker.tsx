
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Bed, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const SleepTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastSleep, setLastSleep] = useState({
    bedTime: '23:15',
    wakeTime: '07:30',
    duration: '8h15',
    quality: 4
  });

  const handleStartTracking = () => {
    setIsTracking(true);
    toast.success('Suivi du sommeil démarré');
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    toast.success('Sommeil enregistré avec succès');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Suivi du sommeil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isTracking ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">😴</div>
              <p className="text-muted-foreground">
                Prêt à suivre votre sommeil ?
              </p>
              <Button onClick={handleStartTracking} className="w-full">
                <Bed className="mr-2 h-4 w-4" />
                Commencer le suivi
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-pulse">🌙</div>
              <p className="text-muted-foreground">
                Suivi en cours...
              </p>
              <Badge variant="secondary">
                Démarré à 23:15
              </Badge>
              <Button onClick={handleStopTracking} variant="outline" className="w-full">
                <Sun className="mr-2 h-4 w-4" />
                Arrêter le suivi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dernière nuit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coucher</p>
              <p className="text-lg font-semibold">{lastSleep.bedTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Réveil</p>
              <p className="text-lg font-semibold">{lastSleep.wakeTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Durée</p>
              <p className="text-lg font-semibold">{lastSleep.duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Qualité</p>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < lastSleep.quality ? "text-yellow-500" : "text-gray-300"}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepTracker;
